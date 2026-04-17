export interface SkillData {
  id: string;
  name: string;
  description: string;
  category: {
    key: string;
    label: string;
    color: string;
    gradient: string;
    icon: string;
  };
  stats: {
    lineCount: number;
    charCount: number;
    sectionCount: number;
    codeBlockCount: number;
    complexityScore: number;
    complexityLabel: string;
    readTime: string;
  };
  triggerPhrases: string[];
  useCases: {
    icon: string;
    title: string;
    description: string;
  }[];
  keyFeatures: string[];
  installCommand: string | null;
  content: string;
  fileInfo: {
    totalFiles: number;
    totalSizeStr: string;
    tree: {
      name: string;
      type: string;
      children?: Array<{
        name: string;
        type: string;
        size?: number;
        ext?: string;
        children?: Array<{
          name: string;
          type: string;
          size?: number;
          ext?: string;
        }>;
      }>;
    };
  };
  lastUpdated: string;
  assets: {
    screenshots: string[];
    samples: string[];
    systemJson?: any;
  };
}
