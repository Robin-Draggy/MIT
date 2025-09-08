import React, { useState } from "react";

export const Login = () => {
  const [loginMethod, setLoginMethod] = useState("password");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretAnswer: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loginMethod === "password") {
      console.log("Logging in with password:", formData.email, formData.password);
    } else if (loginMethod === "secret") {
      console.log("Logging in with secret question:", formData.email, formData.secretAnswer);
    } else if (loginMethod === "otp") {
      console.log("Logging in with OTP:", formData.email, formData.otp);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f6] px-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md transition-transform hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">
          MIT Hospital
        </h2>

        {/* Method Switcher */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { key: "password", label: "Password" },
            { key: "secret", label: "Secret Q" },
            { key: "otp", label: "OTP" },
          ].map((method) => (
            <button
              key={method.key}
              onClick={() => setLoginMethod(method.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
                loginMethod === method.key
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            />
          </div>

          {/* Password */}
          {loginMethod === "password" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
              />
            </div>
          )}

          {/* Secret Question */}
          {loginMethod === "secret" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Pet's Name?
              </label>
              <input
                type="text"
                name="secretAnswer"
                onChange={handleChange}
                value={formData.secretAnswer}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
              />
            </div>
          )}

          {/* OTP */}
          {loginMethod === "otp" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                name="otp"
                onChange={handleChange}
                value={formData.otp}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
              />
              <button
                type="button"
                onClick={() => alert("Send OTP logic here")}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-105"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};