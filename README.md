# Example Relay + PostGraphile App

This is a working example of how to use [React](https://reactjs.org) with [Relay](https://facebook.github.io/relay/) and [PostGraphile](https://www.graphile.org/postgraphile/).

The purpose of this app was to experiment using graphql from the frontend while keeping the required setup to a minimum.  The example app demonstrates a simple query as well as mutation and state modification in Relay.

This app uses [Parcel](http://parceljs.org) to compile assets.

In order to run this app you will need a running [Postgres](http://postgresql.org) database.  Installing on mac OS with brew is as easy as `brew install postgres`.  Other operating systems should refer to Postgres own installation directions. You can also get a free hobby Postgres instance from [Heroku](http://heroku.com).

The example as it stands today uses a database called `test` and a user called `postgres`. If you do not have either of these you can create them by running `createdb test` and `createuser postgres` on your command line.  

The app depends on a single table called 'person', the sql to create the table is:

```sql
DROP TABLE IF EXISTS "public"."person";
CREATE TABLE "public"."person" (
	"id" int4 NOT NULL DEFAULT nextval('person_id_seq'::regclass),
	"first_name" varchar(50) NOT NULL COLLATE "default",
	"last_name" varchar(50) NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."person" OWNER TO "postgres";
ALTER TABLE "public"."person" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;
```

If you would like to use a different database or user, you can either edit the `graphql` command in `package.json` or run PostGraphile yourself from this apps working directory, like so:
```
./node_modules/.bin/postgraphile -c postgres://user:password@domain:port/db?ssl=1 --export-schema-graphql ./schema/schema.graphql -a
```

You will need to compile the relay queries, you can do so by running `npm run relay`.  This will produce a folder `__generated__` in your `src` folder.

Once you have PostGraphile running and you've compiled your queries you can run the application by doing `npm start`.  Assuming the port is not already occupied, the app will be available at: http://localhost:1234. You can access an instance of  GraphiQL at http://localhost:5000/graphiql. In order for the app to run correctly you will need to disable Cross-Origin Restrictions in your browser, as the GraphQL instance and the app itself are run from different ports.
