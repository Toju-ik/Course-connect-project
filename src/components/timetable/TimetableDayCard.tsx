
import { Calendar } from "lucide-react";
import { ClassSchedule } from "../../types/timetable";
import ClassItem from "./ClassItem";
import { motion } from "framer-motion";

interface TimetableDayCardProps {
  day: string;
  classes: ClassSchedule[];
  onDelete: (id: string) => Promise<void>;
}

const TimetableDayCard = ({ day, classes, onDelete }: TimetableDayCardProps) => {
  return (
    <motion.div 
      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="font-medium text-primary mb-3">{day}</h3>
      
      {classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ClassItem 
                classItem={cls} 
                onDelete={onDelete} 
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="text-center py-8 px-4 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No classes scheduled</p>
          <p className="text-xs text-gray-400 mt-1">Add a class to get started</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TimetableDayCard;
