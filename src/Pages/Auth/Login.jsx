import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "password",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API Call
    setTimeout(() => {
      const { identifier, password } = formData;

      if (
        (identifier === "admin@mms.com" || identifier === "01700000000") &&
        password === "password"
      ) {
        login({
          name: "Super Admin",
          email: "admin@mms.com",
          phone: "01700000000",
          role: "super_admin",
        });
        navigate("/super-admin");
      } else if (
        (identifier === "muhtamim@mms.com" || identifier === "01711111111") &&
        password === "password"
      ) {
        const mockMadrasas = [
          {
            id: 1,
            name: "Jamia Islamia Dhaka",
            role: "admin",
            logo: "https://ui-avatars.com/api/?name=JI&background=0D8ABC&color=fff",
          },
          {
            id: 2,
            name: "Al-Madina Institute",
            role: "admin",
            logo: "https://ui-avatars.com/api/?name=AM&background=22c55e&color=fff",
          },
        ];
        login(
          {
            name: "Muhtamim",
            email: "muhtamim@mms.com",
            phone: "01711111111",
            role: "admin",
          },
          mockMadrasas,
        );
        navigate("/admin");
      } else if (
        (identifier === "teacher@mms.com" || identifier === "01722222222") &&
        password === "password"
      ) {
        login({
          name: "Sheikh Abdullah",
          email: "teacher@mms.com",
          phone: "01722222222",
          role: "teacher",
        });
        navigate("/teacher");
      } else if (
        (identifier === "student@mms.com" || identifier === "01733333333") &&
        password === "password"
      ) {
        login({
          name: "Abdullah Mamun",
          email: "student@mms.com",
          phone: "01733333333",
          role: "student",
        });
        navigate("/student/dashboard");
      } else if (
        (identifier === "parent@mms.com" || identifier === "01744444444") &&
        password === "password"
      ) {
        const mockChildren = [
          {
            id: 1,
            name: "Abdullah Mamun",
            class: "Mishkat (Sec A)",
            attendance: "94%",
            status: "Present",
            dues: "৳ 2,500",
            initials: "AM",
            gender: "Male",
            section: "Sec A",
            roll: "042",
            color: "bg-indigo-600",
            lastActivity: "Submitted Homework: Arabic Nahw",
            classTeacher: "Sheikh Abdullah",
            schedule: [
              {
                period: "08:30 AM",
                subject: "Al-Quran (Hifz)",
                teacher: "Sheikh Abdullah",
                room: "Hall 01",
              },
              {
                period: "10:00 AM",
                subject: "Arabic Nahw",
                teacher: "Ustad Junaid",
                room: "Room 105",
              },
              {
                period: "12:00 PM",
                subject: "Fiqh Basics",
                teacher: "Mufti Omar",
                room: "Main Room",
              },
            ],
          },
          {
            id: 2,
            name: "Zaid Bin Harith",
            class: "Hifz (Sec B)",
            attendance: "98%",
            status: "Present",
            dues: "৳ 1,200",
            initials: "ZH",
            gender: "Male",
            section: "Sec B",
            roll: "012",
            color: "bg-emerald-600",
            lastActivity: "New Grade Posted: Tajweed",
            classTeacher: "Hafiz Kareem",
            schedule: [
              {
                period: "07:00 AM",
                subject: "Morning Hifz",
                teacher: "Hafiz Kareem",
                room: "Hall 02",
              },
              {
                period: "09:30 AM",
                subject: "Tajweed Rule",
                teacher: "Qari Basit",
                room: "Room 105",
              },
              {
                period: "11:00 AM",
                subject: "Islamic Manners",
                teacher: "Ustad Ahmed",
                room: "Hall 02",
              },
            ],
          },
        ];
        login(
          {
            name: "Abdur Rahman",
            email: "parent@mms.com",
            phone: "01744444444",
            role: "guardian",
          },
          [],
          mockChildren,
        );
        navigate("/guardian/dashboard");
      } else if (
        (identifier === "accountant@mms.com" || identifier === "01755555555") &&
        password === "password"
      ) {
        login({
          name: "Accountant",
          email: "accountant@mms.com",
          phone: "01755555555",
          role: "accountant",
        });
        navigate("/accounting");
      } else if (
        (identifier === "talimat@mms.com" || identifier === "01766666666") &&
        password === "password"
      ) {
        login({
          name: "Education Secretary",
          email: "talimat@mms.com",
          phone: "01766666666",
          role: "talimat",
        });
        navigate("/talimat");
      } else {
        setError("Invalid credentials (try admin@mms.com or 01700000000)");
        setLoading(false);
      }
    }, 1500);
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
