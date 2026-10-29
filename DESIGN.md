---
name: Wayfinder
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
typography:
  display:
    fontFamily: "Manrope, IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  secondary:
    fontFamily: "IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.65
  mobile-display:
    fontFamily: "Manrope, IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "2.75rem"
    lineHeight: 1.08
  label:
    fontFamily: "IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "0.75rem"
    lineHeight: 1.5
rounded:
  preview: "6px"
  thumbnail: "4px"
  control: "50%"
spacing:
  scene: "32px"
  section: "64px"
components:
  workflow-stop:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "8px 0"
  tool-preview:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.preview}"
    padding: "0"
  scene-control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
---

# Design System: Wayfinder

## Overview

**Creative North Star: "A navigable workflow"**

Wayfinder 是帮助用户完成当前任务的工作流地图，不是按热度排列的工具目录。工作流、真实预览和策展判断在同一个场景中变化。浅色工作台以纸面层级承载工具，深色工作台以真实预览为主要光源；两者都强调路径、位置与选择，而不是再套一层杂志封面或卡片墙。

**Key Characteristics:**
- 任务链组织，不以 AI、UI 等商品标签为主轴。
- 大幅真实预览，旁边是可阅读的策展证据。
- 细线、节点和克制的黄色表达当前位置。
- 手机保留探索逻辑：路径横滑、预览、判断。

## Colors

### Primary
- **Workbench Blue-black**: 深色页面与页头页脚的共同背景，让真实预览成为主要光源。
- **Paper Workbench**: 浅色页面的纸面底色，以层级而非纯白填充承载工具。
- **Ink**: 深色主题暖白、浅色主题近黑，分别对应各自底色。

### Secondary
- **Current Yellow**: 深色工作流节点、焦点与关键说明，不大面积铺色。
- **Current Amber**: 浅色主题的当前节点与焦点，保证小字与线条清晰可辨。
- **Panel Navy / Paper**: 图片加载前的表面和控件底，随主题切换。

### Neutral
- **Muted Sand / Slate**: 次要说明，保持各自底色上的正文可读性。
- **Quiet Line**: 工作流连线、分隔和焦点框，保持 0.5px。

## Typography

**Display Font:** Manrope，自托管拉丁子集，中文回退系统黑体。
**Body Font:** IBM Plex Sans，中文使用系统黑体。
**Label/Mono Font:** IBM Plex Mono 仅用于进度、seed 和数值记录。

大标题只负责提出任务，不覆盖工具内容。工作流与工具名采用自然句式和明确字重，避免全大写装饰标签。

## Layout

桌面首屏由一句任务提问、五段工作流和大幅真实预览组成。当前工具的策展判断位于预览旁；关联工具位于预览下缘但不覆盖截图内容。下一工具、访问网站和详情均为原生链接或按钮。

移动端不缩小整个地图，而按「任务横滑 → 完整预览 → 工具名 → 策展判断」排列。长中文自然换行，预览以完整辨识为先，不为了填满而裁掉工具标题。

## Elevation & Depth

工作台保持平面，预览使用柔和的偏移阴影形成空间。不要同时给所有区域加粗边框和阴影。关联工具在工作台实底上，不使用玻璃模糊层遮住真实截图。

## Shapes

预览为 4px 小圆角，步进与访问按钮为 44px 圆形触控区，工作流节点为小圆点。不使用统一圆角卡片、左侧彩色竖条或装饰性轨道。

## Components

### Workflow Rail
五个任务节点以细线连接，当前节点有黄色实心圆、文字和 `aria-pressed`。小屏横向滚动，不压缩成无法阅读的五列。

### Tool Scene
真实预览随工具切换，保持清晰。预览链接进入详情，相关工具横向可扫，当前策展判断与预览同场更新。工具链使用真实缩略图与当前工具高亮，不再只显示一排小文字。

### Explorer Navigation
在探索区内，左右方向键切换工具，上下方向键切换工作流，Home / End 到首尾。主题切换覆盖首页、页头页脚、缩略图、策展判断和控件，不停留在元数据或单色替换。

### Curator Judgment
始终保留 when、replaces、caveat 三段，标签与原文分离。中文和英文长文本自然展开，不用灰色整段注释掩盖重点。

### Index and Shuffle
索引可从任意工具回到正确工作流；随机 seed 同时还原工具和任务路径，允许复制链接与回到策展路径。

## Do's and Don'ts

### Do:
- **Do** 从任务而非工具数量组织新页面。
- **Do** 让真实预览、策展评论和当前工具保持同步。
- **Do** 在桌面、手机、双语和低动态环境验证探索与访问。

### Don't:
- **Don't** 把 Wayfinder 退回大标题加工具卡片列表。
- **Don't** 复制参考网站的配色、发光边框或商品营销 hero。
- **Don't** 用绝对定位、透明动画或大幅裁切挡住预览与操作。
