import React from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  CheckCircle2, 
  MoreVertical,
  Mail,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

import adminService from '../../services/adminService';
import type { AdminStudent } from '../../services/adminService';

const Students: React.FC = () => {
  const [students, setStudents] = React.useState<AdminStudent[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await adminService.getStudents();
        const studentList = Array.isArray(data) ? data : (data?.results || []);
        setStudents(studentList);
      } catch (error) {
        console.error('Failed to fetch students', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-lexend font-bold text-slate-800 dark:text-white">Student Enrollment</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage accounts and monitor student academic participation.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all active:scale-95 group">
          <UserPlus size={18} /> Enroll New Student
        </button>
      </header>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or registration ID..." 
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             <Filter size={18} /> Level <ChevronDown size={16} />
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Identity</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academic Level</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Participation</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">
                    Mobilizing Student Directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium text-sm italic">
                    No students currently enrolled in the academy.
                  </td>
                </tr>
              ) : (
                students?.map((student) => (
                  <tr key={student.id} className="group hover:bg-slate-50/30 dark:hover:bg-primary-500/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold font-lexend group-hover:scale-110 transition-transform">
                          {student?.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{student?.username || 'Unknown Student'}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12} /> {student?.email || 'No Email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1.5 bg-primary-500/10 text-primary-600 rounded-lg text-xs font-bold uppercase tracking-wider">{student?.level_name || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">ID: {student?.registration_id || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">Joined: {student?.date_joined ? new Date(student.date_joined).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 size={12} />
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
