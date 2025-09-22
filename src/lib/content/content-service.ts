import { db } from '../database/db-service.js';
import { AuditLogService } from '../auth/audit-log.js';
import { RoleService } from '../auth/role-service.js';

export interface ContentVersion {
  id: string;
  content_id: number;
  version_number: number;
  content_zh?: string;
  content_en?: string;
  content_ru?: string;
  content_type: string;
  meta_data?: any;
  change_description?: string;
  change_type: 'create' | 'update' | 'delete' | 'restore';
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentApproval {
  id: string;
  content_id: number;
  version_id: string;
  status: 'pending' | 'approved' | 'rejected';
  approver_id?: string;
  approval_notes?: string;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ContentWithApproval extends ContentVersion {
  approval_status?: string;
  approver_name?: string;
  approval_notes?: string;
  approved_at?: Date;
}

export class ContentService {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * 创建内容版本
   */
  async createContentVersion(
    contentId: number,
    contentData: {
      content_zh?: string;
      content_en?: string;
      content_ru?: string;
      content_type: string;
      meta_data?: any;
    },
    userId: string,
    changeDescription?: string,
    changeType: 'create' | 'update' | 'delete' | 'restore' = 'update'
  ): Promise<ContentVersion> {
    // 获取当前最大版本号
    const maxVersion = await db.get(
      'SELECT MAX(version_number) as max_version FROM content_versions WHERE content_id = ?',
      [contentId]
    ) as { max_version: number } | null;

    const versionNumber = (maxVersion?.max_version || 0) + 1;
    const versionId = `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.run(
      `INSERT INTO content_versions (
        id, content_id, version_number, content_zh, content_en, content_ru, 
        content_type, meta_data, change_description, change_type, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        versionId,
        contentId,
        versionNumber,
        contentData.content_zh,
        contentData.content_en,
        contentData.content_ru,
        contentData.content_type,
        contentData.meta_data ? JSON.stringify(contentData.meta_data) : null,
        changeDescription,
        changeType,
        userId
      ]
    );

    // 记录审计日志
    const content = await db.get(
      'SELECT page_key, section_key FROM page_contents WHERE id = ?',
      [contentId]
    ) as { page_key: string; section_key: string } | null;

    AuditLogService.logEvent({
      action: 'CONTENT_VERSION_CREATED',
      userId: userId,
      username: userId,
      description: `创建内容版本: ${content?.page_key} - ${content?.section_key} (v${versionNumber})`,
      details: {
        contentId,
        versionId,
        versionNumber,
        changeType,
        changeDescription
      },
      severity: 'INFO'
    });

    return this.getContentVersion(versionId);
  }

  /**
   * 获取内容版本
   */
  async getContentVersion(versionId: string): Promise<ContentVersion> {
    const version = await db.get(
      'SELECT * FROM content_versions WHERE id = ?',
      [versionId]
    ) as ContentVersion | null;

    if (!version) {
      throw new Error('Content version not found');
    }

    return {
      ...version,
      meta_data: version.meta_data ? JSON.parse(version.meta_data) : undefined,
      created_at: new Date(version.created_at),
      updated_at: new Date(version.updated_at)
    };
  }

  /**
   * 获取内容的所有版本
   */
  async getContentVersions(contentId: number): Promise<ContentVersion[]> {
    const versions = await db.all(
      'SELECT * FROM content_versions WHERE content_id = ? ORDER BY version_number DESC',
      [contentId]
    ) as ContentVersion[];

    return versions.map(version => ({
      ...version,
      meta_data: version.meta_data ? JSON.parse(version.meta_data) : undefined,
      created_at: new Date(version.created_at),
      updated_at: new Date(version.updated_at)
    }));
  }

  /**
   * 提交内容审批
   */
  async submitForApproval(
    contentId: number,
    versionId: string,
    userId: string
  ): Promise<ContentApproval> {
    // 检查用户是否有审批权限
    const hasApprovePermission = await this.roleService.hasPermission(userId, 'content:approve');
    if (!hasApprovePermission) {
      throw new Error('User does not have approval permission');
    }

    const approvalId = `ca_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.run(
      `INSERT INTO content_approvals (id, content_id, version_id, status, created_at) VALUES (?, ?, ?, ?, datetime('now'))`,
      [approvalId, contentId, versionId, 'pending']
    );

    // 记录审计日志
    const content = await db.get(
      'SELECT page_key, section_key FROM page_contents WHERE id = ?',
      [contentId]
    ) as { page_key: string; section_key: string } | null;

    AuditLogService.logEvent({
      action: 'CONTENT_APPROVAL_SUBMITTED',
      userId: userId,
      username: userId,
      description: `提交内容审批: ${content?.page_key} - ${content?.section_key}`,
      details: {
        contentId,
        versionId,
        approvalId
      },
      severity: 'INFO'
    });

    return this.getContentApproval(approvalId);
  }

  /**
   * 审批内容
   */
  async approveContent(
    approvalId: string,
    approverId: string,
    notes?: string
  ): Promise<ContentApproval> {
    // 检查用户是否有审批权限
    const hasApprovePermission = await this.roleService.hasPermission(approverId, 'content:approve');
    if (!hasApprovePermission) {
      throw new Error('User does not have approval permission');
    }

    await db.run(
      `UPDATE content_approvals SET status = 'approved', approver_id = ?, approval_notes = ?, approved_at = datetime('now') WHERE id = ?`,
      [approverId, notes, approvalId]
    );

    const approval = await this.getContentApproval(approvalId);

    // 记录审计日志
    const content = await db.get(
      'SELECT page_key, section_key FROM page_contents WHERE id = ?',
      [approval.content_id]
    ) as { page_key: string; section_key: string } | null;

    AuditLogService.logEvent({
      action: 'CONTENT_APPROVAL_APPROVED',
      userId: approverId,
      username: approverId,
      description: `审批通过内容: ${content?.page_key} - ${content?.section_key}`,
      details: {
        contentId: approval.content_id,
        versionId: approval.version_id,
        approvalId,
        notes
      },
      severity: 'INFO'
    });

    return approval;
  }

  /**
   * 拒绝内容审批
   */
  async rejectContent(
    approvalId: string,
    approverId: string,
    notes?: string
  ): Promise<ContentApproval> {
    // 检查用户是否有审批权限
    const hasApprovePermission = await this.roleService.hasPermission(approverId, 'content:approve');
    if (!hasApprovePermission) {
      throw new Error('User does not have approval permission');
    }

    await db.run(
      `UPDATE content_approvals SET status = 'rejected', approver_id = ?, approval_notes = ?, approved_at = datetime('now') WHERE id = ?`,
      [approverId, notes, approvalId]
    );

    const approval = await this.getContentApproval(approvalId);

    // 记录审计日志
    const content = await db.get(
      'SELECT page_key, section_key FROM page_contents WHERE id = ?',
      [approval.content_id]
    ) as { page_key: string; section_key: string } | null;

    AuditLogService.logEvent({
      action: 'CONTENT_APPROVAL_REJECTED',
      userId: approverId,
      username: approverId,
      description: `拒绝内容审批: ${content?.page_key} - ${content?.section_key}`,
      details: {
        contentId: approval.content_id,
        versionId: approval.version_id,
        approvalId,
        notes
      },
      severity: 'WARNING'
    });

    return approval;
  }

  /**
   * 获取内容审批
   */
  async getContentApproval(approvalId: string): Promise<ContentApproval> {
    const approval = await db.get(
      'SELECT * FROM content_approvals WHERE id = ?',
      [approvalId]
    ) as ContentApproval | null;

    if (!approval) {
      throw new Error('Content approval not found');
    }

    return {
      ...approval,
      approved_at: approval.approved_at ? new Date(approval.approved_at) : undefined,
      created_at: new Date(approval.created_at),
      updated_at: new Date(approval.updated_at)
    };
  }

  /**
   * 获取内容的审批历史
   */
  async getContentApprovals(contentId: number): Promise<ContentApproval[]> {
    const approvals = await db.all(
      'SELECT * FROM content_approvals WHERE content_id = ? ORDER BY created_at DESC',
      [contentId]
    ) as ContentApproval[];

    return approvals.map(approval => ({
      ...approval,
      approved_at: approval.approved_at ? new Date(approval.approved_at) : undefined,
      created_at: new Date(approval.created_at),
      updated_at: new Date(approval.updated_at)
    }));
  }

  /**
   * 获取待审批的内容列表
   */
  async getPendingApprovals(): Promise<ContentWithApproval[]> {
    const pendingApprovals = await db.all(`
      SELECT
        cv.*,
        ca.status as approval_status,
        ca.approval_notes,
        ca.approved_at,
        u.username as approver_name
      FROM content_approvals ca
      JOIN content_versions cv ON ca.version_id = cv.id
      LEFT JOIN users u ON ca.approver_id = u.id
      WHERE ca.status = 'pending'
      ORDER BY ca.created_at DESC
    `) as ContentWithApproval[];

    return pendingApprovals.map(item => ({
      ...item,
      meta_data: item.meta_data ? JSON.parse(item.meta_data) : undefined,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
      approved_at: item.approved_at ? new Date(item.approved_at) : undefined
    }));
  }

  /**
   * 恢复内容到指定版本
   */
  async restoreContentVersion(
    versionId: string,
    userId: string
  ): Promise<ContentVersion> {
    const version = await this.getContentVersion(versionId);

    // 创建新的恢复版本
    const restoredVersion = await this.createContentVersion(
      version.content_id,
      {
        content_zh: version.content_zh,
        content_en: version.content_en,
        content_ru: version.content_ru,
        content_type: version.content_type,
        meta_data: version.meta_data
      },
      userId,
      `恢复到版本 ${version.version_number}`,
      'restore'
    );

    // 更新主内容表
    await db.run(
      `UPDATE page_contents SET 
        content_zh = ?, content_en = ?, content_ru = ?, 
        content_type = ?, meta_data = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        version.content_zh,
        version.content_en,
        version.content_ru,
        version.content_type,
        version.meta_data ? JSON.stringify(version.meta_data) : null,
        version.content_id
      ]
    );

    return restoredVersion;
  }
}

// 单例实例
export const contentService = new ContentService();