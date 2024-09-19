'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserUrls, logoutUser, shortenURL, deleteURL } from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UrlData {
  shortCode: string;
  originalUrl: string;
}

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN || 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login...');
      router.push('/login');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const urlsData = await getUserUrls();
      console.log('Fetched URLs:', urlsData);
      setUrls(urlsData);
      
      // Fetch the latest shortened URL
      if (urlsData.length > 0) {
        const latestUrl = urlsData[0]; // Assuming the API returns URLs sorted by creation date
        setShortenedUrl(`${WEBSITE_DOMAIN}/${latestUrl.shortCode}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');

    if (!newUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }

    try {
      const result = await shortenURL(newUrl);
      setShortenedUrl(result.shortUrl);
      setNewUrl('');
      fetchData(); // Refresh the URL list
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError('Failed to shorten URL. Please try again.');
    }
  };

  const handleDelete = async (shortCode: string) => {
    try {
      await deleteURL(shortCode);
      toast.success('URL deleted successfully');
      fetchData(); // Refresh the URL list
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL. Please try again.');
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      toast.success('URL copied to clipboard');
    }, (err) => {
      console.error('Error copying URL:', err);
      toast.error('Failed to copy URL. Please try again.');
    });
  };

  const getFullShortUrl = (shortCode: string) => {
    return `${WEBSITE_DOMAIN}/${shortCode}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-blue text-white p-8 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-blue text-white p-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
     
      {error && <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Shortened URLs</h2>
          {urls.length > 0 ? (
            <ul className="space-y-4">
              {urls.map(url => (
                <li key={url.shortCode} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <a href={getFullShortUrl(url.shortCode)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                      {getFullShortUrl(url.shortCode)}
                    </a>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopy(getFullShortUrl(url.shortCode))}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(url.shortCode)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 truncate">{url.originalUrl}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven&apos;t created any shortened URLs yet.</p>
          )}
        </div>

        <div className="bg-indigo-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shorten New URL</h2>
          <form onSubmit={handleShorten} className="flex flex-col space-y-4">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter URL to shorten"
              className="p-2 rounded text-navy-blue"
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Shorten
            </button>
          </form>
          {shortenedUrl && (
            <div className="mt-4">
              <p>Shortened URL:</p>
              <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {shortenedUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;