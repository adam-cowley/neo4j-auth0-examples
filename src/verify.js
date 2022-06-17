// Don't copy this line, it is for testing purposes only
const configuration = require("../test/config");

function verify(email, callback) {
  const neo4j = require("neo4j-driver@4.3.3");

  const driver = neo4j.driver(
    configuration.NEO4J_URI,
    neo4j.auth.basic(configuration.NEO4J_USERNAME, configuration.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity().then(() => {
    const session = driver.session();

    session
      .writeTransaction((tx) =>
        tx
          .run(
            `
              MATCH (u:User {email: $email})
              SET u.email_verified = true,
                u.email_verified_at = datetime()
              RETURN u
            `,
            { email }
          )
          .then((res) => callback(res.records.length === 1))
      )
      .catch((err) => callback(err))
      .finally(() => driver.close());
  });
}

// Don't copy this line, it is for testing purposes only
module.exports = verify;
