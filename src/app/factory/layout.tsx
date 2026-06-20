import { LanguageProvider } from "@/lib/i18n";

export default function FactoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}