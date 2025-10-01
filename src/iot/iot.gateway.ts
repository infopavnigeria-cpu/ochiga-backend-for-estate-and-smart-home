// src/iot/iot.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class IotGateway {
  @WebSocketServer()
  server!: Server;

  /** Generic broadcaster */
  broadcast(event: string, payload: any) {
    if (this.server) {
      this.server.emit(event, payload);
    }
  }

  /** Notify device updates */
  notifyDeviceUpdate(device: any) {
    this.broadcast('deviceUpdate', device);
  }

  /** Notify device log */
  notifyLog(log: any) {
    this.broadcast('deviceLog', log);
  }
}
