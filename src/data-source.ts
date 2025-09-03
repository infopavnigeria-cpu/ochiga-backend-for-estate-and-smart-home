// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Estate } from "./estate/entities/estate.entity";
import { Home } from "./home/entities/home.entity";
import { Room } from "./room/entities/room.entity";
import { HomeMember } from "./home/entities/home-member.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User, Estate, Home, Room, HomeMember],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, // keep false for migrations
  logging: true,
});