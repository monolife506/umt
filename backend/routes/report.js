const express = require('express');
const config = require('../lib/config');
const mysql = require('promise-mysql');
const router = express.Router();

router.get('/', async (req, res, next) => {
    let connection = await mysql.createConnection(config.mysql);
    let phoneNumber = req.query.phoneNumber;

    // let affiliation = req.query.affiliation;
    // let food = req.query.food;
    // let date = req.query.date;

    let deliveryManInfo = await connection.query(
        'SELECT * FROM `deliveryManList` WHERE phoneNumber = phoneNumber',
        [phoneNumber]
    );

    // let insert_deliveryList = await req.mysql.query(
    //     'INSERT INTO `deliverylist`(`deliveryManId`, `food`, `shopId`, `occuredTime`, `isCrime`) VALUES(?, ?, ?, ?, ?, ?)',
    //     [deliveryManId, food, ]
    // );
});

module.exports = router;