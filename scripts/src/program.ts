import { Command } from 'commander';

const program = new Command();

program
  .command('build', 'Build the app')
  .action(async () => {
    const { build } = await import('./build');
    await build();
  });

program.parseAsync();
