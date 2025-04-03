
import React from 'react';
import { Edit, Trash, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface StudySession {
  id: string;
  module_id: string | null;
  duration: number;
  date: string;
  notes?: string;
}

interface Module {
  id: string;
  module_code?: string;
  module_title?: string;
  code?: string;
  name?: string;
}

interface StudySessionsListProps {
  sessions: StudySession[];
  modules: Module[];
  onEdit: (session: StudySession) => void;
  onDelete: (id: string) => void;
}

const StudySessionsList: React.FC<StudySessionsListProps> = ({
  sessions,
  modules,
  onEdit,
  onDelete
}) => {
  const getModuleName = (moduleId: string | null) => {
    if (!moduleId) return 'General Study';
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 'Unknown Module';
    
    // Handle both types of module objects
    const code = module.module_code || module.code || '';
    const title = module.module_title || module.name || '';
    return `${code}: ${title}`;
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'm' : ''}`;
    }
    return `${minutes}m`;
  };
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No study sessions recorded yet. Log one to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900">{getModuleName(session.module_id)}</h3>
                <span className="ml-2 flex items-center text-gray-500 text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(session.duration)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{formatDate(session.date)}</p>
              {session.notes && <p className="mt-2 text-gray-600 text-sm">{session.notes}</p>}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEdit(session)}
                className="p-1 text-gray-500 hover:text-primary transition-colors"
                aria-label="Edit session"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(session.id)}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Delete session"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudySessionsList;
