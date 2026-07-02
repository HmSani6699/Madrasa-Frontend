import { MoreHorizontal, Search, Filter } from "lucide-react";

const recentTenants = [
  { id: 1, name: "Jamia Islamia Dhaka", admin: "Mufti Rahman", students: "1,250", status: "Active", date: "Jan 15, 2024", logo: "J" },
  { id: 2, name: "Darul Uloom Chittagong", admin: "Moulana Ahmed", students: "850", status: "Active", date: "Jan 12, 2024", logo: "D" },
  { id: 3, name: "Madrasa Ayesha Siddiqa", admin: "Hafiz Karim", students: "320", status: "Pending", date: "Jan 10, 2024", logo: "M" },
  { id: 4, name: "Al-Huda Institute", admin: "Mufti Solaiman", students: "450", status: "Active", date: "Jan 08, 2024", logo: "A" },
  { id: 5, name: "Nurul Quran Academy", admin: "Moulana Yusuf", students: "120", status: "Suspended", date: "Jan 05, 2024", logo: "N" },
  { id: 5, name: "Nurul Quran Academy", admin: "Moulana Yusuf", students: "120", status: "Suspended", date: "Jan 05, 2024", logo: "N" },
];

const RecentTenants = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">New Enrollments</h2>

        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10">
            <Filter className="w-5 h-5" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="white-space-nowrap text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Madrasa</th>
              <th className="white-space-nowrap text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="white-space-nowrap text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
              <th className="white-space-nowrap text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="white-space-nowrap text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="white-space-nowrap text-right py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTenants.map((tenant, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group whitespace-nowrap">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center font-bold text-sm">
                      {tenant.logo}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{tenant.name}</p>
                      <p className="text-xs text-gray-500">ID: #MMS-{tenant.id + 100}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 font-medium">{tenant.admin}</td>
                <td className="py-4 px-6 text-center text-sm font-bold text-gray-700">{tenant.students}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    tenant.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${tenant.status === 'Active' ? 'bg-emerald-500' :
                      tenant.status === 'Pending' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}></span>
                    {tenant.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right text-sm text-gray-500">{tenant.date}</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTenants;
