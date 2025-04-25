import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'afro hub api',
      version: '1.0.0',
      description: 'API documentation for afrohub App',
    },
    servers: [
      {
       url: 'https://afrohub.onrender.com/api',
       
      },
    ],
  },  
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
