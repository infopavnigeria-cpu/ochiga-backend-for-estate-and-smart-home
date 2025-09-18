// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [__dirname + "/**/*.entity.{ts,js}"], // 👈 auto-load all entities
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  synchronize: false, // keep false for migrations
  logging: true,
});
