import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  console.log('ProtectedRoute - isAuthed:', isAuthed, 'path:', window.location.pathname);
  if (!isAuthed) {
    console.log('Redirecting to login from ProtectedRoute');
    return <Navigate to="/login" replace />;
  }
  console.log('ProtectedRoute - rendering children');
  return children;
}
