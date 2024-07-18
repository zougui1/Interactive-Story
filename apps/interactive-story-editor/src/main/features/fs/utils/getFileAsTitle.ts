import path from 'node:path';

import { title } from '../../../constants';

export const getFileAsTitle = (filePath: string): string => {
  const [fileName] = path.basename(filePath).split('.');
  return `${fileName} - ${title}`;
}
