import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useI18nReady() {
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(i18n.isInitialized);
  }, [i18n.isInitialized]);

  return { t, i18n, isReady };
}
