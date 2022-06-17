const configuration = require("./config");
const neo4j = require("neo4j-driver@4.3.3");

module.exports = neo4j.driver(
  configuration.NEO4J_URI,
  neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
);
