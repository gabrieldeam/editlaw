"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/">
            <img src="/image/editlaw.svg" alt="EditLaw Logo" className={styles.logo} />
          </Link>
          <div className={styles.searchContainer}>
            <img src="/icon/search.svg" alt="Search Icon" className={styles.searchIcon} />
            <input type="text" placeholder="Pesquisar..." className={styles.search} />
          </div>
        </div>
        <div className={styles.right}>
          <Link href="/licenca" className={styles.licenca}>Licença</Link>
          <Link href="/suport" className={styles.licenca}>Suporte</Link>

          <div onClick={handleSearchClick} className={styles.searchMobileContainer}>
            <img src="/icon/search.svg" alt="Search Icon" className={styles.searchMobileIcon} />
          </div>

          <Link href="/cart" className={styles.cartContainer}>
            <img src="/icon/cart.svg" alt="Cart" className={styles.cartIcon} />
          </Link>
          <Link href="/auth/login" className={styles.buttonLogin}>Entrar</Link>
          <Link href="/auth/register" className={styles.button}>Criar uma conta</Link>
        </div>
      </header>

      {!showMobileSearch ? (
        <div className={styles.mobileButtons}>
          <Link href="/auth/login" className={styles.mobileButtonLogin}>Entrar</Link>
          <Link href="/auth/register" className={styles.mobileButton}>Criar uma conta</Link>
        </div>
      ) : (
        <div className={styles.mobileSearchBar}>
          <img src="/icon/search.svg" alt="Search Icon" className={styles.searchIcon} />
          <input type="text" placeholder="Pesquisar..." className={styles.mobileSearchInput} />
        </div>
      )}
    </>
  );
};

export default Header;
