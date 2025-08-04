const { Project } = require("ts-morph");

function removeComments(filePath) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  sourceFile.forEachDescendant((node) => {
    node.forEachChild((child) => {
      const kindName = child.getKindName();
      if ((
        kindName === "SingleLineCommentTrivia" ||
        kindName === "MultiLineCommentTrivia"
      ) &&
      !/(eslint|@ts-)/.test(child.getText())) {
        child.remove();
      }
    });
  });
  sourceFile.saveSync();
}

const project = new Project();
project.addSourceFilesAtPaths("**/*.{ts,tsx}");

project.getSourceFiles().forEach(sourceFile => {
  console.log(`Processing: ${sourceFile.getFilePath()}`);
  removeComments(sourceFile.getFilePath());
});
