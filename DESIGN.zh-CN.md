---
name: Wayseeker
description: A navigable workflow guide for choosing the next useful tool.
colors:
  workbench: "#111927"
  panel: "#1c2534"
  ink: "#eeeeec"
  muted: "#b5b3ad"
  line: "#363a3f"
  current: "#eac561"
  light-workbench: "#f4f4f2"
  light-panel: "#fdfdfc"
  light-ink: "#21201c"
  light-muted: "#63635e"
  light-line: "#dad9d6"
  light-current: "#ab6400"
  felt-dark: "rgba(0,0,0,0.09 peak)"
  felt-light: "rgba(255,255,255,0.085 peak)"
typography:
  display:
    fontFamily: "Georgia, Songti SC, STSong, serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  scene-title:
    fontFamily: "Georgia, Songti SC, STSong, serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    lineHeight: 1.5
rounded:
  preview: "8px"
  thumbnail: "4px"
  neighbor: "5px"
  control: "50%"
components:
  workflow-stop:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
  tool-preview:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.preview}"
  scene-control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
---

[English](DESIGN.md) · **简体中文**

# Design System: Wayseeker

## Overview

**Creative North Star: "A navigable workflow atlas"**

Wayseeker 是帮助用户完成当前任务的工作流地图，不是按热度排列的工具目录。工作流、真实预览和策展判断在同一个可旋转的工具场景中变化。浅色工作台以纸面层级承载工具，深色工作台以真实预览为主要光源；两者都强调路径、位置与选择，而不是再套一层杂志封面或卡片墙。

工作台表面铺医用毛毡质感：双层可平铺噪点（深色纤维 `multiply`、亮色纤维 `screen`，各约 9% 峰值 alpha）垫在 1600px 柔和渐洗上。配方来自 kaze.build，只在工作台与页头页脚生效，工具预览和卡片保持干净。

**Key Characteristics:**
- 任务链组织，不以 AI、UI 等商品标签为主轴。
- 大幅真实预览，旁边是可阅读的策展证据。
- 细线、节点和克制的赭金表达当前位置。
- 手机保留探索逻辑：路径横滑、预览、判断。

## Colors

强调色全站只有一种赭金，与 favicon 同源；危险语义单独保留 red-11。此前番茄红、柠檬绿、鼠尾草绿与赭黄四套色并存，是页面显乱的主因。

### Primary
- **Workbench Blue-black** `#111927`：深色页面与页头页脚的共同背景。
- **Paper Workbench** `#f4f4f2`：浅色页面的纸面底色。
- **Ink**：深色主题暖白 `#eeeeec`，浅色主题近黑 `#21201c`。

### Secondary
- **Current Gold** `#eac561`：深色主题的当前节点、焦点与关键说明。
- **Current Ochre** `#ab6400`：浅色主题同一角色，白字 4.69:1。
- **Panel Navy / Paper**：图片加载前的表面和控件底。

### Neutral
- **Muted Sand / Slate**：次要说明。
- **Quiet Line**：连线、分隔、焦点框，恒为 0.5px。

## Typography

只有两种声音，没有第三种：

**Display Font:** Georgia / 宋体系统衬线（`--font-display`），用于页面标题、场景标题、工具名与策展引用。字重 500，靠字号与负字距分层，不靠加黑。
**Body Font:** IBM Plex Sans，中文回退系统黑体。控件、正文、按钮均用它。
**Label/Mono Font:** IBM Plex Mono，只用于进度、seed 与数值记录。

此前声明过 Manrope 自托管字体与 Plus Jakarta 两个 display 面，但实际都被 fallback 绕过（浏览器计算样式一律解析到 IBM Plex Sans），已全部移除。

大标题只负责提出任务，不覆盖工具内容。工作流与工具名采用自然句式和明确字重，避免全大写装饰标签。

## Layout

桌面首屏由一句任务提问、五段工作流和大幅真实预览组成。当前工具的策展判断位于预览旁；关联工具位于预览下缘但不覆盖截图内容。

移动端不缩小整个地图，而按「任务横滑 → 完整预览 → 工具名 → 策展判断」排列。

## Elevation & Depth

工作台保持平面，预览使用柔和的偏移阴影形成空间。不要同时给所有区域加粗边框和阴影。关联工具在工作台实底上，不使用玻璃模糊层遮住真实截图。

## Shapes

预览为 8px 圆角，缩略图 4px，相邻工具 5px；步进与访问按钮为 44px 圆形触控区，工作流节点为小圆点。不使用统一圆角卡片、左侧彩色竖条或装饰性轨道。

## Components

### Workflow Rail
五个任务节点以细线连接，当前节点有赭金实心点、文字和 `aria-pressed`，并在下缘画 2px 当前线。小屏横向滚动。

### Atlas
中心工具以真实预览占据主场景，前后工具以轨道式缩略图提供可点击的空间路径。翻面在同一对象上呈现策展判断。桌面保留空间透视；手机只保留必要的前后关系，背面按内容增高。

### Explorer Navigation
左右方向键切换工具，上下方向键切换工作流，Home / End 到首尾。主题切换覆盖首页、页头页脚、缩略图、策展判断和控件。

### Curator Judgment
始终保留 when、replaces、caveat 三段，标签与原文分离。中文和英文长文本自然展开。

### Index and Shuffle
索引可从任意工具回到正确工作流；随机 seed 同时还原工具和任务路径，允许复制链接与回到策展路径。

## Do's and Don'ts

### Do:
- **Do** 从任务而非工具数量组织新页面。
- **Do** 让真实预览、策展评论和当前工具保持同步。
- **Do** 在桌面、手机、双语和低动态环境验证探索与访问。

### Don't:
- **Don't** 把 Wayseeker 退回大标题加工具卡片列表。
- **Don't** 引入第二种强调色；赭金已经是唯一信号色。
- **Don't** 在工具预览上铺毛毡或噪点，会弄脏真实截图。
- **Don't** 复制参考网站的配色、发光边框或商品营销 hero。
