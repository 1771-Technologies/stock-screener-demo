import { useTheme } from "next-themes";
import { tw } from "./lib/tw";
import { ToggleGroup, ToggleItem } from "./ui/toggle-group";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

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
        <ToggleItem value="light">Light</ToggleItem>
        <ToggleItem value="dark">Dark</ToggleItem>
        <ToggleItem value="lng1771-teal">LyteNyte Teal</ToggleItem>
        <ToggleItem value="lng1771-term256">Term 256</ToggleItem>
        <ToggleItem value="lng1771-shadcn-dark">Shadcn Dark</ToggleItem>
        <ToggleItem value="lng1771-shadcn-light">Shadcn Light</ToggleItem>
        <ToggleItem value="lng1771-cotton-candy">Cotton Candy</ToggleItem>
      </ToggleGroup>
    </div>
  );
}
