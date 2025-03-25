import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Users, Calendar, Timer, ClipboardList, Settings, Star } from "lucide-react";

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Smart Timetable",
      description: "Plan your classes and study sessions effortlessly with our automated scheduling system.",
    },
    {
      icon: ClipboardList,
      title: "Task Management",
      description: "Stay on top of assignments, projects, and deadlines in one convenient place.",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups, share resources, and collaborate with classmates.",
    },
    {
      icon: BookOpen,
      title: "Flashcards & Study Tracker",
      description: "Create flashcards and track your study progress to maximize efficiency.",
    },
    {
      icon: Timer,
      title: "Focus Timer",
      description: "Boost productivity with the Pomodoro technique and stay focused on your studies.",
    },
    {
      icon: Settings,
      title: "Customizable Preferences",
      description: "Tailor the app to fit your study habits and learning style.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="container-pad pt-20 pb-16 text-center lg:pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl font-display text-6xl font-bold tracking-tight text-primary sm:text-7xl"
          >
            Course Connect
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-2 max-w-3xl text-2xl tracking-tight text-gray-900"
          >
            The Smart Student Companion for{" "}
            <span className="relative whitespace-nowrap text-primary">
              TU Dublin
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-3xl text-lg tracking-tight text-gray-700"
          >
            Organise your coursework, collaborate with classmates, and stay on top of deadlines—all in one place.
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
              Everything You Need in One Place
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-gray-600"
            >
              Designed to help TU Dublin students stay organised, collaborate, and succeed.
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
                className="card p-8 transition-all hover:shadow-md bg-white rounded-lg shadow-lg flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="container-pad">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What TU Dublin Students Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[
              {
                name: "Emily Johnson",
                text: "Course Connect has completely transformed how I organize my university life. The smart timetable feature is a lifesaver!",
              },
              {
                name: "James Smith",
                text: "I love how easy it is to manage tasks and collaborate with classmates. Definitely a must-have for any student.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 bg-gray-100 rounded-lg shadow-lg"
              >
                <p className="text-lg text-gray-700">"{testimonial.text}"</p>
                <div className="mt-4 flex items-center">
                  <Star className="text-yellow-400" />
                  <span className="ml-2 font-semibold text-gray-900">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
