require('dotenv').config();

const dev = {
    "type": "mysql",
    "host": process.env.db_host,
    "port": process.env.db_port,
    "username": process.env.db_username,
    "password": process.env.db_password,
    "database": process.env.db_database,
    "synchronize": true,
    "logging": true,
    "entities": [
        "src/entity/**/*.ts"
     ],
     "migrations": [
        "src/migration/**/*.ts"
     ],
     "subscribers": [
        "src/subscriber/**/*.ts"
     ]
};

const prod = {
    "type": "mysql",
    "host": process.env.db_host,
    "port": process.env.db_port,
    "username": process.env.db_username,
    "password": process.env.db_password,
    "database": process.env.db_database,
    "synchronize": true,
    "logging": false,
    "entities": [
        "build/entity/**/*.js"
     ],
     "migrations": [
        "build/migration/**/*.js"
     ],
     "subscribers": [
        "build/subscriber/**/*.js"
     ]
};

const config = process.env.NODE_ENV === "prod" ? prod : dev

module.exports = {
  config
}