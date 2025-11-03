import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IotService } from '../iot/iot.service';
import { WalletService } from '../wallet/wallet.service';
import { VisitorsService } from '../visitors/visitors.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { CommunityService } from '../community/community.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EstateService } from '../estate/estate.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Command } from './entities/command.entity';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly iotService: IotService,
    private readonly walletService: WalletService,
    private readonly visitorsService: VisitorsService,
    private readonly utilitiesService: UtilitiesService,
    private readonly communityService: CommunityService,
    private readonly notificationsService: NotificationsService,
    private readonly estateService: EstateService,
    private readonly dashboardService: DashboardService,
    @InjectRepository(Command) private readonly commandRepo: Repository<Command>,
  ) {}

  /**
   * 🔹 Main AI Command Processor
   */
  async processCommand(command: string): Promise<{ reply: string }> {
    const text = command.toLowerCase().trim();
    this.logger.log(`🎤 Processing command: "${text}"`);

    // Log command in DB
    await this.commandRepo.save({ text, createdAt: new Date() });

    try {
      // --- Greetings ---
      if (/(hello|hi|hey|good (morning|afternoon|evening))/i.test(text)) {
        return { reply: '👋 Hello! I’m Ochiga AI — your smart estate assistant. How can I help you today?' };
      }

      // --- IoT / Smart Device Controls ---
      if (/(light|fan|ac|door|toggle|switch|device)/i.test(text)) {
        const deviceName = this.extractDeviceName(text);
        if (deviceName) {
          const result = await this.iotService.toggleDeviceByName(deviceName);
          return { reply: `✅ ${result.message}` };
        }
        return { reply: '⚙️ Please specify the device or room you’d like to control.' };
      }

      // --- Wallet Management ---
      if (text.includes('wallet')) {
        if (text.includes('balance')) {
          const balance = await this.walletService.getBalance();
          return { reply: `💰 Your current wallet balance is ₦${balance}.` };
        }
        if (text.includes('fund') || text.includes('add money') || text.includes('top up')) {
          const amount = this.extractAmount(text);
          if (!amount) return { reply: '💵 Please specify the amount to fund your wallet with.' };
          await this.walletService.fundWallet(amount);
          return { reply: `💳 Wallet successfully funded with ₦${amount}.` };
        }
      }

      // --- Visitors / Guests ---
      if (/(visitor|guest)/i.test(text)) {
        if (text.includes('add')) {
          return { reply: '👥 Please provide the visitor’s name and purpose of visit to proceed.' };
        }
        const visitors = await this.visitorsService.getAllVisitors();
        return { reply: `🚪 You currently have ${visitors.length} visitor(s) recorded.` };
      }

      // --- Utilities / Bills ---
      if (/(bill|utility|power|water|waste|electricity)/i.test(text)) {
        const bills = await this.utilitiesService.getAllUtilities();
        return { reply: `⚡ You have ${bills.length} pending utility bill(s).` };
      }

      // --- Notifications / Alerts ---
      if (/(notification|alert|message)/i.test(text)) {
        const notifs = await this.notificationsService.getAllNotifications();
        if (!notifs.length) return { reply: '🔔 You have no new notifications.' };
        const latest = notifs[0];
        return { reply: `🔔 You have ${notifs.length} notifications. Latest: "${latest.title}".` };
      }

      // --- Community Events / Meetings ---
      if (/(event|meeting|community|party)/i.test(text)) {
        const events = await this.communityService.getEvents();
        if (!events.length) return { reply: '🏡 No upcoming community events right now.' };
        return { reply: `📅 ${events.length} community event(s) coming up. Next: "${events[0].title}".` };
      }

      // --- Estate Overview ---
      if (text.includes('estate')) {
        const estate = await this.estateService.getEstateOverview();
        return {
          reply: `🏠 Estate: ${estate.name}\nUnits: ${estate.units}\nResidents: ${estate.residents}\nYou're living smart with Ochiga.`,
        };
      }

      // --- Dashboard / Summary ---
      if (/(summary|dashboard|report|overview)/i.test(text)) {
        const summary = await this.dashboardService.getSummary();
        return {
          reply: `📊 Estate Summary:\nResidents: ${summary.residents}\nVisitors: ${summary.visitors}\nWallet Total: ₦${summary.totalBalance}`,
        };
      }

      // --- Help / Assistance ---
      if (/help|assist|what can you do|commands/i.test(text)) {
        return {
          reply:
            '🤖 Here’s what I can help you with:\n- Control devices (lights, doors, AC)\n- Check wallet balance or fund wallet\n- View visitors and events\n- Check utility bills or notifications\n- Get estate or dashboard summary',
        };
      }

      // --- Default Fallback ---
      return {
        reply:
          "🤖 I'm not sure I understood that. Try something like 'turn on living room light' or 'show estate summary'.",
      };
    } catch (error) {
      this.logger.error(`❌ Error processing command: ${error.message}`);
      return { reply: '⚠️ Sorry, something went wrong while processing your request.' };
    }
  }

  /**
   * 🔹 Retrieve a single logged command
   */
  async getCommandById(id: string) {
    const command = await this.commandRepo.findOne({ where: { id: id as any } });
    if (!command) throw new NotFoundException('Command not found');
    return command;
  }

  /**
   * 🔹 Helper: Extract device name from natural text
   */
  extractDeviceName(text: string): string | null {
    const match = text.match(/(?:toggle|turn on|turn off|switch|activate|deactivate)\s+([\w\s]+)/i);
    return match ? match[1].trim() : null;
  }

  /**
   * 🔹 Helper: Extract amount (₦) from natural text
   */
  extractAmount(text: string): number {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
