import mysql from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Aj1Berem2Grozdje3",
    database: "baza",
  });
  
  export { db };