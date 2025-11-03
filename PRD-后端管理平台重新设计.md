# 后端管理平台重新设计 PRD

## 文档信息
- **项目名称**: 墙纸胶企业官网 - 后端管理平台重新设计
- **文档版本**: v2.0
- **创建日期**: 2025-01-XX
- **最后更新**: 2025-01-XX
- **撰写人**: AI Assistant
- **状态**: 待审核

---

## 1. 项目概述

### 1.1 项目背景

当前后端管理平台存在以下问题：
- **UI/UX不一致**: 上传组件、按钮位置、布局风格不统一
- **API响应格式不统一**: 不同接口返回格式差异大，前端处理复杂
- **代码组织混乱**: 组件复用性差，存在重复代码
- **用户体验问题**: 操作流程不够直观，错误提示不明确
- **多语言支持不完善**: 三语言（中文/英文/俄文）输入界面不统一

### 1.2 重新设计目标

- ✅ **统一UI/UX设计**: 建立统一的设计规范和组件库
- ✅ **标准化API响应**: 统一所有API的响应格式
- ✅ **优化代码结构**: 提高代码复用性和可维护性
- ✅ **提升用户体验**: 简化操作流程，提高操作效率
- ✅ **完善多语言支持**: 统一多语言输入界面和交互方式

### 1.3 设计原则

1. **一致性原则**: 所有页面遵循统一的设计规范
2. **可用性原则**: 界面直观易用，减少学习成本
3. **效率原则**: 减少操作步骤，提高工作效率
4. **可维护性原则**: 代码结构清晰，易于扩展和维护
5. **响应式原则**: 适配不同屏幕尺寸

---

## 2. 当前问题分析

### 2.1 UI/UX问题

#### 问题1: 上传组件不统一
- **现状**: 
  - `home-content.tsx` 使用 `CompactImageUploadButton`
  - `media-library.tsx` 使用 `ImageUpload` 和 `VideoUpload`
  - 不同页面有不同的上传方式
- **影响**: 用户体验不一致，维护困难
- **优先级**: 🔴 高

#### 问题2: 按钮位置和显示问题
- **现状**: 
  - 上传按钮位置不明确（应该在URL输入框右侧）
  - 某些按钮功能不清晰
- **影响**: 用户操作困惑，增加支持成本
- **优先级**: 🔴 高

#### 问题3: 多语言输入界面不统一
- **现状**: 
  - 不同页面的多语言输入布局不同
  - 有些是标签页切换，有些是并排显示
- **影响**: 用户学习成本高，操作不直观
- **优先级**: 🟡 中

### 2.2 技术架构问题

#### 问题1: API响应格式不统一
- **现状**: 
  - 部分API返回 `{ success, data, message }`
  - 部分API返回 `{ data, pagination }`
  - 错误格式也不统一
- **影响**: 前端需要针对不同接口做不同处理，代码复杂
- **优先级**: 🔴 高

#### 问题2: 组件复用性差
- **现状**: 
  - 相似的组件在不同页面重复实现
  - 缺乏统一的组件库
- **影响**: 代码冗余，维护成本高
- **优先级**: 🟡 中

#### 问题3: 错误处理不统一
- **现状**: 
  - 错误提示方式不一致
  - 某些错误没有明确的用户提示
- **影响**: 用户体验差，问题排查困难
- **优先级**: 🟡 中

---

## 3. 重新设计方案

### 3.1 设计系统（全新现代化设计）

#### 3.1.1 色彩系统（全新配色方案）

**主色调**:
```
- Primary: #6366F1 (靛蓝色/Indigo) - 主要操作、品牌色
  - Primary-50: #EEF2FF - 浅背景
  - Primary-100: #E0E7FF - 浅色背景
  - Primary-500: #6366F1 - 标准色
  - Primary-600: #4F46E5 - 深色
  - Primary-700: #4338CA - 更深色

- Accent: #8B5CF6 (紫色) - 强调、特殊功能
- Success: #10B981 (翠绿色) - 成功状态
- Warning: #F59E0B (琥珀色) - 警告信息
- Danger: #EF4444 (红色) - 危险操作、错误
- Info: #3B82F6 (蓝色) - 信息提示
```

**中性色（深色模式友好）**:
```
- White: #FFFFFF - 纯白
- Gray-50: #F9FAFB - 最浅背景
- Gray-100: #F3F4F6 - 浅背景
- Gray-200: #E5E7EB - 边框、分割线
- Gray-300: #D1D5DB - 禁用状态
- Gray-400: #9CA3AF - 占位符文本
- Gray-500: #6B7280 - 次要文本
- Gray-600: #4B5563 - 正文
- Gray-700: #374151 - 标题
- Gray-800: #1F2937 - 深色背景
- Gray-900: #111827 - 最深色
- Black: #000000 - 纯黑
```

**渐变配色**:
```
- Primary Gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)
- Success Gradient: linear-gradient(135deg, #10B981 0%, #059669 100%)
- Background Gradient: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)
- Card Gradient: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)
```

#### 3.1.2 字体系统

**字体族**:
```css
- 中文: 'PingFang SC', 'Microsoft YaHei', '微软雅黑', sans-serif
- 英文: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- 代码: 'Fira Code', 'Consolas', monospace
```

**字体大小**:
```
- xs: 12px - 辅助信息
- sm: 14px - 次要文本
- base: 16px - 正文
- lg: 18px - 小标题
- xl: 20px - 标题
- 2xl: 24px - 大标题
- 3xl: 30px - 超大标题
```

**字重**:
```
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
```

#### 3.1.3 间距系统（8px基准）

```
- 0: 0px
- 1: 4px (0.25rem)
- 2: 8px (0.5rem)
- 3: 12px (0.75rem)
- 4: 16px (1rem)
- 5: 20px (1.25rem)
- 6: 24px (1.5rem)
- 8: 32px (2rem)
- 10: 40px (2.5rem)
- 12: 48px (3rem)
- 16: 64px (4rem)
- 20: 80px (5rem)
```

#### 3.1.4 圆角系统

```
- none: 0px
- sm: 4px - 小元素
- md: 8px - 按钮、输入框
- lg: 12px - 卡片
- xl: 16px - 大卡片
- 2xl: 24px - 模态框
- full: 9999px - 圆形
```

#### 3.1.5 阴影系统

```
- sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05) - 轻微阴影
- md: 0 4px 6px -1px rgba(0, 0, 0, 0.1) - 标准阴影
- lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1) - 大阴影
- xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1) - 超大阴影
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25) - 超大阴影
- inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06) - 内阴影
- glow: 0 0 20px rgba(99, 102, 241, 0.3) - 发光效果
```

#### 3.1.6 动画系统

**过渡时间**:
```
- fast: 150ms - 快速交互
- normal: 300ms - 标准过渡
- slow: 500ms - 慢速动画
```

**缓动函数**:
```
- ease: cubic-bezier(0.4, 0, 0.2, 1) - 标准
- ease-in: cubic-bezier(0.4, 0, 1, 1) - 加速
- ease-out: cubic-bezier(0, 0, 0.2, 1) - 减速
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) - 加速减速
```

**动画效果**:
```css
- fadeIn: 淡入
- fadeOut: 淡出
- slideUp: 上滑
- slideDown: 下滑
- scaleIn: 缩放进入
- bounce: 弹跳
- shimmer: 闪烁加载
```

#### 3.1.7 组件规范（现代化设计）

**按钮规范**:
```typescript
// 主要按钮 - 渐变背景，圆角，阴影
primary: {
  base: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium",
  hover: "hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg",
  active: "active:scale-95",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  size: {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl"
  }
}

// 次要按钮 - 边框样式
secondary: {
  base: "bg-white border-2 border-gray-300 text-gray-700 font-medium",
  hover: "hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50",
  transition: "transition-all duration-200"
}

// 危险按钮
danger: {
  base: "bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium",
  hover: "hover:from-red-600 hover:to-rose-700 hover:shadow-lg"
}

// 文字按钮
text: {
  base: "text-gray-600 font-medium",
  hover: "hover:text-indigo-600 hover:bg-indigo-50"
}
```

**输入框规范**:
```typescript
// 标准输入框 - 现代化设计
input: {
  base: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg",
  focus: "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none",
  error: "border-red-400 focus:border-red-500 focus:ring-red-200",
  disabled: "disabled:bg-gray-100 disabled:cursor-not-allowed",
  transition: "transition-all duration-200"
}

// 标签
label: {
  base: "block text-sm font-semibold text-gray-700 mb-1.5",
  required: "after:content-['*'] after:text-red-500 after:ml-1"
}
```

**卡片规范**:
```typescript
card: {
  base: "bg-white rounded-xl border border-gray-200",
  shadow: "shadow-sm hover:shadow-md",
  padding: "p-6",
  transition: "transition-all duration-300",
  hover: "hover:border-indigo-200 hover:shadow-lg"
}

// 统计卡片 - 带渐变装饰
statCard: {
  base: "bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200",
  decoration: "border-l-4 border-l-indigo-500",
  shadow: "shadow-md hover:shadow-xl",
  transition: "transition-all duration-300"
}
```

**表格规范**:
```typescript
table: {
  container: "w-full bg-white rounded-xl shadow-sm overflow-hidden",
  header: "bg-gradient-to-r from-gray-50 to-gray-100",
  headerCell: "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider",
  row: "border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150",
  cell: "px-6 py-4 text-sm text-gray-900",
  actions: "flex items-center gap-2"
}
```

**导航规范**:
```typescript
sidebar: {
  base: "w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200",
  navItem: {
    base: "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
    inactive: "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600",
    active: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
  },
  icon: {
    base: "w-5 h-5",
    active: "text-white",
    inactive: "text-gray-500"
  }
}
```

#### 3.1.8 布局系统（全新设计）

**页面布局**:
```
┌─────────────────────────────────────────────────┐
│  Header (固定顶部)                              │
│  - Logo + 标题                                  │
│  - 搜索框                                       │
│  - 通知 + 用户菜单                              │
├─────────┬───────────────────────────────────────┤
│         │                                       │
│ Sidebar │  Main Content Area                    │
│ (固定)  │  - 面包屑导航                         │
│         │  - 页面标题 + 操作按钮                │
│         │  - 内容区域（卡片、表格等）            │
│         │                                       │
└─────────┴───────────────────────────────────────┘
```

**侧边栏设计**:
- 宽度: 280px (桌面) / 80px (收起状态)
- 背景: 白色渐变，右侧边框
- 导航项: 图标 + 文字，圆角卡片样式
- 激活状态: 渐变背景 + 阴影
- 悬停效果: 平滑过渡

**顶部栏设计**:
- 高度: 64px
- 背景: 白色，底部边框
- 内容: 左侧面包屑 + 页面标题，右侧操作按钮 + 用户菜单
- 固定定位，滚动时保持可见

**内容区域设计**:
- 背景: 浅灰色渐变 (#F9FAFB → #F3F4F6)
- 内边距: 24px (移动端) / 32px (桌面)
- 最大宽度: 1400px (居中)
- 卡片间距: 24px

### 3.2 统一组件库设计

#### 3.2.1 上传组件统一设计

**目标**: 统一所有上传场景的组件使用

**设计方案**:

1. **标准上传按钮** (`StandardUploadButton`)
   - 用途: URL输入框旁边的上传按钮
   - 位置: 输入框右侧，垂直对齐
   - 样式: 小尺寸按钮，图标+文字
   - 功能: 点击选择文件，上传后自动填充URL

2. **媒体上传组件** (`MediaUpload`)
   - 用途: 媒体库、独立上传区域
   - 样式: 拖拽上传区域 + 预览
   - 功能: 支持拖拽、点击上传、预览、删除

3. **多语言上传组件** (`MultiLangMediaUpload`)
   - 用途: 需要为每个语言上传不同文件的场景
   - 布局: 每个语言独立的上传区域
   - 结构: 
     ```
     [语言标签] [URL输入框] [上传按钮]
     [预览区域]
     ```

**组件规范**:
```typescript
// 标准上传按钮
<StandardUploadButton
  onUpload={(url) => setValue(url)}
  folder="products"
  accept="image/*"
  size="sm"
  className="ml-2"
/>

// 媒体上传组件
<MediaUpload
  value={imageUrl}
  onChange={setImageUrl}
  folder="products"
  type="image"
  preview={true}
/>

// 多语言上传组件
<MultiLangMediaUpload
  values={{
    zh: imageUrlZh,
    en: imageUrlEn,
    ru: imageUrlRu
  }}
  onChange={(lang, url) => updateLang(lang, url)}
  folder="home/oem"
  type="image"
/>
```

#### 3.2.2 多语言输入组件统一设计

**目标**: 统一所有多语言输入场景

**设计方案**:

1. **标签页切换模式** (`TabLangInput`)
   - 用途: 文本输入（标题、描述等）
   - 布局: 顶部标签页，切换显示不同语言的输入框
   - 优点: 节省空间，适合长文本

2. **并排显示模式** (`InlineLangInput`)
   - 用途: 短文本输入（URL、链接等）
   - 布局: 三个输入框并排显示
   - 优点: 一目了然，便于对比

3. **折叠面板模式** (`AccordionLangInput`)
   - 用途: 复杂表单的多语言字段
   - 布局: 可折叠的语言面板
   - 优点: 减少视觉干扰

**组件规范**:
```typescript
// 标签页模式（文本输入）
<TabLangInput
  label="标题"
  values={{ zh, en, ru }}
  onChange={(lang, value) => updateLang(lang, value)}
  type="text"
/>

// 并排模式（URL输入）
<InlineLangInput
  label="图片URL"
  values={{ zh, en, ru }}
  onChange={(lang, value) => updateLang(lang, value)}
  type="url"
  showUploadButton={true}
  uploadFolder="products"
/>

// 折叠面板模式（复杂表单）
<AccordionLangInput
  label="描述"
  values={{ zh, en, ru }}
  onChange={(lang, value) => updateLang(lang, value)}
  type="textarea"
/>
```

#### 3.2.3 表单组件统一设计

**目标**: 统一所有表单的交互方式

**设计方案**:

1. **标准表单布局**
   ```
   [字段标签]
   [输入控件]
   [错误提示]
   [帮助文本]（可选）
   ```

2. **表单分组**
   - 基本信息组
   - 多语言内容组
   - 媒体文件组
   - 高级设置组

3. **表单操作按钮**
   - 保存按钮: 右下角固定位置
   - 取消按钮: 保存按钮左侧
   - 重置按钮: 取消按钮左侧（可选）

**组件规范**:
```typescript
<FormSection title="基本信息">
  <FormField label="产品代码" required>
    <TextInput value={code} onChange={setCode} />
    <FormError error={errors.code} />
  </FormField>
</FormSection>

<FormSection title="多语言内容">
  <TabLangInput
    label="产品名称"
    values={{ zh, en, ru }}
    onChange={updateName}
  />
</FormSection>

<FormActions>
  <Button variant="secondary" onClick={onCancel}>取消</Button>
  <Button variant="primary" onClick={onSave} loading={saving}>
    保存
  </Button>
</FormActions>
```

### 3.3 API标准化设计

#### 3.3.1 统一响应格式

**成功响应格式**:
```typescript
{
  success: true,
  code: 200,
  message: "操作成功",
  data: {
    // 实际数据
  },
  pagination?: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  },
  timestamp: "2025-01-XXT..."
}
```

**错误响应格式**:
```typescript
{
  success: false,
  code: 400 | 401 | 403 | 404 | 500,
  message: "错误描述",
  error?: {
    field?: string,  // 字段错误时指定字段名
    code?: string,   // 错误代码
    details?: any    // 详细错误信息
  },
  timestamp: "2025-01-XXT..."
}
```

#### 3.3.2 API端点标准化

**资源命名规范**:
- 使用复数形式: `/api/admin/products`, `/api/admin/messages`
- 使用RESTful风格: GET（列表/详情）、POST（创建）、PUT（更新）、DELETE（删除）

**查询参数规范**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `q`: 搜索关键词
- `sort`: 排序字段和方向（如 `sort=created_at:desc`）
- `filter`: 过滤条件（JSON格式）

#### 3.3.3 错误处理规范

**错误代码规范**:
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `422`: 数据验证失败
- `500`: 服务器错误

**错误提示规范**:
- 前端统一使用 `toast.error()` 显示错误
- 表单字段错误显示在字段下方
- 错误信息要清晰、可操作

### 3.4 页面重新设计（全新现代化UI）

#### 3.4.1 仪表盘 (Dashboard) - 全新设计

**视觉设计**:
- 顶部: 渐变背景横幅（显示欢迎信息和日期）
- 统计卡片: 4个大型卡片，带图标和渐变装饰
  - 卡片样式: 白色背景，左侧4px彩色边框，阴影效果
  - 图标: 大尺寸，彩色渐变
  - 数字: 大字体，粗体显示
  - 趋势: 小箭头 + 百分比，绿色/红色
- 图表区域: 圆角卡片，半透明背景，优雅的图表样式
- 快捷操作: 大按钮，图标 + 文字，渐变背景

**布局结构**:
```
┌─────────────────────────────────────────────┐
│  [欢迎横幅 - 渐变背景]                       │
├─────────────────────────────────────────────┤
│  [统计卡片1] [统计卡片2] [统计卡片3] [统计卡片4] │
├─────────────────────────────────────────────┤
│  [访问趋势图表]      │  [产品分布图表]      │
├─────────────────────────────────────────────┤
│  [最近活动列表]      │  [快捷操作面板]      │
└─────────────────────────────────────────────┘
```

**交互效果**:
- 卡片悬停: 轻微上浮 + 阴影增强
- 数字动画: 加载时数字递增动画
- 图表动画: 数据加载时的淡入动画
- 实时更新: 数据自动刷新（30秒间隔）

#### 3.4.2 产品管理 (Products) - 全新设计

**列表页设计**:
- 顶部栏: 
  - 左侧: 大标题 + 描述
  - 右侧: 搜索框 + 筛选按钮 + 新增按钮（渐变）
- 表格区域:
  - 白色卡片背景，圆角
  - 表头: 渐变背景，文字加粗
  - 行: 悬停时背景色变化，平滑过渡
  - 操作列: 图标按钮，圆角，悬停效果
- 分页: 现代化分页器，页码按钮圆角设计

**编辑页设计**:
- 左侧: 表单区域，分步骤显示
- 右侧: 实时预览卡片（固定）
- 表单分组: 带标题的分组卡片
- 保存按钮: 右下角固定，渐变背景，阴影效果

**新增功能UI**:
- 导入/导出: 文件上传区域，拖拽样式
- 批量操作: 选中后顶部显示操作栏
- 产品复制: 复制按钮带动画效果

#### 3.4.3 首页内容管理 (Home Content) - 全新设计

**布局重新设计**:
```
┌─────────────────────────────────────────────┐
│  [顶部操作栏]                                │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ 板块选择 │  内容编辑区域                    │
│ (侧边)   │  - 字段卡片（圆角，阴影）        │
│          │  - 编辑模式（内联编辑）          │
│          │  - 实时预览                      │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**字段编辑UI**:
- 字段卡片: 白色背景，圆角，轻微阴影
- 编辑模式: 点击编辑按钮后，卡片边框变为彩色，背景略微变化
- 多语言输入: 标签页切换，当前语言高亮显示
- 图片上传: URL输入框 + 右侧上传按钮（小按钮，图标+文字）
- 预览: 图片/视频预览卡片，圆角，边框

**交互优化**:
- 自动保存: 输入后3秒自动保存（带保存提示）
- 加载状态: 编辑时显示加载动画
- 成功提示: 保存成功后显示toast通知

#### 3.4.4 媒体库 (Media Library) - 全新设计

**视图切换**:
- 网格视图: 卡片式布局，图片缩略图 + 信息覆盖层
- 列表视图: 表格样式，详细信息展示
- 切换按钮: 顶部切换按钮组，当前视图高亮

**上传区域**:
- 大尺寸拖拽区域，渐变边框
- 拖拽时: 边框变粗，背景色变化
- 上传进度: 进度条 + 百分比显示
- 上传完成: 动画效果，添加到网格

**文件卡片**:
- 图片: 圆角缩略图，悬停显示操作按钮
- 视频: 带播放图标覆盖层
- 信息: 文件名、大小、日期（悬停显示）
- 操作: 编辑、删除按钮（悬停显示）

#### 3.4.5 其他页面优化

**客户留言 (Messages)**:
- 消息卡片: 圆角卡片，未读消息有左侧彩色边框
- 状态标签: 彩色徽章，圆角
- 回复框: 底部固定，输入框 + 发送按钮

**内容管理 (Content)**:
- 树形结构: 左侧导航树，右侧编辑区
- 编辑区: 富文本编辑器，现代化工具栏

**SEO优化 (SEO)**:
- 评分卡片: 大号数字显示，颜色编码（绿/黄/红）
- 优化建议: 列表卡片，可展开查看详情
- 预览卡片: 搜索结果预览样式

#### 3.4.6 全局UI改进

**加载状态**:
- 骨架屏: 内容加载时显示骨架屏
- 加载动画: 现代化spinner，渐变动画
- 进度条: 顶部进度条，渐变颜色

**通知系统**:
- Toast通知: 右下角弹出，圆角，阴影
- 成功: 绿色背景，勾选图标
- 错误: 红色背景，错误图标
- 警告: 黄色背景，警告图标
- 信息: 蓝色背景，信息图标

**模态框**:
- 背景: 半透明黑色遮罩，模糊效果
- 内容: 白色卡片，大圆角，阴影
- 动画: 缩放 + 淡入效果
- 关闭: 右上角X按钮，悬停效果

**空状态**:
- 插图: 简洁的SVG插图
- 文字: 友好的提示文字
- 操作: 主要操作按钮（渐变）

---

## 4. 技术实现方案

### 4.1 组件库结构

```
src/components/admin/
├── ui/                    # 基础UI组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ...
├── forms/                 # 表单组件
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   ├── FormActions.tsx
│   └── ...
├── upload/                # 上传组件
│   ├── StandardUploadButton.tsx
│   ├── MediaUpload.tsx
│   ├── MultiLangMediaUpload.tsx
│   └── ...
├── lang/                  # 多语言组件
│   ├── TabLangInput.tsx
│   ├── InlineLangInput.tsx
│   ├── AccordionLangInput.tsx
│   └── ...
└── layout/                # 布局组件
    ├── PageHeader.tsx
    ├── PageContent.tsx
    └── ...
```

### 4.2 API响应统一处理

**创建统一的API客户端**:
```typescript
// src/lib/api-client.ts
class ApiClient {
  async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    // 统一处理请求和响应
    // 统一错误处理
    // 统一token管理
  }
}
```

**统一的响应类型**:
```typescript
// src/types/api.ts
interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  pagination?: Pagination;
  error?: ApiError;
  timestamp: string;
}
```

### 4.3 状态管理优化

**使用 React Query 统一数据管理**:
- 统一的数据获取逻辑
- 自动缓存和刷新
- 乐观更新

**表单状态管理**:
- 使用 React Hook Form
- 统一的验证规则
- 统一的错误处理

### 4.4 代码组织优化

**页面结构**:
```
src/pages/admin/
├── dashboard/
│   ├── index.tsx
│   ├── components/
│   └── hooks/
├── products/
│   ├── index.tsx          # 列表页
│   ├── edit.tsx           # 编辑页
│   ├── components/
│   └── hooks/
└── ...
```

**共享组件和工具**:
```
src/lib/admin/
├── hooks/                 # 共享hooks
├── utils/                 # 工具函数
├── constants/             # 常量定义
└── types/                 # 类型定义
```

---

## 5. 实施计划

### 5.1 阶段一: 基础组件库（1-2周）

**目标**: 建立统一的组件库

**任务**:
1. ✅ 设计并实现标准上传按钮组件
2. ✅ 设计并实现多语言输入组件
3. ✅ 设计并实现表单组件
4. ✅ 建立设计系统和样式规范
5. ✅ 编写组件文档和使用示例

**交付物**:
- 完整的组件库
- 组件文档
- 使用示例

### 5.2 阶段二: API标准化（1周）

**目标**: 统一所有API的响应格式

**任务**:
1. ✅ 创建统一的API响应工具函数
2. ✅ 修改所有后端API使用统一格式
3. ✅ 创建统一的API客户端
4. ✅ 统一错误处理逻辑
5. ✅ 更新前端代码使用新的API格式

**交付物**:
- 统一的API响应格式
- 更新的后端API
- 更新的前端API调用代码

### 5.3 阶段三: 页面重构（2-3周）

**目标**: 使用新组件重构所有管理页面

**任务**:
1. ✅ 重构首页内容管理页面
2. ✅ 重构产品管理页面
3. ✅ 重构媒体库页面
4. ✅ 重构其他管理页面
5. ✅ 统一页面布局和交互方式

**交付物**:
- 重构后的所有管理页面
- 统一的用户体验

### 5.4 阶段四: 测试和优化（1周）

**目标**: 确保所有功能正常，优化用户体验

**任务**:
1. ✅ 功能测试
2. ✅ 用户体验测试
3. ✅ 性能优化
4. ✅ Bug修复
5. ✅ 文档完善

**交付物**:
- 测试报告
- 优化后的系统
- 用户手册

---

## 6. 验收标准

### 6.1 功能验收

- ✅ 所有页面功能正常
- ✅ 所有API接口正常
- ✅ 多语言功能正常
- ✅ 上传功能正常
- ✅ 表单验证正常

### 6.2 UI/UX验收

- ✅ 所有页面遵循统一的设计规范
- ✅ 所有组件使用统一的组件库
- ✅ 交互方式一致
- ✅ 响应式设计完善
- ✅ 无障碍访问支持

### 6.3 代码质量验收

- ✅ 代码结构清晰
- ✅ 组件复用性高
- ✅ 错误处理完善
- ✅ 性能优化到位
- ✅ 代码注释完善

### 6.4 文档验收

- ✅ 组件文档完整
- ✅ API文档完整
- ✅ 用户手册完整
- ✅ 开发文档完整

---

## 7. 风险评估

### 7.1 技术风险

**风险**: 重构过程中可能引入新的Bug
**应对**: 充分测试，分阶段实施，保留回滚方案

**风险**: 组件库可能不满足所有需求
**应对**: 设计时预留扩展接口，支持自定义

### 7.2 时间风险

**风险**: 重构时间可能超出预期
**应对**: 合理规划时间，优先完成核心功能

### 7.3 兼容性风险

**风险**: 新设计可能与现有数据不兼容
**应对**: 充分测试数据迁移，确保向后兼容

---

## 8. UI设计详细规范

### 8.1 页面布局规范

#### 8.1.1 侧边栏设计
```
宽度: 280px (展开) / 80px (收起)
背景: 白色渐变 (from-white to-gray-50)
边框: 右侧 1px 灰色边框
阴影: 轻微右侧阴影

导航项:
- 高度: 56px
- 内边距: 16px
- 圆角: 12px
- 间距: 8px
- 激活状态: 渐变背景 (indigo-500 to purple-600)
- 悬停效果: 背景色变化 + 轻微缩放
```

#### 8.1.2 顶部栏设计
```
高度: 64px
背景: 白色，轻微模糊效果
边框: 底部 1px 灰色边框
固定: 滚动时保持可见

内容布局:
- 左侧: 面包屑 + 页面标题
- 右侧: 搜索框 + 通知 + 用户头像菜单
```

#### 8.1.3 内容区域设计
```
背景: 渐变背景 (gray-50 to gray-100)
内边距: 24px (移动) / 32px (桌面)
最大宽度: 1400px (居中)
卡片间距: 24px
```

### 8.2 组件设计规范

#### 8.2.1 按钮设计
```
主要按钮:
- 背景: 渐变 (indigo-600 to purple-600)
- 文字: 白色，中等字重
- 圆角: 8px (md) / 12px (lg)
- 阴影: 悬停时增强
- 动画: 点击时轻微缩放 (scale-95)

次要按钮:
- 背景: 白色
- 边框: 2px 灰色
- 文字: 灰色
- 悬停: 边框变彩色，背景变浅色
```

#### 8.2.2 卡片设计
```
标准卡片:
- 背景: 白色
- 边框: 1px 灰色
- 圆角: 12px
- 阴影: 轻微阴影 (shadow-sm)
- 悬停: 阴影增强 + 边框变彩色

统计卡片:
- 背景: 白色渐变
- 装饰: 左侧 4px 彩色边框
- 阴影: 中等阴影
- 悬停: 阴影增强 + 轻微上浮
```

#### 8.2.3 表格设计
```
表头:
- 背景: 渐变 (gray-50 to gray-100)
- 文字: 灰色，加粗，小号，大写
- 内边距: 16px 24px

表行:
- 边框: 底部 1px 灰色
- 悬停: 背景变浅色 (indigo-50)
- 过渡: 平滑颜色过渡

操作列:
- 按钮: 小尺寸，圆角，图标
- 间距: 8px
```

### 8.3 配色方案详解

#### 8.3.1 品牌色使用
```
Primary (Indigo):
- 主要操作按钮
- 链接文字
- 激活状态
- 装饰元素

Accent (Purple):
- 特殊功能
- 强调信息
- 渐变搭配

Success (Green):
- 成功提示
- 确认操作
- 正面指标

Warning (Amber):
- 警告信息
- 需要 attention 的内容

Danger (Red):
- 删除操作
- 错误提示
- 负面指标
```

#### 8.3.2 渐变使用场景
```
按钮渐变: indigo-600 → purple-600
卡片渐变: white → gray-50
背景渐变: gray-50 → gray-100
装饰渐变: indigo-500 → purple-600
```

### 8.4 动画和过渡

#### 8.4.1 页面过渡
```
路由切换: 淡入淡出 (300ms)
页面加载: 内容从下往上滑入 (400ms)
模态框: 缩放 + 淡入 (300ms)
```

#### 8.4.2 交互反馈
```
按钮点击: scale(0.95) + 阴影变化
卡片悬停: translateY(-2px) + 阴影增强
输入框聚焦: 边框颜色变化 + 轻微缩放
加载状态: 旋转动画 + 渐变
```

#### 8.4.3 数据加载
```
骨架屏: 闪烁动画 (shimmer)
数字更新: 数字递增动画
图表加载: 从左到右填充动画
列表加载: 逐个淡入
```

### 8.5 响应式设计

#### 8.5.1 断点
```
sm: 640px - 小屏设备
md: 768px - 平板
lg: 1024px - 桌面
xl: 1280px - 大桌面
2xl: 1536px - 超大桌面
```

#### 8.5.2 适配策略
```
移动端 (< 768px):
- 侧边栏: 抽屉式，覆盖内容
- 表格: 卡片式布局
- 按钮: 全宽按钮
- 内边距: 16px

平板 (768px - 1024px):
- 侧边栏: 收起状态，仅图标
- 表格: 部分列隐藏
- 内边距: 24px

桌面 (> 1024px):
- 侧边栏: 完整显示
- 表格: 完整显示
- 内边距: 32px
```

## 10. 后续优化方向

### 9.1 功能增强

- 数据导入/导出功能
- 批量操作功能
- 版本控制功能
- 操作日志功能
- 深色模式支持

### 9.2 性能优化

- 代码分割和懒加载
- 图片懒加载和优化
- API请求优化
- 缓存策略优化
- 虚拟滚动（大列表）

### 9.3 用户体验优化

- 快捷键支持 (Cmd+K 搜索等)
- 拖拽排序功能
- 实时预览功能
- 智能提示功能
- 操作撤销/重做
- 工作流自动化

### 9.4 UI/UX增强

- 微交互动画
- 手势支持（移动端）
- 无障碍访问优化
- 国际化完善
- 主题定制

---

## 11. 附录

### 9.1 参考资源

- Tremor UI 文档: https://www.tremor.so/
- Radix UI 文档: https://www.radix-ui.com/
- React Hook Form 文档: https://react-hook-form.com/
- Refine 文档: https://refine.dev/

### 9.2 设计稿参考

- [待补充] 主要页面的设计稿
- [待补充] 组件设计稿
- [待补充] 交互流程图

---

## 10. 审核意见

**待产品经理审核**:
- [ ] 设计方案是否合理
- [ ] 功能范围是否合适
- [ ] 时间计划是否可行
- [ ] 优先级是否合理

**待技术负责人审核**:
- [ ] 技术方案是否可行
- [ ] 技术选型是否合理
- [ ] 风险评估是否充分
- [ ] 实施计划是否详细

---

**文档状态**: ✅ 已完成，待审核

