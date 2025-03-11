
import { Clock, MapPin, User, X } from "lucide-react";
import { ClassSchedule } from "../../types/timetable";

interface ClassItemProps {
  classItem: ClassSchedule;
  onDelete: (id: string) => Promise<void>;
}

const ClassItem = ({ classItem, onDelete }: ClassItemProps) => {
  return (
    <div 
      className="flex items-center p-3 rounded-lg" 
      style={{ backgroundColor: `${classItem.color}20` }}
    >
      <div className="mr-3 h-full">
        <div 
          className="w-1 h-full rounded-full self-stretch" 
          style={{ backgroundColor: classItem.color }}
        ></div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{classItem.class_name}</h4>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          <span>
            {classItem.start_time} - {classItem.end_time}
          </span>
        </div>
        {classItem.location && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{classItem.location}</span>
          </div>
        )}
        {classItem.teacher && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <User className="w-3 h-3 mr-1" />
            <span>{classItem.teacher}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => classItem.id && onDelete(classItem.id)}
        className="text-gray-500 hover:text-gray-700 p-1"
        type="button"
        aria-label="Delete class"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ClassItem;
