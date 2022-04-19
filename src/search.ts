import { realpathSync, readdirSync } from 'fs';
import path from 'path';

// Saxon just provides a node-module export not an ESM-Export
const saxon = require('saxon-js');

type result = {
  fileName: string;
  output: any[];
};

const searchInFile = async (
  name: string,
  query: string,
  ns: string
): Promise<result> => {
  const filePath = realpathSync(name);

  const file = await saxon.getResource({
    location: filePath,
    type: 'xml',
  });
  const result = [
    await saxon.XPath.evaluate(query, file, {
      xpathDefaultNamespace: ns,
    }),
  ];
  let output = [];

  for (let entry of result) {
    if (entry === null) {
      continue;
    }

    const serialized = saxon.serialize(entry, {
      method: 'xml',
      'omit-xml-declaration': true,
      'exclude-result-prefixes': true,
      ident: true,
    });
    output.push({
      hit: serialized.replace(/xmlns.*=".*[^a-z=]" ?/, ''),
      line: entry.Ik ? entry.Ik : 'NN',
    });
  }

  const parsedPath = path.parse(filePath);

  return {
    fileName: `${parsedPath.name}${parsedPath.ext}`,
    output,
  };
};

const searchInFolder = async (
  name: string,
  query: string,
  ns: string
): Promise<result[]> => {
  const folderPath = realpathSync(name);
  const files = readdirSync(folderPath).filter((file) => file.includes('.xml'));
  const searchResults = [];

  for (let file of files) {
    try {
      const result = await searchInFile(`${folderPath}/${file}`, query, ns);
      searchResults.push(result);
    } catch (error) {
      continue;
    }
  }

  return searchResults;
};

const logResult = (results: result[], query: string): void => {
  const filteredResults = results.filter((result) => result.output.length);
  if (filteredResults.length > 0) {
    for (const result of filteredResults) {
      process.stdout.write(
        `\n${result.output.length} results found in ${
          result.fileName
        }\n${result.output
          .map((value) => `\t${value.line}: ${value.hit}`)
          .join('\n')}\n`
      );
    }
    process.stdout.write(
      `\nFound ${filteredResults.flat().length} hits in total for ${query}\n`
    );
  } else {
    process.stdout.write('Sorry no results for your query 😌\n');
  }
};

export { searchInFile, searchInFolder, logResult };
