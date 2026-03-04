const BASE_URL = "https://www.abibliadigital.com.br/api";
const TOKEN = import.meta.env.VITE_BIBLIA_TOKEN || "";

export interface VerseData {
  number: number;
  text: string;
}

export interface ChapterResponse {
  book: {
    abbrev: { pt: string; en: string };
    name: string;
    author: string;
    group: string;
    version: string;
  };
  chapter: {
    number: number;
    verses: number;
  };
  verses: VerseData[];
}

export interface RandomVerseResponse {
  book: {
    abbrev: { pt: string; en: string };
    name: string;
  };
  chapter: number;
  number: number;
  text: string;
}

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

if (TOKEN) {
  headers["Authorization"] = `Bearer ${TOKEN}`;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getChapter(
  version: string,
  abbrev: string,
  chapter: number
): Promise<ChapterResponse> {
  const cacheKey = `bible_cache_${version}_${abbrev}_${chapter}`;
  try {
    const data = await fetchApi<ChapterResponse>(
      `/verses/${version}/${abbrev}/${chapter}`
    );
    // Cache for offline
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    // Try cached version
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
}

export async function getRandomVerse(
  version: string
): Promise<RandomVerseResponse> {
  return fetchApi<RandomVerseResponse>(`/verses/${version}/random`);
}
