import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
    
      <a
        href="#main-content"
        className="absolute left-[-9999px] top-auto focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:text-sky-700 focus:px-3 focus:py-2 focus:rounded focus:shadow-md"
      >
        Saltar al contenido
      </a>

      <Header />

      
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}