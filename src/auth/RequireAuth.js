import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}