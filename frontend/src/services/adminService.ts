import api from '../api/axios';

export interface AdminStats {
  total_students: number;
  total_courses: number;
  total_questions: number;
  active_sessions: number;
  completion_rate: number;
}

export interface AdminStudent {
  id: number;
  username: string;
  email: string;
  registration_id: string;
  role: string;
  level_name: string;
  date_joined: string;
}

export interface AdminActivity {
  id: number;
  user_name: string;
  session_type: string;
  status: string;
  level_name: string;
  course_name: string;
  total_questions: number;
  score: number;
  start_time: string;
  end_time: string | null;
}

const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats/');
    return response.data;
  },

  getStudents: async (): Promise<AdminStudent[]> => {
    const response = await api.get('/admin/students/');
    return response.data; // Note: if paginated, handle accordingly
  },

  getActivity: async (): Promise<AdminActivity[]> => {
    const response = await api.get('/admin/activity/');
    return response.data; // Note: if paginated, handle accordingly
  },

  // Extension points for curriculum and questions
  getQuestions: async (params?: any) => {
    const response = await api.get('/questions/', { params });
    return response.data;
  },

  // Curriculum - Levels
  createLevel: async (data: any) => {
    const response = await api.post('/curriculum/levels/', data);
    return response.data;
  },
  updateLevel: async (id: string, data: any) => {
    const response = await api.patch(`/curriculum/levels/${id}/`, data);
    return response.data;
  },
  deleteLevel: async (id: string) => {
    await api.delete(`/curriculum/levels/${id}/`);
  },

  // Curriculum - Courses
  createCourse: async (data: any) => {
    const response = await api.post('/curriculum/courses/', data);
    return response.data;
  },
  updateCourse: async (id: string, data: any) => {
    const response = await api.patch(`/curriculum/courses/${id}/`, data);
    return response.data;
  },
  deleteCourse: async (id: string) => {
    await api.delete(`/curriculum/courses/${id}/`);
  },

  // Curriculum - Disciplines
  createDiscipline: async (data: any) => {
    const response = await api.post('/curriculum/disciplines/', data);
    return response.data;
  },
  updateDiscipline: async (id: string, data: any) => {
    const response = await api.patch(`/curriculum/disciplines/${id}/`, data);
    return response.data;
  },
  deleteDiscipline: async (id: string) => {
    await api.delete(`/curriculum/disciplines/${id}/`);
  },

  getCurriculumStructure: async () => {
    const response = await api.get('/curriculum/levels/');
    return response.data;
  }
};

export default adminService;
