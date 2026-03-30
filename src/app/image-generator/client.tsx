"use client";

import { AppErrorBoundary } from "@/components/optimized/error-boundary";
import { ImageDisplay } from "./components/ImageDisplay";
import { ImageGeneratorForm } from "./components/ImageGeneratorForm";
import { ProviderStatus } from "./components/ProviderStatus";
import { QueueStatus } from "./components/QueueStatus";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { motion } from "framer-motion";
import { Sparkles, History, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ImageGeneratorClient() {
  const { t } = useTranslation();
  const {
    prompt,
    negativePrompt,
    generatedImage,
    requestStatus,
    queueStatus,
    providerStatus,
    isLoading,
    setPrompt,
    setNegativePrompt,
    handleSubmit,
    reset,
  } = useImageGeneration();

  return (
    <AppErrorBoundary>
      <div className="min-h-[calc(100vh-64px)] bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-12 space-y-4"
          >
            <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {t("imageGenerator.appName")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("imageGenerator.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Control Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="sticky top-8 space-y-6">
                <ImageGeneratorForm
                  prompt={prompt}
                  setPrompt={setPrompt}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                />

                <div className="space-y-4">
                  <ProviderStatus providers={providerStatus} />
                  <QueueStatus status={queueStatus} />
                </div>
              </div>
            </motion.div>

            {/* Main Display Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8"
            >
              <ImageDisplay
                generatedImage={generatedImage}
                isLoading={isLoading}
                requestStatus={requestStatus}
                prompt={prompt}
              />

              {/* Gallery Placeholder - In a real app this would be populated with history */}
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">
                    {t("imageGenerator.recentCreations")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all"
                    >
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppErrorBoundary>
  );
}
