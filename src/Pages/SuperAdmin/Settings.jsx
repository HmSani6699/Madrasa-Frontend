import { useState } from "react";
import { User, Lock, Save, Globe, Shield, Bell } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Mock User Data
  const [profileData, setProfileData] = useState({
    name: "Super Admin",
    email: "admin@mms.com",
    phone: "+8801700000000",
    role: "Super Admin"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const [systemData, setSystemData] = useState({
      siteName: "MMS SaaS",
      maintenanceMode: false,
      registrationOpen: true
  });

  const handleSave = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          alert("Settings saved successfully (Simulated)");
      }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account and system preferences.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "profile" 
                    ? "bg-white text-primary shadow-sm border border-gray-100" 
                    : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`}
            >
                <User className="w-4 h-4" />
                Profile Settings
            </button>
            <button 
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "security" 
                    ? "bg-white text-primary shadow-sm border border-gray-100" 
                    : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`}
            >
                <Lock className="w-4 h-4" />
                Security
            </button>
            <button 
                onClick={() => setActiveTab("system")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "system" 
                    ? "bg-white text-primary shadow-sm border border-gray-100" 
                    : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`}
            >
                <Globe className="w-4 h-4" />
                System Preferences
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
            {activeTab === "profile" && (
                <div className="max-w-xl space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                        <p className="text-sm text-gray-500">Update your account's profile information and email address.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                {profileData.name.charAt(0)}
                            </div>
                            <button className="text-sm text-primary font-medium hover:underline">Change Avatar</button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={profileData.name}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-gray-50"
                                value={profileData.email}
                                disabled
                            />
                            <p className="text-xs text-gray-400 mt-1">Email address cannot be changed.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "security" && (
                <div className="max-w-xl space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
                        <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === "system" && (
                <div className="max-w-xl space-y-6 animate-fade-in">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">System Preferences</h3>
                        <p className="text-sm text-gray-500">Manage global system settings and maintenance modes.</p>
                    </div>

                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                value={systemData.siteName}
                                onChange={(e) => setSystemData({...systemData, siteName: e.target.value})}
                            />
                        </div>

                        <hr className="border-gray-100" />
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Maintenance Mode</p>
                                <p className="text-sm text-gray-500">Disable access for all non-admin users.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={systemData.maintenanceMode}
                                    onChange={(e) => setSystemData({...systemData, maintenanceMode: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Allow New Registrations</p>
                                <p className="text-sm text-gray-500">Control if new tenant registrations are accepted.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={systemData.registrationOpen}
                                    onChange={(e) => setSystemData({...systemData, registrationOpen: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
