import axios from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isLoggingIn: false,
	isCheckingAuth: true,

	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post("/api/v1/auth/signup", credentials);
			set({ user: response.data.user, isSigningUp: false });
			toast.success("Account created successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Signup failed");
			set({ isSigningUp: false, user: null });
		}
	},

	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post("/api/v1/auth/login", credentials);
			set({ user: response.data.user, isLoggingIn: false });
			toast.success("Logged in successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Login failed");
			set({ isLoggingIn: false, user: null });
		}
	},

	logout: async () => {
		try {
			await axios.post("/api/v1/auth/logout");
			set({ user: null });
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response.data.message || "Logout failed");
		}
	},

	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await axios.get("/api/v1/auth/authCheck");
			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			// Do not toast error here as it's a silent check
		}
	},
}));