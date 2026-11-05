export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-top mt-auto">
      <div className="container py-3">
        <p className="mb-0 text-body-secondary">
          &copy; {currentYear} RAWVISTA
        </p>
      </div>
    </footer>
  );
}