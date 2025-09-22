import { db } from './database/db-service';
import { AuditLogService } from './auth/audit-log';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalMessages: number;
  unreadMessages: number;
  pendingApprovals: number;
  systemHealth: SystemHealth;
  recentActivities: ActivityLog[];
  userActivity: UserActivity[];
  contentStats: ContentStats;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  database: {
    status: 'connected' | 'disconnected';
    size: number;
    tableCount: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  lastBackup: string | null;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  username: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface UserActivity {
  userId: string;
  username: string;
  lastLogin: Date;
  loginCount: number;
  role: string;
  status: 'active' | 'inactive';
}

export interface ContentStats {
  totalPages: number;
  totalSections: number;
  pendingApprovals: number;
  recentUpdates: number;
  byLanguage: {
    zh: number;
    en: number;
    ru: number;
  };
}

export class DashboardService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      totalMessages,
      unreadMessages,
      pendingApprovals,
      systemHealth,
      recentActivities,
      userActivity,
      contentStats
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getActiveUsers(),
      this.getTotalProducts(),
      this.getTotalMessages(),
      this.getUnreadMessages(),
      this.getPendingApprovals(),
      this.getSystemHealth(),
      this.getRecentActivities(),
      this.getUserActivity(),
      this.getContentStats()
    ]);

    return {
      totalUsers,
      activeUsers,
      totalProducts,
      totalMessages,
      unreadMessages,
      pendingApprovals,
      systemHealth,
      recentActivities,
      userActivity,
      contentStats
    };
  }

  static async getTotalUsers(): Promise<number> {
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    return result?.count || 0;
  }

  static async getActiveUsers(): Promise<number> {
    const result = await db.get('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
    return result?.count || 0;
  }

  static async getTotalProducts(): Promise<number> {
    // 假设产品表名为 products
    try {
      const result = await db.get('SELECT COUNT(*) as count FROM products');
      return result?.count || 0;
    } catch {
      return 0;
    }
  }

  static async getTotalMessages(): Promise<number> {
    // 假设留言表名为 contacts
    try {
      const result = await db.get('SELECT COUNT(*) as count FROM contacts');
      return result?.count || 0;
    } catch {
      return 0;
    }
  }

  static async getUnreadMessages(): Promise<number> {
    try {
      const result = await db.get('SELECT COUNT(*) as count FROM contacts WHERE read = 0');
      return result?.count || 0;
    } catch {
      return 0;
    }
  }

  static async getPendingApprovals(): Promise<number> {
    try {
      const result = await db.get('SELECT COUNT(*) as count FROM content_approvals WHERE status = "pending"');
      return result?.count || 0;
    } catch {
      return 0;
    }
  }

  static async getSystemHealth(): Promise<SystemHealth> {
    try {
      const dbHealth = await db.get(`
        SELECT COUNT(*) as tableCount 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `);

      const dbStats = await db.get('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');

      return {
        status: 'healthy',
        database: {
          status: 'connected',
          size: dbStats?.size || 0,
          tableCount: dbHealth?.tableCount || 0
        },
        storage: {
          used: 0, // 需要实际存储统计
          total: 0,
          percentage: 0
        },
        uptime: process.uptime(),
        lastBackup: null
      };
    } catch (error) {
      return {
        status: 'error',
        database: {
          status: 'disconnected',
          size: 0,
          tableCount: 0
        },
        storage: {
          used: 0,
          total: 0,
          percentage: 0
        },
        uptime: 0,
        lastBackup: null
      };
    }
  }

  static async getRecentActivities(limit = 10): Promise<ActivityLog[]> {
    try {
      // 从审计日志获取最近活动
      const logs = await db.all(`
        SELECT id, timestamp, action, username, description, severity
        FROM audit_logs 
        ORDER BY timestamp DESC 
        LIMIT ?
      `, [limit]);

      return logs.map(log => ({
        id: log.id,
        timestamp: new Date(log.timestamp),
        action: log.action,
        username: log.username,
        description: log.description,
        severity: log.severity
      }));
    } catch {
      return [];
    }
  }

  static async getUserActivity(limit = 5): Promise<UserActivity[]> {
    try {
      const users = await db.all(`
        SELECT u.id, u.username, u.last_login_at, u.is_active, 
               COUNT(DISTINCT al.id) as login_count,
               r.name as role_name
        FROM users u
        LEFT JOIN audit_logs al ON u.id = al.user_id AND al.action = 'LOGIN_SUCCESS'
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        GROUP BY u.id
        ORDER BY u.last_login_at DESC
        LIMIT ?
      `, [limit]);

      return users.map(user => ({
        userId: user.id,
        username: user.username,
        lastLogin: user.last_login_at ? new Date(user.last_login_at) : new Date(0),
        loginCount: user.login_count || 0,
        role: user.role_name || 'user',
        status: user.is_active ? 'active' : 'inactive'
      }));
    } catch {
      return [];
    }
  }

  static async getContentStats(): Promise<ContentStats> {
    try {
      const [pageCount, sectionCount, pendingCount, recentCount, languageStats] = await Promise.all([
        db.get('SELECT COUNT(DISTINCT page_key) as count FROM page_contents'),
        db.get('SELECT COUNT(*) as count FROM page_contents'),
        db.get('SELECT COUNT(*) as count FROM content_approvals WHERE status = "pending"'),
        db.get('SELECT COUNT(*) as count FROM content_versions WHERE created_at > datetime("now", "-7 days")'),
        this.getContentLanguageStats()
      ]);

      return {
        totalPages: pageCount?.count || 0,
        totalSections: sectionCount?.count || 0,
        pendingApprovals: pendingCount?.count || 0,
        recentUpdates: recentCount?.count || 0,
        byLanguage: languageStats
      };
    } catch {
      return {
        totalPages: 0,
        totalSections: 0,
        pendingApprovals: 0,
        recentUpdates: 0,
        byLanguage: { zh: 0, en: 0, ru: 0 }
      };
    }
  }

  static async getContentLanguageStats(): Promise<{ zh: number; en: number; ru: number }> {
    try {
      const stats = { zh: 0, en: 0, ru: 0 };
      
      // 统计每种语言的内容数量
      const zhCount = await db.get('SELECT COUNT(*) as count FROM page_contents WHERE content_zh IS NOT NULL AND content_zh != ""');
      const enCount = await db.get('SELECT COUNT(*) as count FROM page_contents WHERE content_en IS NOT NULL AND content_en != ""');
      const ruCount = await db.get('SELECT COUNT(*) as count FROM page_contents WHERE content_ru IS NOT NULL AND content_ru != ""');

      stats.zh = zhCount?.count || 0;
      stats.en = enCount?.count || 0;
      stats.ru = ruCount?.count || 0;

      return stats;
    } catch {
      return { zh: 0, en: 0, ru: 0 };
    }
  }

  static async getRealTimeUpdates(callback: (stats: Partial<DashboardStats>) => void) {
    // 模拟实时更新，实际项目中可以使用WebSocket或Server-Sent Events
    setInterval(async () => {
      const updates = {
        pendingApprovals: await this.getPendingApprovals(),
        unreadMessages: await this.getUnreadMessages(),
        recentActivities: await this.getRecentActivities(5)
      };
      callback(updates);
    }, 30000); // 每30秒更新一次
  }
}

export const dashboardService = new DashboardService();