// src/iot/iot.mqtt.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { connect, MqttClient } from 'mqtt';
import { IotGateway } from './iot.gateway';

@Injectable()
export class IotMqttService {
  private client: MqttClient;
  private readonly logger = new Logger(IotMqttService.name);

  constructor(private readonly gateway: IotGateway) {
    const endpoint = process.env.AWS_IOT_ENDPOINT;
    if (!endpoint) throw new Error('❌ AWS_IOT_ENDPOINT not set in environment variables');

    const certDir = path.resolve(process.cwd(), 'certs');
    const url = `mqtts://${endpoint}:8883`;

    const options = {
      key: fs.readFileSync(path.join(certDir, 'private.pem.key')),
      cert: fs.readFileSync(path.join(certDir, 'certificate.pem.crt')),
      ca: fs.readFileSync(path.join(certDir, 'AmazonRootCA1.pem')),
      rejectUnauthorized: true,
      reconnectPeriod: 5000, // 🔁 Auto-reconnect every 5s
      clientId: `ochiga-backend-${Math.floor(Math.random() * 10000)}`,
    };

    this.logger.log('🚀 Connecting to AWS IoT Core...');
    this.client = connect(url, options);

    this.client.on('connect', () => {
      this.logger.log('✅ Securely connected to AWS IoT Core');
      this.subscribeToTopics();
    });

    this.client.on('reconnect', () => {
      this.logger.warn('♻️ Reconnecting to AWS IoT Core...');
    });

    this.client.on('close', () => {
      this.logger.warn('⚠️ MQTT connection closed');
    });

    this.client.on('error', (err) => {
      this.logger.error(`❌ AWS IoT MQTT error: ${err.message}`);
    });

    this.client.on('message', (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        this.handleIncomingMessage(topic, message);
      } catch (err) {
        this.logger.error(`⚠️ Invalid message on ${topic}: ${payload.toString()}`);
      }
    });
  }

  /** ✅ Subscribe to important AWS IoT topics */
  private subscribeToTopics() {
    const topics = [
      'devices/+/status',
      'devices/+/telemetry',
      'devices/+/shadow/update',
      'devices/+/discovery',
    ];

    topics.forEach((topic) => {
      this.client.subscribe(topic, (err) => {
        if (err) {
          this.logger.error(`❌ Failed to subscribe to ${topic}: ${err.message}`);
        } else {
          this.logger.log(`📡 Subscribed to ${topic}`);
        }
      });
    });
  }

  /** ✅ Handle incoming device messages */
  private handleIncomingMessage(topic: string, message: any) {
    this.logger.log(`📥 [MQTT] ${topic}: ${JSON.stringify(message)}`);

    // Example topic: devices/livingroom-light/status
    const match = topic.match(/^devices\/(.+?)\/(\w+)$/);
    if (!match) return;

    const [_, deviceId, eventType] = match;

    // Broadcast to WebSocket clients
    if (eventType === 'status' || eventType === 'telemetry') {
      this.gateway.notifyDeviceUpdate({ deviceId, eventType, message });
    }

    // Handle device discovery
    if (eventType === 'discovery') {
      this.gateway.broadcast('deviceDiscovered', { deviceId, message });
    }
  }

  /** ✅ Generic publish function */
  publish(topic: string, message: any) {
    if (!this.client.connected) {
      this.logger.warn(`⚠️ MQTT not connected, skipping publish to ${topic}`);
      return;
    }
    this.client.publish(topic, JSON.stringify(message), { qos: 1 });
    this.logger.log(`📤 Published to ${topic}: ${JSON.stringify(message)}`);
  }

  /** ✅ Device-specific commands */
  publishToggle(deviceId: string, isOn: boolean) {
    this.publish(`devices/${deviceId}/toggle`, { isOn });
  }

  publishMetadata(deviceId: string, metadata: Record<string, any>) {
    this.publish(`devices/${deviceId}/metadata`, metadata);
  }

  publishDiscoveryRequest() {
    this.publish('devices/discover/request', { timestamp: new Date().toISOString() });
  }
}
