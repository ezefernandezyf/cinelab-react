import Footer from "../Footer/Footer";
import Header from "../Header/Header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      {/* Skip link: hidden by default, visible on keyboard focus */}
      <a
        href="#main-content"
        className="absolute left-[-9999px] top-auto focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:text-sky-700 focus:px-3 focus:py-2 focus:rounded focus:shadow-md"
      >
        Saltar al contenido
      </a>

      <Header />
     

      {/* Main: id usado por el skip-link */}
      <main id="main-content" className="min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <Footer />
    
    </>
  );
}
