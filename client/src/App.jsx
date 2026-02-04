import { useState, useEffect, useCallback } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';

const PAGE_SIZE = 20;

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({ country: 'GB-SCT' });
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchAlerts = useCallback(async (filters, loadMore = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Add filters
      if (filters.country) {
        params.append('country', `http://data.food.gov.uk/codes/geographies/countries/${filters.country}`);
      }
      if (filters.type) {
        params.append('type', `http://data.food.gov.uk/food-alerts/def/alert-type/${filters.type}`);
      }
      if (filters.hazardCategory) {
        params.append('hazardCategory', filters.hazardCategory);
      }
      if (filters.allergen) {
        params.append('allergen', filters.allergen);
      }

      // Pagination
      const currentOffset = loadMore ? offset : 0;
      params.append('_limit', PAGE_SIZE.toString());
      params.append('_offset', currentOffset.toString());
      params.append('_sort', '-created');

      const response = await fetch(`/api/alerts?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }

      const data = await response.json();

      // Parse the response - FSA API returns items in 'items' array
      const newAlerts = data.items || [];
      const total = data.totalResults || data.itemsPerPage || newAlerts.length;

      if (loadMore) {
        setAlerts(prev => [...prev, ...newAlerts]);
      } else {
        setAlerts(newAlerts);
      }

      setTotalCount(total);
      setOffset(currentOffset + newAlerts.length);
      setHasMore(newAlerts.length === PAGE_SIZE && (currentOffset + newAlerts.length) < total);

    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [offset]);

  const handleSearch = (filters) => {
    setCurrentFilters(filters);
    setOffset(0);
    setAlerts([]);
    fetchAlerts(filters, false);
  };

  const handleLoadMore = () => {
    fetchAlerts(currentFilters, true);
  };

  // Initial load with Scotland filter
  useEffect(() => {
    fetchAlerts({ country: 'GB-SCT' }, false);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">Food Safety Alerts</h1>
        <p className="header__subtitle">
          Search and browse food alerts from Food Standards Scotland
        </p>
        <div className="header__badge">
          Powered by FSA Open Data API
        </div>
      </header>

      <main>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        <ResultsDisplay
          alerts={alerts}
          isLoading={isLoading}
          error={error}
          totalCount={totalCount}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </main>
    </div>
  );
}
