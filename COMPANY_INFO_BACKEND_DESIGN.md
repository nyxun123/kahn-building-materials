# 🏢 公司信息后端管理系统设计

## 🎯 设计目标
实现通过后端管理界面直接管理前端显示的公司信息，包括联系信息、关于我们内容、公司资质等。

## 📊 数据库设计

### 公司信息表 (company_info)
```sql
CREATE TABLE company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_type TEXT NOT NULL, -- 'contact', 'about', 'certifications', etc.
    field_key TEXT NOT NULL,    -- 'address', 'phone', 'email', etc.
    field_value TEXT,           -- 字段值
    language TEXT DEFAULT 'zh', -- 语言: zh, en, ru
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_type, field_key, language)
);
```

### 公司内容表 (company_content)
```sql
CREATE TABLE company_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type TEXT NOT NULL, -- 'about', 'history', 'advantages', etc.
    content_key TEXT NOT NULL,  -- 'title', 'description', 'paragraph1', etc.
    content_value TEXT,         -- 内容值
    language TEXT DEFAULT 'zh', -- 语言: zh, en, ru
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_type, content_key, language)
);
```

## 🔧 API设计

### 公司信息API端点
```
GET    /api/company/info/:section?lang=zh     # 获取公司信息
POST   /api/admin/company/info                # 创建公司信息
PUT    /api/admin/company/info/:id            # 更新公司信息
DELETE /api/admin/company/info/:id            # 删除公司信息
GET    /api/company/content/:type?lang=zh     # 获取公司内容
POST   /api/admin/company/content             # 创建公司内容
PUT    /api/admin/company/content/:id         # 更新公司内容
DELETE /api/admin/company/content/:id         # 删除公司内容
```

## 🎨 管理界面设计

### 公司信息管理界面 (`/admin/company-info`)
- **标签页结构**:
  - 联系信息 (Contact Info)
  - 关于我们 (About Us)
  - 公司优势 (Advantages)
  - 发展历程 (History)
  - 认证资质 (Certifications)

- **功能特性**:
  - 多语言切换
  - 实时预览
  - 版本历史
  - 审批流程
  - 批量操作

### 界面组件
```typescript
interface CompanyInfoForm {
    section_type: 'contact' | 'about' | 'advantages' | 'history' | 'certifications';
    field_key: string;
    field_value: string;
    language: 'zh' | 'en' | 'ru';
    is_active: boolean;
}

interface CompanyContentForm {
    content_type: string;
    content_key: string;
    content_value: string;
    language: 'zh' | 'en' | 'ru';
    is_active: boolean;
}
```

## 🔄 数据流程

### 1. 管理员操作流程
1. 登录管理后台 → 进入公司信息管理
2. 选择要编辑的板块 → 填写/修改内容
3. 选择语言版本 → 实时预览效果
4. 提交审批 → 管理员审核
5. 审核通过 → 内容发布到前端

### 2. 前端数据获取流程
1. 页面加载 → 调用API获取公司信息
2. 根据用户语言偏好 → 获取对应语言内容
3. 渲染页面 → 显示最新公司信息

## 📱 前端页面更新

### 联系页面更新 (`src/pages/contact/index.tsx`)
```typescript
// 从后端API获取数据
const { data: contactInfo } = useCompanyInfo('contact', i18n.language);

// 使用获取的数据渲染
<p className="text-muted-foreground mt-1">
  {contactInfo?.address || '默认地址'}
</p>
```

### 关于页面更新 (`src/pages/about/index.tsx`)
```typescript
// 从后端API获取数据
const { data: aboutContent } = useCompanyContent('about', i18n.language);

// 使用获取的数据渲染
<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
  {aboutContent?.title || t('about:company.title')}
</p>
```

## 🔧 技术实现

### 1. 数据库迁移
```bash
# 创建公司信息表
node worker/migrations/003_company_info.sql

# 创建公司内容表  
node worker/migrations/004_company_content.sql
```

### 2. API实现
```typescript
// 公司信息API
export async function getCompanyInfo(section: string, language: string) {
    const stmt = db.prepare(`
        SELECT * FROM company_info 
        WHERE section_type = ? AND language = ? AND is_active = 1
    `);
    return stmt.bind(section, language).all();
}

// 公司内容API
export async function getCompanyContent(type: string, language: string) {
    const stmt = db.prepare(`
        SELECT * FROM company_content 
        WHERE content_type = ? AND language = ? AND is_active = 1
    `);
    return stmt.bind(type, language).all();
}
```

### 3. React Hooks
```typescript
// 自定义Hook获取公司信息
export function useCompanyInfo(section: string, language: string) {
    return useQuery({
        queryKey: ['company-info', section, language],
        queryFn: () => getCompanyInfo(section, language),
        staleTime: 5 * 60 * 1000, // 5分钟缓存
    });
}

// 自定义Hook获取公司内容
export function useCompanyContent(type: string, language: string) {
    return useQuery({
        queryKey: ['company-content', type, language],
        queryFn: () => getCompanyContent(type, language),
        staleTime: 5 * 60 * 1000, // 5分钟缓存
    });
}
```

## 🚀 实施计划

### 第一阶段：数据库和API (1天)
- [ ] 创建公司信息表
- [ ] 创建公司内容表
- [ ] 实现基础API端点
- [ ] 添加数据验证和权限控制

### 第二阶段：管理界面 (1天)
- [ ] 设计管理界面布局
- [ ] 实现表单组件
- [ ] 添加多语言支持
- [ ] 集成版本控制

### 第三阶段：前端集成 (1天)
- [ ] 更新联系页面
- [ ] 更新关于页面
- [ ] 添加数据获取Hook
- [ ] 实现实时预览

### 第四阶段：测试和部署 (1天)
- [ ] 功能测试
- [ ] 性能测试
- [ ] 安全测试
- [ ] 生产环境部署

## 📊 预期效果

### 管理效率提升
- ✅ 无需修改代码即可更新公司信息
- ✅ 支持多语言同时管理
- ✅ 实时预览修改效果
- ✅ 版本历史可追溯

### 用户体验优化
- ✅ 内容更新即时生效
- ✅ 多语言内容一致性
- ✅ 响应式管理界面
- ✅ 移动端友好操作

## 🔐 安全考虑

- **权限控制**: 只有管理员可以修改公司信息
- **输入验证**: 严格验证所有输入数据
- **XSS防护**: 内容输出时进行转义
- **审计日志**: 记录所有修改操作
- **备份机制**: 定期备份重要数据

## 📞 技术支持

实施过程中如有问题，请参考：
- [API文档](docs/API_DOCUMENTATION.md)
- [数据库设计](worker/migrations/)
- [管理界面设计](src/pages/admin/)