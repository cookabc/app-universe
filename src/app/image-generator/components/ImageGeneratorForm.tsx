"use client";

import { Copy, Settings2, Sliders, Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ImageGeneratorFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function ImageGeneratorForm({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  isLoading,
  onSubmit,
}: ImageGeneratorFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: t("imageGenerator.promptCopied"),
      description: t("imageGenerator.promptCopiedDesc"),
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wand2 className="w-5 h-5 text-primary" />
          {t("imageGenerator.generationControls")}
        </CardTitle>
        <CardDescription>{t("imageGenerator.configureParams")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic">{t("imageGenerator.basic")}</TabsTrigger>
            <TabsTrigger value="advanced">
              {t("imageGenerator.advanced")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  {t("imageGenerator.prompt")}
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={handleCopyPrompt}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("imageGenerator.promptPlaceholder")}
                className="min-h-[140px] resize-none bg-background/50 focus:bg-background transition-colors text-base p-4 rounded-xl border-primary/20 focus:border-primary/50"
              />
            </div>

            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>{" "}
                  {t("imageGenerator.generating")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" /> {t("imageGenerator.generate")}
                </div>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="negative-prompt"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Sliders className="w-3 h-3" />{" "}
                {t("imageGenerator.negativePrompt")}
              </Label>
              <Textarea
                id="negative-prompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder={t("imageGenerator.negativePromptPlaceholder")}
                className="min-h-[100px] bg-background/50 resize-none text-sm"
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4" />
                <span className="font-medium">
                  {t("imageGenerator.modelSettings")}
                </span>
              </div>
              <p className="text-xs">
                {t("imageGenerator.advancedParamsDesc")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
