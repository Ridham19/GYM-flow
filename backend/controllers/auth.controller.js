import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { z } from "zod";

const signupSchema = z.object({
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

export async function signup(req, res) {
	try {
		const validation = signupSchema.safeParse(req.body);
		if (!validation.success) {
			return res.status(400).json({
				success: false,
				message: validation.error.errors[0].message
			});
		}

		const { email, password, username } = req.body;

		const existingUserByEmail = await User.findOne({ email: email });
		if (existingUserByEmail) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const existingUserByUsername = await User.findOne({ username: username });
		if (existingUserByUsername) {
			return res.status(400).json({ success: false, message: "Username already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const newUser = new User({
			email,
			password: hashedPassword,
			username,
			// isApproved default false
		});

		await newUser.save();

		// Do NOT log them in. Return message.
		res.status(201).json({
			success: true,
			message: "Account created successfully. Please wait for admin approval.",
			user: {
				...newUser._doc,
				password: "",
			},
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: error.message });
	}
}

export async function login(req, res) {
	try {
		const validation = loginSchema.safeParse(req.body);
		if (!validation.success) {
			return res.status(400).json({
				success: false,
				message: validation.error.errors[0].message
			});
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// Treat undefined/null as true (approved) for legacy users
		// Admins are always approved
		if (user.role !== 'admin' && user.isApproved === false) {
			return res.status(403).json({ success: false, message: "Your account is pending approval from the admin." });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			success: true,
			user: {
				...user._doc,
				password: "",
			},
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function logout(req, res) {
	try {
		res.clearCookie("jwt-gym");
		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function authCheck(req, res) {
	try {
		console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}