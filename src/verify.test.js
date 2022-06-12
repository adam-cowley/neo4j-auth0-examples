const driver = require("./test/driver");
const { createUser, getUser, deleteUser } = require("./test/utils");
const verify = require("./verify");

describe("Verify Email", () => {
  const email = `${Math.random()}@neo4j.com`;

  beforeAll(() => createUser(driver, email));

  afterAll(() => deleteUser(driver, email));

  it("should verify user and return true when user is found", (done) => {
    verify(email, (output) => {
      expect(output).toEqual(true);

      getUser(driver, email)
        .then((user) => {
          expect(user.properties.email).toEqual(email);
          expect(user.properties.email_verified).toEqual(true);
          expect(user.properties.email_verified_at).toBeDefined();

          done();
        })
        .catch((e) => done(e));
    });
  });

  it("should return false when user does not exist", (done) => {
    verify(`adam@neo4j.com`, (output) => {
      expect(output).toEqual(false);

      done();
    });
  });
});
