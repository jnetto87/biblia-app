import { Heart, Trash2, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FavoriteVerse } from "@/hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: FavoriteVerse[];
  onRemove: (id: string) => void;
  onNavigate: (abbrev: string, chapter: number) => void;
}

export function FavoritesSheet({
  open,
  onOpenChange,
  favorites,
  onRemove,
  onNavigate,
}: FavoritesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif">
            <Heart className="h-5 w-5 text-primary" />
            Favoritos
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-6rem)] mt-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookOpen className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">Nenhum favorito salvo ainda.</p>
            </div>
          ) : (
            <AnimatePresence>
              {favorites.map(fav => (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border-b border-border py-3 last:border-0"
                >
                  <button
                    onClick={() => {
                      onNavigate(fav.abbrev, fav.chapter);
                      onOpenChange(false);
                    }}
                    className="w-full text-left"
                  >
                    <p className="font-serif text-base leading-relaxed">
                      "{fav.text}"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      {fav.bookName} {fav.chapter}:{fav.verse} ({fav.version.toUpperCase()})
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 mt-1"
                    onClick={() => onRemove(fav.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
