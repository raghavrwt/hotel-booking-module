var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Models = require("../../../models/booking/cart");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// verticalId 
/*
sessionId
orderId
customerId
*/
router.post('/addToCart.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
    reqData.sessionId=1;
    reqData.orderId=1;
    reqData.customerId='5dcbcea0498e975e393b024b';    
    var response=await Models.calendarBookingCart.addToCart(reqData);
    res.send(response);		        
});

//cartId
router.post('/deleteFromCart.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
    var response=await Models.calendarBookingCart.deleteFromCart(reqData);
    res.send(response);		        
});

//verticalId

router.post('/getCartItems.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
    reqData.sessionId=1;    
    var response=await Models.calendarBookingCart.getCartItems(reqData);
    res.send(response);		        
});

router.post('/checkResourceAvailable.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
    
    var response=await Models.calendarBookingCart.checkResourceAvailable(reqData);
    res.send(response);		        
});


module.exports = router;	