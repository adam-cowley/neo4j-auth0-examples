const getByEmail = require("./get-user");
const driver = require("./test/driver");
const { createUser } = require("./test/utils");

describe("Get User By Email", () => {
  it("should return null when user not found", (done) => {
    getByEmail("unknown@neo4j.com", (err, user) => {
      expect(err).toEqual(null);
      expect(user).toBeUndefined();

      done();
    });
  });

  it("should return object when user exists", (done) => {
    const email = `${Math.random()}@neo4j.com`;
    const password = "letmein";

    createUser(driver, email, password).then(() => {
      getByEmail(email, (err, user) => {
        expect(err).toEqual(null);

        expect(user).toBeDefined();
        expect(user.email).toEqual(email);
        expect(user.password).not.toBeDefined();

        done();
      });
    });
  });
});
