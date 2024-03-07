const { readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { exec } = require("child_process");

const getFileInfo = (fileContents) => {
  const header = (fileContents.match(/^\/\*\*\n(.+?)\*\//s) || [])[1];
  if (!header) return null;
  const fileInfo = [...header.matchAll(/@(\w+)\s+(.+?)\s*\r?\n/gs)].reduce(
    (obj, [_, prop, value]) => ({ ...obj, [prop]: value }),
    {}
  );
  return fileInfo;
};

const getOrigins = () => {
  const contents = readFileSync("./src/origins.js").toString().slice(17, -4);
  const origins = [
    ...contents.matchAll(/'?([a-zA-Z0-9.-]+?)'?: {\n(.+?)},?/gs),
  ].map(([_, urlAlias, props]) => ({ urlAlias, props }));
  return origins.reduce((obj, { urlAlias, props }) => {
    obj[urlAlias] = [...props.matchAll(/(\w+): '?(.*?)'?,?\n/gs)].reduce(
      (_obj, [_, prop, value]) => ({ ..._obj, [prop]: value }),
      {}
    );
    return obj;
  }, {});
};

const formatOriginsFile = (origins) =>
  `export { CustomScripts } from './custom-scripts'

export default {\n${Object.entries(origins)
    .sort((a, b) =>
      a[1].name.toLowerCase() < b[1].name.toLowerCase() ? -1 : 1
    )
    .map(
      ([urlAlias, props]) =>
        `  '${urlAlias}': {\n${Object.entries(props)
          .map(([prop, value]) => `    ${prop}: '${value}'`)
          .join(",\n")}\n  }`
    )
    .join(",\n")}\n};\n`;

exec(`git diff --name-only HEAD^ HEAD`, (_, out) => {
  const files = out.split(/[\r\n]+/).filter((name) => !!name && name.startsWith('src/content/') && !path.basename(name).startsWith("_custom_"));
  if (files.length === 0) {
    console.log(`::No files to process`);
    process.exit(0);
  }

  const infos = files
    .map((file) => ({
      ...getFileInfo(readFileSync(file).toString()),
      file: path.basename(file),
    }))
    .filter((info) => info !== null);
  if (infos.length === 0 || !infos[0].urlAlias) {
    console.log(`All files ${files.join(', ')}`)
    console.log(
      `::error ::File ${files[0]} has a faulty header. Check CONTRIBUTING.md`
    );
    process.exit(1);
  }
  const origins = getOrigins();
  const newOrigins = infos.reduce(
    (_origins, { name, urlAlias, urlRegex, file }) => ({
      ...origins,
      [urlAlias]: { url: urlRegex, name, file },
    }),
    origins
  );

  writeFileSync("./src/origins.js", formatOriginsFile(newOrigins));
});
