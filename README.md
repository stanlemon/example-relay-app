# Example Relay + PostGraphile App

This is a working example of how to use [React](https://reactjs.org) with [Relay](https://facebook.github.io/relay/) and [PostGraphile](https://www.graphile.org/postgraphile/).

The purpose of this app was to experiment using graphql from the frontend while keeping the required setup to a minimum. The example app demonstrates a simple query as well as mutation and state modification in Relay.

To beging uou will need to compile the relay queries, you can do so by running:

```shell
npm run relay
```

Next you will need a running [Postgres](http://postgresql.org) database.  Installing on mac OS with brew is as easy as `brew install postgres`.  Other operating systems should refer to Postgres own installation directions. You can also get a free hobby Postgres instance from [Heroku](http://heroku.com).

The example as it stands today uses a database called `test` and a user called `postgres`. If you do not have either of these you can create them by running `createdb test` and `createuser postgres` on your command line.  

The app depends on a single table called 'person', the sql to create the table is:

```sql
DROP TABLE IF EXISTS "public"."person";
CREATE TABLE "public"."person" (
	"id" SERIAL PRIMARY KEY,
	"first_name" varchar(50) NOT NULL COLLATE "default",
	"last_name" varchar(50) NOT NULL COLLATE "default"
)
```

Then you will need to create a config named `.postgraphilerc.js` file for postgraphile:

```javascript
module.exports = {
  options: {
    connection: "postgres:///test",
  },
};
```

Now you can run postgraphile:

```shell
npm run graphql
```

Finally you can run the application by doing:

```shell
npm start
```

Assuming the port is not already occupied, the app will be available at: http://localhost:8080. You can access an instance of  GraphiQL at http://localhost:5000/graphiql. In order for the app to run correctly you will need to disable Cross-Origin Restrictions in your browser, as the GraphQL instance and the app itself are run from different ports.
