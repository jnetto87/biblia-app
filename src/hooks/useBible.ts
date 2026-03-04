import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChapter, getRandomVerse, type ChapterResponse, type RandomVerseResponse } from "@/services/api";
import { bibleBooks } from "@/data/books";

export function useBible() {
  const [version, setVersion] = useState("nvi");
  const [bookAbbrev, setBookAbbrev] = useState("gn");
  const [chapter, setChapter] = useState(1);

  const currentBook = bibleBooks.find(b => b.abbrev === bookAbbrev);

  const chapterQuery = useQuery<ChapterResponse>({
    queryKey: ["chapter", version, bookAbbrev, chapter],
    queryFn: () => getChapter(version, bookAbbrev, chapter),
    staleTime: 1000 * 60 * 10,
  });

  const navigateTo = useCallback((abbrev: string, ch: number) => {
    setBookAbbrev(abbrev);
    setChapter(ch);
  }, []);

  const nextChapter = useCallback(() => {
    if (!currentBook) return;
    if (chapter < currentBook.chapters) {
      setChapter(c => c + 1);
    } else {
      const idx = bibleBooks.findIndex(b => b.abbrev === bookAbbrev);
      if (idx < bibleBooks.length - 1) {
        setBookAbbrev(bibleBooks[idx + 1].abbrev);
        setChapter(1);
      }
    }
  }, [chapter, bookAbbrev, currentBook]);

  const prevChapter = useCallback(() => {
    if (chapter > 1) {
      setChapter(c => c - 1);
    } else {
      const idx = bibleBooks.findIndex(b => b.abbrev === bookAbbrev);
      if (idx > 0) {
        const prevBook = bibleBooks[idx - 1];
        setBookAbbrev(prevBook.abbrev);
        setChapter(prevBook.chapters);
      }
    }
  }, [chapter, bookAbbrev]);

  return {
    version,
    setVersion,
    bookAbbrev,
    setBookAbbrev,
    chapter,
    setChapter,
    currentBook,
    chapterQuery,
    navigateTo,
    nextChapter,
    prevChapter,
  };
}

export function useRandomVerse(version: string) {
  return useQuery<RandomVerseResponse>({
    queryKey: ["randomVerse", version, Date.now()],
    queryFn: () => getRandomVerse(version),
    enabled: false,
  });
}
