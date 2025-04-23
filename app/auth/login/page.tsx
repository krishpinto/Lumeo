"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { setAuthCookie } from "../../../lib/cookies";

export default function Login() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signInWithGoogle, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      // Set cookie when user is authenticated
      currentUser.getIdToken().then((token) => {
        setAuthCookie(token);
        router.push("/dashboard");
      });
    }
  }, [currentUser, router]);

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      const user = await signInWithGoogle();
      // Set auth cookie after successful login
      const token = await user.getIdToken();
      setAuthCookie(token);
      router.push("/dashboard");
    } catch (error) {
      setError(
        `Failed to sign in with Google: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
