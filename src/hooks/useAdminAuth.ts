"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin token exists in localStorage
    const token = localStorage.getItem("adminToken");
    const tokenExpiry = localStorage.getItem("adminTokenExpiry");

    if (token && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      const currentTime = new Date().getTime();

      if (currentTime < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Token expired, clear storage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpiry");
        setIsAuthenticated(false);
      }
    }

    setIsLoading(false);
  }, []);

  const login = () => {
    // Set token with 2 hour expiry
    const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000;
    localStorage.setItem("adminToken", "authenticated");
    localStorage.setItem("adminTokenExpiry", expiryTime.toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminTokenExpiry");
    setIsAuthenticated(false);
    router.push("/admin/auth");
  };

  return { isAuthenticated, isLoading, login, logout };
}
