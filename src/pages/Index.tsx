
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Users, Calendar } from "lucide-react";

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Organize your academic life with our intuitive course management system",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Work together with classmates on projects and assignments",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Never miss a deadline with our integrated calendar system",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="container-pad pt-20 pb-16 text-center lg:pt-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl"
          >
            Welcome to{" "}
            <span className="relative whitespace-nowrap text-primary">
              <span className="relative">Course Connect</span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700"
          >
            Organize Your University Life - A modern platform designed to enhance your academic journey through seamless collaboration and productivity tools.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex justify-center gap-x-6"
          >
            <a
              href="/register"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center justify-center button-primary"
            >
              Get Started
              <ChevronRight 
                className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </a>
            <a href="/login" className="button-secondary">
              Sign In
            </a>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="container-pad">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need to excel
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Streamline your academic journey with our comprehensive set of tools
            </motion.p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card p-8 transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
