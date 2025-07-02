"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const RegisterPage = () => {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null); // ✅ error state
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e) => {
    setRegisterInfo({
      ...registerInfo,
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

    const { name, email, password, confirmPassword } = registerInfo;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are Required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed.");
        }

        toast.success("Registration successful!");

        // Redirect to login
        setTimeout(() => {
          router.push("/login");
        }, 300);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    });
  };

  return (
    <>
    <ToastContainer />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 px-4">
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Full Name</label>
            <input
              type="text"
              name="name"
              value={registerInfo.name}
              onChange={handleChange}
              
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
            <input
              type="email"
              name="email"
              value={registerInfo.email}
              onChange={handleChange}
              
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
              value={registerInfo.password}
              onChange={handleChange}
              
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={registerInfo.confirmPassword}
              onChange={handleChange}
              
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
            {isPending ? "Registering..." : "Register"}
          </button>

          {/* Footer */}
          <p className="text-sm text-center text-gray-300 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
     </>
  );
};

export default RegisterPage;
