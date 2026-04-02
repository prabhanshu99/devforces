import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold tracking-tight text-text-primary mb-4">
        Devforces
      </h1>
      <p className="text-text-secondary text-lg mb-10 text-center max-w-md">
        A competitive programming platform for developers. Solve challenges, compete in contests, and climb the leaderboard.
      </p>

      <div className="flex gap-4">
        <Link
          href="/contests"
          className="bg-accent hover:bg-accent-hover text-white font-medium px-8 py-3 rounded-full transition-all duration-200"
        >
          Browse Contests
        </Link>
        <Link
          href="/user/signin"
          className="border border-border hover:border-accent text-text-primary font-medium px-8 py-3 rounded-full transition-all duration-200"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
