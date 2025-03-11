
import React, { useState } from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useStudySessions } from '../hooks/useStudySessions';
import StudyChart from '../components/study-tracker/StudyChart';
import StudySessionsList from '../components/study-tracker/StudySessionsList';
import StudySessionForm from '../components/study-tracker/StudySessionForm';
import StudyIllustration from '../components/study-tracker/StudyIllustration';
import { Plus } from 'lucide-react';

interface StudySession {
  id: string;
  module_id: string | null;
  duration: number;
  date: string;
  notes?: string;
}

const StudyTracker: React.FC = () => {
  const {
    sessions,
    modules,
    isLoading,
    createStudySession,
    updateStudySession,
    deleteStudySession
  } = useStudySessions();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  
  const handleEditSession = (session: StudySession) => {
    setEditingSession(session);
    setShowForm(true);
  };
  
  const handleFormSubmit = async (moduleId: string | null, duration: number, date: string, notes?: string) => {
    if (editingSession) {
      await updateStudySession(editingSession.id, moduleId, duration, date, notes);
      setEditingSession(null);
    } else {
      await createStudySession(moduleId, duration, date, notes);
    }
    setShowForm(false);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSession(null);
  };
  
  return (
    <MobileLayout title="Study Tracker">
      <div className="py-4">
        <div className="w-full">
          {/* Hero Section with Illustration */}
          <div className="mb-8">
            <StudyIllustration />
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold">Study Tracker</h1>
              <button
                onClick={() => setShowForm(true)}
                disabled={showForm}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Study Session
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading study data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {editingSession ? 'Edit Study Session' : 'Log Study Session'}
                  </h2>
                  <StudySessionForm
                    modules={modules}
                    initialData={editingSession || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                  />
                </div>
              )}
              
              <StudyChart sessions={sessions} modules={modules} />
              
              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4">Recent Sessions</h2>
                <StudySessionsList
                  sessions={sessions}
                  modules={modules}
                  onEdit={handleEditSession}
                  onDelete={deleteStudySession}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default StudyTracker;
