import { useState } from 'react';
import { createCoupon, updateCoupon, Coupon } from '../../../services/couponService';
import Input from '../../../components/input/Input';
import styles from './couponModal.module.css';

interface CouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose, onDelete, onRefresh }) => {
  const [name, setName] = useState(coupon?.name || '');
  const [discountRate, setDiscountRate] = useState<number>(coupon?.discountRate || 0);
  const [isActive, setIsActive] = useState<boolean>(coupon?.isActive ?? true); // Ajustado o tipo aqui
  const [validUntil, setValidUntil] = useState(coupon?.validUntil || '');

  const handleSave = async () => {
    try {
      const data = { name, discountRate, isActive, validUntil };
      
      if (coupon && coupon.id) {
        await updateCoupon(coupon.id, data);
      } else {
        await createCoupon(data);
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{coupon ? 'Editar Cupom' : 'Criar Cupom'}</h2>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Input
            label="Nome"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Desconto (%)"
            name="discountRate"
            type="number"
            value={discountRate.toString()}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
          />
          <Input
            label="Ativo"
            name="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)} // Aqui está correto, pois espera um boolean
          />
          <Input
            label="Validade"
            name="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />

          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            {coupon && coupon.id && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => coupon.id && onDelete(coupon.id)}
              >
                Excluir
              </button>
            )}
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
