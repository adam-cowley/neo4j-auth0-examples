const driver = require("./test/driver");
const changePassword = require("./change-password");

describe("Change Password", () => {
  const email = `${Math.random()}@neo4j.com`;
  const password = "letmein";

  beforeAll(() => {
    const session = driver.session();

    return session
      .writeTransaction((tx) =>
        tx.run(
          `
            CREATE (u:User {email: $email})
        `,
          { email }
        )
      )
      .then(() => session.close());
  });

  afterAll(() => {
    const session = driver.session();

    return session
      .writeTransaction((tx) =>
        tx.run(
          `
            MATCH (u:User {email: $email})
            DETACH DELETE u
        `,
          { email }
        )
      )
      .then(() => session.close());
  });

  it("should set new password return true when user is found", (done) => {
    changePassword(email, password, (output) => {
      expect(output).toEqual(true);

      const session = driver.session();

      session
        .readTransaction((tx) =>
          tx.run(
            `
                MATCH (u:User {email: $email})
                RETURN u.password AS password
            `,
            { email }
          )
        )
        .then((res) => res.records[0].get("password"))
        .then((password) => {
          expect(password).toBeDefined();

          return session.close();
        })
        .then(() => done())
        .catch((e) => done(e));
    });
  });

  it("should return false when user does not exist", (done) => {
    changePassword(`adam@neo4j.com`, password, (output) => {
      expect(output).toEqual(false);

      done();
    });
  });
});
