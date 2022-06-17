// Don't copy this line, it is for testing purposes only
const configuration = require("./test/config");
const WrongUsernameOrPasswordError = require("./test/wrong-username-or-password-error");

function login(email, plainPassword, callback) {
  const bcrypt = require("bcrypt");
  const neo4j = require("neo4j-driver@4.3.3");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity().then(() => {
    const session = driver.session();

    session
      .readTransaction((tx) =>
        tx
          .run(
            `
              MATCH (u:User {email: $email})
              RETURN u { .* } AS user
            `,
            { email }
          )
          .then((res) => {
            if (res.records.length === 0) {
              throw new WrongUsernameOrPasswordError(email);
            }

            const user = res.records[0].get("user");

            bcrypt.compare(
              plainPassword,
              user.password,
              function (err, isValid) {
                if (err || !isValid) {
                  return callback(
                    err || new WrongUsernameOrPasswordError(email)
                  );
                }

                const { password, ...properties } = user;

                callback(null, properties);
              }
            );
          })
          .catch((e) => callback(e))
      )
      .catch((err) => callback(err))
      .finally(() => driver.close());
  });
}

// Don't copy this line, it is for testing purposes only
module.exports = login;
