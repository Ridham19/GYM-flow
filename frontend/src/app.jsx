import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/authUser";
import AdminPage from "./pages/AdminPage";

function App() {
	const { user } = useAuthStore();

	return (
		<Routes>
			<Route path='/' element={!user ? <HomePage /> : <Navigate to={"/dashboard"} />} />
			<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/dashboard"} />} />
			<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/dashboard"} />} />
			<Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to={"/login"} />} />
			<Route path='/admin' element={user?.isAdmin ? <AdminPage /> : <Navigate to={"/"} />} />
		</Routes>
	);
}

export default App;