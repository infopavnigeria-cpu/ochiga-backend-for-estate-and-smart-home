import { IsString, IsOptional, IsIn, IsNumber, IsObject } from 'class-validator';

export class ControlDeviceDto {
  @IsString()
  @IsIn([
    'on',
    'off',
    'set-temp',
    'set-brightness',
    'set-speed',
    'set-mode',
    'custom',
  ])
  action!: string;
  // ✅ Supported actions:
  // "on" | "off"
  // "set-temp"       (temperature control: AC, heater)
  // "set-brightness" (lights, dimmers)
  // "set-speed"      (fans, motors)
  // "set-mode"       (AC mode: cool, heat, auto, etc.)
  // "custom"         (catch-all for future/complex controls)

  @IsOptional()
  @IsNumber()
  value?: number; // for sliders like temp, brightness, speed

  @IsOptional()
  @IsString()
  mode?: string; // e.g. "cool" | "heat" | "auto" for ACs

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>; 
  // for advanced/custom device commands
}
