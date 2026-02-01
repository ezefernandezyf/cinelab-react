export default function Footer() {
    return (
          <footer className="border-t bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-slate-500">
          © {new Date().getFullYear()} CineLab
        </div>
      </footer>
    )
}