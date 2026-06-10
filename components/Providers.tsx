"use client";

import { CartProvider } from "@/lib/cart-context";
import { UIProvider } from "@/lib/ui-context";
import { UserProvider } from "@/lib/user-context";
import { CartDrawer } from "./CartDrawer";
import { ProfileDrawer } from "./ProfileDrawer";
import { AuthReturnHandler } from "./AuthReturnHandler";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <UserProvider>
        <UIProvider>
          {children}
          <CartDrawer />
          <ProfileDrawer />
          <AuthReturnHandler />
        </UIProvider>
      </UserProvider>
    </CartProvider>
  );
}
