# ChatGPT Atlas 搜索引擎控制台操作提示词

## 📋 完整提示词（可直接复制）

```
我需要你帮我操作三个搜索引擎控制台，完成 sitemap 提交和验证任务。以下是详细信息：

## 网站信息
- 网站域名：kn-wallpaperglue.com
- 网站URL：https://kn-wallpaperglue.com
- 主 Sitemap：https://kn-wallpaperglue.com/sitemap.xml
- 语言版本 Sitemap：
  - https://kn-wallpaperglue.com/sitemap-zh.xml (中文)
  - https://kn-wallpaperglue.com/sitemap-en.xml (英文)
  - https://kn-wallpaperglue.com/sitemap-ru.xml (俄文)
  - https://kn-wallpaperglue.com/sitemap-vi.xml (越南文)
  - https://kn-wallpaperglue.com/sitemap-th.xml (泰文)
  - https://kn-wallpaperglue.com/sitemap-id.xml (印尼文)

## 账户信息
（请用户填写以下信息）
- Google 账户：_________________________
- Microsoft/Bing 账户：_________________________
- Yandex 账户：_________________________

## 需要执行的任务

### 任务 1：Google Search Console

#### 步骤 1.1：访问并选择属性
1. 打开浏览器，访问：https://search.google.com/search-console
2. 如果看到多个属性，选择 `kn-wallpaperglue.com`
3. 确认已成功登录并进入该属性的控制台

#### 步骤 1.2：删除并重新添加 Sitemap
1. 在左侧菜单中，点击 "站点地图" (Sitemaps)
2. 查找 `sitemap.xml` 条目
3. 如果存在，点击该条目右侧的 "删除" 按钮，确认删除
4. 等待删除完成（通常几秒钟）
5. 在页面顶部的 "添加新的站点地图" 输入框中，输入：`sitemap.xml`
6. 点击 "提交" 按钮
7. 等待几分钟，检查状态是否显示为 "成功"
8. 如果状态不是 "成功"，记录错误信息

#### 步骤 1.3：验证 Sitemap 格式
1. 在顶部搜索栏或左侧菜单中，找到并点击 "URL 检查" (URL Inspection)
2. 在输入框中输入：`https://kn-wallpaperglue.com/sitemap.xml`
3. 点击 "测试实时 URL" (Test Live URL) 或 "请求索引" (Request Indexing)
4. 确认返回的 Content-Type 为 `application/xml`
5. 如果显示错误或 Content-Type 不是 `application/xml`，记录详细错误信息
6. 截图保存验证结果

#### 步骤 1.4：验证 hreflang 设置
1. 在左侧菜单中，点击 "国际定位" (International Targeting)
2. 检查是否识别了所有 6 种语言版本（zh, en, ru, vi, th, id）
3. 确认 x-default 设置为英文版本
4. 如果缺少任何语言版本或 x-default 设置不正确，记录问题
5. 截图保存 hreflang 配置页面

#### 步骤 1.5：提交所有语言版本的 Sitemap（可选但推荐）
1. 返回 "站点地图" 页面
2. 依次提交以下 sitemap：
   - `sitemap-zh.xml`
   - `sitemap-en.xml`
   - `sitemap-ru.xml`
   - `sitemap-vi.xml`
   - `sitemap-th.xml`
   - `sitemap-id.xml`
3. 记录每个 sitemap 的提交状态

### 任务 2：Bing Webmaster Tools

#### 步骤 2.1：访问并选择网站
1. 打开浏览器，访问：https://www.bing.com/webmasters
2. 如果看到多个网站，选择 `kn-wallpaperglue.com`
3. 确认已成功登录并进入该网站的控制台

#### 步骤 2.2：删除并重新提交 Sitemap
1. 在左侧菜单中，点击 "站点地图" (Sitemaps)
2. 查找 `https://kn-wallpaperglue.com/sitemap.xml` 条目
3. 如果存在，点击该条目右侧的 "删除" 或 "移除" 按钮，确认删除
4. 等待删除完成
5. 点击 "提交站点地图" (Submit Sitemap) 或 "添加站点地图" (Add Sitemap) 按钮
6. 在输入框中输入：`https://kn-wallpaperglue.com/sitemap.xml`
7. 点击 "提交" (Submit) 按钮
8. 记录提交时间和响应状态
9. 如果状态不是 "成功" 或 "已接受"，记录错误信息
10. 截图保存提交结果

#### 步骤 2.3：验证 Sitemap 状态
1. 等待几分钟后，刷新页面
2. 检查 sitemap 状态是否更新
3. 记录发现的 URL 数量（如果显示）
4. 截图保存状态页面

### 任务 3：Yandex Webmaster

#### 步骤 3.1：访问并选择网站
1. 打开浏览器，访问：https://webmaster.yandex.com
2. 如果看到多个网站，选择 `kn-wallpaperglue.com`
3. 确认已成功登录并进入该网站的控制台

#### 步骤 3.2：检查现有 Sitemap
1. 在左侧菜单中，点击 "索引" (Indexing)
2. 点击 "站点地图文件" (Sitemap files)
3. 检查是否已有 `https://kn-wallpaperglue.com/sitemap.xml` 的提交记录
4. 如果存在，记录提交时间和状态

#### 步骤 3.3：删除并重新提交 Sitemap
1. 如果存在旧的 sitemap 记录，点击 "删除" 按钮，确认删除
2. 点击 "添加站点地图" (Add Sitemap) 按钮
3. 在输入框中输入：`https://kn-wallpaperglue.com/sitemap.xml`
4. 点击 "添加" (Add) 按钮
5. 记录提交时间和状态
6. 如果状态不是 "成功" 或 "已接受"，记录错误信息
7. 截图保存提交结果

#### 步骤 3.4：验证索引状态
1. 等待几分钟后，刷新页面
2. 检查 sitemap 状态是否更新
3. 记录发现的页面数量（如果显示）
4. 截图保存状态页面

## 执行要求

1. **按顺序执行**：先完成 Google，再完成 Bing，最后完成 Yandex
2. **详细记录**：每个步骤都要记录执行结果、错误信息（如有）、状态信息
3. **截图保存**：关键步骤和最终结果都要截图保存
4. **验证检查**：每个任务完成后，都要验证操作是否成功
5. **错误处理**：如果遇到任何错误，详细记录错误信息，不要跳过

## 最终报告格式

请按照以下格式提供最终报告：

```
# 搜索引擎控制台操作报告

## Google Search Console
- [ ] 已删除旧 sitemap
- [ ] 已重新提交 sitemap.xml
- [ ] 提交状态：成功/失败（如失败，说明原因）
- [ ] URL 检查结果：Content-Type = application/xml（是/否）
- [ ] hreflang 验证：所有语言版本已识别（是/否）
- [ ] x-default 设置：正确/不正确
- [ ] 截图：已保存/未保存
- [ ] 备注：_________________________

## Bing Webmaster Tools
- [ ] 已删除旧 sitemap
- [ ] 已重新提交 sitemap.xml
- [ ] 提交状态：成功/失败（如失败，说明原因）
- [ ] 提交时间：_________________________
- [ ] 发现的 URL 数量：_________________________
- [ ] 截图：已保存/未保存
- [ ] 备注：_________________________

## Yandex Webmaster
- [ ] 已检查现有 sitemap
- [ ] 已删除旧 sitemap（如存在）
- [ ] 已重新提交 sitemap.xml
- [ ] 提交状态：成功/失败（如失败，说明原因）
- [ ] 提交时间：_________________________
- [ ] 发现的页面数量：_________________________
- [ ] 截图：已保存/未保存
- [ ] 备注：_________________________

## 总结
- 成功完成的任务：_________________________
- 遇到的问题：_________________________
- 需要后续跟进的事项：_________________________
```

## 注意事项

1. 如果某个搜索引擎控制台需要额外的验证步骤（如验证网站所有权），请先完成验证
2. 如果遇到登录问题，请告知我，我会提供账户信息
3. 如果某个步骤无法完成，请详细说明原因，不要跳过
4. 所有操作都要在浏览器中完成，不要使用 API 或其他方式
5. 操作过程中如果页面加载缓慢，请耐心等待

现在请开始执行任务，按照上述步骤逐一完成。
```

---

## 📝 使用说明

1. **填写账户信息**：在上面的提示词中，找到 "账户信息" 部分，填写你的账户邮箱或用户名

2. **复制完整提示词**：复制上面的完整提示词（从 "我需要你帮我操作..." 开始到 "现在请开始执行任务..." 结束）

3. **发送给 ChatGPT Atlas**：将提示词粘贴到 ChatGPT Atlas 的对话框中

4. **等待执行**：ChatGPT Atlas 会按照提示词中的步骤逐一执行任务

5. **检查报告**：执行完成后，ChatGPT Atlas 会提供一份详细的报告，请检查所有任务是否完成

## 🔍 验证清单

执行完成后，请验证以下内容：

- [ ] Google Search Console 显示 sitemap 状态为 "成功"
- [ ] Google Search Console 的 "国际定位" 显示所有 6 种语言版本
- [ ] Google URL 检查工具确认 sitemap.xml 返回 `application/xml`
- [ ] Bing Webmaster Tools 显示 sitemap 已提交
- [ ] Yandex Webmaster 显示 sitemap 已提交
- [ ] 所有截图已保存

## ⚠️ 重要提示

- 如果 ChatGPT Atlas 无法访问某些网站（如需要登录），请提供账户信息或授权
- 如果遇到验证码或其他安全验证，请手动完成后再继续
- 建议在执行前先测试一下 ChatGPT Atlas 是否能访问这些网站












