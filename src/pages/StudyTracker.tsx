
import React, { useState } from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useStudySessions } from '../hooks/useStudySessions';
import { useUserModules } from '../hooks/useUserModules';
import StudyChart from '../components/study-tracker/StudyChart';
import StudySessionsList from '../components/study-tracker/StudySessionsList';
import StudySessionForm from '../components/study-tracker/StudySessionForm';
import StudyIllustration from '../components/study-tracker/StudyIllustration';
import { Plus, RefreshCw, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Module } from '../types/module';

interface StudySession {
  id: string;
  module_id: string | null;
  duration: number;
  date: string;
  notes?: string;
}

const convertModules = (hookModules: any[]): Module[] => {
  return hookModules.map(module => ({
    id: module.id,
    code: module.module_code || module.code || '',
    name: module.module_title || module.name || ''
  }));
};

const StudyTracker: React.FC = () => {
  const {
    sessions,
    modules: hookModules,
    isLoading,
    stats,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    refreshSessions
  } = useStudySessions();
  
  const { userModules } = useUserModules();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  
  const handleEditSession = (session: StudySession) => {
    setEditingSession(session);
    setShowForm(true);
  };
  
  const handleFormSubmit = async (moduleId: string | null, duration: number, date: string, notes?: string) => {
    try {
      if (editingSession) {
        await updateStudySession(editingSession.id, moduleId, duration, date, notes);
        setEditingSession(null);
        toast.success("Study session updated successfully");
      } else {
        await createStudySession(moduleId, duration, date, notes);
        toast.success("Study session logged successfully");
      }
      setShowForm(false);
      refreshSessions();
    } catch (error) {
      console.error("Error submitting study session:", error);
      toast.error("Failed to save study session");
    }
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSession(null);
  };
  
  const handleRefresh = () => {
    refreshSessions();
    toast.info("Data refreshed");
  };
  
  const manualSessions = sessions;
  
  const standardModules = convertModules(hookModules);
  const displayModules = userModules.length > 0 ? userModules : standardModules;
  
  return (
    <MobileLayout title="Study Tracker">
      <div className="py-4">
        <div className="w-full">
          <div className="mb-8">
            <StudyIllustration />
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold">Study Tracker</h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  disabled={showForm}
                  className="w-full px-4 py-3 bg-primary text-white rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Study Session
                </button>
                <button
                  onClick={handleRefresh}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading study data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold">{stats.totalMinutes}</span>
                  <span className="text-sm text-gray-500">Total Minutes</span>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold">{stats.totalSessions}</span>
                  <span className="text-sm text-gray-500">Total Sessions</span>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">This Week</h3>
                  <p className="text-xl font-semibold">{stats.thisWeekMinutes} minutes</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
                  <p className="text-xl font-semibold">{stats.thisMonthMinutes} minutes</p>
                </div>
              </div>
              
              {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {editingSession ? 'Edit Study Session' : 'Log Study Session'}
                  </h2>
                  <StudySessionForm
                    modules={displayModules}
                    initialData={editingSession || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                  />
                </div>
              )}
              
              <StudyChart sessions={sessions} modules={hookModules} />
              
              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4">Study Sessions</h2>
                {manualSessions.length > 0 ? (
                  <StudySessionsList
                    sessions={manualSessions}
                    modules={hookModules}
                    onEdit={handleEditSession}
                    onDelete={deleteStudySession}
                  />
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-500">No study sessions recorded yet. Start logging sessions to begin tracking your study time!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default StudyTracker;
