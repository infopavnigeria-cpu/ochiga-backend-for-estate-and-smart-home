import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class IotGateway {
  @WebSocketServer()
  server!: Server;

  // Generic broadcaster
  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  // Specialized notifiers
  notifyDeviceUpdate(device: any) {
    this.broadcast('deviceUpdate', device);
  }

  notifyLog(log: any) {
    this.broadcast('deviceLog', log);
  }
}
