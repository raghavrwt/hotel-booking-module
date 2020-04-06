var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Models = require("../../../models/booking/calendar");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//take supplierId from session    , menuId from post
router.post('/getAllResourcesByMenuId.ns', async function (req, res) {
	var reqData = req.body;
	reqData.supId = req.supId;
	var response = await Models.calendarBookingServices.getAllResourcesByMenuId(reqData);
	res.send(response);
});

// take supplierId from session,locationId,resourceId,startDateTime,endDateTime from body
// resourceId can be -1 for all

router.post('/getAllBookingsByLocation.ns', async function (req, res) {
	var reqData = req.body;
	reqData.supId = req.supId;
	var response = await Models.calendarBookingServices.getAllBookingsByLocation(reqData);
	res.send(response);
});

//resourceId,startDateTime,endDateTime,rate
router.post('/addRates.ns', async function (req, res) {
	var reqData = req.body;
	reqData.supId = req.supId;
	var response = await Models.calendarBookingServices.addRates(reqData);
	res.send(response);
});

//resourceId,startDateTime,endDateTime
router.post('/blockResource.ns', async function (req, res) {
	var reqData = req.body;
	reqData.supId = req.supId;
	var response = await Models.calendarBookingServices.blockResource(reqData);
	res.send(response);
});
//type= booking,blocked dates,custom rates, id : id
router.post('/delete.ns', async function (req, res) {
	var reqData = req.body;
	reqData.supId = req.supId;
	var response = await Models.calendarBookingServices.delete(reqData);
	res.send(response);
});


//
router.post('/addBooking.ns', async function(req,res){
	var reqData = req.body;	
	reqData.supId=req.supId;	
	var response=await Models.calendarBookingServices.addBooking(reqData);
	res.send(response);			
});



router.post('/getAllWeeklyRatesByLocation.ns', async function(req,res){
	var reqData = req.body;	
	reqData.supId=req.supId;	
	var response=await Models.calendarBookingServices.getAllWeeklyRatesByLocation(reqData);
	res.send(response);			
});

router.post('/addWeeklyRates.ns', async function(req,res){
	var reqData = req.body;	
	reqData.supId=req.supId;	
	var response=await Models.calendarBookingServices.addWeeklyRates(reqData);
	res.send(response);			
});


module.exports = router;	