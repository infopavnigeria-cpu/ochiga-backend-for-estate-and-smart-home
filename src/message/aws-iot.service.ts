// src/message/aws-iot.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as awsIot from 'aws-iot-device-sdk';

@Injectable()
export class AwsIotService implements OnModuleInit {
  private readonly logger = new Logger(AwsIotService.name);
  private device: awsIot.device | null = null;

  async onModuleInit() {
    try {
      this.logger.log('🌍 Initializing AWS IoT connection...');

      this.device = new awsIot.device({
        keyPath: path.resolve(__dirname, '../../certs/private.pem.key'),
        certPath: path.resolve(__dirname, '../../certs/certificate.pem.crt'),
        caPath: path.resolve(__dirname, '../../certs/AmazonRootCA1.pem'),
        clientId: 'OchigaBackendClient',
        host: 'a3m9h28ikfvc7r-ats.iot.us-east-1.amazonaws.com',
        protocol: 'mqtts',
      });

      this.device.on('connect', () => {
        this.logger.log('✅ Connected to AWS IoT Core');
        this.device!.subscribe('ochiga/messages');
      });

      this.device.on('message', (topic: string, payload: Buffer) => {
        this.logger.log(`📩 Received from ${topic}: ${payload.toString()}`);
      });

      this.device.on('error', (error: Error) => {
        this.logger.error(`❌ AWS IoT Error: ${error.message}`);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`⚠️ AWS IoT initialization failed: ${message}`);
    }
  }

  async publishMessage(topic: string, payload: Record<string, any>): Promise<void> {
    if (!this.device) {
      this.logger.warn('AWS IoT device not connected yet.');
      return;
    }
    this.device.publish(topic, JSON.stringify(payload));
    this.logger.log(`📤 Published to ${topic}: ${JSON.stringify(payload)}`);
  }

  async publishTestMessage(): Promise<void> {
    const payload = {
      message: 'Hello from Ochiga Backend!',
      timestamp: new Date().toISOString(),
    };
    await this.publishMessage('ochiga/test/topic', payload);
  }
}
