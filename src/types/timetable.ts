export interface ClassSchedule {
  id?: string;
  class_name: string;
  teacher: string;
  location: string;
  day: string;
  start_time: string;
  end_time: string;
  color: string;
  module_id?: string;
}

export interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

export interface UserProfile {
  course_id: string;
  academic_year: string;
  semester: string;
}

export interface ColorOption {
  name: string;
  value: string;
}

export const colorOptions: ColorOption[] = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
];
