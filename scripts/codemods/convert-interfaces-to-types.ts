#!/usr/bin/env ts-node
/*
 * Codemod: Convert interface declarations to type aliases prefixed with `T`.
 *
 * Rules implemented (in order of precedence):
 * 1. Replace every `interface Foo` with `type TFoo = { ... }`.
 * 2. Preserve `extends` clauses by turning them into intersections (`&`).
 * 3. Emit a plain-text report listing all modified files for manual review.
 *
 * Usage:
 *   npx ts-node scripts/codemods/convert-interfaces-to-types.ts [glob1 glob2 ...]
 *
 * When no globs are provided, the script will read the project `tsconfig.json` and
 * automatically include every `.ts` and `.tsx` file within `src`, `app`, `features`,
 * and `components` directories.
 */
import { Project, InterfaceDeclaration, SyntaxKind } from 'ts-morph';
import path from 'path';
import fg from 'fast-glob';
import chalk from 'chalk';

// Directories considered when no explicit globs are supplied
const DEFAULT_INCLUDE = ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'];

async function main() {
  const cliGlobs = process.argv.slice(2);
  const includeGlobs = cliGlobs.length > 0 ? cliGlobs : DEFAULT_INCLUDE;

  // Resolve matching file paths (ignoring node_modules & build artifacts)
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

  const modifiedFiles = new Set<string>();

  project.getSourceFiles().forEach((sourceFile) => {
    const interfaces = sourceFile.getInterfaces();
    interfaces.forEach((interfaceDec) => {
      const name = interfaceDec.getName();
      if (!name) return;

      // Build new type name by prefixing with T if not already.
      const typeName = name.startsWith('T') ? name : `T${name}`;

      const heritage = interfaceDec.getHeritageClauses();
      const extendsTypes = heritage
        .filter((h) => h.getToken() === SyntaxKind.ExtendsKeyword)
        .flatMap((h) => h.getTypeNodes().map((t) => t.getText()));

      const membersText = interfaceDec.getMembers().map((m) => m.getText()).join('\n');
      const objectLiteral = `{
${membersText ? `  ${membersText.replace(/\n/g, '\n  ')}` : ''}
}`;

      const intersection = [...extendsTypes, objectLiteral].join(' & ');

      // Insert type alias before the current interface (preserves ordering/context)
      sourceFile.insertTypeAlias(interfaceDec.getChildIndex(), {
        name: typeName,
        type: intersection,
        isExported: interfaceDec.isExported(),
      });

      interfaceDec.remove();
      modifiedFiles.add(sourceFile.getFilePath());
    });
  });

  // Save all edits to disk
  project.saveSync();

  // Report
  if (modifiedFiles.size === 0) {
    console.log(chalk.yellow('No interfaces were found — no files modified.'));
    return;
  }

  console.log(chalk.green('\nCodemod complete! Modified files:'));
  Array.from(modifiedFiles)
    .sort()
    .forEach((file) => console.log(` - ${path.relative(process.cwd(), file)}`));
}

main().catch((err) => {
  console.error(chalk.red(err));
  process.exit(1);
});

