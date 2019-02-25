const fs = require('fs-extra');
const path = require('path');

const { getKeybaseConfig } = require('./config');
const { succeed, fail } = require('./response');

const KBFS_PATH = 'KBFS.Mount';

async function readFile (absolutePath) {
  try {
    const content = (await fs.readFile(absolutePath)).toString();
    return succeed(content);
  } catch (e) {
    return fail(e.toString());
  }
}

/**
 * Get file by relative keybase path
 * @param {string} filePath
 * @return {string} stringified file
 */
exports.getFile = async function getFile (relativePath) {
  const res = await getKeybaseConfig(KBFS_PATH);

  if (!res.success) {
    return res;
  }

  const { payload: kbfsPath } = res;
  const absolutePath = path.join(kbfsPath, relativePath);

  const doesFileExist = await fs.exists(absolutePath);

  if (!doesFileExist) {
    return fail(`File ${absolutePath} doesn't exist!`);
  }

  return readFile(absolutePath);
};
