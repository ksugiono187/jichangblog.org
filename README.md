# 云途集 · jichangblog.org

中文机场推荐博客，正式域名为 https://jichangblog.org，GitHub 仓库为 https://github.com/ksugiono187/jichangblog.org。

## 内容与浏览

- 120 篇独立文章：49 篇选购指南、43 篇套餐比较、28 篇品牌档位分析。
- 24 个专题：新手、预算、流量、不限时、影音、AI、优惠码、资料核验、月付、年付、轻度用量、学生、手机、电脑、工作、下载、出行、多设备、延迟、续费、隐私、售后、地区与订阅维护。
- 原有 28 个品牌详情页和 11 个原始优惠码保留。
- 文章库支持搜索、专题筛选和每页 12 篇的分页。不开启 JavaScript 时仍可看到完整文章目录与静态正文。
- 手机底部导航、展开式目录和表格容器内横向滚动；每个专题至少 3 篇文章。
- 全站共 186 个 HTML 页面，其中 183 个内容地址进入 sitemap，排除 404、搜索页与个人阅读记录页。全部内容页可从首页两次链接内到达。

## 选购工具与更新提交

`/select/` 按单次支付预算、流量、付款周期、倍率与预留比例筛选。每个品牌显示符合条件且单次支付最低的档位，计算在浏览器中完成，年付和一次性包分别计算。未知容量与未验证优惠不参与计算。

首页和相关专题保留“机场推荐”，文章标题、H1 与结构化 headline 直接描述具体问题；功能页使用符合用途的标题。

`site.config.json` 中的 indexNowKey 用于公开 URL 更新验证，并非 GitHub 或账户凭据。生产构建在站点根目录生成协议要求的验证文本文件，本地预览不生成。IndexNow 工作流等正式域名的 build-manifest.revision 与本次提交一致后，再提交此次 Git 更新中变化的内容地址。接收结果保存在工作流附件中；200 为已接收，202 为待验证，不代表收录或排名。没有变化时跳过，不重复提交成功请求。

初次或人工核对可以执行 `node scripts/indexnow.mjs --all --dry-run`；实际全量提交使用 `--all`，应先查看自动工作流是否已经提交。Bing Webmaster Tools 的账号验证和搜索表现报告需要站长自己的账户，IndexNow 不代替该验证。

## 商务联系

`/contact/` 提供商业合作、内容共创与洽谈咨询说明。Telegram：@Hy_0027（https://t.me/Hy_0027）；商务邮箱：ksugiono187@gmail.com。入口已加入全站导航、页脚及网站地图。

## 本地预览

项目保存于桌面“博客/jichangblog.org”。安装 Node.js 22 或更新版本后，双击“预览博客.cmd”，再打开 http://localhost:4173/。

也可以在本目录执行 `npm run preview`。本地预览生成在被 Git 忽略的 `.preview/`，带 noindex 和禁止抓取的 robots；不会修改正式域名、生产 sitemap 或 dist。关闭服务后本地地址停止访问。

入口：`/blog/` 为文章，`/topics/` 为专题，`/sitemap/` 为访客地图，`/sitemap.xml` 为 XML 地图。

## 构建与发布

执行 `npm run build` 生成正式站点到 `dist/`，执行 `npm run check` 检查元数据、标题、结构化数据、引用、锚点和全站内链。

当前采用 Cloudflare Pages 托管，连接本仓库后选择框架预设 `None`、生产分支 `main`、构建命令 `npm run build`、输出目录 `dist`，根目录留空；环境变量 `NODE_VERSION` 设为 `22`。在 Pages 项目的自定义域中关联 `jichangblog.org`。

仓库同时保留 GitHub Pages 工作流：推送到 main 后，`.github/workflows/pages.yml` 会构建、检查并部署 GitHub Pages。工作流固定使用 https://jichangblog.org，根路径为空；源目录与 dist 均保留 CNAME 文件。

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

首页和相关专题标题自然包含“机场推荐”，首页 H1 为“机场推荐，从你的需求出发”。静态正文、独立描述、canonical、Article 与 BreadcrumbList、robots 和 sitemap 已生成。正式 sitemap 为 https://jichangblog.org/sitemap.xml。

上线后在 Bing Webmaster Tools 验证站点并提交上述公开 sitemap，查看处理和 URL 检查结果。本地 localhost 地址不能提交。未伪造 Bing 验证密钥、收录或排名；关键词和 sitemap 不保证收录或排名靠前。

参考 [Bing 官方 sitemap 说明](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/)。

## 视觉资产

背景为此前生成的原创午夜深蓝与钴蓝极光图，已压缩为 WebP。使用本地字体，无第三方字体请求。

## 读者功能与核验记录

- 首页与品牌页可收藏、勾选 2～4 家；compare/ 支持并排卡片与可分享的 brands 参数，原有完整静态套餐表保留。
- search/ 搜索 28 家品牌、120 篇文章、24 个专题；library/ 仅使用当前浏览器的本地记录，最近浏览最多 12 条。
- search/ 与 library/ 采用 noindex，且不列入 Sitemap / IndexNow；updates/ 提供公开资料状态与实际功能更新记录。
- assets/explorer.js 管理互动与本地保存，assets/catalog.json 由构建生成；无需账号，不上传收藏和浏览记录。
- data/enrichment.mjs 为三篇重点指南生成有依据的预算比较、有效流量成本与优惠核验模板。node scripts/audit-content.mjs 检查文章正文的共用段落与相似度，仅作编辑审阅线索。
- 用户提供的 Bing 验证标签写入 site.config.json 的 bingVerification，仅首页输出；上线后在 Bing 站长工具点击验证，并提交 https://jichangblog.org/sitemap.xml。
- 186 个 HTML 页面，183 个可索引 Sitemap URL；404、搜索与个人阅读记录页不进入 Sitemap。

## 暂停提交（站长要求）

当前 indexNowEnabled 为 false，构建和发布仍正常，但 IndexNow 脚本在任何网络提交前直接退出。待整站优化及站长审阅完成后，再按明确要求恢复；不自动恢复。Sitemap 文件仍保留供检查，未代替站长在 Bing 后台手动提交。

## 搜索描述与参考资料复查（2026-10-03）

- 为 49 篇指南逐篇编写搜索描述，比较文章、品牌分析与专题描述依据对应内容生成；183 个可收录页面描述互不重复，当前长度为 51～110 个字符。该范围是本次编辑结果，不是 Bing 的排名门槛。
- 修正品牌标题中的重复“机场”与描述中的重复别名；标题、描述、Open Graph 和结构化数据同步。
- 为月付预算、月付与年付、资料分歧三篇指南补充引用现有档位生成的对照表，共 6 篇指南已有额外表格或核验模板。
- data/source-checks.json 保存 28 个公开入口和 28 个第三方来源的访问记录，以及 182 个参考档位与源表的金额、付款周期、GB 字段比对。182 项均匹配，只说明引用一致，不属于官网现价核验。
- 公开入口均显示线路检测页；未登录、未购买，没有新增优惠结算、测速或服务质量验证。Bing 后台收录数量不由网站代码推断。
- scripts/check-metadata.mjs 检查独立描述、重复品牌后缀、Open Graph 与结构化描述一致性，并确保入口访问不改变价格或优惠核验等级。
- 站长已反馈提交 Sitemap 并读取 183 个网址；自动 IndexNow 仍保持暂停，未自动恢复。
## 2026-10-03 证据与计算口径更新

28个品牌页加入30/100/200/500/1000GB月需求的最低满足档和有效用量成本分析。data/research.json保留7个品牌的8份外部历史报告及方法、日期和局限，含商业关联，未取得原始日志、未复测，不当作本站实测。

灵动云穿云外部原图标70GB/年，已纠正此前按70GB/月的显示及计算。25个缺少重置说明的年付档保留原始quotedGb，但月额度gb为null，不参与每月容量筛选和每GB计算。飞猫年包每月50GB依据第三方明确表述，仍非官网现价确认。原参考表匹配182档仅指原始金额、付款周期、容量数值，不验证重置周期或当前在售。

## 2026-10-03 官网公开配置与优惠条件复查
28个面板公开配置均200，套餐读取均403，tos_url均为空；不等同于无条款或品牌停服。另一配置地址有4个500、7个本机访问失败，仅记地址级现象。11个站长原码保持，9个增加第三方历史条件；优惠仍未结算验证。Firefly和极连云套餐来源名称归属有疑点，不进入自动选购与预算候选。
