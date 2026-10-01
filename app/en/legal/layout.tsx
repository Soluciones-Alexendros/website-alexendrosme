export default function EnLegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell section">
      <article className="legal-doc">{children}</article>
    </div>
  );
}
