"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { type LucideIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> {
  width?: number;
  height?: number;
  lightIcon?: LucideIcon;
  darkIcon?: LucideIcon;
  lightColor?: string;
  darkColor?: string;
}

const DEFAULTS = {
  WIDTH: 80,
  HEIGHT: 44,
  LIGHT_COLOR: "#fbbf24",
  DARK_COLOR: "#312E81",
  PADDING: 4,
};

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  ThemeSwitchProps
>(
  (
    {
      className,
      width = DEFAULTS.WIDTH,
      height = DEFAULTS.HEIGHT,
      lightIcon: LightIcon = SunIcon,
      darkIcon: DarkIcon = MoonIcon,
      lightColor = DEFAULTS.LIGHT_COLOR,
      darkColor = DEFAULTS.DARK_COLOR,
      ...props
    },
    ref,
  ) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const isDarkMode = mounted ? theme === "dark" : false;
    const label = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

    const computeThumbStyles = React.useMemo(() => {
      const thumbSize = height - DEFAULTS.PADDING;
      const translateX = width - thumbSize - DEFAULTS.PADDING;

      return {
        size: thumbSize,
        transform: isDarkMode ? translateX : 0,
      };
    }, [height, width, isDarkMode]);

    const thumbIconStyle = {
      height: computeThumbStyles.size * 0.75,
      width: computeThumbStyles.size * 0.75,
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SwitchPrimitives.Root
            className={cn(
              "rounded-full relative inline-flex shrink-0 cursor-pointer border-2 border-transparent",
              "transition-colors duration-200 ease-in-out",
              "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
              className,
            )}
            checked={isDarkMode}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label={label}
            {...props}
            ref={ref}
            style={{
              width,
              height,
              backgroundColor: isDarkMode ? darkColor : lightColor,
            }}
          >
            <SwitchPrimitives.Thumb
              className="pointer-events-none rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center"
              style={{
                height: computeThumbStyles.size,
                width: computeThumbStyles.size,
                transform: `translateX(${computeThumbStyles.transform}px)`,
              }}
            >
              {isDarkMode
                ? DarkIcon && <DarkIcon style={thumbIconStyle} />
                : LightIcon && <LightIcon style={thumbIconStyle} />}
            </SwitchPrimitives.Thumb>
          </SwitchPrimitives.Root>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  },
);
ThemeSwitch.displayName = "ThemeSwitch";

export { ThemeSwitch };
