// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Estate } from "./estate/entities/estate.entity";  // add this

export const AppDataSource = new DataSource({
  type: "postgres",           
  host: "localhost",
  port: 5432,                  
  username: "postgres",        
  password: "password",        
  database: "ochiga_db",       
  entities: [User, Estate],    // include Estate here
  migrations: ["dist/migrations/*.js"], 
  synchronize: false,          // set true only in dev for testing
  logging: true,
});
