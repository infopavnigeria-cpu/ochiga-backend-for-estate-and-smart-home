// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Resident } from "./user/entities/resident.entity";
import { Estate } from "./estate/entities/estate.entity";
import { Home } from "./home/entities/home.entity";
import { Room } from "./room/entities/room.entity";
import { HomeMember } from "./home/entities/home-member.entity";
import { Wallet } from "./wallet/entities/wallet.entity";
import { Visitor } from "./visitors/entities/visitors.entity";
import { Payment } from "./payments/entities/payment.entity";
import { Device } from "./iot/entities/device.entity";
import { DeviceLog } from "./iot/entities/device-log.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [
    User,
    Resident,
    Estate,
    Home,
    Room,
    HomeMember,
    Wallet,
    Visitor,
    Payment,
    Device,      // 👈 add Device
    DeviceLog,   // 👈 add DeviceLog
  ],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, // keep false for migrations
  logging: true,
});
