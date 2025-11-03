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
import { Command } from './command.entity';

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
    @InjectRepository(Command)
    private readonly commandRepo: Repository<Command>,
  ) {}

  async processCommand(command: string, userId: string = 'system-user'): Promise<{ reply: string }> {
    const text = command.toLowerCase().trim();
    this.logger.log(`🎤 Processing command: "${text}"`);
    await this.commandRepo.save({ text, createdAt: new Date() });

    try {
      // --- Greetings ---
      if (/(hello|hi|hey|good (morning|afternoon|evening))/i.test(text)) {
        return { reply: '👋 Hello! I’m Ochiga AI — how can I help with your estate today?' };
      }

      // --- IoT ---
      if (/(light|fan|ac|door|device|toggle|switch)/i.test(text)) {
        const deviceName = this.extractDeviceName(text);
        if (deviceName) {
          const result = await this.iotService.toggleDeviceByName(deviceName);
          return { reply: `✅ ${result?.message || 'Device toggled successfully.'}` };
        }
        return { reply: '⚙️ Please specify the device or room name.' };
      }

      // --- Wallet ---
      if (text.includes('wallet')) {
        if (text.includes('balance')) {
          const balance = await this.walletService.getBalance(userId);
          return { reply: `💰 Your wallet balance is ₦${balance.balance}.` };
        }
        if (text.includes('fund') || text.includes('add money') || text.includes('top up')) {
          const amount = this.extractAmount(text);
          if (!amount) return { reply: '💵 Please specify how much to fund your wallet with.' };
          await this.walletService.fundWallet(userId, amount);
          return { reply: `💳 Wallet successfully funded with ₦${amount}.` };
        }
      }

      // --- Visitors ---
      if (/(visitor|guest)/i.test(text)) {
        const visitors =
          (this.visitorsService.getAllVisitors && (await this.visitorsService.getAllVisitors())) || [];
        return { reply: `🚪 You currently have ${visitors.length} visitor(s).` };
      }

      // --- Utilities ---
      if (/(bill|utility|power|water|waste|electricity)/i.test(text)) {
        const bills =
          (this.utilitiesService.getAllUtilities && (await this.utilitiesService.getAllUtilities())) || [];
        return { reply: `⚡ You have ${bills.length} pending utility bill(s).` };
      }

      // --- Notifications ---
      if (/(notification|alert|message)/i.test(text)) {
        const notifs =
          (this.notificationsService.getAllNotifications &&
            (await this.notificationsService.getAllNotifications())) || [];
        if (!notifs.length) return { reply: '🔔 You have no new notifications.' };
        const latest = notifs[0];
        return { reply: `🔔 You have ${notifs.length} notifications. Latest: "${latest.title || 'Untitled'}".` };
      }

      // --- Community Events ---
      if (/(event|meeting|community|party)/i.test(text)) {
        const events = (this.communityService.getEvents && (await this.communityService.getEvents())) || [];
        if (!events.length) return { reply: '🏡 No upcoming community events right now.' };
        return { reply: `📅 ${events.length} community event(s) coming up. Next: "${events[0].title}".` };
      }

      // --- Estate Info ---
      if (text.includes('estate')) {
        const estate =
          (this.estateService.getEstateOverview && (await this.estateService.getEstateOverview())) || {
            name: 'Your Estate',
            units: 0,
            residents: 0,
          };
        return {
          reply: `🏠 Estate: ${estate.name}\nUnits: ${estate.units ?? 'N/A'}\nResidents: ${
            estate.residents ?? 'N/A'
          }\nYou're
