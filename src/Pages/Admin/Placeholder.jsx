import { useParams } from 'react-router';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
  const params = useParams();
  
  // Try to make a readable title from the last path segment if no title provided
  const derivedTitle = title || window.location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fade-in">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
        <Construction className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{derivedTitle}</h1>
        <p className="text-gray-500 max-w-md mx-auto mt-2">
          This module is currently under development. Please check back later or contact support for more information.
        </p>
      </div>
      <div className="pt-6">
        <button 
            onClick={() => window.history.back()} 
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
            Go Back
        </button>
      </div>
    </div>
  );
};

export default Placeholder;
