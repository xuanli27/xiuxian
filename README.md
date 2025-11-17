# 🐟 摸鱼修仙录 (Moyu Xiuxian Lu)

> **"一人一世一摸鱼，修仙不问队友坑"**
>
> *One person, one lifetime of slacking off; cultivating immortality without worrying about terrible teammates.*

## 📖 项目简介

**摸鱼修仙录** 是一款基于 Web 的**放置类修仙养成游戏 (Idle RPG)**。

它将传统的**修仙玄幻**题材与现代**职场生存**（摸鱼文化）完美融合。玩家作为一名刚入职 "仙欲宗"（Xianyu Sect）的实习生，需要在应对老板（宗主）的绩效考核（天劫）的同时，利用一切办公资源悄悄积累灵气，最终达成 "财务自由"（飞升）的终极目标。

本项目是一个纯前端单页应用 (SPA)，利用 Google Gemini API 生成动态的随机事件、吐槽反馈和职场天劫题目，保证每次游玩的体验都充满新鲜感。

---

## 🚀 核心功能

### 1. 🔮 灵根与心性检测 (Onboarding)
- **手绘灵根**：使用 Canvas 技术，让玩家亲手绘制一笔，通过算法分析线条密度与覆盖率，结合 AI 给出毒舌评价（如“天灵根”或“废材外包”）。
- **问心路**：通过一系列职场价值观测试（如“遇到各种锅怎么甩”），决定玩家的初始心性流派（苟道、卷王、乐子人）。

### 2. 🧘 摸鱼修炼 (Core Loop)
- **工位打坐**：通过粒子动效可视化灵气流转。支持点击加速（主动摸鱼）和后台挂机（被动摸鱼）。
- **离线收益**：利用 `zustand` 持久化存储，玩家关闭浏览器后再次上线，AI 会根据离线时长生成一段幽默的“摸鱼周报”。

### 3. ⚡ 职场天劫 (Tribulation)
- **绩效考核**：当修为达到瓶颈时，触发“天劫”。
- **AI 出题**：调用 Gemini API 生成情境题，将修仙术语与职场危机结合（例：“老板走过来了，你正在看小说，该释放什么神通？A. Alt-Tab瞬移术...”）。
- **晋升机制**：考核通过则职级提升（练气 -> 筑基 -> ... -> 飞升），失败则扣除绩效（修为）并增加心魔值。

### 4. 📜 摸鱼任务榜 (Task Board)
- **每日需求**：随机生成“带薪如厕”、“茶水间八卦”等摸鱼任务。
- **真实模拟**：任务执行带有进度条，模拟“看起来很忙”的状态，完成后奖励灵气与宗门贡献。

### 5. 🏔️ 仙欲宗门体系 (Sect System)
- **3D 身份令牌**：基于 CSS Transform 的 3D 交互式身份卡片。
- **宗门晋升**：从“外门牛马”晋升至“咸鱼宗主”，解锁更多权限。
- **功德阁 (商城)**：消耗贡献点兑换“续命冰美式”、“降噪耳塞”等职场法宝，用于降低心魔或加速修炼。

### 6. 🎒 百宝囊 (Inventory)
- 管理和使用购买的道具，道具具有实际的游戏数值影响（回血、降压）。

---

## 🛠️ 技术栈

*   **Framework**: React 19 + TypeScript
*   **Styling**: Tailwind CSS v4 (Utilizing new 3D transforms & animations)
*   **State Management**: Zustand (with `persist` middleware for local storage)
*   **AI Integration**: Google Gemini API (`gemini-2.5-flash` model) for dynamic content generation.
*   **Visualization**: HTML5 Canvas (Particles & Drawing), CSS3 3D Transforms.
*   **Icons**: Lucide React.

---

## 📦 快速开始

1.  **配置 API Key**:
    本项目依赖 Google Gemini API。请确保环境变量中包含有效的 `API_KEY`。

2.  **安装依赖**:
    *(本项目设计为无构建步骤或通过简单的静态服务器运行，依赖项通过 Import Map 加载)*

3.  **运行**:
    直接启动本地开发服务器指向 `index.html` 即可。

---

## 🌌 宗门设定：仙欲宗 (Xianyu Sect)

*   **宗门宗旨**：“能坐着绝不站着，能躺着绝不坐着。”
*   **最高心法**：《带薪拉屎真经》
*   **门规第一条**：严禁内卷，违者废除修为逐出宗门。
*   **核心资源**：
    *   **灵气 (Qi)**：工作摸鱼时产生的能量，用于提升职级。
    *   **心魔 (Inner Demon)**：工作压力、背锅、加班会导致心魔滋生，过高会导致走火入魔（离职/猝死）。
    *   **贡献 (Gongde)**：通过完成摸鱼任务获得，是宗门的硬通货。

---

## ⚖️ 免责声明

本游戏纯属虚构，请勿在真实老板眼皮底下模仿游戏内的摸鱼行为，否则可能导致真实的“被逐出宗门”（解雇）。