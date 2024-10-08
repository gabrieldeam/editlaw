'use client';

import React from 'react';
import styles from './TermosDeUso.module.css';

const TermosDeUso: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TERMOS DE USO</h1>
      <p className={styles.intro}>
        Bem-vindo à Editlaw! Estes Termos de Uso regulam o acesso e a utilização dos serviços oferecidos pela Editlaw, acessíveis através do site editlaw.com.br. Ao utilizar nossa plataforma, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com algum destes termos, por favor, não utilize nossos serviços.
      </p>

      {/* 1. Aceitação dos Termos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou utilizar os serviços da Editlaw, você declara ter lido, compreendido e aceitado estar vinculado a estes Termos de Uso e a todas as leis e regulamentos aplicáveis. Caso não concorde com estes termos, você está proibido de utilizar ou acessar este site. Você também concorda com os termos descritos em nossa Política de Privacidade.
        </p>
      </section>

      {/* 2. Descrição dos Serviços */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Descrição dos Serviços</h2>
        <p>
          A Editlaw é uma startup que auxilia profissionais do direito a obter modelos de peças processuais devidamente testadas e validadas, bem como conteúdos em formato VisualLaw, através do site editlaw.com.br. Além disso, disponibilizamos peças prontas para stories e posts, incluindo arte e texto, para utilização dos nossos usuários.
        </p>
      </section>

      {/* 3. Elegibilidade */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Elegibilidade</h2>
        <p>
          Para utilizar os serviços da Editlaw, você deve ser maior de 18 anos e possuir capacidade legal para celebrar contratos. Ao utilizar nossos serviços, você declara e garante que atende a esses requisitos.
        </p>
      </section>

      {/* 4. Contas de Usuário */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Contas de Usuário</h2>
        <p>
          Para acessar certas funcionalidades da plataforma, pode ser necessário criar uma conta. Ao criar uma conta, você concorda em fornecer informações precisas, atualizadas e completas. É de sua responsabilidade manter a confidencialidade de suas credenciais de acesso e notificar imediatamente a Editlaw em caso de uso não autorizado de sua conta.
        </p>
      </section>

      {/* 5. Licença e Acesso */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Licença e Acesso</h2>
        <p>
          A Editlaw concede a você uma licença não exclusiva, intransferível e revogável para acessar e utilizar os materiais disponibilizados na plataforma, conforme os termos da Licença de Uso disponível na seção específica do site. Essa licença é válida pelo período de vigência do seu pacote adquirido, que é de 1 (um) ano a partir da data de aquisição.
        </p>
      </section>

      {/* 6. Proibições de Uso */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Proibições de Uso</h2>
        <p>
          Você concorda em não utilizar os serviços da Editlaw para quaisquer fins ilegais ou não autorizados. Especificamente, você se compromete a não:
        </p>
        <ul className={styles.list}>
          <li>Reproduzir, distribuir ou criar trabalhos derivados de qualquer material disponível na plataforma, exceto conforme permitido pela Licença de Uso.</li>
          <li>Vender, alugar, sublicenciar ou transferir qualquer conteúdo adquirido para terceiros.</li>
          <li>Interferir ou comprometer a segurança da plataforma ou tentar obter acesso não autorizado a qualquer parte dela.</li>
          <li>Utilizar os materiais de maneira que viole quaisquer leis ou regulamentos aplicáveis.</li>
        </ul>
      </section>

      {/* 7. Propriedade Intelectual */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Propriedade Intelectual</h2>
        <p>
          Todos os conteúdos disponibilizados pela Editlaw, incluindo, mas não se limitando a, textos, peças processuais, artes, ícones, fotos e conteúdos em VisualLaw, são de propriedade exclusiva da Editlaw ou de seus licenciadores e estão protegidos pelas leis de direitos autorais e outras legislações de propriedade intelectual. Nenhuma parte do conteúdo pode ser reproduzida, distribuída ou utilizada de qualquer forma sem a autorização prévia por escrito da Editlaw.
        </p>
      </section>

      {/* 8. Pagamentos e Reembolsos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Pagamentos e Reembolsos</h2>
        <p>
          Os serviços da Editlaw são oferecidos mediante a aquisição de pacotes com validade de 1 (um) ano. Os pagamentos devem ser efetuados através dos métodos disponibilizados na plataforma. Todos os pagamentos são não reembolsáveis, exceto conforme exigido por lei ou conforme definido na Política de Reembolso disponível na plataforma.
        </p>
      </section>

      {/* 9. Rescisão */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Rescisão</h2>
        <p>
          A Editlaw reserva-se o direito de rescindir ou suspender seu acesso aos serviços, sem aviso prévio, caso você viole qualquer um dos termos estabelecidos nestes Termos de Uso. Em caso de rescisão, você deverá cessar imediatamente todo e qualquer uso dos materiais fornecidos pela Editlaw.
        </p>
      </section>

      {/* 10. Isenção de Responsabilidade */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>10. Isenção de Responsabilidade</h2>
        <p>
          Os materiais fornecidos pela Editlaw são disponibilizados "no estado em que se encontram" e "conforme a disponibilidade". A Editlaw não garante a precisão, completude ou adequação dos conteúdos para qualquer finalidade específica. O uso dos materiais é de sua inteira responsabilidade, e a Editlaw não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar os serviços.
        </p>
      </section>

      {/* 11. Limitação de Responsabilidade */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>11. Limitação de Responsabilidade</h2>
        <p>
          Em nenhuma hipótese a Editlaw será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, boa vontade, uso, dados ou outras perdas intangíveis resultantes do uso ou da incapacidade de usar os serviços da Editlaw.
        </p>
      </section>

      {/* 12. Legislação Aplicável e Jurisdição */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>12. Legislação Aplicável e Jurisdição</h2>
        <p>
          Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Qualquer disputa decorrente ou relacionada a estes termos estará sujeita à jurisdição exclusiva dos tribunais competentes de Vila Velha-ES, Brasil.
        </p>
      </section>

      {/* 13. Alterações aos Termos de Uso */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>13. Alterações aos Termos de Uso</h2>
        <p>
          A Editlaw reserva-se o direito de modificar, alterar ou atualizar estes Termos de Uso a qualquer momento, sem aviso prévio. As alterações entrarão em vigor imediatamente após a publicação no site. É responsabilidade do usuário revisar periodicamente os Termos de Uso para estar ciente de quaisquer modificações. Caso você não concorde com os novos Termos de Uso, você deverá cessar o uso da plataforma.
        </p>
      </section>

      {/* 14. Disposições Gerais */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>14. Disposições Gerais</h2>
        <p>
          Estes Termos de Uso constituem o acordo integral entre você e a Editlaw no que diz respeito ao uso dos serviços. Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
        </p>
      </section>

      {/* 15. Contato */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>15. Contato</h2>
        <p>
          Para quaisquer dúvidas, comentários ou solicitações relacionadas a estes Termos de Uso, entre em contato conosco através do e-mail <a href="mailto:contato@editlaw.com.br" className={styles.link}>contato@editlaw.com.br</a> ou visite nossa seção de <a href="/suporte" className={styles.link}>Suporte/Contato</a> no site.
        </p>
      </section>
    </div>
  );
};

export default TermosDeUso;
