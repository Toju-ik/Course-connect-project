import { Link } from "react-router-dom";
import { ListTodo } from "lucide-react";
import MobileLayout from "../components/layouts/MobileLayout";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import QuickActions from "../components/dashboard/QuickActions";
import { useAuth } from "../contexts/AuthContext";
import Timetable from "../components/dashboard/Timetable";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchRecentActivity = async () => {
      const { data, error } = await supabase
        .from("recent_activity")
        .select("type, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recent activity:", error);
      } else {
        setRecentActivity(data);
      }
    };

    fetchRecentActivity();
  }, [user]);

  return (
    <MobileLayout title="Dashboard">
      <div className="px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">
            Welcome back, {user?.email.split("@")[0]}! 👋
          </h2>
          <p className="text-gray-600">Here's your study overview for today</p>
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-6">
          <TodaySchedule />
          <QuickActions />
          <Timetable />
        </div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-gray-600 text-sm">Your latest updates and progress.</p>

          <div className="mt-4 space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-3 bg-white rounded-md shadow-sm flex items-center justify-between"
                >
                  <p className="text-gray-800 text-sm">{activity.content}</p>
                  <span className="text-gray-500 text-xs">
                    {new Date(activity.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-sm">No recent activity yet.</p>
            )}
          </div>
        </motion.div>

        {/* Manage Tasks Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Manage Tasks
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
