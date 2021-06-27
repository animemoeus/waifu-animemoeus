import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div className="flex justify-between items-center h-14 bg-white shadow">
        <div className="px-3">
          <Link href="/">
            <a>
              <span className="text-xl">Waifu Collections</span>
            </a>
          </Link>
        </div>
        <div className="px-4">
          <a
            href="https://t.me/animemoeus_bot/"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
