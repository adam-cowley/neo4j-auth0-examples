const create = require("./create");
const login = require("./login");

describe("Login", () => {
  it("should throw WrongUsernameOrPasswordError when user not found", (done) => {
    login("unknown@neo4j.com", "dontletmein", (output) => {
      expect(output).toBeInstanceOf(Error);

      done();
    });
  });

  it("should throw WrongUsernameOrPasswordError on incorrect password", (done) => {
    const email = `${Math.random()}@neo4j.com`;
    const password = "letmein";

    create({ email, password }, (output) => {
      expect(output).toEqual(null);

      login(email, "dontletmein", (err, output) => {
        expect(err).toBeInstanceOf(Error);
        expect(output).not.toBeDefined();

        done();
      });
    });
  });

  it("should return user information on correct credentials", (done) => {
    const email = `${Math.random()}@neo4j.com`;
    const password = "letmein";

    create({ email, password }, (output) => {
      expect(output).toEqual(null);

      login(email, password, (err, output) => {
        expect(err).toEqual(null);

        expect(output.email).toEqual(email);
        expect(output.password).not.toBeDefined();

        done();
      });
    });
  });
});
