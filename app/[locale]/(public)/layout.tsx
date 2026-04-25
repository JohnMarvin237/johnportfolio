// app/[locale]/(public)/layout.tsx
import NavbarMultilingual from "@/components/layout/NavbarMultilingual";
import FooterMultilingual from "@/components/layout/FooterMultilingual";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarMultilingual />
      <main className="min-h-screen">
        {children}
      </main>
      <FooterMultilingual />
    </>
  );
}