module.exports = {
  apps : [{
    name: 'SRTT',
    script: './src/index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ['persist'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
