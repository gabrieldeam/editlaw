import React from 'react';
import styles from './Section.module.css';

const Section: React.FC = () => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.textContainer}>
        <span className={styles.uniqueDocuments}>100 documentos únicos</span>
        <h1 className={styles.title}>Qual <span className={styles.doc}>documento</span> vai <span className={styles.edit}>editar</span> hoje?</h1>
        <p className={styles.subtext}>
          Ferramentas intuitivas para criar contratos perfeitos. Edite, personalize e gerencie contratos com facilidade.
        </p>
      </div>
    </div>
  );
};

export default Section;
