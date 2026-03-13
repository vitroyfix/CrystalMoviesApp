// hooks/useMovies.ts
import { useState, useEffect } from 'react';
import { TMDB_CONFIG, OMDB_CONFIG } from '../constants/Config';

const IMAGE_SIZE = 'w500';

const languageMap: any = {
  en: "English", zh: "Chinese", fr: "French", es: "Spanish", ja: "Japanese",
  de: "German", it: "Italian", ko: "Korean", hi: "Hindi", ru: "Russian",
};

// --- HOME DATA HOOK ---
export const useHomeData = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [action, setAction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTrending, resAction] = await Promise.all([
          fetch(`${TMDB_CONFIG.BASE_URL}/trending/all/day?api_key=${TMDB_CONFIG.API_KEY}`),
          fetch(`${TMDB_CONFIG.BASE_URL}/discover/movie?api_key=${TMDB_CONFIG.API_KEY}&with_genres=28`)
        ]);

        const dataT = await resTrending.json();
        const dataA = await resAction.json();
        const base = `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZE}`;

        setTrending(dataT.results?.map((m: any) => ({
          id: m.id.toString(),
          uri: `${base}${m.poster_path}`,
          title: m.title || m.name,
          mediaType: m.media_type || 'movie' // CRITICAL: Identify if it's a movie or tv
        })) || []);

        setAction(dataA.results?.map((m: any) => ({
          id: m.id.toString(),
          uri: `${base}${m.poster_path}`,
          mediaType: 'movie' // Discover/movie is always movie
        })) || []);
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { trending, action, loading };
};

// --- MOVIE DETAILS FUNCTION ---
export const fetchMovieDetails = async (id: string, mediaType = "movie", season = 1, episode = 1) => {
  const PROVIDERS = [
    { 
      name: 'VidLink', 
      movie: (id: string) => `https://vidlink.pro/movie/${id}?primaryColor=e50914&nextbutton=true`,
      tv: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914&nextbutton=true`
    },
    { 
      name: 'VidSrc', 
      movie: (id: string) => `https://vidsrc-embed.ru/embed/movie/${id}`,
      tv: (id: string, s: number, e: number) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}-${e}`
    }
  ];

  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_CONFIG.BASE_URL}/${mediaType}/${id}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=external_ids,seasons`),
      fetch(`${TMDB_CONFIG.BASE_URL}/${mediaType}/${id}/credits?api_key=${TMDB_CONFIG.API_KEY}`)
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    let plot = details.overview;
    const imdbId = details.external_ids?.imdb_id;

    if (imdbId && OMDB_CONFIG?.API_KEY) {
      try {
        const omdbRes = await fetch(`${OMDB_CONFIG.BASE_URL}/?i=${imdbId}&plot=full&apikey=${OMDB_CONFIG.API_KEY}`);
        const omdbData = await omdbRes.json();
        if (omdbData.Plot && omdbData.Plot !== "N/A") plot = omdbData.Plot;
      } catch (e) { console.warn("OMDb Plot Error"); }
    }

    const streams = PROVIDERS.map(p => ({
      provider: p.name,
      url: mediaType === "movie" ? p.movie(id) : p.tv(id, season, episode)
    }));

    // Logic to handle "Director" for movies vs "Creator" for TV
    const director = mediaType === 'movie' 
      ? credits.crew?.find((c: any) => c.job === "Director")?.name 
      : details.created_by?.[0]?.name || "N/A";

    return {
      id,
      title: details.title || details.name,
      poster: details.poster_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/w500${details.poster_path}` : null,
      backdrop: details.backdrop_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/original${details.backdrop_path}` : null,
      badgeYear: (details.release_date || details.first_air_date || "").split("-")[0],
      rating: details.vote_average?.toFixed(1) || "0",
      runtime: details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : (details.episode_run_time?.[0] ? `${details.episode_run_time[0]}m` : "N/A"),
      plot,
      cast: credits.cast?.slice(0, 8).map((a: any) => a.name).join(", "),
      director: director || "N/A",
      genre: details.genres?.map((g: any) => g.name).join(", "),
      language: languageMap[details.original_language] || details.original_language,
      streams,
    };
  } catch (error) {
    console.error("Fetch Details Error:", error);
    return null;
  }
};