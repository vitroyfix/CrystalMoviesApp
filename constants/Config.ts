// constants/Config.ts
export const TMDB_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_TMDB_KEY,
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};

// ADD THIS SECTION:
export const OMDB_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_OMBD_KEY, 
  BASE_URL: 'https://www.omdbapi.com',
};

export const PROVIDERS = [
  { 
    name: 'VidLink', 
    movie: (id: string) => `https://vidlink.pro/movie/${id}?primaryColor=e50914&nextbutton=true`,
    tv: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914&nextbutton=true`
  }
];