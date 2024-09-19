import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-navy-blue">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-orange-500 text-3xl font-bold">
          Trim
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-white hover:text-orange-500">
            Log in
          </Link>
          <Link href="/register" className="bg-white text-navy-blue px-4 py-2 rounded hover:bg-orange-500 hover:text-white">
            Sign up Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;