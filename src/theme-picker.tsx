import { useTheme } from "next-themes";
import { tw } from "./lib/tw";
import { ToggleGroup, ToggleItem } from "./ui/toggle-group";
import { useEffect } from "react";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme?.includes("ln-shadcn")) {
      const isLight = theme.includes("light");
      document.documentElement.classList.add(isLight ? "light" : "dark");
      document.documentElement.classList.remove(isLight ? "dark" : "light");
      document.documentElement.classList.add("ln-shadcn");
    } else {
      document.documentElement.classList.remove("ln-shadcn");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={tw("flex items-center gap-1 px-2 h-full py-1 text-nowrap")}>
      <div className={tw("text-light text-xs font-medium hidden md:block")}>
        Theme:
      </div>
      <ToggleGroup
        type="single"
        value={theme}
        className={tw("flex flex-wrap")}
        onValueChange={(c) => {
          if (!c) return;
          setTheme(c);
        }}
      >
        <ToggleItem value="ln-light">Light</ToggleItem>
        <ToggleItem value="ln-dark">Dark</ToggleItem>
        <ToggleItem value="ln-teal">LyteNyte Teal</ToggleItem>
        <ToggleItem value="ln-term">Term 256</ToggleItem>
        <ToggleItem value="ln-shadcn-dark">Shadcn Dark</ToggleItem>
        <ToggleItem value="ln-shadcn-light">Shadcn Light</ToggleItem>
        <ToggleItem value="ln-cotton-candy">Cotton Candy</ToggleItem>
      </ToggleGroup>
    </div>
  );
}
