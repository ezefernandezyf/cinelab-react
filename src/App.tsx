import './App.css';

function App() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-2xl rounded-2xl shadow-2xl bg-white p-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Tailwind v3 — Prueba</h1>
          <p className="text-slate-500 mt-2">
            Si ves colores y sombras, Tailwind 3 está generando utilidades.
          </p>

          <div className="mt-6 flex gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Indigo
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
              Emerald
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
