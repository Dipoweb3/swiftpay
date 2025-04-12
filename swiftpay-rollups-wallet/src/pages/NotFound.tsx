
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Button from "@/components/Button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-swiftpay-dark text-white flex flex-col items-center justify-center p-6">
      <Logo className="mb-8" />
      
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">Page not found</p>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button 
          variant="primary" 
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
