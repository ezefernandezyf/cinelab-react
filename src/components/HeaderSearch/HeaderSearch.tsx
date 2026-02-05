import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../SearchBar/SearchBar';

export default function HeaderSearch() {
  const navigate = useNavigate();

  const onSearch = (q: string) => {
    const encoded = encodeURIComponent(q);
    navigate(`/search?q=${encoded}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <SearchBar defaultValue="" onSearch={onSearch} />
    </div>
  );
}