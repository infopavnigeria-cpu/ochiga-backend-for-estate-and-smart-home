import { Injectable } from '@nestjs/common';
import { TokenUser } from '../auth/types/token-user.interface';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class DashboardService {
  async getManagerDashboard(user: TokenUser) {
    // 🔹 Replace this mock data with DB queries later
    return {
      message: 'Welcome Manager!',
      user,
      stats: {
        totalResidents: 120,
        activeLeases: 85,
        pendingRequests: 14,
      },
      quickLinks: [
        { name: 'Manage Properties', url: '/properties' },
        { name: 'Approve Requests', url: '/requests' },
        { name: 'Financial Reports', url: '/reports' },
      ],
    };
  }

  async getResidentDashboard(user: TokenUser) {
    // 🔹 Replace this with personalized resident data later
    return {
      message: 'Welcome Resident!',
      user,
      myLease: {
        property: 'Sunset Apartments, Block B',
        rentDue: '2025-10-01',
        balance: 250,
      },
      quickLinks: [
        { name: 'Pay Rent', url: '/payments' },
        { name: 'Request Maintenance', url: '/maintenance' },
        { name: 'Community Forum', url: '/community' },
      ],
    };
  }

  async getDashboard(user: TokenUser) {
    if (user.role === UserRole.MANAGER) {
      return this.getManagerDashboard(user);
    } else if (user.role === UserRole.RESIDENT) {
      return this.getResidentDashboard(user);
    }
    return { message: 'Unknown role', user };
  }
}
