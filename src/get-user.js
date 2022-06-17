// Don't copy this line, it is for testing purposes only
const configuration = require("./test/config");

function getByEmail(email, callback) {
  const neo4j = require("neo4j-driver@4.3.3");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver
    .verifyConnectivity()
    .then(() => {
      const session = driver.session();

      session
        .readTransaction((tx) => {
          return tx
            .run(
              `
                MATCH (u:User {email: $email})
                RETURN u { .* } AS user
              `,
              { email }
            )
            .then((res) => {
              if (res.records.length === 0) {
                return callback(null);
              }

              const { password, ...properties } = res.records[0].get("user");

              return properties;
            });
        })
        .then((user) => callback(null, user))
        .catch((err) => callback(err));
    })
    .catch((err) => callback(err));
}

// Don't copy this line, it is for testing purposes only
module.exports = getByEmail;
