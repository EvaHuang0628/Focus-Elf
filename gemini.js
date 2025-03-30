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

const ai = new GoogleGenAI({ apiKey });

async function generateSmartTasks(goal) {
  try {
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
    // 处理可能包含Markdown格式的响应文本
    const responseText = response.text;
    // 移除可能存在的Markdown代码块标记
    const cleanedText = responseText.replace(/^```json\s*|\s*```$/g, '');
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating tasks:', error);
    return DEFAULT_TASKS;
  }
}

// 导出函数，使其可以在其他地方使用
export { generateSmartTasks };