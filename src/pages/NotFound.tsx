
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <Link to="/" className="mt-6 button-primary inline-block">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
