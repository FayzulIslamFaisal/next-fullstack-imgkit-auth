"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    startTransition(async () => {
      const results = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log("results===>", results);
      
      if (results?.error) {
        setError("Invalid email or password.");
      } else {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 rounded-xl transition duration-200 ${
              isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>

          {/* Footer */}
          <p className="text-sm text-center text-gray-300 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
