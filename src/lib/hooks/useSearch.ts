export function useSearch() {
  let timeoutId: number;

  async function searchPosts(query: string) {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  function debounceSearch(callback: (results: any[]) => void, query: string, delay = 300) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const results = await searchPosts(query);
      callback(results);
    }, delay);
  }

  return { debounceSearch };
}