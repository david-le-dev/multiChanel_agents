import type { PropsWithChildren } from "react";

import { Footer } from "@/components/navigation/Footer";
import { TopNav } from "@/components/navigation/TopNav";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen">
      <TopNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
