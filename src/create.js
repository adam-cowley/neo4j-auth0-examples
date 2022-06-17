// Don't copy this line, it is for testing purposes only
const configuration = require("./test/config");

function create(user, callback) {
  const bcrypt = require("bcrypt");
  const neo4j = require("neo4j-driver@4.3.3");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity().then(() => {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return callback(err);
      }

      const session = driver.session();

      session
        .writeTransaction((tx) =>
          tx
            .run(
              `
              CREATE (u:User {
                user_id: randomUuid(),
                email: $user.email
              })
              SET u += $user,
                u.password = $hash
              RETURN u { .* } AS user
            `,
              { user, hash }
            )
            .then(() => callback(null))
        )
        .catch((err) => {
          if (
            err instanceof neo4j.Neo4jError &&
            err.code === "Neo.ClientError.Schema.ConstraintValidationFailed"
          ) {
            return callback(
              new Error(`A user already exists with the email ${user.email}`)
            );
          }
          callback(err);
        })
        .finally(() => driver.close());
    });
  });
}

// Don't copy this line, it is for testing purposes only
module.exports = create;
