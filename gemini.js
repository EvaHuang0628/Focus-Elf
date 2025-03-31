import { GoogleGenAI } from "@google/genai";

// 尝试从多个来源获取API密钥
// 1. 首先尝试从localStorage获取（适用于GitHub Pages等静态托管环境）
// 2. 如果没有，则尝试使用硬编码的API密钥（部署前需要手动设置）
let apiKey = "";

// 检查是否在浏览器环境中
if (typeof window !== 'undefined' && window.localStorage) {
  // 从localStorage获取API密钥
  apiKey = window.localStorage.getItem('gemini_api_key') || "";
}

// 如果需要，可以在这里设置一个硬编码的API密钥（仅用于部署到GitHub Pages）
// apiKey = apiKey || "YOUR_API_KEY_HERE";

const ai = new GoogleGenAI({ apiKey: apiKey });

async function generateSmartTasks(goal) {
  try {
    console.log("Generating tasks for goal:", goal);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
你是一位专业的项目拆解专家，擅长将大目标分解成符合SMART原则的小目标。SMART原则指的是：
- Specific（具体的）：目标应该清晰明确，避免模糊不清。
- Measurable（可衡量的）：目标应该能够量化，可以通过数据或指标来评估完成情况。
- Achievable（可实现的）：目标应该在现有资源和能力范围内可以实现。
- Relevant（相关的）：目标应该与整体目标相关联，能够为整体目标的实现做出贡献。
- Time-bound（有时限的）：目标应该有明确的完成时间限制。

请将以下大目标分解成不超过10个符合SMART原则的小目标：

${goal}

请以如下格式返回，不要任何其他的解释性文字或前缀，仅返回一个JSON数组，数组中的每一个元素是一个SMART目标字符串，长度不超过10个字。
[
    "小目标1",
    "小目标2",
    "小目标3",
    "小目标4",
    "小目标5"
]`,
    });
    console.log("Response:", response);
    console.log("Response text:", response.text);

    // 处理可能包含Markdown格式的响应文本
    const responseText = response.text;

    // 更健壮地处理响应文本
    let jsonString = responseText.trim();

    // 移除Markdown代码块标记（如果有）
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7); // 移除前7个字符 '```json'
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3); // 移除后3个字符 '```'
    }

    // 尝试解析JSON
    return JSON.parse(jsonString);
  } catch (error) {
    // console.log(error);
    // console.error('Error generating tasks:', error);
    return [
      '理解基本概念和原理',
      '学习核心技术和方法',
      '完成相关练习和实践',
      '进行知识总结和复习',
      '完成测试和评估'
    ];
  }
}

// 导出函数到GeminiModule对象
export { generateSmartTasks };