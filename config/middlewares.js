module.exports = [
    "strapi::errors",
    {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:"],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              "*.digitaloceanspaces.com"
            ],
            "media-src": ["'self'", "data:", "blob:"],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            headers: '*',
            origin: ['http://localhost:1337', 'https://kuizme.com']
        }
    },
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    "strapi::favicon",
    "strapi::public",
  ];
  