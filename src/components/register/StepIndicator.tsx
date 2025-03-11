
import React from "react";
import { Step } from "../../hooks/useRegistrationForm";

interface StepIndicatorProps {
  currentStep: Step;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  if (currentStep === "welcome" || currentStep === "complete") return null;
  
  const steps: Step[] = ["account", "department", "course", "details", "modules", "complete"];
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="mb-4 flex justify-center">
      <div className="flex space-x-2">
        {steps.slice(0, 6).map((step, index) => (
          <div 
            key={step}
            className={`w-2 h-2 rounded-full ${
              index <= currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
