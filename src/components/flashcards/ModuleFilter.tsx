
import React from 'react';

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

interface ModuleFilterProps {
  modules: Module[];
  activeModule: string | null;
  onModuleChange: (moduleId: string | null) => void;
}

const ModuleFilter: React.FC<ModuleFilterProps> = ({ modules, activeModule, onModuleChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="module-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Module
      </label>
      <select
        id="module-filter"
        value={activeModule || ''}
        onChange={(e) => onModuleChange(e.target.value || null)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">All Flashcards</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.module_code}: {module.module_title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleFilter;
