// src/iot/dto/control-device.dto.ts
export class ControlDeviceDto {
  action: string;   // "on", "off", "set-temp", etc.
  value?: any;
}
