import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Building2, Check, PlusCircle } from "lucide-react";

/**
 * MadrasaSwitcher Component
 * 
 * A premium dropdown component that allows users to switch between multiple madrasas.
 * Only visible if the user belongs to more than one madrasa.
 */
const MadrasaSwitcher = () => {
  const { madrasas, currentMadrasa, selectMadrasa } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If no madrasas, we should still show the current one contextually or return null if user really has no access (unlikely for admin)
  if (!madrasas || madrasas.length === 0) {
      if (currentMadrasa) {
           return (
             <div className="p-3 bg-surface border border-border rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                    {currentMadrasa.logo ? (
                        <img src={currentMadrasa.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <Building2 className="w-5 h-5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-fg-main truncate leading-none mb-1">{currentMadrasa.name}</p>
                    <p className="text-[10px] text-fg-muted font-medium">Madrasa Management</p>
                </div>
            </div>
           )
      }
      return null;
  }

  return (
    <div className="relative w-full hidden" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border text-left
          ${isOpen 
            ? 'bg-primary/5 border-primary/20 ring-4 ring-primary/5 shadow-inner' 
            : 'bg-surface border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:border-primary/30 hover:shadow-md'}
        `}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
          {currentMadrasa?.logo ? (
             <img src={currentMadrasa.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
          ) : (
             <Building2 className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-fg-main truncate leading-tight mb-0.5">
            {currentMadrasa?.name || "Select Madrasa"}
          </p>
           <div className="flex items-center gap-2">
                <span className="text-[10px] text-fg-muted font-medium uppercase tracking-wider">Switch Campus</span>
                <ChevronDown className={`w-3 h-3 text-fg-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
           </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-surface rounded-xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
           <div className="px-4 py-3 border-b border-border bg-gray-50/50 dark:bg-slate-800/50">
             <p className="text-xs font-bold text-fg-muted uppercase tracking-wider">Select Organization</p>
           </div>
           
           <div className="max-h-[200px] overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
             {madrasas.map((madrasa) => (
               <button
                 key={madrasa.id}
                 onClick={() => {
                   selectMadrasa(madrasa);
                   setIsOpen(false);
                 }}
                 className={`
                   w-full flex items-center gap-3 p-2 rounded-lg transition-all
                   ${currentMadrasa?.id === madrasa.id 
                     ? 'bg-primary/10 text-primary ring-1 ring-primary/20' 
                     : 'hover:bg-gray-50 dark:hover:bg-slate-700/50 text-fg-main'}
                 `}
               >
                  <div className={`
                    w-8 h-8 rounded-md flex items-center justify-center shrink-0
                    ${currentMadrasa?.id === madrasa.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 dark:bg-slate-700 text-fg-muted'}
                  `}>
                    {madrasa.logo ? (
                        <img src={madrasa.logo} alt="Logo" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <Building2 className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-xs truncate">{madrasa.name}</p>
                    <p className="text-[9px] text-fg-muted capitalize">{madrasa.role}</p>
                  </div>

                  {currentMadrasa?.id === madrasa.id && (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  )}
               </button>
             ))}
           </div>

           <div className="p-2 border-t border-border bg-gray-50/50 dark:bg-slate-800/50">
             <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-fg-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold group">
               <PlusCircle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
               <span>Add Branch</span>
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MadrasaSwitcher;
