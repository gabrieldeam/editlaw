// fonts/fontawesome.ts
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faXTwitter, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Importa os estilos

config.autoAddCss = false; // Evita que o FontAwesome adicione estilos automaticamente

library.add(faFacebook, faXTwitter, faTiktok, faInstagram);
