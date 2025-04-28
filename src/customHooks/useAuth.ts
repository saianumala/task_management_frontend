import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
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

  return { isAuthenticated, user, loading };
}
