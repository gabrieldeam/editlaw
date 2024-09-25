"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './search.module.css';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  image: string;
}

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');  // Pega o parâmetro de pesquisa "query"
  const category = searchParams.get('category');  // Pega o parâmetro de categoria "category"

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Substitua pela sua chamada API para buscar resultados com base nos parâmetros
        const response = await fetch(`/api/search?query=${query}&category=${category}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    // Executa a busca quando a página é carregada com os parâmetros
    fetchSearchResults();
  }, [query, category]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.searchPage}>
      <h1>Resultados da busca</h1>
      {results.length > 0 ? (
        <div className={styles.resultsList}>
          {results.map((result) => (
            <div key={result.id} className={styles.resultItem}>
              <img src={result.image} alt={result.name} className={styles.resultImage} />
              <div>
                <h2>{result.name}</h2>
                <p>{result.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum resultado encontrado para a sua pesquisa.</p>
      )}
    </div>
  );
};

export default SearchPage;
