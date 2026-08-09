import { useRouter } from "expo-router";
import { useCallback } from "react";

import { EditAccountView } from "./EditAccountView";

export default function EditAccountContainer() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/account");
  }, [router]);

  return <EditAccountView onBack={handleBack} />;
}
