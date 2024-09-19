'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { shortenURL } from '../../utils/api';

const URLShortenerForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const pendingUrl = localStorage.getItem('pendingUrl');
    if (pendingUrl) {
      setUrl(pendingUrl);
      localStorage.removeItem('pendingUrl');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      if (!localStorage.getItem('token')) {
        localStorage.setItem('pendingUrl', url);
        router.push('/login');
        return;
      }

      const result = await shortenURL(url);
      setShortUrl(result.shortUrl);
      setUrl(''); // Clear the input after successful shortening
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL here..."
          required
          className="p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button 
          type="submit" 
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Shorten URL
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {shortUrl && (
        <div className="mt-4">
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default URLShortenerForm;