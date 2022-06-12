// Don't copy this line, it is for testing purposes only
const configuration = require("../test/config");

function changePassword(email, newPassword, callback) {
  const bcrypt = require("bcrypt");
  const neo4j = require("neo4j-driver");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity().then(() => {
    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) {
        return callback(err);
      }

      const session = driver.session();

      session
        .writeTransaction((tx) =>
          tx
            .run(
              `
              MATCH (u:User {email: $email})
              SET u.password = $hash
              RETURN u
            `,
              { email, hash }
            )
            .then((res) => callback(res.records.length === 1))
        )
        .catch((err) => {
          callback(err);
        })
        .finally(() => driver.close());
    });
  });
}

// Don't copy this line, it is for testing purposes only
module.exports = changePassword;
