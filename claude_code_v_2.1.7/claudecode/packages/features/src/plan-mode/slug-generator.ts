/**
 * @claudecode/features - Plan Slug Generator
 *
 * Generate human-readable slugs for plan files.
 * Reconstructed from chunks.86.mjs:3-37
 */

// ============================================
// Word Lists
// ============================================

/**
 * Adjectives for slug generation.
 * Original: Q12 in chunks.86.mjs
 */
const ADJECTIVES = [
  // Nature & feelings
  'abundant', 'ancient', 'bright', 'calm', 'cheerful', 'clever', 'cozy', 'curious',
  'dapper', 'dazzling', 'deep', 'delightful', 'eager', 'elegant', 'enchanted',
  'fierce', 'flowing', 'gentle', 'glowing', 'golden', 'graceful', 'happy',
  'humble', 'joyful', 'kind', 'lively', 'majestic', 'merry', 'mighty',
  'noble', 'peaceful', 'playful', 'quiet', 'radiant', 'serene', 'shimmering',
  'silent', 'spirited', 'steadfast', 'swift', 'tender', 'tranquil', 'valiant',
  'vibrant', 'vivid', 'warm', 'whimsical', 'wise', 'wonderful',
  // Technical terms
  'abstract', 'adaptive', 'agile', 'async', 'atomic', 'binary', 'cached',
  'compiled', 'concurrent', 'distributed', 'dynamic', 'functional', 'generic',
  'immutable', 'incremental', 'iterative', 'layered', 'modular', 'parallel',
  'recursive', 'scalable', 'stateless', 'streaming', 'virtual',
];

/**
 * Nouns for slug generation.
 * Original: B12 in chunks.86.mjs
 */
const NOUNS = [
  // Nature
  'aurora', 'avalanche', 'blossom', 'breeze', 'brook', 'bubble', 'canyon',
  'cascade', 'cloud', 'comet', 'coral', 'creek', 'crystal', 'dawn', 'dew',
  'eclipse', 'ember', 'fern', 'flame', 'forest', 'frost', 'galaxy', 'glacier',
  'glow', 'grove', 'harbor', 'horizon', 'island', 'lagoon', 'lake', 'leaf',
  'meadow', 'mist', 'moon', 'moss', 'mountain', 'nebula', 'ocean', 'orchid',
  'peak', 'pebble', 'pine', 'planet', 'prairie', 'quartz', 'rain', 'rainbow',
  'reef', 'river', 'rose', 'shadow', 'shore', 'sky', 'snow', 'spark',
  'spring', 'star', 'stone', 'storm', 'stream', 'sun', 'thunder', 'tide',
  'tree', 'valley', 'wave', 'willow', 'wind',
  // Animals
  'bear', 'bird', 'butterfly', 'deer', 'dolphin', 'dragon', 'eagle', 'falcon',
  'fox', 'hawk', 'lion', 'owl', 'panther', 'phoenix', 'rabbit', 'raven',
  'salmon', 'seal', 'shark', 'sparrow', 'tiger', 'turtle', 'whale', 'wolf',
  // CS pioneers
  'dijkstra', 'hopper', 'knuth', 'lamport', 'liskov', 'lovelace', 'turing',
];

/**
 * Actions for slug generation.
 * Original: G12 in chunks.86.mjs
 */
const ACTIONS = [
  'baking', 'beaming', 'booping', 'bouncing', 'brewing', 'bubbling', 'chasing',
  'climbing', 'conjuring', 'crafting', 'dancing', 'dazzling', 'discovering',
  'doodling', 'dreaming', 'exploring', 'floating', 'flowing', 'flying',
  'gathering', 'gliding', 'glowing', 'growing', 'humming', 'jumping', 'leaping',
  'learning', 'munching', 'painting', 'playing', 'racing', 'resting', 'rolling',
  'running', 'sailing', 'searching', 'seeking', 'shimmering', 'singing',
  'skating', 'skipping', 'sleeping', 'soaring', 'sparkling', 'spinning',
  'splashing', 'sprouting', 'swimming', 'swinging', 'thinking', 'traveling',
  'tumbling', 'twirling', 'wandering', 'watching', 'weaving', 'wondering',
];

// ============================================
// Random Selection
// ============================================

/**
 * Get random element from array.
 */
function randomChoice<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('randomChoice() called with empty array');
  }
  const idx = Math.floor(Math.random() * array.length);
  return array[idx]!;
}

// ============================================
// Slug Generation
// ============================================

/**
 * Generate a random slug.
 * Original: Z12 in chunks.86.mjs
 *
 * @returns Slug like "bright-exploring-aurora"
 */
export function generateSlug(): string {
  const adjective = randomChoice(ADJECTIVES);
  const action = randomChoice(ACTIONS);
  const noun = randomChoice(NOUNS);
  return `${adjective}-${action}-${noun}`;
}

/**
 * Total possible combinations.
 * ~8 million with current word lists.
 */
export const TOTAL_COMBINATIONS = ADJECTIVES.length * ACTIONS.length * NOUNS.length;

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复导出。
