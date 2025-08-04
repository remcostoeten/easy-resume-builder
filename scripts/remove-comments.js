const { Project } = require('ts-morph');
const fs = require('node:fs');
const path = require('node:path');

// ANSI escape codes for colors
const Colors = {
	Reset: '\x1b[0m',
	Bright: '\x1b[1m',
	Dim: '\x1b[2m',
	Underscore: '\x1b[4m',
	Blink: '\x1b[5m',
	Reverse: '\x1b[7m',
	Hidden: '\x1b[8m',

	FgBlack: '\x1b[30m',
	FgRed: '\x1b[31m',
	FgGreen: '\x1b[32m',
	FgYellow: '\x1b[33m',
	FgBlue: '\x1b[34m',
	FgMagenta: '\x1b[35m',
	FgCyan: '\x1b[36m',
	FgWhite: '\x1b[37m',

	BgBlack: '\x1b[40m',
	BgRed: '\x1b[41m',
	BgGreen: '\x1b[42m',
	BgYellow: '\x1b[43m',
	BgBlue: '\x1b[44m',
	BgMagenta: '\x1b[45m',
	BgCyan: '\x1b[46m',
	BgWhite: '\x1b[47m',
};

const BACKUP_DIR = path.join(__dirname, '.remove-comments-backup');
const REVERT_WINDOW_SECONDS = 300; // 5 minutes

function showHelp() {
	console.log(`
${Colors.Bright}${Colors.FgCyan}Usage:${Colors.Reset} node ${path.basename(process.argv[1])} [options]

${Colors.Bright}${Colors.FgCyan}Options:${Colors.Reset}
  ${Colors.FgGreen}--files <file1> <file2>...${Colors.Reset}  Process only specified files.
  ${Colors.FgGreen}--revert${Colors.Reset}                     Revert changes from backup (within ${REVERT_WINDOW_SECONDS / 60} minutes).
  ${Colors.FgGreen}--dry-run${Colors.Reset}                    Show what would be done without making changes.
  ${Colors.FgGreen}--help${Colors.Reset}                       Display this help message.

${Colors.Bright}${Colors.FgCyan}Examples:${Colors.Reset}
  ${Colors.FgYellow}node ${path.basename(process.argv[1])}${Colors.Reset}
    Remove comments from all .ts and .tsx files (excluding node_modules, .next, and configured paths).

  ${Colors.FgYellow}node ${path.basename(process.argv[1])} --files foo.ts bar.tsx${Colors.Reset}
    Remove comments from specific files.

  ${Colors.FgYellow}node ${path.basename(process.argv[1])} --revert${Colors.Reset}
    Revert comments in all processed files from backup.

  ${Colors.FgYellow}node ${path.basename(process.argv[1])} --dry-run${Colors.Reset}
    Perform a dry run, showing files that would be processed.
`);
}

function _removeComments(filePath, backup = true, dryRun = false) {
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(filePath);

	if (dryRun) {
		console.log(
			`${Colors.FgYellow}Dry run:${Colors.Reset} Would remove comments from ${filePath}`
		);
		return;
	}

	if (backup) {
		const backupPath = path.join(BACKUP_DIR, path.relative(process.cwd(), filePath));
		fs.mkdirSync(path.dirname(backupPath), { recursive: true });
		fs.copyFileSync(filePath, backupPath);
		fs.writeFileSync(`${backupPath}.timestamp`, Date.now().toString());
	}

	sourceFile.forEachDescendant((node) => {
		node.forEachChild((child) => {
			const kindName = child.getKindName();
			if (
				(kindName === 'SingleLineCommentTrivia' ||
					(kindName === 'MultiLineCommentTrivia' &&
						!child.getText().startsWith('/**'))) &&
				!/(eslint|@ts-)/.test(child.getText())
			) {
				child.remove();
			}
		});
	});
	sourceFile.saveSync();
}

function _revertComments(filePath) {
	const backupPath = path.join(BACKUP_DIR, path.relative(process.cwd(), filePath));
	const timestampPath = `${backupPath}.timestamp`;

	if (!fs.existsSync(backupPath) || !fs.existsSync(timestampPath)) {
		console.error(
			`${Colors.FgRed}Error:${Colors.Reset} No backup found for ${filePath}. Skipping revert.`
		);
		return;
	}

	const timestamp = parseInt(fs.readFileSync(timestampPath, 'utf8'));
	const now = Date.now();

	if ((now - timestamp) / 1000 > REVERT_WINDOW_SECONDS) {
		console.error(
			`${Colors.FgRed}Error:${Colors.Reset} Backup for ${filePath} is too old to revert. Skipping.`
		);
		return;
	}

	fs.copyFileSync(backupPath, filePath);
	console.log(`${Colors.FgGreen}Reverted:${Colors.Reset} ${filePath} from backup.`);
}

const EXCLUDED_PATHS_DEFAULT = ['node_modules/**', '!.next/**', '!.remove-comments-backup/**'];

let configExcludedPaths = [];
try {
	const config = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'remove-comments.config.json'), 'utf8')
	);
	if (config.excludedPaths && Array.isArray(config.excludedPaths)) {
		configExcludedPaths = config.excludedPaths;
	}
} catch (error) {
	console.warn(
		`${Colors.FgYellow}Warning:${Colors.Reset} Could not read ${Colors.Bright}remove-comments.config.json${Colors.Reset}. Using default exclusions. (${error.message})`
	);
}

const _ALL_EXCLUDED_PATHS = [...EXCLUDED_PATHS_DEFAULT, ...configExcludedPaths];

const args = process.argv.slice(2);
const filesFlagIndex = args.indexOf('--files');
const revertFlagIndex = args.indexOf('--revert');
const dryRunFlagIndex = args.indexOf('--dry-run');
const helpFlagIndex = args.indexOf('--help');
const interactiveFlagIndex = args.indexOf('--interactive');

if (helpFlagIndex !== -1) {
	showHelp();
	process.exit(0);
}

function processFiles(isRevertMode, isDryRunMode, filesToProcess) {
	if (filesToProcess.length > 0) {
		filesToProcess.forEach((file) => {
			if (isRevertMode) {
				_revertComments(file);
			} else {
				_removeComments(file, true, isDryRunMode);
			}
		});
	} else {
		// If no specific files are provided, glob for all .ts and .tsx files
		const glob = require('glob');
		const files = glob.sync('**/*.{ts,tsx}', {
			ignore: _ALL_EXCLUDED_PATHS,
			cwd: process.cwd(),
		});

		if (files.length === 0) {
			console.log(`${Colors.FgYellow}No .ts or .tsx files found to process.${Colors.Reset}`);
			return;
		}

		console.log(`${Colors.Bright}Processing ${files.length} files...${Colors.Reset}`);
		files.forEach((file) => {
			const absolutePath = path.join(process.cwd(), file);
			if (isRevertMode) {
				_revertComments(absolutePath);
			} else {
				_removeComments(absolutePath, true, isDryRunMode);
			}
		});
		console.log(`${Colors.Bright}Processing complete.${Colors.Reset}`);
	}
}

function showInteractiveMenu() {
	console.log("Interactive mode is not yet implemented.");
	process.exit(0);
}

let filesToProcess = [];
let isRevertMode = false;
let isDryRunMode = false;

if (dryRunFlagIndex !== -1) {
	isDryRunMode = true;
}

if (revertFlagIndex !== -1) {
	isRevertMode = true;
	if (filesFlagIndex !== -1) {
		filesToProcess = args.slice(filesFlagIndex + 1);
		if (filesToProcess.length === 0) {
			console.error(
				`${Colors.FgRed}Error:${Colors.Reset} --files flag requires at least one file path when used with --revert.`
			);
			showHelp();
			process.exit(1);
		}
	}
} else if (filesFlagIndex !== -1) {
	filesToProcess = args.slice(filesFlagIndex + 1);
	if (filesToProcess.length === 0) {
		console.error(
			`${Colors.FgRed}Error:${Colors.Reset} --files flag requires at least one file path.`
		);
		showHelp();
		process.exit(1);
	}
}

processFiles(isRevertMode, isDryRunMode, filesToProcess);

