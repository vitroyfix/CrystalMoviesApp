// hooks/useMovies.ts
import { useState, useEffect } from 'react';
import { TMDB_CONFIG } from '../constants/Config';

export const useHomeData = () => {
  const [trending, setTrending] = useState([]);
  const [action, setAction] = useState([]);
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

        // MATCHING THE NAME HERE: IMAGE_BASE_URL + size (w500)
        const base = `${TMDB_CONFIG.IMAGE_BASE_URL}/w500`;

        setTrending(dataT.results?.map((m: any) => ({
          id: m.id.toString(),
          uri: `${base}${m.poster_path}`, // No more undefined!
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