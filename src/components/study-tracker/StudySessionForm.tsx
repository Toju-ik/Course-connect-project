
import React, { useState, useEffect } from 'react';
import { useUserModules } from '../../hooks/useUserModules';
import { Module } from '../../types/module';

interface StudySessionFormProps {
  modules: Module[];
  initialData?: {
    id?: string;
    module_id: string | null;
    duration: number;
    date: string;
    notes?: string;
  };
  onSubmit: (moduleId: string | null, duration: number, date: string, notes?: string) => void;
  onCancel: () => void;
}

const StudySessionForm: React.FC<StudySessionFormProps> = ({
  modules,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [moduleId, setModuleId] = useState<string | null>(initialData?.module_id || null);
  const [duration, setDuration] = useState(initialData?.duration || 30);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  // Get the latest modules directly from the hook to ensure we have semester-filtered modules
  const { userModules, userProfile } = useUserModules();
  
  useEffect(() => {
    if (initialData) {
      setModuleId(initialData.module_id);
      setDuration(initialData.duration);
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);
  
  // Log current semester and available modules for debugging
  useEffect(() => {
    if (userProfile) {
      console.log("Current user semester in form:", userProfile.semester);
      console.log("Available modules in form:", userModules);
    }
  }, [userProfile, userModules]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(moduleId, duration, date, notes);
  };
  
  // Use the modules passed from props first, but if we have direct access to filtered modules, use those
  const displayModules = userModules.length > 0 ? userModules : modules;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
          Module
        </label>
        <select
          id="module"
          value={moduleId || ''}
          onChange={(e) => setModuleId(e.target.value || null)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">General Study</option>
          {displayModules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.code}: {module.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
          Duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          min="5"
          step="5"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
          placeholder="Add notes about what you studied"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
        >
          {initialData?.id ? 'Update' : 'Log'} Study Session
        </button>
      </div>
    </form>
  );
};

export default StudySessionForm;
