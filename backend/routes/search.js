const express = require("express");
const config = require("../lib/config");
const mysql = require("promise-mysql");
const router = express.Router();

router.get("/", async (req, res, next) => {
  let connection = await mysql.createConnection(config.mysql);
  let deliveryMan = await connection.query("SELECT * FROM deliveryManList");
  let result = [];
  let idx = 0;

  await deliveryMan.forEach(async delivery => {
    let deliveryManObj = {};

    let firm_info = await connection.query("SELECT * FROM affiliationList WHERE firmId = ?", [
      delivery.affiliation,
    ]);

    let foodHistory = await connection.query("SELECT * FROM deliveryList WHERE deliveryManId = ?", [
      delivery.deliveryManId,
    ]);

    deliveryManObj.company = firm_info[0].firmName;
    deliveryManObj.companyPhoneNumber = firm_info[0].firmTel;

    deliveryManObj.phonenumber = delivery.phoneNumber;
    deliveryManObj.index = idx++;
    deliveryManObj.credit = delivery.crimeCount;
    deliveryManObj.FoodHistory = [];

    foodHistory.forEach(History => {
      let obj = {};
      obj.StealDate = History.occuredTime;
      obj.StealType = History.food;
      deliveryManObj.FoodHistory.push(obj);
    });

    result.push(deliveryManObj);
    if (idx === deliveryMan.length) res.send(result);
  });
});

module.exports = router;
