import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly service: NotificationsService) {}

  @SubscribeMessage('notify')
  handleNotify(@MessageBody() data: any) {
    this.server.emit(`user-${data.userId}`, data);
  }
}
