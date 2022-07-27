const { rejects } = require('assert');
const mysql = require('mysql');
const { resolve } = require('url');

class Connection {

    static createConnection() {
        let configToMySQL = {
            host: 'localhost',
            user: 'root',
            password: 'Anhyeuem.123',
            database: 'blog',
            charset:'utf8_general_ci'
        };
        return mysql.createConnection(configToMySQL);
    }
}
module.exports = Connection;

