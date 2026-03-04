import { useState, useEffect } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRandomVerse, type RandomVerseResponse } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface DailyVerseProps {
  version: string;
}

export function DailyVerse({ version }: DailyVerseProps) {
  const [verse, setVerse] = useState<RandomVerseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchVerse = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getRandomVerse(version);
      setVerse(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerse();
  }, [version]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Versículo do dia
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={fetchVerse}
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Não foi possível carregar.</p>
      ) : verse ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${verse.book.abbrev.pt}-${verse.chapter}-${verse.number}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-serif text-lg leading-relaxed italic">
              "{verse.text}"
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-sans">
              — {verse.book.name} {verse.chapter}:{verse.number}
            </p>
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  );
}
