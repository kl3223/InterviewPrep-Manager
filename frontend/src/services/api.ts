import axios from 'axios';
import {
  InterviewQuestion,
  InterviewQuestionCreate,
  InterviewQuestionUpdate,
  KnowledgePoint,
  KnowledgePointCreate,
  KnowledgePointUpdate,
  CodingQuestion,
  CodingQuestionCreate,
  CodingQuestionUpdate,
  DashboardStats,
  TodayTasks
} from '../types';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

// 面试题库 API
export const interviewQuestionApi = {
  getAll: (params?: any) => api.get<InterviewQuestion[]>('/interview-questions', { params }),
  getById: (id: number) => api.get<InterviewQuestion>(`/interview-questions/${id}`),
  create: (data: InterviewQuestionCreate) => api.post<InterviewQuestion>('/interview-questions', data),
  update: (id: number, data: InterviewQuestionUpdate) => api.put<InterviewQuestion>(`/interview-questions/${id}`, data),
  delete: (id: number) => api.delete(`/interview-questions/${id}`),
};

// 知识点库 API
export const knowledgePointApi = {
  getAll: (params?: any) => api.get<KnowledgePoint[]>('/knowledge-points', { params }),
  getById: (id: number) => api.get<KnowledgePoint>(`/knowledge-points/${id}`),
  create: (data: KnowledgePointCreate) => api.post<KnowledgePoint>('/knowledge-points', data),
  update: (id: number, data: KnowledgePointUpdate) => api.put<KnowledgePoint>(`/knowledge-points/${id}`, data),
  delete: (id: number) => api.delete(`/knowledge-points/${id}`),
  toggleStar: (id: number) => api.patch(`/knowledge-points/${id}/star`),
};

// 刷题题库 API
export const codingQuestionApi = {
  getAll: (params?: any) => api.get<CodingQuestion[]>('/coding-questions', { params }),
  getById: (id: number) => api.get<CodingQuestion>(`/coding-questions/${id}`),
  create: (data: CodingQuestionCreate) => api.post<CodingQuestion>('/coding-questions', data),
  update: (id: number, data: CodingQuestionUpdate) => api.put<CodingQuestion>(`/coding-questions/${id}`, data),
  delete: (id: number) => api.delete(`/coding-questions/${id}`),
};

// 仪表盘 API
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  getTodayTasks: () => api.get<TodayTasks>('/dashboard/today-tasks'),
};

export default api;