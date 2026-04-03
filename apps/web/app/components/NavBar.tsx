"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isAdminPage = pathname.startsWith("/admin");

    useEffect(() => {
        const token = isAdminPage
            ? localStorage.getItem("adminToken")
            : localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [pathname, isAdminPage]);

    const handleLogout = () => {
        if (isAdminPage) {
            localStorage.removeItem("adminToken");
            router.push("/admin/signin");
        } else {
            localStorage.removeItem("token");
            router.push("/user/signin");
        }
        setIsLoggedIn(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-text-primary">
                        DEVFORCES {isAdminPage && <span className="text-text-muted text-sm ml-1 font-normal uppercase tracking-widest">Admin</span>}
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {isAdminPage ? (
                            <>
                                <Link href="/admin" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Dashboard</Link>
                                <Link href="/admin/challenges" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Challenges</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/contests" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Contests</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red hover:underline cursor-pointer transition-all"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href={isAdminPage ? "/admin/signin" : "/user/signin"}
                            className="text-sm font-medium text-text-primary hover:underline"
                        >
                            Sign In
                        </Link>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
