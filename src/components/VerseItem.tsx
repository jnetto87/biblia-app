import { useState } from "react";
import { Heart, Copy, MoreHorizontal, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { VerseData } from "@/services/api";

interface VerseItemProps {
  verse: VerseData;
  bookName: string;
  abbrev: string;
  chapter: number;
  version: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  searchTerm?: string;
}

function highlightText(text: string, term: string) {
  if (!term) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-highlight rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function VerseItem({
  verse,
  bookName,
  abbrev,
  chapter,
  version,
  isFavorite,
  onToggleFavorite,
  searchTerm = "",
}: VerseItemProps) {
  const [justCopied, setJustCopied] = useState(false);

  const reference = `${bookName} ${chapter}:${verse.number}`;
  const fullText = `"${verse.text}" — ${reference} (${version.toUpperCase()})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setJustCopied(true);
    toast.success("Versículo copiado!");
    setTimeout(() => setJustCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: verse.number * 0.02 }}
      className="group relative flex gap-3 py-1.5 px-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors"
    >
      <span className="text-verse-number text-xs font-sans font-semibold pt-1.5 select-none min-w-[1.5rem] text-right">
        {verse.number}
      </span>
      <p className="font-serif text-lg leading-relaxed flex-1">
        {highlightText(verse.text, searchTerm)}
      </p>

      {/* Desktop hover actions */}
      <div className="hidden md:flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onToggleFavorite}
        >
          <Heart
            className={`h-3.5 w-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          {justCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden flex items-start pt-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleFavorite}>
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-primary text-primary" : ""}`} />
              {isFavorite ? "Remover favorito" : "Favoritar"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
