# Li Hongmin 电影感科研个人网站设计规范

日期：2026-07-11  
状态：已完成视觉方向确认，待实现计划  
目标仓库：`li-hongmin.github.io`

## 1. 目标与受众

网站面向国际科研合作者与 PI，以英文为主。首要任务不是完整复刻传统 CV，而是在数秒内建立三件事：

1. Hongmin Li 是从事 AI for Science 与生物分子设计的研究者；
2. 研究工作强调可检验、可复现的科学证据；
3. 访问者可以快速进入研究项目、论文、履历和联系渠道。

成功标准：

- 首屏具备鲜明、克制、可识别的个人品牌，不像通用科研模板；
- 视觉冲击来自动态影像、排版和滚动节奏，而不是轨道、点阵、坐标、徽章或大量装饰；
- 真实研究信息和外部链接均来自现有 `index.md` 与 `cv.md`，不虚构项目、论文、职位或资助；
- 桌面、平板和手机均可阅读，减少动态效果模式不播放视频；
- 首屏视频不阻塞核心文本，页面在视频失败时仍完整可用；
- 构建产物适合静态托管，并可继续承载 `li-hongmin.github.io`。

## 2. 已确认的视觉方向

方向名称：Cinematic Minimal V3。

### 首屏

- 使用用户提供的云端小岛视频作为全屏动态壁纸，桌面端 `autoplay muted loop playsinline`；
- 视频保留原片暖金色云层与深蓝天空，使用 `saturate(1.08)`、`contrast(1.03)`，禁止灰度化；
- 首屏高度为 `100svh`，首屏内不露出下一节；
- `HONGMIN LI` 必须在桌面端同行显示，字号约 `clamp(96px, 11.2vw, 178px)`，系统现代无衬线，字重 560–600；
- 姓名不再压满整个画面，左右至少保留约 56px 呼吸空间；
- 只在左下主张文字附近使用宽度不超过约 680px 的局部暗化渐变，不对整张视频加暗幕；
- 主张文字为：`I build computational systems that turn scientific questions into testable, reproducible discoveries.`；
- 主入口为轻量文本链接 `Explore research ↘`，不使用大型白色胶囊按钮；
- 导航保持极简：`About / Research / Publications / Contact`，左侧使用简洁的 `H/L` 标识；
- 首屏唯一的额外动画是导航、姓名和主张在 500–650ms 内轻微上移淡入，不加入鼠标追随、磁吸、粒子或循环装饰动画。

### 首屏之后

- 首屏下方通过约 100px 的深色到暖白过渡进入 Research Vision；
- 暖白背景使用 `#F2F0EB`，正文使用接近 `#181817` 的深墨色；
- Research Vision 首句为：`Scientific AI should turn ambitious questions into evidence others can test.`；
- 该区域先讲研究愿景，再进入研究方向，避免首屏之后立即出现项目卡片墙；
- 后续版式以大留白、细分隔线、文本层级和少量全宽项目面板构成，禁止恢复第一版的轨道、点阵、坐标、节点和首屏指标栏。

## 3. 信息架构

网站为单页静态体验，使用锚点导航，不引入复杂路由。

1. **Hero**：姓名、研究主张、主入口和极简导航；
2. **About / Research Vision**：研究愿景、当前身份与合作方向；
3. **Research**：三个核心研究方向，采用全宽文本行而非小卡片：
   - AI-Automated Scientific Workflows
   - Biomolecular Sequence Design and Optimization
   - Reliable AI Research and Evaluation
4. **Selected Work**：展示 ID3、mRNA-GPT、FastUMAP 和 Targeted Tests for LLM Reasoning；每项只包含项目名、简短贡献、年份以及论文或代码链接；
5. **Publications**：默认展示 Targeted Tests for LLM Reasoning、Separating Shortcut Transition、A Controlled Counterexample、FastUMAP、mRNA-GPT 和 Gradient-based Optimization for mRNA Sequence Design；随后用原生 `<details>` 展开完整论文记录；
6. **Experience & Recognition**：默认展示 Institute of Science Tokyo 研究员、The University of Tokyo 客座研究员、The University of Tokyo 博士后和 HAOMO.AI 机器学习工程师经历；资助展示 2026 KAKENHI、2025 Google Grant 和 2024 KAKENHI；精选学术活动展示 CREST 2025 poster、RNA Informatics Dojo 2025 oral 和 APBJC24 poster；
7. **Contact**：电子邮件、GitHub、名为 `Full CV / Record` 的常显完整履历，以及合作邀请；
8. **Footer**：姓名、当前单位、更新时间和基础站点信息。

页面所有主要内容无需登录、弹窗或客户端持久化。实现时把 `index.md` 与 `cv.md` 的真实内容一次性迁移到 `src/data/profile.ts`，之后运行时和后续站点更新均以 `profile.ts` 为唯一内容源；原 Markdown 文件保留为迁移记录，不在构建时解析，也不与 TypeScript 双向同步。完整履历在页面中始终可见。

## 4. 内容边界

- 当前身份以仓库现有内容为准：Institute of Science Tokyo 研究员、The University of Tokyo 客座研究员；
- 研究主题以 AI-automated scientific workflows、AI for Science、bioinformatics、biomolecular sequence design 和 reliable AI evaluation 为核心；
- 论文、资助、奖项、单位名称、金额和链接只从现有仓库迁移；
- 页面文案可以压缩和重写，但不得扩大论文结论、资助范围或个人贡献；
- 首页只突出最重要工作，完整记录放在展开区域，避免把 CV 全量内容挤入首屏附近。

## 5. 技术架构

将现有 Jekyll 表现层迁移为 Vite + React + TypeScript 的静态站点。迁移是完整替换视觉层，不改变仓库作为个人主页的定位。

目标结构：

```text
src/
  App.tsx
  main.tsx
  components/
    Hero.tsx
    ResearchVision.tsx
    ResearchAreas.tsx
    SelectedWork.tsx
    Publications.tsx
    Recognition.tsx
    Contact.tsx
  data/
    profile.ts
  hooks/
    useHeroMedia.ts
  styles/
    globals.css
public/
  cv.html
  files/
    CREST_2025_poster.pdf
  media/
    hero.mp4
    hero-poster.webp
.github/
  workflows/
    deploy-pages.yml
```

实现约束：

- React 与 TypeScript 负责组件和真实内容映射；
- Tailwind CSS 负责响应式布局与设计令牌；少量需要精确渐变、字体缩放和视频遮罩的规则放入全局 CSS；
- Framer Motion 仅用于首屏一次性入场，不构建复杂滚动状态机；
- Lucide React 仅在确有语义的外链箭头或邮件图标中使用；
- 研究内容集中在 `src/data/profile.ts`，组件不重复硬编码事实；
- 不引入 CMS、数据库、登录、分析仪表盘或运行时 API；
- 使用语义 HTML 和锚点滚动，避免为了单页内容引入路由库。

构建与发布：

- `npm run build` 产出静态 `dist/`；
- 站点基路径固定为 `/`，保持 `li-hongmin.github.io` 根域兼容；
- GitHub Pages 作为现有公开主页的主发布目标，使用 GitHub Actions 的 Pages artifact/deploy 工作流发布 `dist/`，不使用 `gh-pages` 分支；
- Sites 托管用于本轮构建后的可访问预览与交付，不改变 canonical URL；
- 发布配置不依赖服务器端渲染、重写规则或运行时环境变量。
- 在 `public/cv.html` 提供轻量兼容页，将旧 `/cv.html` 访问者引导到 `/#contact`，同时保留无脚本可点击链接；
- 把现有 `files/CREST_2025_poster.pdf` 复制到 `public/files/`，保持公开 PDF 路径不变。

## 6. 视频、性能与降级

- 从用户明确提供的 `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4` 下载 MP4 并自托管，避免生产站继续依赖外部 CloudFront 热链；
- 使用低内存的转码设置移除音轨、加入 `faststart`，目标文件约 4–7MB；
- 从视频抽取代表帧并生成约 1920px 宽的 WebP poster；
- `useHeroMedia` 只在视口宽度至少 900px 且未启用 `prefers-reduced-motion` 时设置视频 `src`，更窄设备与减少动态效果模式不下载视频；
- 视频加载、解码或自动播放失败时，poster 始终保持可见；
- 视频为装饰性媒体，使用 `aria-hidden="true"`，不暴露无意义的播放器控件；
- 页面核心文字、导航和链接不依赖 JavaScript 动画完成可见性；
- 使用系统字体栈，避免首屏等待远程字体；
- 非首屏内容与媒体按需加载，避免一次加载所有外部资源。

## 7. 响应式与可访问性

- 768px 以上姓名保持一行；小于 768px 允许分行；小于 900px 使用静态 poster；
- 手机导航保持四个短链接，可在窄屏下缩小间距，但不隐藏为菜单；
- 文本遮罩只服务于对比度，不能让背景整体重新变灰；
- 所有链接和可展开内容可用键盘访问，并有可见焦点状态；
- `prefers-reduced-motion: reduce` 下禁用首屏入场动画并停止视频；
- 颜色对比度按 WCAG AA 作为底线；
- 页面支持 320px 宽度，不出现水平滚动或被裁切的长论文标题。

## 8. SEO 与分享

- 页面标题：`Hongmin Li — AI for Science & Biomolecular Design`；
- 描述强调 AI for Science、biomolecular sequence design 与 reproducible scientific workflows；
- 提供 canonical、Open Graph 和 X/Twitter 元数据；
- 社交分享图使用最终站点的暖金云层、深蓝天空、较小的一行姓名和研究主张，不使用通用占位图；
- 保留语义标题层级和结构化的个人/研究信息，避免仅靠视觉排版表达内容。

## 9. 验证与验收

实现完成后至少验证：

- TypeScript、生产构建和静态产物成功；
- 首屏姓名在桌面同行、手机可读，页面无横向溢出；
- 视频仅在合适设备加载，减少动态效果模式与移动端使用 poster；
- 视频失败时姓名、主张、导航和 CTA 仍可正常使用；
- 所有论文、代码、资助、单位和联系链接来自现有仓库且无明显断链；
- 键盘导航、焦点状态、语义标题和常显完整履历可用；
- 首屏不包含轨道、点阵、坐标、节点、首屏指标栏或大型胶囊按钮；
- 首屏背景保留鲜艳暖金与深蓝，左侧只做局部暗化；
- Research Vision 在完整首屏之后出现，转场不产生突兀白色切断。
- `/cv.html` 可访问并引导到 `/#contact`；
- `/#contact` 可直接定位到完整履历；
- `/files/CREST_2025_poster.pdf` 保持可直接访问。

## 10. 非目标

- 不制作博客、后台、登录、搜索、订阅或邮件表单；
- 不加入 3D WebGL、持续粒子效果、复杂鼠标跟随或重型滚动框架；
- 不把所有 CV 条目同时放在默认视图；
- 不在未经内容依据的情况下新增数字指标、合作单位、论文影响或研究成果；
- 不在本轮重构中修改科研事实本身。
