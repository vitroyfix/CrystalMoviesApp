// constants/Config.ts
export const TMDB_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_TMDB_KEY, // Best practice: Use process.env.EXPO_PUBLIC_TMDB_KEY
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};

export const PROVIDERS = [
  { 
    name: 'VidLink', 
    movie: (id: string) => `https://vidlink.pro/movie/${id}?primaryColor=e50914`,
    tv: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914`
  }
];