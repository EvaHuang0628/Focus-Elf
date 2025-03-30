// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";

// 从localStorage获取API密钥
let API_KEY = "";

// 检查是否在浏览器环境中
if (typeof window !== 'undefined' && window.localStorage) {
  // 从localStorage获取API密钥
  API_KEY = window.localStorage.getItem('gemini_api_key') || "";
}

// 如果需要，可以在这里设置一个硬编码的API密钥（仅用于部署到GitHub Pages）
// API_KEY = API_KEY || "YOUR_API_KEY_HERE";

export async function generateAndDisplayTasks(goal) {
  const templates = {
    'data mining': [
      '学习数据预处理和特征工程基础',
      '掌握决策树(Decision Tree)算法原理和实现',
      '学习神经网络(Neural Network)基础概念和应用',
      '理解模型评估方法和指标',
      '完成分类算法相关练习和测试'
    ],
    'default': [
      '理解基本概念和原理',
      '学习核心技术和方法',
      '完成相关练习和实践',
      '进行知识总结和复习',
      '完成测试和评估'
    ]
  };

  const goalLower = goal.toLowerCase();

  // 优先使用预设模板
  for (const [key, tasks] of Object.entries(templates)) {
    if (goalLower.includes(key)) {
      console.log(`Using template for: ${key}`); // 添加日志，方便调试
      return tasks;
    }
  }

  // 如果没有匹配的模板，则调用 Gemini API
  console.log("No matching template found. Calling Gemini API..."); // 添加日志

  // 检查是否设置了 API 密钥，如果没有，则返回默认值
  if (!API_KEY || API_KEY === "YOUR_API_KEY") {
    console.warn("Gemini API Key is not set. Returning default tasks.");
    return templates["default"];
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getModel({ model: "gemini-pro" });

  const prompt = `
你是一位专业的项目拆解专家，擅长将大目标分解成符合SMART原则的小目标。SMART原则指的是：
- Specific（具体的）：目标应该清晰明确，避免模糊不清。
- Measurable（可衡量的）：目标应该能够量化，可以通过数据或指标来评估完成情况。
- Achievable（可实现的）：目标应该在现有资源和能力范围内可以实现。
- Relevant（相关的）：目标应该与整体目标相关联，能够为整体目标的实现做出贡献。
- Time-bound（有时限的）：目标应该有明确的完成时间限制。

请将以下大目标分解成5个符合SMART原则的小目标：

${goal}

请以如下格式返回，不要任何其他的解释性文字或前缀，仅返回一个JSON数组，数组中的每一个元素是一个SMART目标字符串。
[
    "小目标1",
    "小目标2",
    "小目标3",
    "小目标4",
    "小目标5"
]
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 尝试解析JSON
    try {
      const tasks = JSON.parse(responseText);
      if (Array.isArray(tasks) && tasks.every(item => typeof item === 'string')) {
        return tasks;
      } else {
        console.error("Gemini API returned an invalid JSON format. Raw response:", responseText);
        return ["Invalid response from Gemini API"]; // 或者返回一个默认的任务列表，或抛出错误
      }
    } catch (error) {
      console.error("Error parsing JSON from Gemini API response:", error, "Raw response:", responseText);
      return ["Error parsing response from Gemini API"]; // 或者返回一个默认的任务列表，或抛出错误
    }


  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return ["Error calling Gemini API"]; // 或者返回一个默认的任务列表，或抛出错误
  }
}

window.generateAndDisplayTasks = generateAndDisplayTasks;