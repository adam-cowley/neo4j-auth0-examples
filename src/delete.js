// Don't copy this line, it is for testing purposes only
const configuration = require("./test/config");

function remove(id, callback) {
  const neo4j = require("neo4j-driver");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity().then(() => {
    const session = driver.session();

    session
      .writeTransaction((tx) =>
        tx.run(
          `
            MATCH (u:User {user_id: $id})
            DETACH DELETE u
          `,
          { id }
        )
      )
      .then(() => {
        callback();
      })
      .catch((e) => callback(e));
  });
}

// Don't copy this line, it is for testing purposes only
module.exports = remove;
