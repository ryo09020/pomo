import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;