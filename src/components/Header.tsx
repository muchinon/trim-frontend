'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking for a token in localStorage)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="bg-navy-blue">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-orange-500 text-3xl font-bold">
          Trim
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="bg-white text-navy-blue px-4 py-2 rounded hover:bg-orange-500 hover:text-white transition duration-300"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-white hover:text-orange-500 px-4 py-2 rounded transition duration-300"
              >
                Log in
              </Link>
              <Link 
                href="/register" 
                className="bg-white text-navy-blue px-4 py-2 rounded hover:bg-orange-500 hover:text-white transition duration-300"
              >
                Sign up Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;