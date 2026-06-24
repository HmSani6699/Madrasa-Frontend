import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-500 flex items-center justify-center">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-4">
            
                <h2>Welcome to Madrasa Management System</h2>
                <button
                onClick={() => navigate("/login")}
                className="text-white bg-primary px-4 py-2 rounded-lg cursor-pointer"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Home;