# 媒体库功能实现文档

## 📋 概述

本文档描述了为杭州卡恩新型建材有限公司官网添加的媒体库功能，包括图片和视频的上传、管理和展示。

## 🎯 功能需求

### 前端展示位置
1. **首页 - 演示视频区域** (`src/pages/home/index.tsx` 第382-411行)
2. **首页 - OEM定制区域** (`src/pages/home/index.tsx` 第445-552行)
3. **首页 - 半成品小包装区域** (`src/pages/home/index.tsx` 第554行开始)

### 后端管理功能
- 统一的媒体库管理界面
- 支持图片和视频上传
- 文件元数据管理（多语言标题、描述、使用位置）
- 文件预览和删除
- 按类型、文件夹、使用位置筛选

## 🏗️ 技术架构

### 数据库设计

#### media_files 表结构

| 字段名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| id | INTEGER | 主键 | 1 |
| file_name | TEXT | 文件名 | 'video_demo.mp4' |
| file_url | TEXT | 文件URL | 'https://r2.dev/home/videos/...' |
| file_type | TEXT | 文件类型 | 'image' 或 'video' |
| file_size | INTEGER | 文件大小（字节） | 1024000 |
| mime_type | TEXT | MIME类型 | 'video/mp4' |
| folder | TEXT | 文件夹 | 'home', 'oem', 'products' |
| title_zh | TEXT | 中文标题 | '产品演示视频' |
| title_en | TEXT | 英文标题 | 'Product Demo Video' |
| title_ru | TEXT | 俄文标题 | 'Демонстрационное видео' |
| description_zh | TEXT | 中文描述 | '了解产品特点' |
| description_en | TEXT | 英文描述 | 'Learn product features' |
| description_ru | TEXT | 俄文描述 | 'Узнайте о функциях' |
| alt_text_zh | TEXT | 中文替代文本 | '产品视频' |
| alt_text_en | TEXT | 英文替代文本 | 'Product Video' |
| alt_text_ru | TEXT | 俄文替代文本 | 'Видео продукта' |
| usage_location | TEXT | 使用位置 | 'home_video', 'home_oem' |
| is_active | BOOLEAN | 是否激活 | 1 |
| created_at | DATETIME | 创建时间 | '2025-01-06 10:00:00' |
| updated_at | DATETIME | 更新时间 | '2025-01-06 10:00:00' |

#### 索引
- `idx_media_file_type` - 文件类型索引
- `idx_media_folder` - 文件夹索引
- `idx_media_active` - 激活状态索引
- `idx_media_usage` - 使用位置索引
- `idx_media_created` - 创建时间索引（降序）

### API 端点

#### 1. 数据库迁移
- **端点**: `GET /api/admin/migrate-media-files`
- **功能**: 创建 media_files 表和索引
- **响应**: 
  ```json
  {
    "success": true,
    "message": "media_files 表创建成功",
    "tableInfo": [...]
  }
  ```

#### 2. 获取媒体文件列表
- **端点**: `GET /api/admin/media`
- **认证**: 需要 JWT Token
- **查询参数**:
  - `file_type`: 'image' 或 'video'
  - `folder`: 文件夹名称
  - `usage_location`: 使用位置
  - `page`: 页码（默认1）
  - `page_size`: 每页数量（默认20）
- **响应**:
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 50,
      "totalPages": 3
    }
  }
  ```

#### 3. 创建媒体文件记录
- **端点**: `POST /api/admin/media`
- **认证**: 需要 JWT Token
- **请求体**:
  ```json
  {
    "file_name": "video.mp4",
    "file_url": "https://...",
    "file_type": "video",
    "file_size": 1024000,
    "mime_type": "video/mp4",
    "folder": "home",
    "title_zh": "演示视频",
    "description_zh": "产品演示"
  }
  ```

#### 4. 更新媒体文件元数据
- **端点**: `PUT /api/admin/media?id=1`
- **认证**: 需要 JWT Token
- **请求体**: 同创建接口

#### 5. 删除媒体文件
- **端点**: `DELETE /api/admin/media?id=1`
- **认证**: 需要 JWT Token
- **功能**: 软删除（设置 is_active = 0）

### 前端组件

#### 1. VideoUpload 组件
- **路径**: `src/components/VideoUpload.tsx`
- **功能**: 
  - 支持拖拽上传
  - 支持点击选择文件
  - 视频预览
  - 上传进度显示
  - 文件大小限制（默认100MB）
- **Props**:
  ```typescript
  interface VideoUploadProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    className?: string;
    preview?: boolean;
    maxSizeMB?: number;
  }
  ```

#### 2. MediaLibrary 管理页面
- **路径**: `src/pages/admin/media-library.tsx`
- **功能**:
  - 媒体文件网格展示
  - 图片/视频上传
  - 文件元数据编辑
  - 文件删除
  - 搜索和筛选
  - 统计信息展示

### 文件存储

#### Cloudflare R2 存储结构
```
kaen/
├── home/
│   ├── images/
│   │   └── timestamp_random.jpg
│   └── videos/
│       └── timestamp_random.mp4
├── oem/
│   ├── images/
│   └── videos/
├── products/
│   └── images/
└── general/
    ├── images/
    └── videos/
```

## 📝 实现步骤

### 步骤 1: 运行数据库迁移

访问以下URL创建 media_files 表：
```
https://kn-wallpaperglue.com/api/admin/migrate-media-files
```

预期响应：
```json
{
  "success": true,
  "message": "media_files 表创建成功"
}
```

### 步骤 2: 访问媒体库管理页面

登录管理后台后，访问：
```
https://kn-wallpaperglue.com/admin/media-library
```

### 步骤 3: 上传测试文件

1. 点击"上传图片"或"上传视频"按钮
2. 选择或拖拽文件
3. 等待上传完成
4. 点击"保存到媒体库"

### 步骤 4: 编辑文件元数据

1. 在媒体文件卡片上点击"编辑"按钮
2. 填写多语言标题和描述
3. 选择使用位置
4. 点击"保存更改"

### 步骤 5: 在首页内容管理中使用

1. 访问 `/admin/home-content`
2. 选择对应的板块（演示视频、OEM定制、半成品小袋）
3. 使用 VideoUpload 或 ImageUpload 组件上传文件
4. 保存内容

## 🧪 测试清单

### 功能测试

- [ ] **数据库迁移**
  - [ ] 成功创建 media_files 表
  - [ ] 成功创建所有索引
  - [ ] 插入示例数据

- [ ] **图片上传**
  - [ ] 拖拽上传图片
  - [ ] 点击选择图片
  - [ ] 上传进度显示
  - [ ] 上传成功提示
  - [ ] 图片预览正常

- [ ] **视频上传**
  - [ ] 拖拽上传视频
  - [ ] 点击选择视频
  - [ ] 上传进度显示
  - [ ] 上传成功提示
  - [ ] 视频预览正常

- [ ] **媒体库管理**
  - [ ] 显示所有媒体文件
  - [ ] 按类型筛选（图片/视频）
  - [ ] 按文件夹筛选
  - [ ] 搜索功能
  - [ ] 编辑元数据
  - [ ] 删除文件

- [ ] **前端展示**
  - [ ] 首页演示视频正常播放
  - [ ] OEM区域图片正常显示
  - [ ] 半成品小袋区域图片正常显示

### 性能测试

- [ ] 上传大文件（接近100MB）
- [ ] 同时上传多个文件
- [ ] 加载大量媒体文件（50+）
- [ ] 搜索和筛选响应速度

### 兼容性测试

- [ ] Chrome 浏览器
- [ ] Firefox 浏览器
- [ ] Safari 浏览器
- [ ] Edge 浏览器
- [ ] 移动端浏览器

## 🔧 配置说明

### 环境变量

确保在 Cloudflare Pages 中配置了以下环境变量：

```bash
R2_PUBLIC_DOMAIN=https://pub-b9f0c2c358074609bf8701513c879957.r2.dev
JWT_SECRET=your-jwt-secret
```

### Cloudflare R2 绑定

在 `wrangler.toml` 中确保配置了 R2 绑定：

```toml
[[r2_buckets]]
binding = "IMAGE_BUCKET"
bucket_name = "kaen"
```

## 📚 使用示例

### 在首页内容管理中使用视频上传

```tsx
import VideoUpload from "@/components/VideoUpload";

function HomeContentManager() {
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <VideoUpload
      value={videoUrl}
      onChange={setVideoUrl}
      folder="home"
      maxSizeMB={100}
    />
  );
}
```

### 在OEM页面使用图片上传

```tsx
import ImageUpload from "@/components/ImageUpload";

function OEMContentManager() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      folder="oem"
    />
  );
}
```

## 🐛 故障排除

### 问题 1: 上传失败

**症状**: 文件上传时显示错误

**解决方案**:
1. 检查文件大小是否超过限制
2. 检查文件格式是否支持
3. 检查 R2 存储桶绑定是否正确
4. 查看浏览器控制台错误信息

### 问题 2: 媒体文件不显示

**症状**: 媒体库页面为空

**解决方案**:
1. 检查是否运行了数据库迁移
2. 检查 API 端点是否正常
3. 检查 JWT Token 是否有效
4. 查看网络请求响应

### 问题 3: 视频无法播放

**症状**: 视频上传成功但无法播放

**解决方案**:
1. 检查视频格式是否为浏览器支持的格式（MP4推荐）
2. 检查 R2 公共域名配置
3. 检查视频文件是否损坏
4. 尝试使用其他浏览器

## 📈 后续优化建议

1. **性能优化**
   - 实现图片缩略图生成
   - 添加懒加载
   - 实现虚拟滚动

2. **功能增强**
   - 批量上传
   - 批量删除
   - 文件夹管理
   - 标签系统
   - 收藏功能

3. **用户体验**
   - 拖拽排序
   - 复制URL功能
   - 快速插入到内容
   - 使用统计

4. **安全性**
   - 文件类型验证增强
   - 病毒扫描
   - 访问权限控制
   - 水印添加

## 📞 技术支持

如有问题，请查看：
- 浏览器控制台错误信息
- Cloudflare Pages 部署日志
- Cloudflare R2 存储桶状态
- 数据库查询日志

