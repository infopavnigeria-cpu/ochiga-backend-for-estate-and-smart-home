// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [__dirname + "/**/*.entity{.ts,.js}"], // ✅ auto-load all entities
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});

// ✅ Initialize + log entities for debugging
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source initialized");
    console.log(
      "Entities loaded:",
      AppDataSource.entityMetadatas.map((e) => e.name)
    );
  })
  .catch((err) => {
    console.error("❌ Error during Data Source init:", err);
  });
