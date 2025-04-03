
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Module } from "../../../types/module";

interface ModuleSearchModalProps {
  modules: Module[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectModule: (moduleId: string) => void;
  onClose: () => void;
}

const ModuleSearchModal = ({
  modules,
  searchQuery,
  onSearchChange,
  onSelectModule,
  onClose,
}: ModuleSearchModalProps) => {
  // Create a deduplicated list of modules using a Map with ID as the key
  const uniqueModules = Array.from(
    modules.reduce((map, module) => {
      map.set(module.id, module);
      return map;
    }, new Map<string, Module>()).values()
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-slide-up-sheet">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Select Module</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search modules..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-[40vh] overflow-y-auto">
          {uniqueModules.length > 0 ? (
            uniqueModules.map(module => (
              <div
                key={module.id}
                className="p-4 hover:bg-gray-100 active:bg-gray-200 cursor-pointer border-b border-gray-100"
                onClick={() => onSelectModule(module.id)}
              >
                <div className="font-medium">{module.code}</div>
                <div className="text-sm text-gray-600 truncate">{module.name}</div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No modules found
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <Button
            type="button"
            className="w-full h-12"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleSearchModal;
