import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VerseItem } from "@/components/VerseItem";
import { DailyVerse } from "@/components/DailyVerse";
import { NavigationPanel } from "@/components/NavigationPanel";
import { TopBar } from "@/components/TopBar";
import { FavoritesSheet } from "@/components/FavoritesSheet";
import { useBible } from "@/hooks/useBible";
import { useFavorites } from "@/hooks/useFavorites";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { isDark, toggle: toggleTheme } = useTheme();
  const {
    version,
    setVersion,
    bookAbbrev,
    chapter,
    currentBook,
    chapterQuery,
    navigateTo,
    nextChapter,
    prevChapter,
    setBookAbbrev,
    setChapter,
  } = useBible();

  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const verses = chapterQuery.data?.verses || [];
  const filteredVerses = searchTerm
    ? verses.filter(v => v.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : verses;

  const bookName = currentBook?.name || "";

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenFavorites={() => setFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      <FavoritesSheet
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
        favorites={favorites}
        onRemove={removeFavorite}
        onNavigate={navigateTo}
      />

      <div className="pt-14 flex min-h-screen">
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside className="w-72 border-r border-border bg-card hidden md:flex flex-col fixed top-14 bottom-0 left-0 overflow-hidden">
            <NavigationPanel
              version={version}
              onVersionChange={setVersion}
              selectedBook={bookAbbrev}
              selectedChapter={chapter}
              onNavigate={navigateTo}
            />
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 ${!isMobile ? "md:ml-72" : ""}`}>
          <div className="max-w-prose mx-auto px-4 py-6 pb-24">
            {/* Daily verse */}
            <DailyVerse version={version} />

            {/* Chapter header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
                  {bookName}
                </h1>
                <p className="text-sm text-muted-foreground font-sans">
                  Capítulo {chapter} • {version.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={prevChapter} aria-label="Capítulo anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextChapter} aria-label="Próximo capítulo">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar neste capítulo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Verses */}
            {chapterQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-4 w-6 mt-1" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : chapterQuery.isError ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-serif">Sem conexão</p>
                <p className="text-sm mt-1">Verifique sua internet e tente novamente.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => chapterQuery.refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredVerses.map(verse => {
                  const verseId = `${version}:${bookAbbrev}:${chapter}:${verse.number}`;
                  return (
                    <VerseItem
                      key={verse.number}
                      verse={verse}
                      bookName={bookName}
                      abbrev={bookAbbrev}
                      chapter={chapter}
                      version={version}
                      isFavorite={isFavorite(verseId)}
                      onToggleFavorite={() =>
                        toggleFavorite({
                          id: verseId,
                          bookName,
                          abbrev: bookAbbrev,
                          chapter,
                          verse: verse.number,
                          text: verse.text,
                          version,
                        })
                      }
                      searchTerm={searchTerm}
                    />
                  );
                })}
                {searchTerm && filteredVerses.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhum versículo encontrado para "{searchTerm}"
                  </p>
                )}
              </div>
            )}

            {/* Chapter navigation bottom */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <Button variant="ghost" onClick={prevChapter} className="text-sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                {bookName} {chapter}
              </span>
              <Button variant="ghost" onClick={nextChapter} className="text-sm">
                Próximo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile navigation drawer */}
      {isMobile && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            <NavigationPanel
              version={version}
              onVersionChange={setVersion}
              selectedBook={bookAbbrev}
              selectedChapter={chapter}
              onNavigate={navigateTo}
              onClose={() => setDrawerOpen(false)}
            />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Index;
