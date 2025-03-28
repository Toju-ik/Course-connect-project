import React from "react";
import MobileLayout from "../components/layouts/MobileLayout";
import TaskBoard from "../components/dashboard/TaskBoard";
import { TimetableProvider } from "../contexts/TimetableContext";
import { useTasks } from "../hooks/useTasks";
import TaskStats from "../components/dashboard/TaskStats";
import TasksBreadcrumb from "../components/dashboard/TasksBreadcrumb";
import TasksLoader from "../components/dashboard/TasksLoader";
import { Card, CardContent } from "@/components/ui/card";

const Tasks: React.FC = () => {
  const {
    tasks,
    userModules,
    isLoading,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasks();

  return (
    <MobileLayout title="Tasks">
      <div className="min-h-screen px-4 py-6 flex flex-col gap-6">
        {/* Default white task bar */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="py-6 px-5 space-y-4">
            <TasksBreadcrumb />
            <TaskStats tasks={tasks} />
          </CardContent>
        </Card>

        {/* Task board section */}
        <div className="flex-1">
          {isLoading ? (
            <TasksLoader />
          ) : (
            <Card className="h-full shadow-sm rounded-2xl animate-fade-in overflow-hidden">
              <CardContent className="p-4 sm:p-6 h-full overflow-y-auto bg-white">
                <TimetableProvider>
                  <TaskBoard
                    tasks={tasks}
                    onCreateTask={handleCreateTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    modules={userModules}
                  />
                </TimetableProvider>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Tasks;
