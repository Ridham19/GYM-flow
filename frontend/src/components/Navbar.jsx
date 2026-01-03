import { Link } from "react-router-dom";
import { Dumbbell, Menu, X, LayoutDashboard, LogOut, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Dumbbell className="text-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        GYMFLOW
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Home
                    </Link>

                    {user && (
                        <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                    )}

                    {user?.isAdmin && (
                        <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Admin
                        </Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <>
                            <div className="relative group/dropdown">
                                <button className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors py-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="p-2 space-y-1">
                                        <div className="px-3 py-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                            My Account
                                        </div>
                                        {user?.isAdmin && (
                                            <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm transition-colors">
                                                <ShieldCheck size={16} /> Admin Panel
                                            </Link>
                                        )}
                                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm transition-colors">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <div className="h-px bg-border my-1" />
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm transition-colors text-left"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-all shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={toggleMenu} className="p-2 text-muted-foreground hover:text-foreground">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border p-6 space-y-4 animate-in slide-in-from-top-2 shadow-xl z-40">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block text-muted-foreground hover:text-foreground">
                        Home
                    </Link>
                    {user && (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-muted-foreground hover:text-foreground">
                            Dashboard
                        </Link>
                    )}
                    {user?.isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-muted-foreground hover:text-foreground">
                            Admin
                        </Link>
                    )}
                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        {user ? (
                            <button
                                onClick={() => { logout(); setIsOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive font-medium"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center text-muted-foreground">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-primary text-primary-foreground py-2 rounded-lg font-bold">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
