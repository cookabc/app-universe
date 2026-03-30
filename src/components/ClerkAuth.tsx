"use client";

import { Button } from "@/components/ui/button";
import { useClerkEnabled } from "./ClerkProvider";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User, LogIn } from "lucide-react";

// Dynamic import of Clerk components
function ClerkAuthInner() {
  const [components, setComponents] = useState<any>(null);
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(i18n.isInitialized);
  }, [i18n.isInitialized]);

  useEffect(() => {
    import("@clerk/nextjs").then((mod) => {
      setComponents({
        SignedOut: mod.SignedOut,
        SignedIn: mod.SignedIn,
        SignInButton: mod.SignInButton,
        UserButton: mod.UserButton,
      });
    });
  }, []);

  if (!components) {
    return null;
  }

  const { SignedOut, SignedIn, SignInButton, UserButton } = components;

  return (
    <div className="flex items-center">
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            asChild
            className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20 flex items-center space-x-2"
          >
            <span className="flex items-center space-x-2">
              <LogIn className="w-4 h-4" />
              <span>{isReady ? t("navigation.login") : "Login"}</span>
            </span>
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          className="transition-all duration-300"
          userProfileMode="modal"
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full transition-all duration-300 hover:bg-muted"
          >
            <span>
              <User className="w-5 h-5" />
            </span>
          </Button>
        </UserButton>
      </SignedIn>
    </div>
  );
}

export function ClerkAuth() {
  const { isEnabled, isLoaded } = useClerkEnabled();

  // Wait until Clerk is fully loaded before rendering any Clerk components
  if (!isEnabled || !isLoaded) {
    return null;
  }

  return <ClerkAuthInner />;
}
