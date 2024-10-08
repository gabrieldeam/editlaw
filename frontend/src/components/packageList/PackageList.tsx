// src/components/packageList/PackageList.tsx
import { useEffect, useState, useRef } from 'react';
import { getAllPackages, Package } from '@/services/packageService';
import { getDocumentById, Document } from '@/services/documentApi';
import { getCategoryById } from '@/services/categoryService';
import { useRouter } from 'next/navigation';
import styles from './packageList.module.css';
import { useCart } from '../../context/CartContext';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categoryNames, setCategoryNames] = useState<{ [docId: string]: string }>({});
  const [packageImages, setPackageImages] = useState<{ [packageId: string]: string[] }>({});
  const router = useRouter();
  const { addToCart } = useCart();

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        setPackages(response);

        // Para cada pacote, buscar as três primeiras imagens dos documentos
        const imagesPromises = response.map(async (pkg) => {
          const firstThreeDocIds = pkg.documentIds.slice(0, 3);
          try {
            const docs = await Promise.all(firstThreeDocIds.map(id => getDocumentById(id)));
            const images = docs.map(doc => `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${doc.image}`);
            return { packageId: pkg.id, images };
          } catch (docError) {
            console.error(`Erro ao buscar documentos para o pacote ${pkg.id}:`, docError);
            return { packageId: pkg.id, images: [] };
          }
        });

        const packagesImages = await Promise.all(imagesPromises);
        const imagesMap = packagesImages.reduce((acc, curr) => {
          acc[curr.packageId] = curr.images;
          return acc;
        }, {} as { [packageId: string]: string[] });

        setPackageImages(imagesMap);
      } catch (error) {
        console.error('Erro ao buscar pacotes ou documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const fetchDocuments = async (documentIds: string[]) => {
    try {
      const documentData = await Promise.all(documentIds.map(id => getDocumentById(id)));
      setDocuments(documentData);

      // Busca os nomes das categorias e armazena no estado categoryNames
      const categoryPromises = documentData.map(async (doc) => {
        const category = await getCategoryById(doc.categoryId);
        return { docId: doc.id, categoryName: category.name };
      });

      const categories = await Promise.all(categoryPromises);
      const categoryMap = categories.reduce((acc, curr) => {
        acc[curr.docId] = curr.categoryName;
        return acc;
      }, {} as { [docId: string]: string });

      setCategoryNames(categoryMap);
    } catch (error) {
      console.error('Erro ao buscar documentos e categorias:', error);
    }
  };

  const handleAddToCart = (packageId?: string) => {
    if (packageId) {
      addToCart({ type: 'package', id: packageId });
    } else {
      console.error('Package ID is undefined');
    }
  };

  const handleBuyNow = (packageId?: string) => {
    if (packageId) {
      addToCart({ type: 'package', id: packageId });
      router.push('/cart');
    } else {
      console.error('Package ID is undefined');
    }
  };

  const toggleExpand = (pkg: Package) => {
    setExpandedPackageId(prevId => (prevId === pkg.id ? null : pkg.id));
    if (expandedPackageId !== pkg.id) {
      fetchDocuments(pkg.documentIds);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  const handleDocumentClick = (docId: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita acionar o onClick do pacote
    router.push(`/document/${docId}`);
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
              {/* Imagens Sobrepostas */}
              <div className={styles.imagesOverlay}>
                {packageImages[pkg.id]?.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Documento ${index + 1}`}
                    className={styles.overlayImage}
                  />
                ))}
              </div>

              {/* Card do Pacote */}
              <div
                className={styles.packageCard}
                onClick={() => toggleExpand(pkg)}
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

              {/* Descrição Expandida */}
              {expandedPackageId === pkg.id && (
                <div className={styles.expandedDescription}>
                  <div className={styles.carousel}>
                    <button onClick={scrollLeft} className={styles.arrow}>
                      <img src="/icon/left-arrow.svg" alt="Scroll Left" />
                    </button>
                    <div className={styles.carouselContent} ref={carouselRef}>
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className={styles.documentCard}
                          onClick={handleDocumentClick(doc.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleDocumentClick(doc.id)(e as any);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${doc.image}`}
                            alt={doc.title}
                            className={styles.documentImage}
                          />
                          <div className={styles.documentInfo}>
                            <h3 className={styles.documentSpace}>{doc.title}</h3>
                            <p className={styles.documentSpace}>
                              {categoryNames[doc.id] || 'Categoria não encontrada'}
                            </p>
                            <p className={styles.documentSpace}>{doc.autor}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={scrollRight} className={styles.arrow}>
                      <img src="/icon/right-arrow.svg" alt="Scroll Right" />
                    </button>
                  </div>
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
