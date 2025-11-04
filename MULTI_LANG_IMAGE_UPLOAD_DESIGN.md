# 多语言图片上传功能设计

## 📋 需求分析

### 当前设计
- 单个图片上传组件
- 三个URL输入框（中文、英文、俄文）

### 目标设计
- 三个独立的图片上传组件，分别对应中文、英文、俄文
- 每个语言都可以独立上传本地图片
- 后端支持存储三个不同语言的图片URL

## 🏗️ 设计方案

### 1. 前端设计

#### 数据结构
```typescript
interface ImageFieldState {
  content_zh: string;  // 中文图片URL
  content_en: string;  // 英文图片URL
  content_ru: string;  // 俄文图片URL
}
```

#### UI组件结构
```
图片字段卡片
├── 中文图片上传
│   ├── ImageUpload组件
│   └── URL输入框（可选）
├── 英文图片上传
│   ├── ImageUpload组件
│   └── URL输入框（可选）
└── 俄文图片上传
    ├── ImageUpload组件
    └── URL输入框（可选）
```

### 2. 后端设计

#### 数据库存储
- `page_key`: `home`
- `section_key`: `{section}_image` (例如: `oem_image`)
- `content_zh`: 中文图片URL
- `content_en`: 英文图片URL
- `content_ru`: 俄文图片URL
- `content_type`: `image`

#### API行为
- 创建/更新时，接收三个语言的图片URL
- 支持部分更新（只更新某个语言的图片）
- 保持向后兼容（如果某个语言没有图片，使用默认值）

## 🔧 实现方案

### 前端实现
1. 修改 `home-content.tsx` 中的图片字段渲染逻辑
2. 为每个语言创建独立的 `ImageUpload` 组件
3. 更新 `formState` 管理三个语言的图片URL
4. 保存时同时提交三个语言的图片URL

### 后端实现
1. API 已支持 `content_zh`, `content_en`, `content_ru` 字段
2. 无需修改后端，直接使用现有字段

## ✅ 优势
- 每个语言独立管理图片
- 可以上传不同语言的图片
- 向后兼容现有数据
- 用户体验更好



