export default function SkipLink() {
  return (
    <a href="#main-content" className="sr-only-focusable" tabIndex={0}>
      Saltar al contenido
    </a>
  );
}
