import { DatabaseService } from '../database/db-service';
import { AuditLogService } from './audit-log';
import { db } from '../database/db-service';

/**
 * 角色权限服务 - 提供角色和权限的CRUD操作
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isSystemPermission: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
}

export interface RolePermissionAssignment {
  id: string;
  roleId: string;
  permissionId: string;
  assignedBy: string;
  assignedAt: Date;
}

export class RoleService {
  private db: DatabaseService;
  private auditLog: AuditLogService;

  constructor() {
    // DatabaseService 是静态类，不需要实例化
    // AuditLogService 也是静态类
  }

  /**
   * 初始化系统角色和权限
   */
  async initializeSystemRoles(): Promise<void> {
    const systemPermissions = this.getSystemPermissions();
    const systemRoles = this.getSystemRoles();

    // 插入系统权限
    for (const perm of systemPermissions) {
      const existing = await db.get(
        'SELECT * FROM permissions WHERE id = ?',
        [perm.id]
      ) as Permission | null;
      
      if (!existing) {
        await db.run(
          `INSERT INTO permissions (id, name, description, category, is_system_permission, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [perm.id, perm.name, perm.description, perm.category, perm.isSystemPermission]
        );
      }
    }

    // 插入系统角色
    for (const role of systemRoles) {
      const existing = await db.get(
        'SELECT * FROM roles WHERE id = ?',
        [role.id]
      ) as Role | null;
      
      if (!existing) {
        await db.run(
          `INSERT INTO roles (id, name, description, permissions, is_system_role, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [role.id, role.name, role.description, JSON.stringify(role.permissions), role.isSystemRole ? 1 : 0]
        );
      }
    }

    AuditLogService.logEvent({
      action: 'ROLE_INITIALIZED',
      userId: 'SYSTEM',
      username: 'SYSTEM',
      description: '系统角色和权限初始化完成',
      severity: 'INFO'
    });
  }

  /**
   * 获取所有角色
   */
  async getAllRoles(): Promise<Role[]> {
    const roles = await db.all('SELECT * FROM roles ORDER BY name') as Role[];
    return roles.map(role => ({
      ...role,
      permissions: JSON.parse(role.permissions as unknown as string || '[]'),
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt)
    }));
  }

  /**
   * 获取所有权限
   */
  async getAllPermissions(): Promise<Permission[]> {
    return await db.all('SELECT * FROM permissions ORDER BY category, name') as Permission[];
  }

  /**
   * 创建新角色
   */
  async createRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string): Promise<Role> {
    const id = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.run(
      `INSERT INTO roles (id, name, description, permissions, is_system_role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, roleData.name, roleData.description, JSON.stringify(roleData.permissions), roleData.isSystemRole ? 1 : 0]
    );

    AuditLogService.logEvent({
      action: 'ROLE_CREATED',
      userId: createdBy,
      username: createdBy,
      description: `创建角色: ${roleData.name}`,
      details: {
        roleId: id,
        roleName: roleData.name,
        permissions: roleData.permissions
      },
      severity: 'INFO'
    });

    return this.getRoleById(id);
  }

  /**
   * 更新角色
   */
  async updateRole(roleId: string, updates: Partial<Omit<Role, 'id' | 'createdAt' | 'isSystemRole'>>, updatedBy: string): Promise<Role> {
    const setClauses: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      setClauses.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClauses.push('description = ?');
      values.push(updates.description);
    }
    if (updates.permissions !== undefined) {
      setClauses.push('permissions = ?');
      values.push(JSON.stringify(updates.permissions));
    }

    setClauses.push('updatedAt = datetime(\'now\')');
    values.push(roleId);

    await db.run(
      `UPDATE roles SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    AuditLogService.logEvent({
      action: 'ROLE_UPDATED',
      userId: updatedBy,
      username: updatedBy,
      description: `更新角色: ${roleId}`,
      details: {
        roleId,
        updates
      },
      severity: 'INFO'
    });

    return this.getRoleById(roleId);
  }

  /**
   * 删除角色
   */
  async deleteRole(roleId: string, deletedBy: string): Promise<void> {
    const role = await this.getRoleById(roleId);
    if (role.isSystemRole) {
      throw new Error('Cannot delete system role');
    }

    // 检查是否有用户分配了这个角色
    const userAssignments = await db.all(
      'SELECT * FROM user_roles WHERE roleId = ?',
      [roleId]
    ) as UserRoleAssignment[];

    if (userAssignments.length > 0) {
      throw new Error('Cannot delete role with assigned users');
    }

    await db.run('DELETE FROM roles WHERE id = ?', [roleId]);

    AuditLogService.logEvent({
      action: 'ROLE_DELETED',
      userId: deletedBy,
      username: deletedBy,
      description: `删除角色: ${role.name}`,
      details: {
        roleId,
        roleName: role.name
      },
      severity: 'INFO'
    });
  }

  /**
   * 根据ID获取角色
   */
  async getRoleById(roleId: string): Promise<Role> {
    const role = await db.get('SELECT * FROM roles WHERE id = ?', [roleId]) as Role | null;
    if (!role) {
      throw new Error('Role not found');
    }

    return {
      ...role,
      permissions: JSON.parse(role.permissions as unknown as string || '[]'),
      createdAt: new Date(role.createdAt),
      updatedAt: new Date(role.updatedAt)
    };
  }

  /**
   * 为用户分配角色
   */
  async assignRoleToUser(userId: string, roleId: string, assignedBy: string, expiresAt?: Date): Promise<UserRoleAssignment> {
    // 检查角色是否存在
    await this.getRoleById(roleId);

    // 检查是否已经分配
    const existing = await db.get(
      'SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    ) as UserRoleAssignment | null;

    if (existing) {
      throw new Error('Role already assigned to user');
    }

    const id = `ura_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.run(
      `INSERT INTO user_roles (id, user_id, role_id, assigned_by, assigned_at, expires_at)
       VALUES (?, ?, ?, ?, datetime('now'), ?)`,
      [id, userId, roleId, assignedBy, expiresAt?.toISOString()]
    );

    AuditLogService.logEvent({
      action: 'ROLE_ASSIGNED',
      userId: assignedBy,
      username: assignedBy,
      description: `为用户分配角色: ${roleId}`,
      details: {
        userId,
        roleId,
        assignedBy,
        expiresAt
      },
      severity: 'INFO'
    });

    return this.getUserRoleAssignment(id);
  }

  /**
   * 移除用户的角色
   */
  async removeRoleFromUser(userId: string, roleId: string, removedBy: string): Promise<void> {
    const assignment = await db.get(
      'SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    ) as UserRoleAssignment | null;

    if (!assignment) {
      throw new Error('Role not assigned to user');
    }

    await db.run(
      'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    );

    AuditLogService.logEvent({
      action: 'ROLE_REMOVED',
      userId: removedBy,
      username: removedBy,
      description: `移除用户角色: ${roleId}`,
      details: {
        userId,
        roleId,
        removedBy
      },
      severity: 'INFO'
    });
  }

  /**
   * 获取用户的角色
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const assignments = await db.all(
      `SELECT r.id, r.name, r.description, r.permissions, r.is_system_role as isSystemRole, r.created_at as createdAt, r.updated_at as updatedAt
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = ? AND (ur.expires_at IS NULL OR ur.expires_at > datetime('now'))`,
      [userId]
    ) as Role[];

    return assignments.map(assignment => ({
      id: assignment.id,
      name: assignment.name,
      description: assignment.description,
      permissions: JSON.parse(assignment.permissions as unknown as string || '[]'),
      isSystemRole: assignment.isSystemRole,
      createdAt: new Date(assignment.createdAt),
      updatedAt: new Date(assignment.updatedAt)
    }));
  }

  /**
   * 获取用户的所有权限
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const roles = await this.getUserRoles(userId);
      
      // 使用数组方式处理权限，避免Set相关的问题
      const permissionArray: string[] = [];
      
      for (const role of roles) {
        // 确保role.permissions是数组
        if (Array.isArray(role.permissions)) {
          for (const permission of role.permissions) {
            // 确保权限不为空且不重复
            if (permission && !permissionArray.includes(permission)) {
              permissionArray.push(permission);
            }
          }
        }
      }

      return permissionArray;
    } catch (error) {
      console.error('Error in getUserPermissions:', error);
      return []; // 返回空数组作为后备
    }
  }

  /**
   * 验证用户是否有特定权限
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId);
      // 确保permissions是数组且具有includes方法
      if (Array.isArray(permissions) && typeof permissions.includes === 'function') {
        return permissions.includes(permission);
      }
      return false;
    } catch (error) {
      console.error('Error in hasPermission:', error);
      return false; // 出错时默认返回false以确保安全
    }
  }

  /**
   * 验证用户是否有特定角色
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some(role => role.name === roleName);
  }

  /**
   * 获取角色分配记录
   */
  private async getUserRoleAssignment(id: string): Promise<UserRoleAssignment> {
    const assignment = await db.get(
      'SELECT * FROM user_roles WHERE id = ?',
      [id]
    ) as UserRoleAssignment | null;

    if (!assignment) {
      throw new Error('Role assignment not found');
    }

    return {
      ...assignment,
      assignedAt: new Date(assignment.assignedAt),
      expiresAt: assignment.expiresAt ? new Date(assignment.expiresAt) : undefined
    };
  }

  /**
   * 系统权限定义
   */
  private getSystemPermissions(): Permission[] {
    return [
      // 用户管理权限
      { id: 'user:read', name: '查看用户', description: '查看用户信息', category: '用户管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'user:create', name: '创建用户', description: '创建新用户', category: '用户管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'user:update', name: '更新用户', description: '更新用户信息', category: '用户管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'user:delete', name: '删除用户', description: '删除用户账户', category: '用户管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'user:manage-roles', name: '管理用户角色', description: '分配和移除用户角色', category: '用户管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },

      // 角色管理权限
      { id: 'role:read', name: '查看角色', description: '查看角色信息', category: '角色管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'role:create', name: '创建角色', description: '创建新角色', category: '角色管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'role:update', name: '更新角色', description: '更新角色信息', category: '角色管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'role:delete', name: '删除角色', description: '删除角色', category: '角色管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },

      // 内容管理权限
      { id: 'content:read', name: '查看内容', description: '查看所有内容', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'content:create', name: '创建内容', description: '创建新内容', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'content:update', name: '更新内容', description: '更新内容信息', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'content:delete', name: '删除内容', description: '删除内容', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'content:publish', name: '发布内容', description: '发布内容到前台', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'content:approve', name: '审批内容', description: '审批待发布内容', category: '内容管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },

      // 系统管理权限
      { id: 'system:settings', name: '系统设置', description: '修改系统设置', category: '系统管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'system:audit', name: '审计日志', description: '查看审计日志', category: '系统管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'system:backup', name: '数据备份', description: '执行数据备份', category: '系统管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 'system:restore', name: '数据恢复', description: '执行数据恢复', category: '系统管理', isSystemPermission: true, createdAt: new Date(), updatedAt: new Date() }
    ];
  }

  /**
   * 系统角色定义
   */
  private getSystemRoles(): Role[] {
    return [
      {
        id: 'role_super_admin',
        name: '超级管理员',
        description: '拥有系统所有权限',
        permissions: [
          'user:read', 'user:create', 'user:update', 'user:delete', 'user:manage-roles',
          'role:read', 'role:create', 'role:update', 'role:delete',
          'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:approve',
          'system:settings', 'system:audit', 'system:backup', 'system:restore'
        ],
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role_admin',
        name: '管理员',
        description: '拥有大部分管理权限',
        permissions: [
          'user:read', 'user:create', 'user:update',
          'role:read',
          'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish', 'content:approve',
          'system:audit'
        ],
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role_editor',
        name: '编辑',
        description: '内容编辑和管理权限',
        permissions: [
          'content:read', 'content:create', 'content:update', 'content:publish'
        ],
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'role_user',
        name: '普通用户',
        description: '基本用户权限',
        permissions: [
          'content:read'
        ],
        isSystemRole: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}