module.exports = {
  apps: [{
    name: 'GMRC_API',
    script: 'index.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: ['src/'],
    watch_options: {
      followSymlinks: false,
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: '3000',
      MONGODB_URL: 'mongodb://mark:gmrcadmin@localhost:27017/GMRC?authSource=GMRC&w=1',
      JWT_SECRET: 'thisisthesecretkey',
    },
    env_production: {
      NODE_ENV: 'production',
      JWT_SECRET: 'thisisthesecretkey',
    },
  }],

  deploy: {
    production: {},
    staging: {},
    development: {},
  },
};
