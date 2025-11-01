import { Injectable } from '@nestjs/common';
import { DeviceService } from '../iot/device.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AssistantService {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly walletService: WalletService,
  ) {}

  async processCommand(command: string) {
    const text = command.toLowerCase();

    if (text.includes('toggle')) {
      const deviceName = this.extractDeviceName(text);
      if (deviceName) {
        await this.deviceService.toggleDeviceByName(deviceName);
        return { reply: `✅ Toggled ${deviceName}.` };
      }
      return { reply: 'Device not found.' };
    }

    if (text.includes('wallet')) {
      if (text.includes('balance')) {
        const balance = await this.walletService.getBalance();
        return { reply: `💰 Your wallet balance is ₦${balance}` };
      }
      if (text.includes('fund')) {
        const amount = this.extractAmount(text);
        await this.walletService.fundWallet(amount);
        return { reply: `✅ Wallet funded with ₦${amount}.` };
      }
    }

    return { reply: "Sorry, I didn't understand that command." };
  }

  extractDeviceName(text: string) {
    const match = text.match(/toggle (.*)/);
    return match ? match[1] : null;
  }

  extractAmount(text: string) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
