// src/iot/iot.service.ts (refined)
async controlDevice(userId: string, role: UserRole, deviceId: string, dto: ControlDeviceDto) {
  const device = await this.deviceRepo.findOne({ where: { id: deviceId }, relations: ['owner'] });
  if (!device) return null;

  // 🔒 Security checks
  if (device.isEstateLevel && role !== UserRole.MANAGER) {
    throw new Error('Only managers can control estate devices');
  }
  if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId)) {
    throw new Error('You can only control your own devices');
  }

  // ✅ Apply control
  if (dto.action === 'on') device.isOn = true;
  if (dto.action === 'off') device.isOn = false;
  if (dto.action === 'set-temp') device.metadata = JSON.stringify({ temp: dto.value });

  await this.deviceRepo.save(device);

  const log = this.logRepo.create({ device, action: dto.action, details: JSON.stringify(dto.value) });
  await this.logRepo.save(log);

  return device;
}
