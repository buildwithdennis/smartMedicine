import api from './axios';

export interface Level {
  id: string;
  name: string;
  order: number;
  is_active: boolean;
}

export interface Course {
  id: string;
  name: string;
  level: string;
  code: string;
  is_active: boolean;
}

export interface Discipline {
  id: string;
  name: string;
  course: string;
  is_active: boolean;
}

export const curriculumService = {
  getLevels: async (): Promise<Level[]> => {
    const response = await api.get<any>('/curriculum/levels/');
    return response.data.results || response.data;
  },
  getCourses: async (levelId?: string): Promise<Course[]> => {
    const params = levelId ? { level: levelId } : {};
    const response = await api.get<any>('/curriculum/courses/', { params });
    return response.data.results || response.data;
  },
  getDisciplines: async (courseId?: string): Promise<Discipline[]> => {
    const params = courseId ? { course: courseId } : {};
    const response = await api.get<any>('/curriculum/disciplines/', { params });
    return response.data.results || response.data;
  },
};
