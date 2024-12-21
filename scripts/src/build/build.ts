import path from 'node:path';

import fs from 'fs-extra';

export const build = async () => {
  const { execa } = await import('execa');

  const readerPath = path.join(__dirname, '../../../apps/interactive-story-reader-standalone');
  const readerOutputHtmlFile = path.join(readerPath, 'dist/index.html');
  const editorPath = path.join(__dirname, '../../../apps/interactive-story-editor');
  const editorHtmlTemplateFile = path.join(editorPath, 'extraResources/index.html');

  console.log('Building standalone reader');
  await execa('npm', ['run', 'build'], {
    cwd: readerPath,
    stdout: 'inherit',
  });

  console.log('Copying reader HTML file to editor\'s extraResources');
  await fs.copy(readerOutputHtmlFile, editorHtmlTemplateFile);

  console.log('Building editor for linux');
  await execa('npm', ['run', 'build:linux'], {
    cwd: editorPath,
    stdout: 'inherit',
  });
}
