import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import SkipLink from '../SkipLink/SkipLink';


export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />

      <Header />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
