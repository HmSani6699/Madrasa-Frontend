import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { identifier, password } = formData;
      const userData = await login(identifier, password);

      // Redirect based on role
      const roleRedirects = {
        super_admin: "/super-admin",
        admin: "/admin",
        teacher: "/teacher",
        student: "/student/dashboard",
        guardian: "/guardian/dashboard",
        accountant: "/accounting",
        talimat: "/talimat",
        mohtamim: "/admin", // Assuming mohtamim uses admin panel
      };

      const redirectPath = roleRedirects[userData.role] || "/";
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-xl border border-white/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500">Sign in to your Qawmi Madrasa account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email or Phone Number
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
              placeholder="Email or 01XXXXXXXXX"
              value={formData.identifier}
              onChange={(e) =>
                setFormData({ ...formData, identifier: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a href="#" className="text-primary font-medium hover:underline">
          Contact Administration
        </a>
      </div>
    </div>
  );
};

export default Login;
