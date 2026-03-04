import { useState, useCallback, useEffect } from "react";

export interface FavoriteVerse {
  id: string; // "version:abbrev:chapter:verse"
  bookName: string;
  abbrev: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

const STORAGE_KEY = "bible_favorites";

function loadFavorites(): FavoriteVerse[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((verse: FavoriteVerse) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === verse.id);
      if (exists) {
        return prev.filter(f => f.id !== verse.id);
      }
      return [...prev, verse];
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some(f => f.id === id),
    [favorites]
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  return { favorites, toggleFavorite, isFavorite, removeFavorite };
}
