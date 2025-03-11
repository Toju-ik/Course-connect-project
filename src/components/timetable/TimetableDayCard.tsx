
import { Calendar } from "lucide-react";
import { ClassSchedule } from "../../types/timetable";
import ClassItem from "./ClassItem";

interface TimetableDayCardProps {
  day: string;
  classes: ClassSchedule[];
  onDelete: (id: string) => Promise<void>;
}

const TimetableDayCard = ({ day, classes, onDelete }: TimetableDayCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-800 mb-3">{day}</h3>
      
      {classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map((cls) => (
            <ClassItem 
              key={cls.id} 
              classItem={cls} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p>No classes scheduled</p>
        </div>
      )}
    </div>
  );
};

export default TimetableDayCard;
