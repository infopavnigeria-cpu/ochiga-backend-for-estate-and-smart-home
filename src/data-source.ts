import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity"; 
// later add Home, HomeMember, etc

export const AppDataSource = new DataSource({
  type: "postgres",            // or "mysql" depending on your DB
  host: "localhost",
  port: 5432,                  // postgres default
  username: "postgres",        // your db username
  password: "password",        // your db password
  database: "ochiga_db",       // your db name
  entities: [User],            // add more entities here
  migrations: ["dist/migrations/*.js"], 
  synchronize: false,          // true for dev, false in prod
  logging: true,
});
