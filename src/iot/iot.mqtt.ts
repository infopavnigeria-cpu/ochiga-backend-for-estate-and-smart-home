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
      this.logger.error('❌ MQTT error: ' + err.message);
    });
  }

  /** Generic publisher */
  publish(topic: string, message: any) {
    if (!this.client.connected) {
      this.logger.warn(`⚠️ MQTT not connected, skipping publish to ${topic}`);
      return;
    }
    this.client.publish(topic, JSON.stringify(message));
  }

  /** Specialized publisher for toggling devices */
  publishToggle(deviceId: string, isOn: boolean) {
    const topic = `devices/${deviceId}/toggle`;
    const message = { isOn };
    this.publish(topic, message);
  }

  /** Example: publish metadata updates */
  publishMetadata(deviceId: string, metadata: Record<string, any>) {
    const topic = `devices/${deviceId}/metadata`;
    this.publish(topic, metadata);
  }
}
