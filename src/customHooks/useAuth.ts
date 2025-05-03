import { useState, useEffect } from "react";

export function useAuth() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // User information
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call backend to verify if user is logged in
        const response = await fetch(
          `${import.meta.env.VITE_BACKENDURL}/api/user/isLoggedIn`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching login status:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Return authentication state for components to use
  return { isAuthenticated, user, loading };
}
