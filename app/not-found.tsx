import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#9C6B2E] mb-4">
        404 — Not Found
      </span>
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-display mb-6">
        Space Not Found
      </h1>
      <p className="max-w-md text-sm sm:text-base text-gray-400 mb-8 leading-relaxed">
        The visualization or page you are looking for has been moved or does not exist.
      </p>
      <Link
        href="/"
        className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-all hover:bg-gray-200 hover:scale-105"
      >
        Return to Gallery
      </Link>
    </div>
  );
}
