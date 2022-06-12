const driver = require("./test/driver");
const create = require("./create");
const { deleteUser, getUser } = require("./test/utils");

describe("Create User", () => {
  const email = `${Math.random()}@neo4j.com`;
  const password = "letmein";

  beforeAll(() => {
    const session = driver.session();

    return session
      .run(
        `
          CREATE CONSTRAINT UserEmailUnique
          IF NOT EXISTS
          ON (u:User)
          ASSERT u.email IS UNIQUE
        `
      )
      .then(() => session.close());
  });

  afterAll(() => deleteUser(driver, email));

  it("should return null when user is created", (done) => {
    create({ email, password }, (output) => {
      expect(output).toEqual(null);

      getUser(driver, email).then((user) => {
        expect(user.properties.email).toEqual(email);
        expect(user.properties.password).not.toEqual(password);

        done();
      });
    });
  });

  it("should return an error when user already exists", (done) => {
    create({ email, password }, (output) => {
      expect(output).toBeInstanceOf(Error);
      done();
    });
  });
});
