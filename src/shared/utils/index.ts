import * as fsPromises from 'fs/promises';
import * as path from 'path';

export const createSortObject = (
  sort: string,
  separator: string = ' ',
): Record<string, string> => {
  const sortObject = {};
  const sortFilters = sort.split(',');

  sortFilters.map((filterAndCriteria) => {
    const filter = filterAndCriteria.split(separator);
    sortObject[filter[0]] = filter[1];
    return filter;
  });

  return sortObject;
};

export const minutesInSeconds = (minutes: number) => minutes * 60;
export const minutesInMilliseconds = (minutes: number) => minutes * 60 * 1000;
export const secondsInMilliseconds = (seconds: number) => seconds * 1000;

const fileNameRegex = /^[\w,\s-]+\.[A-Za-z0-9]{1,5}$/;

export const isFileName = (fileName: string) => fileNameRegex.test(fileName);

const SAFE_RELATIVE_PATH_REGEX =
  /^(?![./\\~])(?![A-Za-z]:)(?!.*(?:^|[\\/])\.\.(?:[\\/]|$))(?!.*[\\/]{2})[A-Za-z0-9._-]+(?:[\\/][A-Za-z0-9._-]+)*$/;

export const isSafeProjectRelativePath = (p: string): boolean =>
  SAFE_RELATIVE_PATH_REGEX.test(p);

export const fileExtension = (fileName: string): string => {
  const secureFileName = fileName || '';

  return secureFileName.split('.').pop() || '';
};

// Don't expose the file system, this function is only for internal use
const checkFileExistence = async (filename: string): Promise<boolean> => {
  if (!filename.trim()) return false;

  const fullPath = path.join(process.cwd(), filename);

  try {
    await fsPromises.access(fullPath, fsPromises.constants.F_OK);

    return true;
  } catch (err: unknown) {
    console.error('An error occurred:', err);

    return false;
  }
};

export const getProjectFile = async (
  rawFilename: string,
): Promise<Buffer | undefined> => {
  const filename = rawFilename.trim();

  if (!filename) return undefined;

  if (!isSafeProjectRelativePath(filename)) {
    console.error('Invalid file path:', filename);

    return undefined;
  }

  const fullPath = path.join(process.cwd(), filename);

  const exists = await checkFileExistence(fullPath);
  if (!exists) return undefined;

  return fsPromises.readFile(fullPath);
};
