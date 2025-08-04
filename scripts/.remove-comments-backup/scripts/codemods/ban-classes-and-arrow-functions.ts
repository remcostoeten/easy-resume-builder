#!/usr/bin/env ts-node
/*
 * Codemod #6 – Ban classes and arrow function constants.
 *
 * Goals:
 * 1. Transform _simple_ data classes (classes without methods except an optional constructor
 *    that only assigns public properties) into plain factory functions.
 * 2. Rewrite variable arrow-function constants (`const foo = () => {}`) to canonical
 *    `function foo() {}` declarations while preserving async modifiers, generics, parameter
 *    types, return types, and export modifiers.
 * 3. After automatic fixes, **fail** with a non-zero exit code if **any** `ClassDeclaration`
 *    or arrow-function constants remain. This guarantees that the build breaks until all
 *    violations are resolved.
 *
 * Usage
 *   npx ts-node scripts/codemods/ban-classes-and-arrow-functions.ts [glob1 glob2 ...]
 *
 * If no globs are supplied the script will default to the common source folders
 * (`src`, `app`, `features`, `components`).
 */
import path from 'node:path';
import chalk from 'chalk';
import fg from 'fast-glob';
import {
	type ArrowFunction,
	type ClassDeclaration,
	Project,
	SyntaxKind,
	type VariableDeclaration,
} from 'ts-morph';

const DEFAULT_INCLUDE = [
	'src/**/*.{ts,tsx}',
	'app/**/*.{ts,tsx}',
	'features/**/*.{ts,tsx}',
	'components/**/*.{ts,tsx}',
];

//#region Utility helpers -----------------------------------------------------
function isSimpleDataClass(cls: ClassDeclaration): boolean {
	// Must have NO methods (other than at most one constructor)
	if (cls.getMethods().length > 0) return false;

	// Constructors may only assign to `this` for declared properties
	const ctors = cls.getConstructors();
	if (ctors.length > 1) return false;

	const _props = new Set(
		cls
			.getProperties()
			.filter((p) => p.isPublic())
			.map((p) => p.getName())
	);

	if (ctors.length === 1) {
		const ctor = ctors[0];
		const invalidStatement = ctor
			.getStatements()
			.some(
				(st) =>
					!st
						.asKind(SyntaxKind.ExpressionStatement)
						?.getExpression()
						.asKind(SyntaxKind.BinaryExpression)
			);

		if (invalidStatement) return false;
	}

	return true;
}

function arrowToFunction(decl: VariableDeclaration, arrow: ArrowFunction) {
	const name = decl.getName();

	// Build function structure preserving important metadata
	const structure = {
		name,
		isExported: decl.getVariableStatement()?.isExported(),
		isAsync: arrow.isAsync(),
		parameters: arrow.getParameters().map((p) => p.getStructure()),
		typeParameters: arrow.getTypeParameters().map((tp) => tp.getStructure()),
		returnType: arrow.getReturnTypeNode()?.getText() ?? undefined,
		statements: arrow.getBody().getText(),
	} as const;

	// Insert the new function BEFORE the variable statement to preserve ordering
	const insertionIndex = decl.getVariableStatement()?.getChildIndex() ?? 0;
	const source = decl.getSourceFile();
	source.insertFunction(insertionIndex, structure as any);

	// Remove the original variable declaration; if the variable statement now has
	// no declarations, remove it entirely.
	const vStmt = decl.getVariableStatement();
	decl.remove();
	if (vStmt && vStmt.getDeclarations().length === 0) vStmt.remove();
}
//#endregion ------------------------------------------------------------------

async function main() {
	const cliGlobs = process.argv.slice(2);
	const includeGlobs = cliGlobs.length > 0 ? cliGlobs : DEFAULT_INCLUDE;

	const files = await fg(includeGlobs, {
		ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**'],
		absolute: true,
	});

	if (files.length === 0) {
		console.error(chalk.red('No TypeScript files matched the provided patterns.'));
		process.exit(1);
	}

	const project = new Project({
		tsConfigFilePath: path.resolve('tsconfig.json'),
		skipAddingFilesFromTsConfig: true,
	});

	project.addSourceFilesAtPaths(files);

	let modified = 0;
	const remainingArrowConsts: string[] = [];
	const remainingClasses: string[] = [];

	project.getSourceFiles().forEach((sourceFile) => {
		// 1. Transform simple data classes --------------------------------------
		sourceFile.getClasses().forEach((cls) => {
			if (!isSimpleDataClass(cls)) return;

			const typeName = `T${cls.getName()}`;

			// Build type from public props
			const members = cls
				.getProperties()
				.filter((p) => p.isPublic())
				.map((p) => `${p.getName()}: ${p.getTypeNodeOrThrow().getText()};`)
				.join('\n  ');

			sourceFile.insertTypeAlias(cls.getChildIndex(), {
				name: typeName,
				isExported: cls.isExported(),
				type: `{
  ${members}
}`,
			});

			const factoryName = `create${cls.getName()}`;
			const params = cls
				.getProperties()
				.filter((p) => p.isPublic())
				.map((p) => `${p.getName()}: ${p.getTypeNodeOrThrow().getText()}`)
				.join(', ');

			sourceFile.insertFunction(cls.getChildIndex() + 1, {
				name: factoryName,
				isExported: cls.isExported(),
				parameters: [{ name: 'input', type: `{ ${params} }` }],
				returnType: typeName,
				statements: `return { ...input };`,
			});

			cls.remove();
			modified += 1;
		});

		// 2. Transform arrow-function constants ----------------------------------
		sourceFile.getVariableDeclarations().forEach((decl) => {
			const initializer = decl.getInitializer();
			if (!initializer || initializer.getKind() !== SyntaxKind.ArrowFunction) return;
			const arrow = initializer as ArrowFunction;

			// Only convert if variable is `const` (to avoid altering `let` semantics)
			const vStmt = decl.getVariableStatement();
			if (!vStmt || !vStmt.getDeclarationKind() || vStmt.getDeclarationKind() !== 'const')
				return;

			arrowToFunction(decl, arrow);
			modified += 1;
		});

		// Record remaining violations after modifications -----------------------
		sourceFile.getVariableDeclarations().forEach((decl) => {
			if (decl.getInitializerIfKind(SyntaxKind.ArrowFunction)) {
				remainingArrowConsts.push(`${sourceFile.getBaseName()}:${decl.getName()}`);
			}
		});

		if (sourceFile.getClasses().length > 0) {
			sourceFile.getClasses().forEach((cls) => {
				remainingClasses.push(`${sourceFile.getBaseName()}:${cls.getName()}`);
			});
		}
	});

	// Save edits ---------------------------------------------------------------
	project.saveSync();

	// Reporting ----------------------------------------------------------------
	if (modified > 0) {
		console.log(chalk.green(`Codemod complete – ${modified} declarations transformed.`));
	} else {
		console.log(chalk.yellow('Codemod finished – no applicable declarations found.'));
	}

	if (remainingClasses.length > 0 || remainingArrowConsts.length > 0) {
		console.error(chalk.red('\nBuild failed: forbidden constructs remain.'));
		if (remainingClasses.length) {
			console.error(chalk.red('\nClass declarations:'));
			remainingClasses.forEach((c) => console.error(` - ${c}`));
		}
		if (remainingArrowConsts.length) {
			console.error(chalk.red('\nArrow-function constants:'));
			remainingArrowConsts.forEach((a) => console.error(` - ${a}`));
		}
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(chalk.red(err));
	process.exit(1);
});
