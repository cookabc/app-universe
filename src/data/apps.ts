import {
  Calendar,
  GraduationCap,
  Image,
  Keyboard,
  Languages,
  TrendingUp,
} from "lucide-react";

type AppData = {
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  color: string;
  path: string;
  icon: React.ComponentType<any>;
};

const apps: AppData[] = [
  {
    name: {
      en: "Image Generator",
      zh: "图像生成器",
    },
    description: {
      en: "Create stunning images from text prompts",
      zh: "从文本提示创建令人惊叹的图像",
    },
    color: "#c83b82",
    path: "/image-generator",
    icon: Image,
  },
  {
    name: {
      en: "Language Converter",
      zh: "语言转换器",
    },
    description: {
      en: "Convert text between different languages",
      zh: "在不同语言之间转换文本",
    },
    color: "#F7B731",
    path: "/lang-converter",
    icon: Languages,
  },
  {
    name: {
      en: "Typing Practice",
      zh: "打字练习",
    },
    description: {
      en: "Improve your typing skills with interactive practice",
      zh: "通过互动练习提高您的打字技能",
    },
    color: "#3B82F6",
    path: "/typing-practice",
    icon: Keyboard,
  },

  {
    name: {
      en: "DueKeep",
      zh: "截止日期提醒",
    },
    description: {
      en: "Event countdown and calendar management",
      zh: "事件倒计时和日历管理",
    },
    color: "#10b981",
    path: "/duekeep",
    icon: Calendar,
  },
  {
    name: {
      en: "AGI School",
      zh: "AGI 学校",
    },
    description: {
      en: "Complete education platform with courses",
      zh: "完整的教育平台，包含课程",
    },
    color: "#f97316",
    path: "/agischool",
    icon: GraduationCap,
  },
  {
    name: {
      en: "Real-time Fund",
      zh: "实时基金",
    },
    description: {
      en: "Track and manage your fund portfolio",
      zh: "跟踪和管理您的基金投资组合",
    },
    color: "#ef4444",
    path: "/realtime-fund",
    icon: TrendingUp,
  },
];
export default apps;
