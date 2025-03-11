
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AccountDetailsProps {
  initialValues?: {
    studentId: string;
    password: string;
  };
  onSubmit: (studentId: string, password: string) => void;
}

const AccountDetails = ({ initialValues, onSubmit }: AccountDetailsProps) => {
  const [studentId, setStudentId] = useState(initialValues?.studentId || "");
  const [password, setPassword] = useState(initialValues?.password || "");
  const [confirmPassword, setConfirmPassword] = useState(initialValues?.password || "");
  const [errors, setErrors] = useState({
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [isCheckingId, setIsCheckingId] = useState(false);

  useEffect(() => {
    // Update values if initialValues changes
    if (initialValues) {
      setStudentId(initialValues.studentId || "");
      setPassword(initialValues.password || "");
      setConfirmPassword(initialValues.password || "");
    }
  }, [initialValues]);

  const validate = async () => {
    let newErrors = {
      studentId: !studentId.match(/^B00\d{6}$/)
        ? "Student ID must be in format B00XXXXXX"
        : "",
      password: password.length < 8
        ? "Password must be at least 8 characters"
        : "",
      confirmPassword: password !== confirmPassword
        ? "Passwords do not match"
        : "",
    };

    if (!newErrors.studentId) {
      try {
        setIsCheckingId(true);
        
        // Check if student ID already exists
        const { data: existingUser, error } = await supabase
          .from('profiles')
          .select('student_id')
          .eq('student_id', studentId)
          .single();
          
        if (existingUser) {
          newErrors.studentId = "A user with this Student ID already exists";
        }
      } catch (error) {
        // No user found is good in this case
      } finally {
        setIsCheckingId(false);
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (await validate()) {
      onSubmit(studentId, password);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Account Details</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Student ID (B00XXXXXX)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={`w-full py-3 px-4 bg-gray-100 border border-gray-200 rounded-lg ${errors.studentId ? 'border-red-500' : ''}`}
          />
          {errors.studentId && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.studentId}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter your student ID in the format B00XXXXXX
          </p>
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full py-3 px-4 bg-gray-100 border border-gray-200 rounded-lg ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full py-3 px-4 bg-gray-100 border border-gray-200 rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isCheckingId}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-70"
        >
          {isCheckingId ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              <span>Checking...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default AccountDetails;
