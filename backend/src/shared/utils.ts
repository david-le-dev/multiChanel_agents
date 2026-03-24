export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

export const uniqueStrings = (values: string[]) =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

export const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const htmlEntities: Record<string, string> = {
  amp: "&",
  apos: "'",
  copy: "c",
  gt: ">",
  hellip: "...",
  laquo: "\"",
  ldquo: "\"",
  lsquo: "'",
  mdash: "-",
  ndash: "-",
  nbsp: " ",
  quot: "\"",
  raquo: "\"",
  rdquo: "\"",
  reg: "r",
  rsquo: "'",
  trade: "tm",
  lt: "<",
};

export const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    const normalized = entity.toLowerCase();

    if (normalized.startsWith("#x")) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalized.startsWith("#")) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return htmlEntities[normalized] ?? " ";
  });

export const stripHtml = (html: string) =>
  decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

export const extractMetaContent = (html: string, name: string) => {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  const match = html.match(pattern);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : undefined;
};

export const extractReadableArticle = (html: string) => {
  const candidates = [
    html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1],
    html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1],
  ].filter((candidate): candidate is string => Boolean(candidate));

  const cleanedCandidates = candidates
    .map((candidate) => stripHtml(candidate))
    .map((candidate) => candidate.replace(/\b(cookie|subscribe|sign in|view profile|newsletter)\b/gi, " "))
    .map((candidate) => candidate.replace(/\s+/g, " ").trim())
    .filter((candidate) => candidate.length > 280);

  return cleanedCandidates.sort((left, right) => right.length - left.length)[0];
};

export const summarizeText = (text: string, maxSentences = 3) => {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40)
    .filter((sentence) => /[a-z]{4,}/i.test(sentence));

  return sentences.slice(0, maxSentences).join(" ");
};

export const topKeywords = (text: string, limit = 8) => {
  const stopWords = new Set([
    "aged",
    "about",
    "after",
    "affiliate",
    "all",
    "are",
    "after",
    "also",
    "article",
    "been",
    "been",
    "being",
    "but",
    "can",
    "candidate",
    "com",
    "edition",
    "from",
    "gardens",
    "have",
    "here",
    "homes",
    "into",
    "just",
    "latest",
    "magazine",
    "more",
    "need",
    "news",
    "now",
    "published",
    "rsquo",
    "ndash",
    "select",
    "sign",
    "site",
    "summer",
    "that",
    "their",
    "there",
    "these",
    "they",
    "this",
    "through",
    "try",
    "want",
    "what",
    "when",
    "will",
    "with",
    "you",
    "your",
    "the",
    "and",
  ]);

  const frequencies = new Map<string, number>();

  for (const token of text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []) {
    if (stopWords.has(token)) {
      continue;
    }

    frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  }

  return [...frequencies.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([word]) => word);
};
