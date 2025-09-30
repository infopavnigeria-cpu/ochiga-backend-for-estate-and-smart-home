onModuleInit() {
  this.client = connect(process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com:1883');
  this.client.on('connect', () => {
    this.logger.log('✅ Connected to MQTT broker');

    // Subscribe to both resident + estate scopes
    this.client.subscribe('resident/+/devices/+/status');
    this.client.subscribe('estate/+/devices/+/status');
  });

  this.client.on('message', async (topic, payload) => {
    try {
      const data = JSON.parse(payload.toString());
      const parts = topic.split('/'); 
      // resident/{userId}/devices/{deviceId}/status
      // estate/{estateId}/devices/{deviceId}/status
      const scope = parts[0]; // "resident" | "estate"
      const scopeId = parts[1]; 
      const deviceId = parts[3]; 

      const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
      if (device) {
        device.isOn = data.status;
        await this.deviceRepo.save(device);
        this.gateway.notifyDeviceUpdate(device);
      }
    } catch (err) {
      this.logger.error('❌ MQTT parse error', err.message);
    }
  });
}

publishToggle(device: Device, status: boolean, userId?: string, estateId?: string) {
  if (!this.client?.connected) {
    this.logger.warn('⚠️ MQTT client not connected, skipping publish');
    return;
  }

  let topic: string;
  if (device.isEstateLevel && estateId) {
    topic = `estate/${estateId}/devices/${device.id}/toggle`;
  } else if (!device.isEstateLevel && userId) {
    topic = `resident/${userId}/devices/${device.id}/toggle`;
  } else {
    this.logger.error('❌ Missing scope for publish');
    return;
  }

  this.client.publish(topic, JSON.stringify({ status }));
  this.logger.log(`📡 Published toggle => ${topic} : ${status}`);
}
