import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Estate } from "./estate/entities/estate.entity";
import { Home } from "./home/entities/home.entity";
import { Room } from "./room/entities/room.entity";

export const AppDataSource = new DataSource({
  type: "postgres", // or "mysql"
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "ochiga_db",
  entities: [User, Estate, Home, Room],
  migrations: ["dist/migrations/*.js"],
  synchronize: false, // keep false in production
  logging: true,
});
