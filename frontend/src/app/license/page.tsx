'use client';

import React from 'react';
import styles from './Licenca.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faGavel, 
  faPenFancy, 
  faPhoneAlt, 
  faEnvelope, 
  faCalendarAlt, 
  faInfinity, 
  faPaintBrush, 
  faStore, 
  faImage, 
  faLock, 
  faGlobe, 
  faBan, 
  faTimesCircle, 
  faExclamationTriangle, 
  faEdit 
} from '@fortawesome/free-solid-svg-icons';

const Licenca: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>LICENÇA DE USO</h1>
      <p className={styles.intro}>
        Bem-vindo à Editlaw! Ao utilizar nossos serviços, você concorda com os termos desta licença. Leia atentamente para garantir uma experiência segura e proveitosa.
      </p>

      {/* Propriedade Intelectual */}
      <section className={`${styles.section} ${styles.propriedade}`}>
        <h2><FontAwesomeIcon icon={faBook} className={styles.icon} /> Propriedade Intelectual</h2>
        <p>
          Todos os direitos autorais e de propriedade intelectual das peças jurídicas, posts, stories, artes, ícones e textos disponíveis na plataforma Editlaw pertencem exclusivamente à Editlaw. Estes materiais são protegidos por leis de direitos autorais e tratados internacionais.
        </p>
      </section>

      {/* Concessão de Licença */}
      <section className={`${styles.section} ${styles.licenca}`}>
        <h2><FontAwesomeIcon icon={faGavel} className={styles.icon} /> Concessão de Licença</h2>
        <p>
          Concedemos a você uma licença não exclusiva, intransferível e revogável para utilizar os materiais adquiridos em nossa plataforma. Esta licença permite:
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faCalendarAlt} className={styles.cardIcon} />
            <h3>Uso por Período</h3>
            <p>Utilize as peças jurídicas, posts e stories durante o período de validade do seu plano de assinatura, que é de 1 (um) ano a partir da data de aquisição.</p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faInfinity} className={styles.cardIcon} />
            <h3>Quantidade Ilimitada</h3>
            <p>Durante o período de validade do seu plano, você pode acessar e utilizar as peças jurídicas, posts e stories sem restrições de quantidade.</p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faPaintBrush} className={styles.cardIcon} />
            <h3>Personalização</h3>
            <p>Adapte os materiais conforme necessário para atender às suas necessidades específicas, respeitando sempre os limites desta licença.</p>
          </div>
        </div>
      </section>

      {/* Restrições de Uso */}
      <section className={`${styles.section} ${styles.restricoes}`}>
        <h2><FontAwesomeIcon icon={faBan} className={styles.icon} /> Restrições de Uso</h2>
        <p>
          Para proteger nossos direitos e manter a integridade dos materiais fornecidos, as seguintes ações são estritamente proibidas:
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faStore} className={styles.cardIcon} />
            <h3>Venda ou Distribuição</h3>
            <p>Não é permitido vender, licenciar, distribuir ou transferir qualquer material adquirido para terceiros.</p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faImage} className={styles.cardIcon} />
            <h3>Comercialização de Imagens e Artes</h3>
            <p>As imagens e artes fornecidas são para uso exclusivo pessoal ou profissional dentro de sua atuação. A revenda ou distribuição dessas artes é proibida.</p>
          </div>
          <div className={styles.card}>
            <FontAwesomeIcon icon={faLock} className={styles.cardIcon} />
            <h3>Modificação de Direitos Autorais</h3>
            <p>Não altere, remova ou oculte quaisquer avisos de direitos autorais ou marcas registradas pertencentes à Editlaw.</p>
          </div>
        </div>
      </section>

      {/* Conteúdo de Domínio Público */}
      <section className={`${styles.section} ${styles.conteudo}`}>
        <h2><FontAwesomeIcon icon={faGlobe} className={styles.icon} /> Conteúdo de Domínio Público</h2>
        <p>
          Embora utilizemos ícones e fotos de domínio público em nossas artes, a combinação e a criação dessas artes são exclusivas da Editlaw. Isso garante que, mesmo utilizando elementos de domínio público, a obra final oferecida a você é única e protegida.
        </p>
      </section>

      {/* Autoria dos Textos e Writs */}
      <section className={`${styles.section} ${styles.autoria}`}>
        <h2><FontAwesomeIcon icon={faPenFancy} className={styles.icon} /> Autoria dos Textos e Writs</h2>
        <p>
          Todos os textos, petições e documentos jurídicos (writs) disponíveis na plataforma são de autoria exclusiva da Editlaw. Você está autorizado a utilizá-los conforme a licença, mas não pode reivindicar autoria ou redistribuir esses textos de forma independente.
        </p>
      </section>

      {/* Terminação da Licença */}
      <section className={`${styles.section} ${styles.terminacao}`}>
        <h2><FontAwesomeIcon icon={faTimesCircle} className={styles.icon} /> Terminação da Licença</h2>
        <p>
          Reservamo-nos o direito de rescindir esta licença imediatamente, sem aviso prévio, caso você viole qualquer um dos termos aqui estabelecidos. Após a rescisão, você deverá cessar todo e qualquer uso dos materiais fornecidos.
        </p>
      </section>

      {/* Isenção de Responsabilidade */}
      <section className={`${styles.section} ${styles.isencao}`}>
        <h2><FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} /> Isenção de Responsabilidade</h2>
        <p>
          A Editlaw não se responsabiliza por qualquer uso indevido dos materiais adquiridos ou por quaisquer danos resultantes da utilização dos mesmos. É de responsabilidade do usuário assegurar que o uso dos materiais está em conformidade com as leis aplicáveis.
        </p>
      </section>

      {/* Alterações na Licença */}
      <section className={`${styles.section} ${styles.alteracoes}`}>
        <h2><FontAwesomeIcon icon={faEdit} className={styles.icon} /> Alterações na Licença</h2>
        <p>
          Podemos atualizar esta licença periodicamente para refletir mudanças em nossos serviços ou em legislações aplicáveis. Recomendamos que você revise esta página regularmente para se manter informado sobre quaisquer atualizações.
        </p>
      </section>

      {/* Contato */}
      <section className={`${styles.section} ${styles.contato}`}>
        <h2><FontAwesomeIcon icon={faPhoneAlt} className={styles.icon} /> Contato</h2>
        <p>
          Em caso de dúvidas ou para mais informações sobre esta licença, entre em contato conosco através do <a href="mailto:contato@editlaw.com.br" className={styles.link}>contato@editlaw.com.br</a> ou visite nossa seção de <a href="/suporte" className={styles.link}>Suporte/Contato</a> no site.
        </p>
      </section>
    </div>
  );
};

export default Licenca;
