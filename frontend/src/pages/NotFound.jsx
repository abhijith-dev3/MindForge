import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-black">404</h1>
      <p className="mt-4 text-slate-400">Page not found</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Go Home
      </Link>
    </div>
  );
}