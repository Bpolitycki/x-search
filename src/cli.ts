#!/usr/bin/env node
import { Command } from 'commander';
import { lstatSync } from 'fs';
import { searchInFile, searchInFolder, logResult } from './search';

type Options = {
  query: string;
  namespace: string;
};

const program = new Command();

program
  .name('X-Search')
  .description('Searching in one or more XML-Files with XPath');

program
  .command('xs')
  .argument('<context>', 'Filename or folder')
  .requiredOption('-q, --query <query>', 'XPath to search for')
  .option('-n, --namespace <namespace>', 'Namespace, default: TEI')
  .action(async (context: string, options: Options) => {
    try {
      const namespace = options.namespace
        ? options.namespace
        : 'http://www.tei-c.org/ns/1.0';

      if (lstatSync(context).isDirectory()) {
        const searchResults = await searchInFolder(
          context,
          options.query,
          namespace
        );
        logResult(searchResults, options.query);
      } else {
        const searchResult = await searchInFile(
          context,
          options.query,
          namespace
        );
        logResult([searchResult], options.query);
      }
    } catch (error) {
      process.stdout.write(`Did not find file or folder "${context}"`);
    }
  });

program.parse();
