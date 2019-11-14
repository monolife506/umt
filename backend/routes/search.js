const express = require('express');
const config = require('../lib/config');
const mysql = require('promise-mysql');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let connection = await mysql.createConnection(config.mysql);
    let phoneNumber = req.query.phoneNumber;
    let result = {};
    let deliveryManInfo = await connection.query(
        'SELECT * FROM deliveryManList WHERE phoneNumber = ?',
        [phoneNumber]
    );
    let affiliation  = await connection.query(
        'SELECT * FROM affiliationList WHERE firmId = ?',
        [deliveryManInfo[0].affiliation]
    );
    console.log(deliveryManInfo);
    let deliveryList = await connection.query(
        'SELECT * FROM deliveryList WHERE deliveryManId = ?',
        [deliveryManInfo[0].deliveryManId]
    );
    result.affiliation = affiliation;
    result.deliveryList = deliveryList;
    res.send(result);
});

module.exports = router;