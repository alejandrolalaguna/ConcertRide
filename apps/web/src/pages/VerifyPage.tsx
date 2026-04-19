import { Navigate } from "react-router-dom";

// Magic-link auth has been replaced by password auth.
// This page is no longer routed; redirect to login for any stale links.
export default function VerifyPage() {
  return <Navigate to="/login" replace />;
}
