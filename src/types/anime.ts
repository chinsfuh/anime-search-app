// Jikan API Response Types - strictly typed, no 'any'

export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeAired {
  from: string | null;
  to: string | null;
  prop: {
    from: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
    to: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
  };
  string: string;
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface AnimeProducer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeTheme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeDemographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: AnimeAired;
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: AnimeProducer[];
  licensors: AnimeProducer[];
  studios: AnimeProducer[];
  genres: AnimeGenre[];
  explicit_genres: AnimeGenre[];
  themes: AnimeTheme[];
  demographics: AnimeDemographic[];
}

export interface AnimePagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeSearchResponse {
  pagination: AnimePagination;
  data: Anime[];
}

export interface AnimeDetailResponse {
  data: Anime;
}

// Filter Types
export type AnimeType = 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
export type AnimeStatus = 'airing' | 'complete' | 'upcoming';
export type AnimeRating = 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
export type SortOrder = 'asc' | 'desc';

export interface AnimeFilters {
  type: AnimeType | null;
  status: AnimeStatus | null;
  rating: AnimeRating | null;
  genres: number[];
  minScore: number | null;
  orderBy: string | null;
  sort: SortOrder;
}

// Season Selection Type
export interface SelectedSeason {
  year: number;
  season: string; // winter, spring, summer, fall
}

// Season Data for Navigation Menu
export interface SeasonData {
  year: number;
  season: string;
}

export type SeasonType = 'winter' | 'spring' | 'summer' | 'fall';

export interface SeasonsByType {
  winter: SeasonData[];
  spring: SeasonData[];
  summer: SeasonData[];
  fall: SeasonData[];
}

// Redux State Types
export interface AnimeState {
  searchResults: Anime[];
  selectedAnime: Anime | null;
  loading: boolean;
  error: string | null;
  pagination: AnimePagination | null;
  searchQuery: string;
  currentPage: number;
  filters: AnimeFilters;
  selectedSeason: SelectedSeason | null;
  topAnime: Anime[];
  seasonsByType: SeasonsByType;
}
