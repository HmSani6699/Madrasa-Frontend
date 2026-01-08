import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API Call
    setTimeout(() => {
      if (formData.email === "admin@mms.com" && formData.password === "password") {
        login({ name: "Super Admin", email: formData.email, role: "super_admin" });
        navigate("/super-admin");
      } else if (formData.email === "muhtamim@mms.com" && formData.password === "password") {
        login({ name: "Muhtamim", email: formData.email, role: "admin" });
         navigate("/admin");
      } else {
        setError("Invalid credentials (try admin@mms.com / password)");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-xl border border-white/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-dark mb-2">Welcome Back</h1>
        <p className="text-gray-500">Sign in to your Qawmi Madrasa account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
              placeholder="you@madrasa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
        Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Contact Administration</a>
      </div>
    </div>
  );
};

export default Login;
