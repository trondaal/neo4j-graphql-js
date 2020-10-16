// start with

import { makeAugmentedSchema } from '../dist/index';
import { ApolloServer } from 'apollo-server';
import neo4j from 'neo4j-driver';

const typeDefs = `
type lrmPerson {
  text: String
  uri: String
  label: String
  name: String
  date: String
  role: String
}

type lrmWork{
  text: String
  uri: String
  label: String
  title: String
  category: String
  pagerank: String
  score: String
  expressions: [lrmExpression] @relation(name: "REALIZES", direction: "IN")
  contributors: [lrmPerson] @relation(name: "CONTRIBUTOR_OF", direction: "IN")
  roles: [lrmPerson] @cypher(statement:"MATCH (this)<-[x:CONTRIBUTOR_OF]-(p) RETURN {name: p.name, uri: p.uri, role: x.role} as \`o\`")
}

type lrmExpression{
  text: String
  uri: String
  label: String
  pagerank: String
  title: String
  type: String
  language: String
  work: [lrmWork] @relation(name: "REALIZES", direction: "OUT")
  manifestations: [lrmManifestation] @relation(name: "EMBODIES", direction: "IN")
  contributors: [lrmPerson] @relation(name: "CONTRIBUTOR_OF", direction: "IN")
  roles: [lrmPerson] @cypher(statement:"MATCH (this)<-[x:CONTRIBUTOR_OF]-(p) RETURN {name: p.name, uri: p.uri, role: x.role} as \`o\`")
}

type lrmManifestation {
  text: String
  uri: String
  label: String
  title: String
  other: String
  responsibility: String
  carrier: String
  media: String
  publisher: String
  manufacturer: String
  edition: String
  publication: String
  date: String
  numbering: String
  series: String
  place: String
  dimensions: String
  extent: String
  identifier: String
  expressions: [lrmExpression] @relation(name: "EMBODIES", direction: "OUT")
  contributors: [lrmPerson] @relation(name: "CONTRIBUTOR_OF", direction: "IN")
  roles: [lrmPerson] @cypher(statement:"MATCH (this)<-[x:CONTRIBUTOR_OF]-(p) RETURN {name: p.name, uri: p.uri, role: x.role} as \`o\`")
}

`;

const schema = makeAugmentedSchema({ typeDefs });

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'letmein')
);

const server = new ApolloServer({ schema, context: { driver } });

server.listen(8080).then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});
