import { useEffect, useState } from 'react';
import { getAllPackages, Package } from '@/services/packageService'; // Importa a função de busca de pacotes
import { useRouter } from 'next/navigation';
import styles from './packageList.module.css';
import { useCart } from '../../context/CartContext'; // Ajuste o caminho conforme necessário

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null); // Estado para controlar o pacote expandido
  const router = useRouter();
  const { addToCart } = useCart(); // Função para adicionar ao carrinho

  // Busca os pacotes ao montar o componente
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        setPackages(response);
      } catch (error) {
        console.error('Erro ao buscar pacotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleAddToCart = (packageId?: string) => {
    if (packageId) {
      addToCart(packageId);
    } else {
      console.error('Package ID is undefined');
    }
  };

  const handleBuyNow = (packageId?: string) => {
    if (packageId) {
      addToCart(packageId);
      router.push('/cart');
    } else {
      console.error('Package ID is undefined');
    }
  };

  const toggleExpand = (packageId: string) => {
    setExpandedPackageId(prevId => (prevId === packageId ? null : packageId)); // Alterna entre expandido e colapsado
  };

  return (
    <>
            <div className={styles.header}>        
        <img
          className={styles.checkIcon}
          src="/icon/checklogo.svg"
          alt="Check logo"
        />
        <h1 className={styles.categoryName}>Pacotes</h1>
      </div>
      <div className={styles.container}>
      {loading ? (
        <div>Carregando pacotes...</div>
      ) : (
        packages.map((pkg) => (
          <div key={pkg.id} className={styles.packageContainer}>
            <div
              className={styles.packageCard}
              onClick={() => toggleExpand(pkg.id)}
            >
              <div className={styles.packageInfo}>
                <div className={styles.packageHeader}>
                  <h2 className={styles.packageTitle}>{pkg.title}</h2>
                  <div className={styles.packageDocInfo}>
                    <img src="/icon/doc.svg" alt="Document Icon" className={styles.docIcon} />
                    <span className={styles.documentCount}>{pkg.documentIds.length}</span>
                  </div>
                </div>
                <p className={styles.packagePrice}>
                  {pkg.precoDesconto ? (
                    <>
                      <span className={styles.precoDesconto}>R$ {pkg.precoDesconto.toFixed(2)}</span>
                      <span className={styles.precoOriginal}>R$ {pkg.preco.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>R$ {pkg.preco.toFixed(2)}</span>
                  )}
                </p>
                <h4 className={styles.packageDescricao}>{pkg.descricao}</h4>
                <div className={styles.buttons}>
                  <button
                    className={styles.cartButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(pkg.id);
                    }}
                  >
                    Adicionar ao Carrinho
                  </button>
                  <button
                    className={styles.buyButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(pkg.id);
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
  
            {/* Renderiza o retângulo de descrição completo ao lado ou abaixo, dependendo da tela */}
            {expandedPackageId === pkg.id && (
              <div className={styles.expandedDescription}>
                <p>{pkg.descricao}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
    </>
    
  );
};

export default PackageList;
