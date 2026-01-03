import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authUser";
import { useThemeStore } from "./store/themeStore";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import { useEffect } from "react";

function App() {
	const { user, authCheck, isCheckingAuth } = useAuthStore();
	const { theme } = useThemeStore();

	useEffect(() => {
		authCheck();
	}, [authCheck]);

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	if (isCheckingAuth) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-background">
				<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
			{/* Liquid Background Effects */}
			<div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
				<div className="liquid-bg-shape bg-purple-500 w-72 h-72 top-[-10%] left-[20%] mix-blend-multiply filter blur-xl opacity-20 animation-delay-2000"></div>
				<div className="liquid-bg-shape bg-blue-500 w-96 h-96 bottom-[-10%] right-[10%] mix-blend-multiply filter blur-xl opacity-20 animation-delay-4000"></div>
				<div className="liquid-bg-shape bg-indigo-500 w-80 h-80 top-[30%] left-[40%] mix-blend-multiply filter blur-xl opacity-20"></div>
			</div>

			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/dashboard"} />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/dashboard"} />} />
				<Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to={"/login"} />} />
				<Route path='/admin' element={user?.isAdmin ? <AdminPage /> : <Navigate to={"/"} />} />
			</Routes>
		</div>
	);
}

export default App;