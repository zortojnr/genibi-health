module.exports = {
  "apps": [
    {
      "name": "genibi-health-app",
      "script": "server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "development",
        "PORT": 8080
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 8080
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true,
      "watch": false,
      "max_memory_restart": "1G",
      "node_args": "--max-old-space-size=1024"
    }
  ]
};