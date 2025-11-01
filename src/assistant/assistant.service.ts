import { Injectable, Logger } from '@nestjs/common';

// Services from other modules
import { DeviceService } from '../iot/device.service';
import { WalletService } from '../wallet/wallet.service';
import { VisitorsService } from '../visitors/visitors.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { CommunityService } from '../community/community.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EstateService } from '../estate/estate.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly walletService: WalletService,
    private readonly visitorsService: VisitorsService,
    private readonly utilitiesService: UtilitiesService,
    private readonly communityService: CommunityService,
    private readonly notificationsService: NotificationsService,
    private readonly estateService: EstateService,
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Main command processor
   */
  async processCommand(command: string): Promise<{ reply: string }> {
    const text = command.toLowerCase().trim();
    this.logger.log(`🎤 Processing command: "${text}"`);

    // --- Greetings ---
    if (/(hello|hi|hey|good (morning|evening|afternoon))/i.test(text)) {
      return { reply: '👋 Hello! I’m Ochiga AI — how can I assist with your estate today?' };
    }

    // --- IoT / Device Commands ---
    if (text.includes('light') || text.includes('fan') || text.includes('ac') || text.includes('toggle')) {
      const deviceName = this.extractDeviceName(text);
      if (deviceName) {
        await this.deviceService.toggleDeviceByName(deviceName);
        return { reply: `✅ ${deviceName} toggled successfully.` };
      }
      return { reply: '⚙️ Please specify which device or room to control.' };
    }

    // --- Wallet Commands ---
    if (text.includes('wallet')) {
      if (text.includes('balance')) {
        const balance = await this.walletService.getBalance();
        return { reply: `💰 Your wallet balance is ₦${balance}.` };
      }
      if (text.includes('fund') || text.includes('add money')) {
        const amount = this.extractAmount(text);
        await this.walletService.fundWallet(amount);
        return { reply: `💵 Wallet funded with ₦${amount}.` };
      }
    }

    // --- Visitors ---
    if (text.includes('visitor') || text.includes('guest')) {
      if (text.includes('add')) {
        return { reply: '👥 You can add a visitor by providing their name and purpose of visit.' };
      }
      const visitors = await this.visitorsService.getAllVisitors();
      return { reply: `👥 You currently have ${visitors.length} visitor(s) recorded.` };
    }

    // --- Utilities ---
    if (text.includes('bill') || text.includes('utility') || text.includes('power') || text.includes('water')) {
      const bills = await this.utilitiesService.getAllUtilities();
      return { reply: `⚡ You have ${bills.length} pending utility bills.` };
    }

    // --- Notifications ---
    if (text.includes('notification') || text.includes('alert')) {
      const notifs = await this.notificationsService.getAllNotifications();
      if (notifs.length === 0) return { reply: '🔔 You have no new notifications.' };
      return { reply: `🔔 You have ${notifs.length} notifications. Latest: "${notifs[0].title}"` };
    }

    // --- Community Events ---
    if (text.includes('event') || text.includes('meeting') || text.includes('community')) {
      const events = await this.communityService.getEvents();
      return { reply: `🏡 There are ${events.length} community events coming up.` };
    }

    // --- Estate Info ---
    if (text.includes('estate')) {
      const estate = await this.estateService.getEstateOverview();
      return { reply: `🏠 Estate: ${estate.name}, ${estate.units} units, ${estate.residents} residents.` };
    }

    // --- Dashboard Summary ---
    if (text.includes('summary') || text.includes('dashboard')) {
      const summary = await this.dashboardService.getSummary();
      return {
        reply: `📊 Estate Summary: ${summary.residents} residents, ${summary.visitors} visitors, ₦${summary.totalBalance} in wallet.`,
      };
    }

    // --- Default Fallback ---
    return { reply: "🤖 Sorry, I didn’t quite catch that. Could you rephrase or be more specific?" };
  }

  /**
   * Extract device name from a spoken text
   */
  extractDeviceName(text: string): string | null {
    const match = text.match(/(?:toggle|turn on|turn off|switch)\s+([\w\s]+)/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract amount from text (for wallet commands)
   */
  extractAmount(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
