'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ url }: { url: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
  }, [url, router]);

  return (
    <div className="min-h-screen bg-navy-blue text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>If you are not redirected automatically, <a href={url} className="text-blue-400 hover:underline">click here</a>.</p>
      </div>
    </div>
  );
}