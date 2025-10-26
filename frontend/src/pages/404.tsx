import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <FileQuestion size={80} className="text-gray-300" />
        </div>

        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>

        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
