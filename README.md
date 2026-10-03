# 航线笔记 · jichangblog.org

中文机场推荐博客，正式域名为 https://jichangblog.org，GitHub 仓库为 https://github.com/ksugiono187/jichangblog.org。

## 内容与浏览

- 120 篇独立文章：49 篇选购指南、43 篇套餐比较、28 篇品牌档位分析。
- 24 个专题：新手、预算、流量、不限时、影音、AI、优惠码、资料核验、月付、年付、轻度用量、学生、手机、电脑、工作、下载、出行、多设备、延迟、续费、隐私、售后、地区与订阅维护。
- 原有 28 个品牌详情页和 11 个原始优惠码保留。
- 文章库支持搜索、专题筛选和每页 12 篇的分页。不开启 JavaScript 时仍可看到完整文章目录与静态正文。
- 手机底部导航、展开式目录和表格容器内横向滚动；每个专题至少 3 篇文章。
- 全站共 181 个 HTML 页面，其中 180 个内容地址进入 sitemap，排除 404。全部内容页可从首页两次链接内到达。

## 本地预览

项目保存于桌面“博客/jichangblog.org”。安装 Node.js 22 或更新版本后，双击“预览博客.cmd”，再打开 http://localhost:4173/。

也可以在本目录执行 `npm run preview`。本地预览生成在被 Git 忽略的 `.preview/`，带 noindex 和禁止抓取的 robots；不会修改正式域名、生产 sitemap 或 dist。关闭服务后本地地址停止访问。

入口：`/blog/` 为文章，`/topics/` 为专题，`/sitemap/` 为访客地图，`/sitemap.xml` 为 XML 地图。

## 构建与发布

执行 `npm run build` 生成正式站点到 `dist/`，执行 `npm run check` 检查元数据、标题、结构化数据、引用、锚点和全站内链。

推送到 main 后，`.github/workflows/pages.yml` 会构建、检查并部署 GitHub Pages。工作流固定使用 https://jichangblog.org，根路径为空；源目录与 dist 均保留 CNAME 文件。

使用自定义 GitHub Actions 部署时，CNAME 文件不能代替 GitHub Settings → Pages 中的 Custom domain 配置。仓库 Pages 需要选择 GitHub Actions，并将 Custom domain 设为 jichangblog.org。证书可用后启用 Enforce HTTPS。

本项目没有通过修改源文件访问域名服务商，DNS 需要与实际托管一致。参考 [GitHub 官方自定义域名说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 数据与真实性

套餐是有来源、日期和具体疑点的第三方参考资料，不是已完成官网实时核验的报价。2026-10-03 检查了 28 个推广入口，服务面板套餐接口要求登录，未独立核实官网现价。

品牌页和分析文章链接到各自的公开来源；保留来源日期与查询日期。单位成本、增量成本和匹配月包为本站计算，未计未知倍率或未验证优惠。不存在虚构购买、测速、解锁、隐私审计或客服评分。

25 篇原指南和 24 篇新增指南均为选购方法与明确算例；43 篇比较按指定假设月用量筛选容量明确的最低匹配月档；28 篇品牌分析解释完整档位、升级增量、年付和一次性结构及来源疑点。

所有 11 个优惠码来自站长，保留原始大小写；折扣、有效期与续费条件未结算验证。推广入口标注 sponsored / nofollow。

## 内容维护

- `data/brands.json`：品牌名、入口、优惠码、套餐、来源与疑点。
- `data/editorial.mjs` 和 `data/examples.mjs`：原指南、比较、专题与判断例子。
- `data/expansion.mjs`：新增 16 个专题、24 篇指南、31 篇比较和 28 篇品牌分析；品牌分析读取 brands.json 后计算，不复制一个永远不更新的价格表。
- `scripts/editorial.mjs`：文章、专题、关联内容和网站地图渲染。
- `site.config.json`：站名、正式域名、描述和内容更新日期。

修改数据后重新构建、检查、提交与推送。lastmod 应反映正文真实修改日期，不应为了催抓取每日自动改日期。

## Bing 抓取基础

标题自然包含“机场推荐”，首页 H1 为“机场推荐，从你的需求出发”。静态正文、独立描述、canonical、Article 与 BreadcrumbList、robots 和 sitemap 已生成。正式 sitemap 为 https://jichangblog.org/sitemap.xml。

上线后在 Bing Webmaster Tools 验证站点并提交上述公开 sitemap，查看处理和 URL 检查结果。本地 localhost 地址不能提交。未伪造 Bing 验证密钥、收录或排名；关键词和 sitemap 不保证收录或排名靠前。

参考 [Bing 官方 sitemap 说明](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)。

## 视觉资产

背景为此前生成的原创午夜深蓝与钴蓝极光图，已压缩为 WebP。使用本地字体，无第三方字体请求。
