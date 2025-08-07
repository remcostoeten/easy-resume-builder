
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { Project } from 'ts-morph';
import fs from 'fs';

const drizzleConfigPath = './drizzle.config.ts';

async function main() {
  // 1. Modify drizzle.config.ts
  console.log('Temporarily modifying drizzle.config.ts...');
  const originalDrizzleConfig = fs.readFileSync(drizzleConfigPath, 'utf8');
  const modifiedDrizzleConfig = originalDrizzleConfig.replace("@/server/env", "./src/server/env");
  fs.writeFileSync(drizzleConfigPath, modifiedDrizzleConfig);

  // 2. Run knip
  console.log('Running knip to find unused exports...');
  let knipOutput;
  try {
    knipOutput = execSync('bun knip --reporter json', { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    knipOutput = error.stdout;
  } finally {
    console.log('Reverting drizzle.config.ts...');
    fs.writeFileSync(drizzleConfigPath, originalDrizzleConfig);
  }


  if (!knipOutput) {
    console.log('No knip output was generated.');
    return;
  }

  let knipReport;
  try {
    knipReport = JSON.parse(knipOutput);
  } catch (e) {
    console.error("Error parsing knip's JSON output.");
    console.error("--- Knip Output ---");
    console.error(knipOutput);
    console.error("--- End Knip Output ---");
    return;
  }

  const unusedExports = getUnusedExportsFromReport(knipReport);

  if (unusedExports.length === 0) {
    console.log('No unused exports found.');
    return;
  }

  // 5. Inquirer prompt
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'exportsToRemove',
      message: 'Select the exports you want to remove:',
      choices: unusedExports.map(e => ({
        name: `${e.exportName} (${e.type}) in ${e.filePath}`,
        value: e,
      })),
    },
  ]);

  if (!answers.exportsToRemove || answers.exportsToRemove.length === 0) {
    console.log('No exports selected. Exiting.');
    return;
  }

  // 6. Remove exports with ts-morph
  const project = new Project();
  const filesToModify = new Set(answers.exportsToRemove.map(e => e.filePath));

  for (const filePath of filesToModify) {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const exportsToRemoveInFile = answers.exportsToRemove.filter(e => e.filePath === filePath);

      for (const exp of exportsToRemoveInFile) {
          const declarations = sourceFile.getExportedDeclarations().get(exp.exportName);
          if (declarations) {
              declarations.forEach(declaration => {
                  if(declaration.isExported()) {
                    declaration.setIsExported(false);
                  }
              });
          }
      }
      await sourceFile.save();
  }

  console.log('Selected exports have been removed.');
}

function getUnusedExportsFromReport(report) {
    const unused = [];
    const items = Array.isArray(report) ? report : report.files || [];

    for (const item of items) {
        if (item.type === 'exports' || item.type === 'types') {
            unused.push({
                exportName: item.name,
                filePath: item.file,
                type: item.type
            });
        }
    }
    return unused;
}

main().catch(console.error);
