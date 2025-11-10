// Popular anime genres with their MAL IDs
export const GENRE_LIST = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Thriller' },
  { id: 9, name: 'Ecchi' },
  { id: 49, name: 'Isekai' },
  { id: 62, name: 'Iyashikei' },
];

export const TYPE_OPTIONS = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

export const STATUS_OPTIONS = [
  { value: 'airing', label: 'Currently Airing' },
  { value: 'complete', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
];

export const RATING_OPTIONS = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13+' },
  { value: 'r17', label: 'R - 17+' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];

export const SCORE_OPTIONS = [
  { value: 9, label: '9+ Outstanding' },
  { value: 8, label: '8+ Great' },
  { value: 7, label: '7+ Good' },
  { value: 6, label: '6+ Fine' },
  { value: 5, label: '5+ Average' },
  { value: 0, label: 'Any Score' },
];
