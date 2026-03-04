import { Sun, Moon, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

export function TopBar({ isDark, onToggleTheme, onOpenFavorites, favoritesCount }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-tight">Bíblia</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenFavorites}
            className="relative"
            aria-label="Favoritos"
          >
            <Heart className="h-4 w-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {favoritesCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
