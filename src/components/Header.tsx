"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  username: string;
  displayName: string | null;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [discordUrl, setDiscordUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch settings
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.discord_enabled === "true" && data.discord_url) {
          setDiscordUrl(data.discord_url);
        }
      })
      .catch(() => {});

    // Fetch user
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="relative z-50">
      {/* Top gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />

      <nav className="bg-dark-800/95 backdrop-blur-md border-b border-gold-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">👑</span>
              <div>
                <h1 className="text-2xl font-display font-bold gold-shimmer tracking-wide">
                  Degen Central
                </h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500/70 font-semibold">
                  Live life like a KING
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/casinos">Casinos</NavLink>
              <NavLink href="/strategies">Strategies</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/faq">FAQ</NavLink>
              <NavLink href="/about">About</NavLink>
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              {discordUrl && (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Discord
                </a>
              )}
              
              {user ? (
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 font-medium rounded-lg text-sm transition-all duration-200 flex items-center gap-2 border border-gold-500/30"
                >
                  <span>👤</span>
                  {user.displayName || user.username}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gold-400 hover:text-gold-300 font-medium text-sm transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg text-sm transition-all duration-200"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gold-400 hover:text-gold-300 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gold-800/30 bg-dark-800/98 backdrop-blur-md">
            <div className="px-4 py-4 flex flex-col gap-1">
              <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/casinos" onClick={() => setMenuOpen(false)}>Casinos</MobileNavLink>
              <MobileNavLink href="/strategies" onClick={() => setMenuOpen(false)}>Strategies</MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setMenuOpen(false)}>Blog</MobileNavLink>
              <MobileNavLink href="/faq" onClick={() => setMenuOpen(false)}>FAQ</MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
              
              <div className="border-t border-gold-800/30 mt-2 pt-2 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 bg-gold-500/10 text-gold-400 font-medium rounded-lg text-center"
                  >
                    👤 {user.displayName || user.username}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-3 text-gold-400 font-medium rounded-lg text-center border border-gold-500/30"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-lg text-center"
                    >
                      Join Free
                    </Link>
                  </>
                )}
                
                {discordUrl && (
                  <a
                    href={discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 bg-[#5865F2] text-white font-semibold rounded-lg text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Discord
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-gold-200/80 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg transition-all duration-200 uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 text-base font-medium text-gold-200/80 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg transition-all duration-200 uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}
