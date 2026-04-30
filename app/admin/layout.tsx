// app/admin/layout.tsx
// Passthrough layout for the admin root. Auth guard lives in (protected)/layout.tsx.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
