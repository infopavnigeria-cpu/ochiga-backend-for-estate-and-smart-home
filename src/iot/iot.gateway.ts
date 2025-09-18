// src/iot/iot.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Device } from './entities/device.entity';

@WebSocketGateway()
export class IotGateway {
  @WebSocketServer()
  server!: Server; // ✅ Fix: definite assignment

  // Call this method whenever a device is updated
  notifyDeviceUpdate(device: Device) {
    if (device.owner) {
      // Resident-only notification
      this.server.to(device.owner.id).emit('deviceUpdated', device);
    }

    if (device.isEstateLevel) {
      // Estate-wide notification to all managers
      this.server.to('managers').emit('estateDeviceUpdated', device);
    }
  }
}
