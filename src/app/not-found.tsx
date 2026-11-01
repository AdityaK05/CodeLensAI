/** src/app/not-found.tsx */
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page not found</p>
      <Link href="/" className="text-primary hover:underline">Return Home</Link>
    </div>
  );
}