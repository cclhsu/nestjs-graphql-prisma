#!/usr/bin/env node
// Path: api/graphql/schema/schema.graphql
// DESC: This is the main schema file that imports all other schema files
'use strict';
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';

// npx ts-node api/graphql/generate-typings.ts

const schemaConfigurations: {
  schemaFile: string;
  outputDir: string;
}[] = [
  // {
  //   schemaFile: 'api/graphql/schema/schema.graphql',
  //   outputDir: 'src/graphql/generated',
  //   // outputDir: 'generated/graphql/schema',
  // },
  {
    schemaFile: 'api/graphql/schema/auth.graphql',
    // outputDir: 'src/auth/graphql/generated',
    outputDir: 'generated/graphql/auth',
  },
  {
    schemaFile: 'api/graphql/schema/user.graphql',
    // outputDir: 'src/stakeholders/user/graphql/generated',
    outputDir: 'generated/graphql/user',
  },
  {
    schemaFile: 'api/graphql/schema/team.graphql',
    // outputDir: 'src/stakeholders/team/graphql/generated',
    outputDir: 'generated/graphql/team',
  },
  {
    schemaFile: 'api/graphql/schema/hello.graphql',
    // outputDir: 'src/hello/graphql/generated',
    outputDir: 'generated/graphql/hello',
  },
  {
    schemaFile: 'api/graphql/schema/health.graphql',
    // outputDir: 'src/health/graphql/generated',
    outputDir: 'generated/graphql/health',
  },
];

console.log('Schemas:');
console.log(schemaConfigurations);
console.log('Generating GraphQL typings...');

// Populate the output directory with the generated typings
for (const schemaConfig of schemaConfigurations) {
  const { schemaFile, outputDir } = schemaConfig;
  const schemaName: string | undefined = schemaFile.split('/').pop()?.split('.')[0];

  if (schemaName) {
    const definitionsFactory: GraphQLDefinitionsFactory = new GraphQLDefinitionsFactory();

    definitionsFactory.generate({
      typePaths: [schemaFile],
      path: `${outputDir}/${schemaName}.graphql.ts`,
      outputAs: 'class',
    });

    console.log(`Generated typings for ${schemaFile} in ${outputDir}`);
  } else {
    console.error(`Error: schemaName is undefined for ${schemaFile}`);
  }
}

console.log('GraphQL typings generated successfully!');

export default {}; // Export an empty object to satisfy TypeScript
