import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { createContentVersionsTable } from './migrations/create-content-versions-table.js';
import { createContentApprovalsTable } from './migrations/create-content-approvals-table.js';

type Database = sqlite3.Database;
const Database = sqlite3.Database;

/**
 * 数据库服务
 * 提供SQLite数据库操作，用于用户数据持久化
 */
export class DatabaseService {
  private static db: Database;
  private static readonly DB_PATH = path.join(process.cwd(), 'data', 'backend-management.db');
  private static readonly MIGRATIONS_PATH = path.join(process.cwd(), 'src', 'lib', 'database', 'migrations');

  /**
   * 初始化数据库连接
   */
  static async initialize(): Promise<void> {
    // 确保数据目录存在
    const dataDir = path.dirname(this.DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 创建数据库连接
    this.db = new Database(this.DB_PATH);

    // 启用外键约束
    await this.run('PRAGMA foreign_keys = ON');

    // 运行迁移
    await this.runMigrations();

    console.log('✅ 数据库初始化完成');
  }

  /**
   * 执行SQL查询
   */
  static async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * 执行查询并返回单条结果
   */
  static async get<T>(sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T || null);
      });
    });
  }

  /**
   * 执行查询并返回所有结果
   */
  static async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  /**
   * 开始事务
   */
  static async beginTransaction(): Promise<void> {
    await this.run('BEGIN TRANSACTION');
  }

  /**
   * 提交事务
   */
  static async commit(): Promise<void> {
    await this.run('COMMIT');
  }

  /**
   * 回滚事务
   */
  static async rollback(): Promise<void> {
    await this.run('ROLLBACK');
  }

  /**
   * 关闭数据库连接
   */
  static async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * 运行数据库迁移
   */
  private static async runMigrations(): Promise<void> {
    try {
      // 创建迁移表
      await this.run(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 获取已执行的迁移
      const executedMigrations = await this.all<{ name: string }>('SELECT name FROM migrations ORDER BY id');

      // 定义系统迁移
      const systemMigrations = [
        this.createUsersTable,
        this.createRefreshTokensTable,
        this.createAuditLogsTable,
        this.createRolesTable,
        this.createPermissionsTable,
        this.createUserRolesTable,
        this.createRolePermissionsTable,
        createContentVersionsTable,
        createContentApprovalsTable
      ];

      // 执行未运行的迁移
      for (const migration of systemMigrations) {
        const migrationName = migration.name;
        
        if (!executedMigrations.some(m => m.name === migrationName)) {
          console.log(`🔄 执行迁移: ${migrationName}`);
          await migration.call(this);
          await this.run('INSERT INTO migrations (name) VALUES (?)', [migrationName]);
        }
      }

    } catch (error) {
      console.error('❌ 迁移执行失败:', error);
      throw error;
    }
  }

  /**
   * 创建用户表
   */
  private static async createUsersTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        roles JSON NOT NULL DEFAULT '[]',
        permissions JSON NOT NULL DEFAULT '[]',
        is_active BOOLEAN DEFAULT 1,
        is_verified BOOLEAN DEFAULT 0,
        failed_login_attempts INTEGER DEFAULT 0,
        lockout_until DATETIME,
        last_login_at DATETIME,
        password_changed_at DATETIME NOT NULL,
        mfa_enabled BOOLEAN DEFAULT 0,
        mfa_secret TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建索引
    await this.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)');
  }

  /**
   * 创建刷新令牌表
   */
  private static async createRefreshTokensTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await this.run('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at)');
  }

  /**
   * 创建审计日志表
   */
  private static async createAuditLogsTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        action TEXT NOT NULL,
        user_id TEXT,
        username TEXT,
        target_user_id TEXT,
        target_username TEXT,
        description TEXT NOT NULL,
        details JSON,
        ip_address TEXT,
        user_agent TEXT,
        severity TEXT DEFAULT 'INFO',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await this.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)');
    await this.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity)');
  }

  /**
   * 创建角色表
   */
  private static async createRolesTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT NOT NULL DEFAULT '[]',
        is_system_role BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入系统默认角色
    const defaultRoles = [
      {
        id: 'superadmin',
        name: '超级管理员',
        description: '系统最高权限管理员',
        permissions: JSON.stringify([
          'user:read', 'user:create', 'user:update', 'user:delete', 'user:manage-roles',
          'role:read', 'role:create', 'role:update', 'role:delete',
          'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:approve',
          'system:settings', 'system:audit', 'system:backup', 'system:restore'
        ]),
        is_system_role: 1
      },
      {
        id: 'admin',
        name: '管理员',
        description: '系统管理员',
        permissions: JSON.stringify([
          'user:read', 'user:create', 'user:update',
          'role:read',
          'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:approve',
          'system:audit'
        ]),
        is_system_role: 1
      },
      {
        id: 'editor',
        name: '编辑',
        description: '内容编辑人员',
        permissions: JSON.stringify([
          'content:read', 'content:create', 'content:update', 'content:publish'
        ]),
        is_system_role: 1
      },
      {
        id: 'user',
        name: '用户',
        description: '普通用户',
        permissions: JSON.stringify(['content:read']),
        is_system_role: 1
      }
    ];

    for (const role of defaultRoles) {
      await this.run(
        `INSERT OR IGNORE INTO roles (id, name, description, permissions, is_system_role) VALUES (?, ?, ?, ?, ?)`,
        [role.id, role.name, role.description, role.permissions, role.is_system_role]
      );
    }
  }

  /**
   * 创建权限表
   */
  private static async createPermissionsTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS permissions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        is_system_permission BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入默认权限
    const defaultPermissions = [
      // 用户管理权限
      { id: 'users:read', name: '查看用户', description: '查看用户列表和详情', category: '用户管理' },
      { id: 'users:create', name: '创建用户', description: '创建新用户', category: '用户管理' },
      { id: 'users:update', name: '更新用户', description: '修改用户信息', category: '用户管理' },
      { id: 'users:delete', name: '删除用户', description: '删除用户账户', category: '用户管理' },
      { id: 'users:roles:manage', name: '管理用户角色', description: '分配和修改用户角色', category: '用户管理' },

      // 内容管理权限
      { id: 'content:read', name: '查看内容', description: '查看所有内容', category: '内容管理' },
      { id: 'content:create', name: '创建内容', description: '创建新内容', category: '内容管理' },
      { id: 'content:update', name: '更新内容', description: '修改内容信息', category: '内容管理' },
      { id: 'content:delete', name: '删除内容', description: '删除内容', category: '内容管理' },
      { id: 'content:publish', name: '发布内容', description: '发布和撤回内容', category: '内容管理' },

      // 系统管理权限
      { id: 'system:settings:read', name: '查看系统设置', description: '查看系统配置', category: '系统管理' },
      { id: 'system:settings:update', name: '更新系统设置', description: '修改系统配置', category: '系统管理' },
      { id: 'system:logs:view', name: '查看系统日志', description: '查看审计和系统日志', category: '系统管理' },
      { id: 'system:backup:manage', name: '管理备份', description: '创建和恢复系统备份', category: '系统管理' }
    ];

    for (const perm of defaultPermissions) {
      await this.run(
        `INSERT OR IGNORE INTO permissions (id, name, description, category, is_system_permission) VALUES (?, ?, ?, ?, ?)`,
        [perm.id, perm.name, perm.description, perm.category, 1]
      );
    }
  }

  /**
   * 创建用户角色关联表
   */
  private static async createUserRolesTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        assigned_by TEXT,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
  }

  /**
   * 创建角色权限关联表
   */
  private static async createRolePermissionsTable(): Promise<void> {
    await this.run(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id TEXT NOT NULL,
        permission_id TEXT NOT NULL,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        assigned_by TEXT,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 分配默认角色权限
    const defaultRolePermissions = [
      // 超级管理员拥有所有权限
      { role_id: 'superadmin', permission_id: 'users:read' },
      { role_id: 'superadmin', permission_id: 'users:create' },
      { role_id: 'superadmin', permission_id: 'users:update' },
      { role_id: 'superadmin', permission_id: 'users:delete' },
      { role_id: 'superadmin', permission_id: 'users:roles:manage' },
      { role_id: 'superadmin', permission_id: 'content:read' },
      { role_id: 'superadmin', permission_id: 'content:create' },
      { role_id: 'superadmin', permission_id: 'content:update' },
      { role_id: 'superadmin', permission_id: 'content:delete' },
      { role_id: 'superadmin', permission_id: 'content:publish' },
      { role_id: 'superadmin', permission_id: 'system:settings:read' },
      { role_id: 'superadmin', permission_id: 'system:settings:update' },
      { role_id: 'superadmin', permission_id: 'system:logs:view' },
      { role_id: 'superadmin', permission_id: 'system:backup:manage' },

      // 管理员权限
      { role_id: 'admin', permission_id: 'users:read' },
      { role_id: 'admin', permission_id: 'users:create' },
      { role_id: 'admin', permission_id: 'users:update' },
      { role_id: 'admin', permission_id: 'users:roles:manage' },
      { role_id: 'admin', permission_id: 'content:read' },
      { role_id: 'admin', permission_id: 'content:create' },
      { role_id: 'admin', permission_id: 'content:update' },
      { role_id: 'admin', permission_id: 'content:delete' },
      { role_id: 'admin', permission_id: 'content:publish' },
      { role_id: 'admin', permission_id: 'system:settings:read' },

      // 编辑权限
      { role_id: 'editor', permission_id: 'content:read' },
      { role_id: 'editor', permission_id: 'content:create' },
      { role_id: 'editor', permission_id: 'content:update' },
      { role_id: 'editor', permission_id: 'content:publish' },

      // 用户权限
      { role_id: 'user', permission_id: 'content:read' }
    ];

    for (const rp of defaultRolePermissions) {
      await this.run(
        `INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
        [rp.role_id, rp.permission_id]
      );
    }
  }

  /**
   * 数据库健康检查
   */
  static async healthCheck(): Promise<{
    status: string;
    tables: { name: string; count: number }[];
    size: number;
  }> {
    try {
      // 获取所有表
      const tables = await this.all<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      // 获取每个表的记录数
      const tableCounts = [];
      for (const table of tables) {
        const countResult = await this.get<{ count: number }>(`SELECT COUNT(*) as count FROM ${table.name}`);
        tableCounts.push({ name: table.name, count: countResult?.count || 0 });
      }

      // 获取数据库文件大小
      const stats = fs.statSync(this.DB_PATH);
      const sizeMB = stats.size / (1024 * 1024);

      return {
        status: 'healthy',
        tables: tableCounts,
        size: parseFloat(sizeMB.toFixed(2))
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        tables: [],
        size: 0
      };
    }
  }
}

// 导出常用查询方法
export const db = {
  run: DatabaseService.run.bind(DatabaseService),
  get: DatabaseService.get.bind(DatabaseService),
  all: DatabaseService.all.bind(DatabaseService),
  beginTransaction: DatabaseService.beginTransaction.bind(DatabaseService),
  commit: DatabaseService.commit.bind(DatabaseService),
  rollback: DatabaseService.rollback.bind(DatabaseService)
};

// 默认导出
export default DatabaseService;