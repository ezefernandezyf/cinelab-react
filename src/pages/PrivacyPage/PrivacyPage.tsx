export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold mb-2">Política de Privacidad</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Texto informativo sobre privacidad y uso de datos en CineLab.
        </p>
      </header>

      <section className="mt-8 space-y-4">
        <p>
          CineLab no almacena ni comparte claves de API. La app utiliza la API pública de TMDB para
          obtener datos de películas; la clave de API se configura mediante variables de entorno
          (VITE_TMDB_API_KEY) y no debe subirse al repositorio.
        </p>

        <h2 className="text-lg font-medium">Datos personales</h2>
        <p>
          Esta aplicación no recopila datos personales de los usuarios más allá del almacenamiento
          local de favoritos (localStorage). Si decidís usar la app, tus favoritos quedan sólo en tu
          navegador a menos que implementes sincronización manual.
        </p>

        <h2 className="text-lg font-medium">Contacto</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Para consultas sobre privacidad:{' '}
          <a href="mailto:ezefernandezyf@gmail.com" className="text-cinematic-action underline">
            ezefernandezyf@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
