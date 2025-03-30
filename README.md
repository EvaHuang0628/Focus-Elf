# ADHD学习助手

这是一个帮助ADHD人群提高学习效率的Web应用，提供任务管理、专注计时器和环境音效等功能。

## 功能特点

- 智能任务拆解：使用Gemini AI将大目标拆解为符合SMART原则的小目标
- 专注计时器：基于番茄工作法的计时器，帮助保持专注
- 环境音效：提供多种白噪音和环境音效，创造专注学习环境
- 可爱宠物：提供视觉陪伴和鼓励

## 部署到GitHub Pages

### 1. 创建GitHub仓库

1. 在GitHub上创建一个新仓库
2. 将本地代码推送到该仓库

```bash
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 2. 配置API密钥

由于GitHub Pages是静态网站托管服务，无法直接使用环境变量，您需要在部署前手动设置API密钥：

**方法1：直接在gemini.js中设置API密钥**

在推送到GitHub之前，编辑gemini.js文件，将您的API密钥直接设置在代码中：

```javascript
const apiKey = "您的API密钥"; // 替换为您的实际API密钥
const ai = new GoogleGenAI({ apiKey });
```

**方法2：使用前端配置页面**

您也可以创建一个简单的配置页面，让用户在使用前输入自己的API密钥，并将其存储在浏览器的localStorage中。

### 3. 启用GitHub Pages

1. 在GitHub仓库页面，点击"Settings"
2. 滚动到"GitHub Pages"部分
3. 在"Source"下拉菜单中选择"main"分支
4. 点击"Save"
5. 等待几分钟，您的网站将在显示的URL上可用

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 注意事项

- 本项目使用Google Gemini API，需要有效的API密钥才能使用智能任务拆解功能
- 如果没有API密钥，应用会使用预设的默认任务模板