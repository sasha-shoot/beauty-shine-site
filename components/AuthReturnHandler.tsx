"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useUI } from "@/lib/ui-context";
import { useUser } from "@/lib/user-context";

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openProfile } = useUI();
  const { refresh } = useUser();

  useEffect(() => {
    const auth = sp?.get("auth");
    const err = sp?.get("authError");

    if (auth === "ok") {
      // Перетягуємо актуальний user з /api/me і відкриваємо drawer
      refresh().then(() => openProfile());
      // Прибираємо параметр з URL
      router.replace(pathname || "/", { scroll: false });
    } else if (err) {
      console.error("Telegram auth error:", err);
      alert(`Помилка авторизації: ${err}`);
      router.replace(pathname || "/", { scroll: false });
    }
  }, [sp, refresh, openProfile, router, pathname]);

  return null;
}

export function AuthReturnHandler() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
