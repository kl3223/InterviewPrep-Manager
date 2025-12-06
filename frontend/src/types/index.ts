// 面试题库类型
export interface InterviewQuestion {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: string; // 未学 / 已掌握 / 需要复习 / 重要
  tags?: string;
  created_at: string;
  updated_at?: string;
}

export interface InterviewQuestionCreate {
  title: string;
  description?: string;
  category: string;
  status: string;
  tags?: string;
}

export interface InterviewQuestionUpdate {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  tags?: string;
}

// 知识点库类型
export interface KnowledgePoint {
  id: number;
  title: string;
  content: string; // Markdown
  category: string;
  status: string; // 未学 / 掌握 / 重看
  starred: boolean;
  created_at: string;
  updated_at?: string;
}

export interface KnowledgePointCreate {
  title: string;
  content?: string;
  category: string;
  status: string;
  starred?: boolean;
}

export interface KnowledgePointUpdate {
  title?: string;
  content?: string;
  category?: string;
  status?: string;
  starred?: boolean;
}

// 刷题题库类型
export interface CodingQuestion {
  id: number;
  title: string;
  category: string;
  status: string; // 未做 / 已做 / 复盘
  source_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface CodingQuestionCreate {
  title: string;
  category: string;
  status: string;
  source_url?: string;
}

export interface CodingQuestionUpdate {
  title?: string;
  category?: string;
  status?: string;
  source_url?: string;
}

// 仪表盘统计类型
export interface DashboardStats {
  interview_questions: {
    total: number;
    status_counts: Record<string, number>;
  };
  knowledge_points: {
    total: number;
    status_counts: Record<string, number>;
    starred_count: number;
  };
  coding_questions: {
    total: number;
    status_counts: Record<string, number>;
  };
  overall: {
    total_items: number;
    completed_items: number;
    completion_rate: number;
  };
}

// 今日任务类型
export interface TodayTask {
  id: number;
  title: string;
  category: string;
}

export interface TodayTasks {
  interview_questions: TodayTask[];
  knowledge_points: TodayTask[];
  coding_questions: TodayTask[];
}