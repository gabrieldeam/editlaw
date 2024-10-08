// components/footer/Footer.tsx

import React from 'react';
import styles from './Footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo" itemScope itemType="http://schema.org/WPFooter">
      <div className={styles.social} role="navigation" aria-labelledby="social-heading">
        <a href="#" aria-label="Facebook">
          <FontAwesomeIcon icon={['fab', 'facebook']} />
        </a>
        <a href="#" aria-label="Twitter">
          <FontAwesomeIcon icon={['fab', 'x-twitter']} />
        </a>
        <a href="#" aria-label="tiktok">
          <FontAwesomeIcon icon={['fab', 'tiktok']} />
        </a>
        <a href="#" aria-label="Instagram">
          <FontAwesomeIcon icon={['fab', 'instagram']} />
        </a>
      </div>
      <hr className={styles['footer-break']} />
      <ul className={styles['footer-links']} role="navigation" aria-labelledby="footer-links-heading">
        <h3 id="footer-links-heading" className="sr-only">Footer Links</h3>
        <li><a href="/license">Licença</a></li>
        <li><a href="/suporte">Suporte</a></li>
        <li><a href="/user-terms">Termo de uso</a></li>
        <li><a href="#">Politica de privacidade</a></li>
      </ul>
      <p className={styles.copyright}>© 2024 Editlaw</p>
    </footer>
  );
};

export default Footer;
