import AppShell from "@/components/app/AppShell";

import DemoGate from "@/components/demo/DemoGate";

export default function ProductLayout({ children }) {
  return (
    <DemoGate>
      <AppShell>{children}</AppShell>
    </DemoGate>
  );
}
