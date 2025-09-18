// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [__dirname + "/**/*.entity{.ts,.js}"], // ✅ correct glob
  migrations: [__dirname + "/migrations/*{.ts,.js}"], // ✅ works for dev & prod
  synchronize: false, // keep false for migrations
  logging: true,
});
