import { postgres } from "./deps.js";

let sql;
if (Deno.env.get("DATABASE_URL")) {
    sql = postgres(Deno.env.get("DATABASE_URL"));
} else {
    sql = postgres({});
}

export { sql };

//import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

//Create a SQL connection using your credentials
//const sql = postgres({
//  host: "database-server", // Use "localhost" if you're running locally
//port: 5432, // Default PostgreSQL port
//user: "username", // Replace with your actual database username
//password: "password", // Replace with your actual database password
//database: "database", // Replace with your actual database name
//});

//Export the SQL connection for use in other modules
//export { sql };

//let sql;
// if (Deno.env.get("DATABASE_URL")) {
//sql = postgres(Deno.env.get("DATABASE_URL"));
//} else {
//sql = postgres({});
//}

//export { sql };
