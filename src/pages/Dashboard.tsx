
import { Link } from "react-router-dom";
import { ListTodo } from "lucide-react";
import MobileLayout from "../components/layouts/MobileLayout";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import QuickActions from "../components/dashboard/QuickActions";
import { useAuth } from "../contexts/AuthContext";
import Timetable from "../components/dashboard/Timetable";
import { motion } from "framer-motion";
import { TimetableProvider } from "../contexts/TimetableContext";

const Dashboard = () => {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MobileLayout title="Dashboard">
      <div className="px-4 py-6 bg-background">
        <motion.div 
          className="mb-6"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's your study overview for today</p>
        </motion.div>

        <motion.div 
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <TimetableProvider>
            <motion.div variants={item}>
              <TodaySchedule />
            </motion.div>
            
            <motion.div variants={item}>
              <QuickActions />
            </motion.div>
            
            <motion.div variants={item}>
              <Timetable />
            </motion.div>
          </TimetableProvider>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex justify-center"
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/tasks" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Manage Tasks
          </Link>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
