import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Layout/Footer';
import URLShortenerForm from '../components/URLShortener/URLShortenerForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-blue text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">
        Generate high-performing links<br />with our powerful URL shortener.
        </h1>
        <p className="text-xl mb-8">
        Engage your audience instantly with short<br />
        and secure links
        </p>
        <URLShortenerForm />
      </main>
      <Footer />
    </div>
  );
}