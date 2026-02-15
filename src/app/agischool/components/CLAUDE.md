# components/
> L2 | 父级: /CLAUDE.md

成员清单
ui/                            shadcn/ui 设计系统组件库 (30+ 组件: button[含gradient微拟物变体], card[微拟物阴影], dialog, form, select, table, tooltip 等)
auth/AuthModal.tsx:            认证弹窗组件，支持登录/注册切换，React Hook Form + Zod 验证
common/ComingSoon.tsx:         敬请期待占位组件，倒计时样式
common/FadeIn.tsx:             通用动画组件，FadeIn淡入 + StaggerContainer交错动画
common/Modal.tsx:              通用模态框容器，framer-motion 动效
creation/ProjectCard.tsx:      项目卡片，展示创作项目
creation/SidebarWidgets.tsx:   侧边栏小工具组
creation/layout/CreationHeader.tsx: 创作页面顶部导航
dashboard/BadgeWall.tsx:        徽章墙组件，展示成就
dashboard/KnowledgeRadar.tsx:   知识雷达图，数据可视化
dashboard/Portfolio.tsx:        作品集展示
dashboard/ModelLibrary.tsx:     模型库管理
dashboard/StatsRow.tsx:         统计数据行
dashboard/layout/DashboardLayout.tsx: 仪表板布局容器
dashboard/layout/Sidebar.tsx:   侧边栏导航
lab/image-classifier/TrainingPerformance.tsx: 训练性能监控
lab/image-classifier/Hyperparameters.tsx: 超参数配置面板
lab/image-classifier/DataCollection.tsx: 数据采集组件
lab/image-classifier/ConsoleOutput.tsx: 控制台输出日志
lab/image-classifier/layout/LabHeader.tsx: 实验室顶部导航
landing/Hero.tsx:               落地页首屏 Hero（FadeIn动画）
landing/FeatureMatrix.tsx:      功能特性矩阵（Stagger动画）
landing/FinalCTA.tsx:           最终行动号召组件
landing/GamifiedJourney.tsx:    游戏化学习路径
landing/TrustSection.tsx:       信任背书区块
landing/StudentWork.tsx:        学员作品展示
layout/AppHeader.tsx:           应用头部导航（shadcn Button）
layout/Header.tsx:              页面头部（带路由）
layout/Footer.tsx:              全局页脚（shadcn Button + Input）
learning/LearningMap.tsx:       学习地图组件
learning/StudentHUD.tsx:        学员抬头显示（HUD）
teacher/dashboard/StatsGrid.tsx: 教师后台统计网格
teacher/dashboard/RecentActivity.tsx: 最近活动流
teacher/layout/TeacherLayout.tsx: 教师后台布局
teacher/layout/Sidebar.tsx:     教师侧边栏
teacher/layout/TopNav.tsx:      教师顶部导航

法则: 成员完整·一行一文件·父级链接·技术词前置
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
