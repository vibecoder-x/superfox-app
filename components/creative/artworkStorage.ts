export type Artwork = {
  id: string;
  dataUrl: string;
  timestamp: number;
};

const STORAGE_KEY = 'superfox-artworks';

function isArtwork(value: unknown): value is Artwork {
  if (!value || typeof value !== 'object') return false;
  const artwork = value as Partial<Artwork>;
  return typeof artwork.id === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(artwork.id)
    && typeof artwork.dataUrl === 'string' && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(artwork.dataUrl)
    && typeof artwork.timestamp === 'number' && Number.isFinite(artwork.timestamp) && artwork.timestamp > 0;
}

/** Keep local artwork local; never render arbitrary URLs from browser storage. */
export function readArtworks(): Artwork[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error('Invalid artwork collection');
  return parsed.filter(isArtwork);
}

export function writeArtworks(artworks: Artwork[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
}

export function saveArtwork(dataUrl: string, prefix: 'artwork' | 'coloring') {
  const artwork = { id: `${prefix}-${Date.now()}`, dataUrl, timestamp: Date.now() };
  if (!isArtwork(artwork)) throw new Error('Invalid artwork');
  writeArtworks([...readArtworks(), artwork]);
}
