// hooks/useMovies.ts
import { useState, useEffect } from 'react';
import { TMDB_CONFIG } from '../constants/Config';

const IMAGE_SIZE = 'w500';

// --- EXISTING HOME HOOK ---
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
          title: m.title || m.name
        })) || []);

        setAction(dataA.results?.map((m: any) => ({
          id: m.id.toString(),
          uri: `${base}${m.poster_path}`
        })) || []);

      } catch (err) {
        console.error("Crystal API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { trending, action, loading };
};

// --- NEW MOVIE CATEGORIES HOOK ---
export const useMoviesByGenre = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const genres = [
    { id: '28', name: 'Action' },
    { id: '35', name: 'Comedy' },
    { id: '27', name: 'Horror' },
    { id: '878', name: 'Sci-Fi' },
    { id: '10749', name: 'Romance' },
    { id: '53', name: 'Thriller' }
  ];

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const base = `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZE}`;
        
        const requests = genres.map(genre => 
          fetch(`${TMDB_CONFIG.BASE_URL}/discover/movie?api_key=${TMDB_CONFIG.API_KEY}&with_genres=${genre.id}`)
            .then(res => res.json())
            .then(data => ({
              title: genre.name,
              data: data.results.map((m: any) => ({
                id: m.id.toString(),
                uri: `${base}${m.poster_path}`,
              }))
            }))
        );

        const results = await Promise.all(requests);
        setSections(results);
      } catch (error) {
        console.error("Genre Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllGenres();
  }, []);

  return { sections, loading };
};

// --- NEW TV SHOWS HOOK ---
export const useTVData = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tvGenres = [
    { id: '10759', name: 'Action & Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '18', name: 'Drama' },
    { id: '10765', name: 'Sci-Fi & Fantasy' }
  ];

  useEffect(() => {
    const fetchTV = async () => {
      try {
        const base = `${TMDB_CONFIG.IMAGE_BASE_URL}/${IMAGE_SIZE}`;
        
        const requests = tvGenres.map(genre => 
          fetch(`${TMDB_CONFIG.BASE_URL}/discover/tv?api_key=${TMDB_CONFIG.API_KEY}&with_genres=${genre.id}`)
            .then(res => res.json())
            .then(data => ({
              title: genre.name,
              data: data.results.map((t: any) => ({
                id: t.id.toString(),
                uri: `${base}${t.poster_path}`,
              }))
            }))
        );

        const results = await Promise.all(requests);
        setSections(results);
      } catch (error) {
        console.error("TV Genre Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTV();
  }, []);

  return { sections, loading };
};