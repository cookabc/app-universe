import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { getCachedTranslation, japaneseConvert } from "@/app/actions";
import { useTranslation } from "react-i18next";

interface ConversionHistoryItem {
  id: string;
  input: string;
  output: string;
  from: string;
  to: string;
  mode: string;
}

interface UseLanguageConverterProps {
  uiLanguage: "en" | "ja" | "zh";
}

export function useLanguageConverter({
  uiLanguage,
}: UseLanguageConverterProps) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ja");
  const [fromType, setFromType] = useState("hiragana");
  const [toType, setToType] = useState("romaji");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("translation");

  const [_isPending, startTransition] = useTransition();

  const [optimisticHistory, addOptimisticHistory] = useOptimistic(
    history,
    (current, newItem: ConversionHistoryItem) => [
      newItem,
      ...current.slice(0, 9),
    ],
  );

  const conversionStats = useMemo(
    () => ({
      totalConversions: history.length,
      translationCount: history.filter((h) => h.mode === "translation").length,
      japaneseCount: history.filter((h) => h.mode === "japaneseConversion")
        .length,
    }),
    [history],
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem("conversionHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Error parsing history from localStorage:", err);
        localStorage.removeItem("conversionHistory");
      }
    }
  }, []);

  const convertText = useCallback(async () => {
    if (!inputText.trim()) {
      setError(t("langConverter.inputPlaceholder"));
      return;
    }

    const newHistoryItem: ConversionHistoryItem = {
      id: crypto.randomUUID(),
      input: inputText,
      output: "...",
      from: activeTab === "translation" ? fromLang : fromType,
      to: activeTab === "translation" ? toLang : toType,
      mode: activeTab,
    };

    addOptimisticHistory(newHistoryItem);

    setIsLoading(true);
    setError(null);
    setOutputText("");

    try {
      let result: string;
      if (activeTab === "translation") {
        const translationResult = await getCachedTranslation(
          inputText,
          fromLang,
          toLang,
        );
        result = translationResult.success
          ? translationResult.data!
          : translationResult.error!;
      } else {
        const conversionResult = await japaneseConvert(
          inputText,
          fromType,
          toType,
        );
        result = conversionResult.success
          ? conversionResult.data!
          : conversionResult.error!;
      }

      setOutputText(result);
      const finalHistoryItem = { ...newHistoryItem, output: result };
      const newHistory = [finalHistoryItem, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem("conversionHistory", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Error details:", err);
      setError(
        `${t("langConverter.error")}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setHistory((prev) =>
        prev.filter((item) => item.id !== newHistoryItem.id),
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    inputText,
    uiLanguage,
    activeTab,
    fromLang,
    toLang,
    fromType,
    toType,
    history,
    addOptimisticHistory,
  ]);

  const copyToClipboard = useCallback(() => {
    if (!outputText) return;

    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
        setError("Failed to copy text to clipboard");
      });
  }, [outputText]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("conversionHistory");
  }, []);

  const switchLanguages = useCallback(() => {
    startTransition(() => {
      if (activeTab === "translation") {
        setFromLang(toLang);
        setToLang(fromLang);
      } else {
        setFromType(toType);
        setToType(fromType);
      }
    });
  }, [activeTab, fromLang, toLang, fromType, toType]);

  const speakText = useCallback((text: string, lang: string) => {
    if (!text.trim()) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Error speaking text:", err);
      setError("Failed to speak text");
    }
  }, []);

  return {
    // State
    inputText,
    outputText,
    fromLang,
    toLang,
    fromType,
    toType,
    isLoading,
    error,
    history: optimisticHistory,
    copied,
    activeTab,
    conversionStats,

    // Actions
    setInputText,
    setFromLang,
    setToLang,
    setFromType,
    setToType,
    setActiveTab,
    convertText,
    copyToClipboard,
    clearHistory,
    switchLanguages,
    speakText,
  };
}
