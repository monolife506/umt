const express = require('express');
const config = require('../lib/config');
const mysql = require('promise-mysql');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let connection = await mysql.createConnection(config.mysql);
    let phoneNumber = req.query.phoneNumber;
    let affiliation = req.query.affiliation;
    let food = req.query.food;
    let occuredTime = req.query.occuredTime;

    let deliveryManInfo = await connection.query(
        'SELECT * FROM `deliveryManList` WHERE phoneNumber = ?',
        [phoneNumber]
    );
    if(deliveryManInfo.length === 0) {
        console.log("new");
        await connection.query(
            'INSERT INTO deliveryManList(phoneNumber, deliveryManName, orderCount, crimeCount, affiliation) VALUES (?, "익명", 0 , 0, ?)',
            [phoneNumber, affiliation]
        );
        deliveryManInfo = await connection.query(
            'SELECT * FROM `deliveryManList` WHERE phoneNumber = ?',
            [phoneNumber]
        );
    }
    let deliveryInfo = await connection.query(
        'INSERT INTO deliveryList(deliveryManId, shopId, food, occuredTime, isCrime) VALUES (?, ?, ?, ?, ?)',
        [deliveryManInfo[0].deliveryManId, 2, food, occuredTime, 1]
    );
    res.send(deliveryInfo);
});

module.exports = router;