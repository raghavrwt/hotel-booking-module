const config = require('../config/config-db');

module.exports.connection = require('jd-node-library').mySqlConnection({
	databases: [config.database]
});