import { OpenAPIV3 } from 'openapi-types';

// Defina suas opções aqui
const swaggerOptions: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'EditLaw API',
    version: '1.0.0',
    description: 'API para o sistema EditLaw',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  paths: {
    '/api': {
      get: {
        summary: 'Verifica o status da API',
        responses: {
          '200': {
            description: 'API funcionando!',
          },
        },
      },
    },
  },
};

export default swaggerOptions;
