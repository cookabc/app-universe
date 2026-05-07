"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  Copy,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { languages } from "../constants";

interface ConverterFormProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  fromLang: string;
  setFromLang: (value: string) => void;
  toLang: string;
  setToLang: (value: string) => void;
  fromType: string;
  setFromType: (value: string) => void;
  toType: string;
  setToType: (value: string) => void;
  switchLanguages: () => void;
  inputText: string;
  setInputText: (value: string) => void;
  convertText: () => void;
  isLoading: boolean;
  uiLanguage: "en" | "ja" | "zh";
  outputText: string;
  error: string | null;
  copied: boolean;
  copyToClipboard: () => void;
  speakText: (text: string, lang: string) => void;
}

export function ConverterForm({
  activeTab,
  setActiveTab,
  fromLang,
  setFromLang,
  toLang,
  setToLang,
  fromType,
  setFromType,
  toType,
  setToType,
  switchLanguages,
  inputText,
  setInputText,
  convertText,
  isLoading,
  uiLanguage,
  outputText,
  error,
  copied,
  copyToClipboard,
  speakText,
}: ConverterFormProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="translation">
              {t("langConverter.tabs.translation")}
            </TabsTrigger>
            <TabsTrigger value="japaneseConversion">
              {t("langConverter.tabs.japaneseConversion")}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Toolbar */}
          <div className="border-b border-border/50 p-4 bg-muted/30 flex items-center justify-between gap-4">
            <div className="flex-1">
              <TabsContent value="translation" className="mt-0">
                <Select value={fromLang} onValueChange={setFromLang}>
                  <SelectTrigger className="w-full bg-background border-border/50 h-10">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages[uiLanguage].languageOptions.map(
                      (lang: { value: string; label: string }) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="japaneseConversion" className="mt-0">
                <Select value={fromType} onValueChange={setFromType}>
                  <SelectTrigger className="w-full bg-background border-border/50 h-10">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages[uiLanguage].japaneseOptions.map(
                      (type: { value: string; label: string }) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={switchLanguages}
              className="rounded-full hover:bg-primary/10 hover:text-primary shrink-0"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <TabsContent value="translation" className="mt-0">
                <Select value={toLang} onValueChange={setToLang}>
                  <SelectTrigger className="w-full bg-background border-border/50 h-10">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages[uiLanguage].languageOptions.map(
                      (lang: { value: string; label: string }) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="japaneseConversion" className="mt-0">
                <Select value={toType} onValueChange={setToType}>
                  <SelectTrigger className="w-full bg-background border-border/50 h-10">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages[uiLanguage].japaneseOptions.map(
                      (type: { value: string; label: string }) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </TabsContent>
            </div>
          </div>

          {/* Editor Area */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50 min-h-[400px]">
            {/* Input Section */}
            <div className="flex flex-col relative group bg-background/50">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t("langConverter.inputPlaceholder")}
                className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 text-lg bg-transparent rounded-none"
              />
              <div className="p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-muted-foreground">
                  {inputText.length} chars
                </span>
                {inputText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputText("")}
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col relative bg-muted/10">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  {t("langConverter.translating")}
                </div>
              ) : outputText ? (
                <>
                  <div className="flex-1 p-6 text-lg font-medium leading-relaxed font-kosugi overflow-y-auto">
                    {outputText}
                  </div>
                  <div className="p-4 flex justify-end items-center gap-2 border-t border-border/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        speakText(
                          outputText,
                          activeTab === "translation" ? toLang : "ja",
                        )
                      }
                    >
                      <Volume2 className="h-4 w-4 mr-2" />{" "}
                      {t("langConverter.listen")}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={copyToClipboard}
                      className={
                        copied
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : ""
                      }
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied
                        ? t("langConverter.copied")
                        : t("langConverter.copy")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground/50">
                  {t("langConverter.translationWillAppear")}
                </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("langConverter.error")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={convertText}
        disabled={isLoading || !inputText.trim()}
        size="lg"
        className="w-full text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {isLoading
          ? t("langConverter.loading")
          : t("langConverter.convertButton")}
      </Button>
    </div>
  );
}
