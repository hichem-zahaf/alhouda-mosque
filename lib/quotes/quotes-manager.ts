/**
 * Quotes manager - handles Islamic quotes and message selection
 */

import quotesData from '@/data/quotes.json';

export interface Quote {
  id: string;
  text: string;
  source: string;
  category?: string;
  conditions?: QuoteCondition[];
}

export type QuoteCategory = 'general' | 'pre-prayer' | 'post-prayer' | 'friday' | 'ramadan';

export interface QuoteCondition {
  type: 'time' | 'day' | 'prayer' | 'holiday';
  value: string | number;
}

export interface QuotesCollection {
  general: Quote[];
  'pre-prayer': Quote[];
  'post-prayer': Quote[];
  friday: Quote[];
  ramadan: Quote[];
}

/**
 * Default quotes collection (fallback if JSON loading fails)
 */
const DEFAULT_QUOTES: QuotesCollection = {
  general: [
    {
      id: 'bismillah',
      text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      source: 'القرآن الكريم',
      category: 'general',
    },
    {
      id: 'ayat-kursi',
      text: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوم',
      source: 'آية الكرسي',
      category: 'general',
    },
    {
      id: 'subhanallah',
      text: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
      source: 'ذكر',
      category: 'general',
    },
  ],
  'pre-prayer': [
    {
      id: 'haya-ala-salah',
      text: 'حَيَّ عَلَى الصَّلَاةِ',
      source: 'الأذان',
      category: 'pre-prayer',
    },
    {
      id: 'prepare-prayer',
      text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَجِيبُوا لِلَّهِ وَلِلرَّسُولِ إِذَا دَعَاكُمْ لِمَا يُحْيِيكُمْ',
      source: 'القرآن الكريم 8:24',
      category: 'pre-prayer',
    },
  ],
  'post-prayer': [
    {
      id: 'astaghfirullah',
      text: 'أَسْتَغْفِرُ اللَّهَ',
      source: 'الذكر بعد الصلاة',
      category: 'post-prayer',
    },
    {
      id: 'subhan-rabb',
      text: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ',
      source: 'القرآن الكريم 37:180',
      category: 'post-prayer',
    },
  ],
  friday: [
    {
      id: 'friday-khutbah',
      text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَى ذِكْرِ اللَّهِ',
      source: 'القرآن الكريم 62:9',
      category: 'friday',
    },
  ],
  ramadan: [
    {
      id: 'ramadan-greeting',
      text: 'رَمَضَانُ كَرِيمٌ',
      source: 'تهنئة',
      category: 'ramadan',
    },
  ],
};

/**
 * Load quotes from imported JSON data
 */
function loadQuotesFromData(): QuotesCollection {
  try {
    const data = quotesData as unknown as QuotesCollection;

    // Validate and merge with defaults
    return {
      general: Array.isArray(data.general) && data.general.length > 0 ? data.general : DEFAULT_QUOTES.general,
      'pre-prayer': Array.isArray(data['pre-prayer']) && data['pre-prayer'].length > 0 ? data['pre-prayer'] : DEFAULT_QUOTES['pre-prayer'],
      'post-prayer': Array.isArray(data['post-prayer']) && data['post-prayer'].length > 0 ? data['post-prayer'] : DEFAULT_QUOTES['post-prayer'],
      friday: Array.isArray(data.friday) && data.friday.length > 0 ? data.friday : DEFAULT_QUOTES.friday,
      ramadan: Array.isArray(data.ramadan) && data.ramadan.length > 0 ? data.ramadan : DEFAULT_QUOTES.ramadan,
    };
  } catch {
    return DEFAULT_QUOTES;
  }
}

/**
 * Active quotes collection (loaded from JSON)
 */
const QUOTES: QuotesCollection = loadQuotesFromData();

/**
 * Get quotes from a category
 */
export function getQuotes(category: QuoteCategory): Quote[] {
  return QUOTES[category] || [];
}

/**
 * Get a random quote from a category
 */
export function getRandomQuote(category: QuoteCategory): Quote | null {
  const quotes = getQuotes(category);
  if (quotes.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Get a quote by ID
 */
export function getQuoteById(id: string): Quote | null {
  for (const category of Object.keys(QUOTES) as QuoteCategory[]) {
    const quote = QUOTES[category].find((q) => q.id === id);
    if (quote) return quote;
  }
  return null;
}

/**
 * Get appropriate quote based on context
 */
export function getContextualQuote(options: {
  isFriday?: boolean;
  isPrePrayer?: boolean;
  isPostPrayer?: boolean;
  isRamadan?: boolean;
}): Quote | null {
  // Prioritize contextual quotes
  if (options.isPrePrayer) {
    return getRandomQuote('pre-prayer');
  }

  if (options.isPostPrayer) {
    return getRandomQuote('post-prayer');
  }

  if (options.isFriday) {
    return getRandomQuote('friday');
  }

  if (options.isRamadan) {
    return getRandomQuote('ramadan');
  }

  // Default to general quotes
  return getRandomQuote('general');
}

/**
 * Cycle through quotes for display
 */
export class QuoteCycler {
  private quotes: Quote[];
  private currentIndex: number = 0;
  private lastUpdate: number = 0;
  private intervalMs: number;

  constructor(quotes: Quote[], intervalMinutes: number = 5) {
    this.quotes = quotes;
    this.intervalMs = intervalMinutes * 60 * 1000;
  }

  /**
   * Get current quote
   */
  getCurrentQuote(): Quote {
    return this.quotes[this.currentIndex];
  }

  /**
   * Get quote based on time (cycles automatically)
   */
  getQuoteForTime(): Quote {
    const now = Date.now();

    if (now - this.lastUpdate >= this.intervalMs) {
      this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
      this.lastUpdate = now;
    }

    return this.getCurrentQuote();
  }

  /**
   * Manually advance to next quote
   */
  nextQuote(): Quote {
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    this.lastUpdate = Date.now();
    return this.getCurrentQuote();
  }

  /**
   * Set quotes collection
   */
  setQuotes(quotes: Quote[]): void {
    this.quotes = quotes;
    this.currentIndex = 0;
  }

  /**
   * Set change interval
   */
  setInterval(minutes: number): void {
    this.intervalMs = minutes * 60 * 1000;
  }
}

/**
 * Create a quote cycler for general quotes
 */
export function createQuoteCycler(intervalMinutes: number = 5): QuoteCycler {
  const generalQuotes = getQuotes('general');
  return new QuoteCycler(generalQuotes, intervalMinutes);
}

/**
 * Parse quotes from JSON
 */
export function parseQuotesFromJSON(jsonString: string): QuotesCollection | null {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    const collection: Partial<QuotesCollection> = {};

    for (const category of ['general', 'pre-prayer', 'post-prayer', 'friday', 'ramadan'] as QuoteCategory[]) {
      if (Array.isArray(data[category])) {
        collection[category] = data[category];
      }
    }

    // Merge with defaults
    return {
      general: collection.general || DEFAULT_QUOTES.general,
      'pre-prayer': collection['pre-prayer'] || DEFAULT_QUOTES['pre-prayer'],
      'post-prayer': collection['post-prayer'] || DEFAULT_QUOTES['post-prayer'],
      friday: collection.friday || DEFAULT_QUOTES.friday,
      ramadan: collection.ramadan || DEFAULT_QUOTES.ramadan,
    };
  } catch {
    return null;
  }
}
