"use client";

import { useEffect, useState } from 'react';
import { getAllCoupons, deleteCoupon, Coupon } from '../../../services/couponService';
import styles from './coupons.module.css';
import CouponModal from './CouponModal';

const CouponsPage: React.FC = () => {

  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllCoupons(page, size);
        setCoupons(response.coupons || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || 1);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar cupons.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [page, size]);

  const handleCreateCoupon = () => {
    setSelectedCoupon(null);
    setModalOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setModalOpen(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este cupom?");
    if (confirmDelete) {
      try {
        await deleteCoupon(id);
        const response = await getAllCoupons(page, size);
        setCoupons(response.coupons || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || 1);
      } catch (error) {
        console.error(error);
        setError("Erro ao deletar o cupom.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lista de Cupons</h1>
        <button className={styles.createButton} onClick={handleCreateCoupon}>
          Criar Cupom
        </button>
      </div>

      {loading ? (
        <div>Carregando cupons...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.couponList}>
          <div className={styles.couponHeader}>
            <span>#</span>
            <span>Nome</span>
            <span>Desconto (%)</span>
            <span>Ativo</span>
            <span>Validade</span>
          </div>
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <div
                key={coupon.id}
                className={`${styles.couponItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
                onClick={() => handleEditCoupon(coupon)}
              >
                <span>{(page - 1) * size + index + 1}</span>
                <span>{coupon.name}</span>
                <span>{coupon.discountRate}</span>
                <span>{coupon.isActive ? 'Sim' : 'Não'}</span>
                <span>{coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'N/A'}</span>
              </div>
            ))
          ) : (
            <div>Nenhum cupom encontrado.</div>
          )}
        </div>
      )}

      <div className={styles.pagination}>
        <button 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
          disabled={page === 1}
        >
          Página Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button 
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={page === totalPages}
        >
          Próxima Página
        </button>
      </div>

      {modalOpen && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setModalOpen(false)}
          onDelete={handleDeleteCoupon}
          onRefresh={() => {
            getAllCoupons(page, size)
              .then(response => {
                setCoupons(response.coupons || []);
                setTotalPages(response.totalPages || 1);
                setPage(response.currentPage || 1);
              })
              .catch(err => {
                console.error(err);
                setError("Erro ao recarregar cupons.");
              });
          }}
        />
      )}
    </div>
  );
};

export default CouponsPage;
