# Neo4j Auth0 Examples

Examples for using Neo4j as a Custom Database on Auth0.

## Using these examples

To use Neo4j as a custom database in Auth0, you will need to copy the functions from the `src/` folder into the relevent tab in.


1. In the Auth0 conosle, go to *Authentication > Database*
2. Click *Create DB Connection* to add a new connection.  You can give it any reference you like.
3. Under the *Custom Database* tab, enable the *Use my own database* option.
4. Under *Database settings*, enter your Neo4j credentials ([See Configuration](#configuration))
5. Under *Database Action Scripts*, copy the files from the `src/` folder into the relevent tab.


[Read more on Custom Database Connections in Auth0](https://auth0.com/docs/authenticate/database-connections/custom-db).

### Copying the files

When copying files, only the function included in the file needs to be copied.  Any `require` functions outside of the function are only required for testing purposes.


### Configuration

These scripts use values from the  `configuration` object when instantiating the driver.These can be configured in the *Database settings* section.

* NEO4J_URI - The URI for neo4j, eg `neo4j://dbhash.databases.neo4j.io`
* NEO4J_USERNAME - The username for the Neo4j DBMS - eg `neo4j`
* NEO4J_PASSWORD - The password for the user


## Testing

This repository uses jest for testing.  To run tests, run the `npm run test` command.

You can edit the configuration details by editing `test/config.js` or setting the variables in your evironment.
