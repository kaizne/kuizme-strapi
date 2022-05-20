module.exports = ({ env }) => ({
    host: env('HOST'),
    port: env.int('PORT'),
    app: {
      keys: env.array('APP_KEYS'),
    },
    url: env('BACKEND_URL'),
  });
  