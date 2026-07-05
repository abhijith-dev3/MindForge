import { Link } from "react-router-dom";

const games = [
  { title: "Reaction Test", path: "/reaction", text: "Fast visual timing challenge." },
  { title: "Memory Game", path: "/memory", text: "Repeat and extend color sequences." },
  { title: "Accuracy Game", path: "/accuracy", text: "Hit targets with speed and precision." },
];

export default function Games() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-white">Games</h1>
        <p className="mt-3 text-slate-300">Choose a mode and start training.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.path}
            to={game.path}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/10"
          >
            <h2 className="text-2xl font-black text-white">{game.title}</h2>
            <p className="mt-3 text-slate-300">{game.text}</p>
            <p className="mt-6 text-sm font-semibold text-cyan-300">Play now →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}