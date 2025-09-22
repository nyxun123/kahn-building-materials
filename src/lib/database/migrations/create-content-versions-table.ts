import { db } from '../db-service.js';

export async function createContentVersionsTable() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS content_versions (
      id TEXT PRIMARY KEY,
      content_id INTEGER NOT NULL,
      version_number INTEGER NOT NULL,
      content_zh TEXT,
      content_en TEXT,
      content_ru TEXT,
      content_type TEXT NOT NULL DEFAULT 'text',
      meta_data JSON,
      change_description TEXT,
      change_type TEXT NOT NULL DEFAULT 'update', -- 'create', 'update', 'delete', 'restore'
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES page_contents(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await db.run('CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_versions_version_number ON content_versions(version_number)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_versions_created_by ON content_versions(created_by)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at)');
}