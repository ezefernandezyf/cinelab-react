export const HomePage = (): React.JSX.Element =>{
  return (
    <section>
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-4 text-sm text-slate-600">
        Bienvenido a CineLab - esta es la página principal (placeholder).
      </p>
      <div className="mt-6">
        <p className="text-xs text-slate-500">
          Acá se mostraran cards de películas, busquedas, etc.
        </p>
      </div>
    </section>
  );
}
