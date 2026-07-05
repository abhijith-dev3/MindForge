export default function Card({ children }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      {children}
    </div>
  );
}