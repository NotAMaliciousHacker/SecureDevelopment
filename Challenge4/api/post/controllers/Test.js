const { async, get, assign, toLower } = require('lodash');

module.exports = async function test (req, res) {
        console.log('hello!!!!!!!');
        //var ds = User.getDatastore();
        //console.log(ds);


// Send it to the database.
//var rawResult = await sails.sendNativeQuery('select * from user', []);
//var rawResult = await ds.sendNativeQuery('select * from user', []);

//sails.log(rawResult);
// (result format depends on the SQL query that was passed in, and the adapter you're using)

// Then parse the raw result and do whatever you like with it.

//return exits.success();

        return 1;
}
