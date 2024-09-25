import { useState } from 'react';
import styles from './CustomSelect.module.css';

interface Option {
  id: string;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect, placeholder = "Todas as categorias" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(placeholder); // Definir a opção padrão como 'Todas as categorias'

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: Option | null) => {
    if (option === null) {
      setSelected(placeholder); // Selecionar a opção padrão
      onSelect('');
    } else {
      setSelected(option.name);
      onSelect(option.id);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.selected} onClick={toggleDropdown}>
        {selected}
        <img src="/icon/down-arrow.svg" alt="Arrow Icon" className={styles.icon} />
      </div>
      {isOpen && (
        <div className={styles.options}>
          <div className={styles.option} onClick={() => handleSelect(null)}>
            {placeholder}
          </div>
          {options.map((option) => (
            <div
              key={option.id}
              className={styles.option}
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
