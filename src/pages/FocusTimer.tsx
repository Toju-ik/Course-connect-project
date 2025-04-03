
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { useUserModules } from '../hooks/useUserModules';
import { useGamification } from '../hooks/useGamification';
import TimerControls from '../components/focus-timer/TimerControls';
import DurationSelector from '../components/focus-timer/DurationSelector';
import MotivationalTip from '../components/focus-timer/MotivationalTip';
import CoinsDisplay from '../components/focus-timer/CoinsDisplay';
import GamificationDisplay from '../components/focus-timer/GamificationDisplay';
import TimerIllustration from '../components/focus-timer/TimerIllustration';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FocusTimer: React.FC = () => {
  const {
    formattedTime,
    status,
    coins,
    activeModule,
    setActiveModule,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateDuration,
  } = useFocusTimer();

  const { userModules, isLoading: modulesLoading } = useUserModules();
  const { coins: totalCoins, streak } = useGamification();
  const [showModuleSelect, setShowModuleSelect] = useState(false);


  useEffect(() => {
    setShowModuleSelect(status === 'idle');
  }, [status]);

  const handleModuleChange = (moduleId: string) => {
    console.log('Module selected:', moduleId);
    setActiveModule(moduleId || null);
  };

  return (
    <MobileLayout title="Focus Timer">
      <div className="py-4 bg-gradient-to-b from-white to-blue-50">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6 text-primary">Focus Timer</h1>
            
            {}
            <GamificationDisplay coins={totalCoins} streak={streak} />
            
            <div className="flex justify-center mt-6">
              <motion.div 
                className="w-64 h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/5 rounded-full shadow-inner"
                animate={{
                  boxShadow: status === 'running' ? 
                    '0 0 0 10px rgba(59, 130, 246, 0.1), 0 0 0 20px rgba(59, 130, 246, 0.05)' : 
                    'inset 0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <span className="text-5xl font-bold text-gray-900">{formattedTime}</span>
              </motion.div>
            </div>
            
            <TimerControls
              status={status}
              onStart={startTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onStop={stopTimer}
            />
            
            <MotivationalTip isVisible={status === 'paused'} />
            
            {}
            <TimerIllustration isVisible={status === 'idle' || status === 'completed'} />
            
            {}
            {showModuleSelect && (
              <div className="mt-6 mb-4">
                <label htmlFor="module-select" className="block text-sm font-medium text-gray-700 mb-2">
                  What are you studying? (Optional)
                </label>
                <Select 
                  value={activeModule || ""} 
                  onValueChange={handleModuleChange}
                >
                  <SelectTrigger id="module-select" className="w-full">
                    <SelectValue placeholder="Select a module (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Study</SelectItem>
                    {userModules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.code}: {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This will help track which modules you spend time studying
                </p>
              </div>
            )}
            
            <DurationSelector 
              disabled={status !== 'idle'} 
              onSelectDuration={updateDuration} 
            />
            
            {status === 'completed' && <CoinsDisplay coins={coins} />}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default FocusTimer;
