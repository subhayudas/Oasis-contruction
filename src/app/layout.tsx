/**
 * Pass-through root layout. The real document shell lives in
 * app/[locale]/layout.tsx so that <html lang> can be set per locale.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
