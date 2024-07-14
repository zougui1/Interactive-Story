import { prefixWith, removeSuffix } from '@zougui/common.string-utils';

/**
 * add a leading slash to the path and remove any trailing slash
 * @param path
 * @returns
 */
export const normalizePath = (path: string, options?: NormalizePathOptions | undefined): string => {
  const withLeadingSlash = options?.noLeadingSlash
    ? path
    : prefixWith(path, '/');
  return removeSuffix(withLeadingSlash, '/');
}

export interface NormalizePathOptions {
  noLeadingSlash?: boolean | undefined;
}
