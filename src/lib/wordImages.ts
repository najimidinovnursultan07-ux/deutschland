/** Visual quiz image mapping — Unsplash crop URLs keyed by normalized term */
const IMAGE_MAP: Record<string, string> = {
  apfel: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
  wasser: "https://images.unsplash.com/photo-1548839140-5a941f94e586?w=400&h=300&fit=crop",
  water: "https://images.unsplash.com/photo-1548839140-5a941f94e586?w=400&h=300&fit=crop",
  brot: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
  haus: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  house: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  hund: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  dog: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  katze: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
  milch: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
  milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
  buch: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop",
  book: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop",
  auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
  car: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
  blume: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
  flower: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
  sonne: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  sun: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  rot: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
  red: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
  blau: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  blue: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  grün: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop",
  green: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop",
  eins: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
  one: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
  zwei: "https://images.unsplash.com/photo-1596495577886-d920f1fb5138?w=400&h=300&fit=crop",
  two: "https://images.unsplash.com/photo-1596495577886-d920f1fb5138?w=400&h=300&fit=crop",
  drei: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
  three: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
  kaffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
  fisch: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
};

const EMOJI_FALLBACK: Record<string, string> = {
  hallo: "👋",
  hello: "👋",
  danke: "🙏",
  "thank you": "🙏",
  ja: "✅",
  yes: "✅",
  nein: "❌",
  no: "❌",
  mama: "👩",
  mother: "👩",
  papa: "👨",
  father: "👨",
  kind: "👶",
  child: "👶",
  vier: "4️⃣",
  four: "4️⃣",
  fünf: "5️⃣",
  five: "5️⃣",
};

export function normalizeTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/^(ein|eine|der|die|das|a|an|the|to)\s+/i, "")
    .trim();
}

export function getWordImageUrl(term: string): string | null {
  const key = normalizeTerm(term);
  return IMAGE_MAP[key] ?? null;
}

export function getWordEmoji(term: string): string {
  const key = normalizeTerm(term);
  return EMOJI_FALLBACK[key] ?? "📖";
}

export function hasVisualImage(term: string): boolean {
  return getWordImageUrl(term) !== null;
}
