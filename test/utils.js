function createUser(driver, email, password = null) {
  const session = driver.session();

  return session
    .writeTransaction((tx) =>
      tx.run(
        `
        CREATE (u:User {user_id: randomUuid(), email: $email, password: $password})
        RETURN u
    `,
        { email, password }
      )
    )
    .then((res) => res.records[0].get("u"))
    .finally(() => session.close());
}

function deleteUser(driver, email) {
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
    .finally(() => session.close());
}

function getUser(driver, email) {
  const session = driver.session();

  return session
    .writeTransaction((tx) =>
      tx.run(
        `
        MATCH (u:User {email: $email})
        RETURN u
    `,
        { email }
      )
    )
    .then((res) => (res.records.length ? res.records[0].get("u") : undefined))
    .finally(() => session.close());
}

module.exports = {
  createUser,
  deleteUser,
  getUser,
};
