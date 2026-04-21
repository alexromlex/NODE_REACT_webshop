const fs = require('fs');
const { userDocs } = require('./swagger_docs/userRoute');
const { responses } = require('./swagger_docs/responses');

const swaggerSpec = {
  openapi: '3.2.0',
  info: {
    title: 'NODE REACT webshop API Documentation',
    version: '1.0.0',
    description:
      'Download <a href="http://localhost:5026/api-docs.json" target="_blank">webshop-api-schema.json</a> API schema',
  },
  servers: [
    {
      url: 'http://localhost:5026/api',
    },
  ],
  paths: {
    ...userDocs,
  },
  components: {
    securitySchemes: {
      customAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Use format: ROMLEX token',
      },
    },
    responses: {
      ...responses,
    },
  },
  tags: [
    {
      name: 'User',
      description: 'User model API endpoints',
    },
    {
      name: 'Product',
      description: '[TODO] Product model API endpoints',
    },
    {
      name: 'Order',
      description: '[TODO] Order model API endpoints',
    },
    {
      name: 'Basket',
      description: '[TODO] Basket model API endpoints',
    },
    {
      name: 'Brand',
      description: '[TODO] Brand model API endpoints',
    },
    {
      name: 'Type',
      description: '[TODO] Type model API endpoints',
    },
    {
      name: 'Settings',
      description: '[TODO] Settings model API endpoints',
    },
  ],
};

fs.writeFileSync('./swagger_output.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ Swagger documentation generated successfully!');
console.log('📄 File saved: swagger_output.json');
console.log('📚 Open http://localhost:5026/api-docs to view documentation');
