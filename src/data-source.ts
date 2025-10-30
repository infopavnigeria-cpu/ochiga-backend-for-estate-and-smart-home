// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres", // docker service name
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "estate_app",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source initialized (Postgres)");
    console.log(
      "Entities loaded:",
      AppDataSource.entityMetadatas.map((e) => e.name)
    );
  })
  .catch((err) => {
    console.error("❌ Error during Data Source init:", err);
  });
