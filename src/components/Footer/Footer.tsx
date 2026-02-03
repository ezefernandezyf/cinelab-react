import { Link } from "react-router-dom";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="border-t bg-white/90 dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <div>© {new Date().getFullYear()} CineLab</div>
        <nav aria-label="Footer" className="space-x-4">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <a href="https://github.com/ezefernandezyf/cinelab-react" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}