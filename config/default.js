/* eslint-disable @typescript-eslint/camelcase */
require('dotenv').config();

const PORT = process.env.PORT || 4042;
module.exports = {
  app: {
    appName: process.env.APP_NAME || 'Order-backend-API',
    environment: process.env.NODE_ENV || 'development',
    superSecret: process.env.SERVER_SECRET || 'Order-backend-API',
    baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
    port: PORT,
  },
  database: {
    firebase: {
      api_key:  process.env.FIREBASE_API_KEY,
      auth_domain:  process.env.FIREBASE_AUTH_DOMAIN,
      database_url:  process.env.FIREBASE_DATABASE_URL,
      project_id:  process.env.FIREBASE_PROJECT_ID,
      storage_bucket:  process.env.FIREBASE_STORAGE_BUCKET,
      messaging_sender_id:  process.env.FIREBASE_MESSAGING_SENDER_ID,
      app_id:  process.env.FIREBASE_APP_ID,
      client_email:  process.env.FIREBASE_CLIENT_EMAIL,
      private_key:  process.env.FIREBASE_PRIVATE_KEY,
    },
  },
  api: {
    lang: 'en',
    prefix: '^/api/v[1-9]',
    versions: [1],
    pagination: {
      items_per_page: 10,
    },
  },
};
