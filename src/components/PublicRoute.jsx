import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        // If logged in, don't let them see Login/Register, send to Dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;