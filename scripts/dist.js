const fs = require("fs").promises;
const path = require("path");

const distDir = path.join(__dirname, "../dist");
const buildDir = path.join(__dirname, "../build");

function copy(source, destination) {
  return fs.cp(source, destination, { recursive: true }).then(() => {
    console.log(`Copy successfully: ${source} -> ${destination}`);
  });
}

function cleanDist() {
  return fs.rm("dist", { recursive: true, force: true });
}

async function modifyPackageJson() {
  const packageJsonPath = path.join(distDir, "package.json");
  const data = await fs.readFile(packageJsonPath);
  const packageJson = JSON.parse(data);

  packageJson.private = false;
  packageJson.files = ["*"];

  fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function main() {
  await cleanDist();
  await copy(path.join(buildDir, "standalone"), distDir);

  modifyPackageJson();
  copy(path.join(buildDir, "static"), path.join(distDir, "build/static"));
  copy(path.join(__dirname, "../lib"), path.join(distDir, "lib"));
  copy(path.join(__dirname, "../migrations"), path.join(distDir, "migrations"));
  copy(path.join(__dirname, "../bin"), path.join(distDir, "bin"));
}

main();
