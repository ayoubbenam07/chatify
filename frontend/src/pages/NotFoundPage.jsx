import React from "react";
import { Link } from "react-router";
import { HomeIcon, GhostIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

function NotFoundPage() {
    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900">
            <div className="relative w-full max-w-lg md:h-[600px] h-[500px]">
                <BorderAnimatedContainer>
                    <div className="w-full flex flex-col items-center justify-center p-8 text-center">
                        {/* ILLUSTRATION */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                            <GhostIcon className="relative w-32 h-32 text-cyan-400 animate-bounce" />
                            <div className="mt-4 text-6xl font-black text-slate-700/50 absolute -bottom-4 -right-8 select-none">
                                404
                            </div>
                        </div>

                        {/* TEXT CONTENT */}
                        <h1 className="text-3xl font-bold text-slate-200 mb-4">
                            Lost in the Clouds?
                        </h1>
                        <p className="text-slate-400 mb-8 max-w-xs">
                            Whoops! The page you're looking for has drifted away into the digital void.
                        </p>

                        {/* ACTION BUTTON */}
                        <Link to="/" className="auth-link flex items-center gap-2 group">
                            <HomeIcon className="size-4 group-hover:-translate-y-0.5 transition-transform mx-auto" />
                            Back to Chat
                        </Link>

                        {/* DECORATIVE BADGES */}
                        <div className="mt-12 flex flex-wrap justify-center gap-3">
                            <span className="auth-badge">Missing Link</span>
                            <span className="auth-badge">Not Found</span>
                            <span className="auth-badge">404 Error</span>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
}

export default NotFoundPage;
