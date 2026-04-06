import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch checked={dark} onCheckedChange={setDark} />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export default DarkModeToggle;
