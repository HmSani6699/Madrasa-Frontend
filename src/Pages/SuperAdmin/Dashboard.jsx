import { Building2, Users, Wallet, TrendingUp, Plus, Bell, Search, Calendar } from "lucide-react";
import StatCard from "../../components/StatCard";
import RecentTenants from "../../components/RecentTenants";
import AddMadrasaModal from "../../components/AddMadrasaModal";
import { useState } from "react";

const SuperAdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Mock Data for Charts
    const revenueData = [40, 70, 45, 90, 65, 85, 105];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
        {/* Top Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 text-sm">Welcome back, here's what's happening with your SaaS today.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-64"
                    />
                </div>
                <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Madrasa</span>
                </button>
            </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Madrasas" 
            value="124" 
            icon={Building2} 
            trend="+12%" 
            isPositive={true} 
            color="text-blue-600" 
            bgGradient="bg-blue-400"
        />
        <StatCard 
            title="Active Students" 
            value="45,231" 
            icon={Users} 
            trend="+5%" 
            isPositive={true} 
            color="text-emerald-600" 
            bgGradient="bg-emerald-400"
        />
        <StatCard 
            title="Total Revenue" 
            value="$125,430" 
            icon={Wallet} 
            trend="+18%" 
            isPositive={true} 
            color="text-amber-600" 
            bgGradient="bg-amber-400"
        />
        <StatCard 
            title="Growth Rate" 
            value="24.5%" 
            icon={TrendingUp} 
            trend="+2%" 
            isPositive={true} 
            color="text-purple-600" 
            bgGradient="bg-purple-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Recent Tenants */}
        <div className="xl:col-span-2 space-y-8">
            <RecentTenants />
        </div>

        {/* Right Column: Analytics & Quick Status */}
        <div className="space-y-6">
            {/* Revenue Chart Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity duration-700"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="font-bold text-lg">Revenue Analytics</h3>
                        <p className="text-gray-400 text-xs">Monthly earnings overview</p>
                    </div>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Calendar className="w-4 h-4 text-white" />
                    </button>
                </div>
                
                <div className="h-48 flex items-end justify-between gap-3 relative z-10">
                    {revenueData.map((height, idx) => (
                        <div key={idx} className="w-full bg-white/5 rounded-t-lg relative group/bar">
                            <div 
                                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-emerald-400 rounded-t-lg transition-all duration-500 group-hover/bar:brightness-110"
                                style={{ height: `${height}%` }}
                            ></div>
                             {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg transform translate-y-2 group-hover/bar:translate-y-0 duration-200">
                                ${height * 100}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium px-1 relative z-10">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
            </div>

             {/* Quick Actions / System Status */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Quick Shortcuts</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 text-xs font-semibold">
                        <Users className="w-5 h-5 mb-1" />
                        Manage Users
                    </button>
                    <button className="p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex flex-col items-center justify-center gap-2 text-xs font-semibold">
                        <Wallet className="w-5 h-5 mb-1" />
                        View Billings
                    </button>
                    <button className="p-3 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2 text-xs font-semibold">
                        <Building2 className="w-5 h-5 mb-1" />
                        All Madrasas
                    </button>
                     <button className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2 text-xs font-semibold">
                        <Calendar className="w-5 h-5 mb-1" />
                        Reports
                    </button>
                </div>
             </div>
        </div>
      </div>
      
      {/* Modals */}
      <AddMadrasaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SuperAdminDashboard;
