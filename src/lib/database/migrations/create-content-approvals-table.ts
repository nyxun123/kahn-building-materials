import { db } from '../db-service.js';

export async function createContentApprovalsTable() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS content_approvals (
      id TEXT PRIMARY KEY,
      content_id INTEGER NOT NULL,
      version_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      approver_id TEXT,
      approval_notes TEXT,
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES page_contents(id) ON DELETE CASCADE,
      FOREIGN KEY (version_id) REFERENCES content_versions(id) ON DELETE CASCADE,
      FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await db.run('CREATE INDEX IF NOT EXISTS idx_content_approvals_content_id ON content_approvals(content_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_approvals_version_id ON content_approvals(version_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_approvals_status ON content_approvals(status)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_approvals_approver_id ON content_approvals(approver_id)');
}