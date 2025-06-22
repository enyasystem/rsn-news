import React from "react";

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // Standalone layout for login page (no header/sidebar)
  return <>{children}</>;
}
