// This compiles all twig templates into a single TypeScript file
// that can be imported and used in Angular components and services

const fs = require("fs");
const path = require("path");

const TWIG_DIR = path.join(__dirname, "./src/templates");
const OUTPUT_FILE = path.join(__dirname, "./src/app/render/twig-templates.ts");

function findTwigFiles(dir, fileList = [], baseDir = dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTwigFiles(filePath, fileList, baseDir);
    } else if (file.endsWith(".twig")) {
      const relativePath = path.relative(baseDir, filePath);
      const content = fs.readFileSync(filePath, "utf8");
      const templateName = relativePath
        .replace(/\.twig$/, "")
        .replace(/\\/g, "/");
      fileList.push({ name: templateName, content });
    }
  });

  return fileList;
}

const templates = findTwigFiles(TWIG_DIR);

const output = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const TWIG_TEMPLATES: Record<string, string> = {
${templates
  .map(
    (t) =>
      `  '${t.name}': \`${t.content
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")}\``
  )
  .join(",\n")}
};
`;

fs.writeFileSync(OUTPUT_FILE, output, "utf8");
console.log(`✓ Bundled ${templates.length} Twig templates into ${OUTPUT_FILE}`);
