const { createUser, deleteUser, getUser } = require("./test/utils");
const driver = require("./test/driver");
const deleteFn = require("./delete");

describe("Delete", () => {
  const email = "delete@neo4j.com";

  afterAll(() => deleteUser(driver, email));

  it("should return undefined if user does not exist", done => {
    deleteFn ("abc", (err) => {
      expect(err).toBeUndefined()

      done()
    });
  });

  it("should return undefined and delete user from the database", done => {
    createUser(driver, email, "password").then((user) => {
      const id = user.properties.user_id;

      deleteFn(id, (err) => {
        expect(err).toBeUndefined();

        getUser(driver, email).then((res) => {
          expect(res).toBeUndefined();

          done();
        });
      });
    });
  });
});
