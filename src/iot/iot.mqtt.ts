// src/iot/iot.mqtt.ts
import { Injectable, Logger } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class IotMqttService {
  private client: MqttClient;
  private readonly logger = new Logger(IotMqttService.name);

  constructor() {
    this.client = connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com:1883');

    this.client.on('connect', () => {
      this.logger.log('✅ Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      this.logger.error('❌ MQTT error', err);
    });
  }

  publish(topic: string, message: any) {
    this.client.publish(topic, JSON.stringify(message));
  }
}
