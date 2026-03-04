import { useState } from "react";
import { bibleBooks, type BibleBook } from "@/data/books";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationPanelProps {
  version: string;
  onVersionChange: (v: string) => void;
  selectedBook: string;
  selectedChapter: number;
  onNavigate: (abbrev: string, chapter: number) => void;
  onClose?: () => void;
}

const versions = [
  { value: "nvi", label: "NVI" },
  { value: "acf", label: "ACF" },
  { value: "ra", label: "RA" },
];

export function NavigationPanel({
  version,
  onVersionChange,
  selectedBook,
  selectedChapter,
  onNavigate,
  onClose,
}: NavigationPanelProps) {
  const [search, setSearch] = useState("");
  const [activeBook, setActiveBook] = useState<BibleBook | null>(
    bibleBooks.find(b => b.abbrev === selectedBook) || null
  );
  const [goToInput, setGoToInput] = useState("");

  const filteredBooks = bibleBooks.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleGoTo = () => {
    // Parse "jo 3:16" or "jo 3"
    const match = goToInput.trim().match(/^(\w+)\s+(\d+)(?::(\d+))?$/);
    if (match) {
      const abbrev = match[1].toLowerCase();
      const chapter = parseInt(match[2]);
      const book = bibleBooks.find(b => b.abbrev === abbrev);
      if (book && chapter >= 1 && chapter <= book.chapters) {
        onNavigate(abbrev, chapter);
        onClose?.();
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Version selector */}
      <Select value={version} onValueChange={onVersionChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Versão" />
        </SelectTrigger>
        <SelectContent>
          {versions.map(v => (
            <SelectItem key={v.value} value={v.value}>
              {v.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Go to */}
      <div className="flex gap-2">
        <Input
          placeholder="Ir para... (ex: jo 3)"
          value={goToInput}
          onChange={e => setGoToInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGoTo()}
          className="text-sm"
        />
      </div>

      {activeBook ? (
        /* Chapter grid */
        <div className="flex-1 flex flex-col">
          <button
            onClick={() => setActiveBook(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← {activeBook.name}
          </button>
          <p className="text-xs text-muted-foreground mb-2">Capítulo</p>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map(ch => (
                <motion.button
                  key={ch}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onNavigate(activeBook.abbrev, ch);
                    onClose?.();
                  }}
                  className={`h-10 rounded-md text-sm font-medium transition-colors ${
                    activeBook.abbrev === selectedBook && ch === selectedChapter
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  {ch}
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        /* Book list */
        <div className="flex-1 flex flex-col">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar livro..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <ScrollArea className="flex-1">
            {["VT", "NT"].map(testament => {
              const books = filteredBooks.filter(b => b.testament === testament);
              if (books.length === 0) return null;
              return (
                <div key={testament} className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 px-1">
                    {testament === "VT" ? "Velho Testamento" : "Novo Testamento"}
                  </p>
                  {books.map(book => (
                    <button
                      key={book.abbrev}
                      onClick={() => setActiveBook(book)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
                        book.abbrev === selectedBook
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
                      {book.name}
                    </button>
                  ))}
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
