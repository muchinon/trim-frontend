import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-blue text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-8">The shortened URL you&apos;re looking for doesn&apos;t exist or has expired.</p>
        <Link href="/" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}