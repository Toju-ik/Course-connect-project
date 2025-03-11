
import { motion } from "framer-motion";

interface SemesterProps {
  onSelect: (semester: string) => void;
  onBack: () => void;
}

const Semester = ({ onSelect, onBack }: SemesterProps) => {
  const semesters = [
    { id: "Semester 1", name: "Semester 1" },
    { id: "Semester 2", name: "Semester 2" }
  ];

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-6">Select Semester</h2>
      
      <div className="space-y-4">
        {semesters.map((semester) => (
          <button
            key={semester.id}
            className="w-full px-4 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            onClick={() => onSelect(semester.id)}
          >
            <div className="flex items-center">
              <div className="flex-1 text-left">
                <span className="font-medium">{semester.name}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Semester;
