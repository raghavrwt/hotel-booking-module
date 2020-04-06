var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Models = require("../../../models/booking/vendor");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/getMenu.ns', async function(req,res){
	var reqData={
		supId : req.supId
	}
	var response=await Models.vendorBookingServices.getMenu(reqData);
	res.send(response);			
});

//input is menuId and/or resourceId
router.post('/getMenuStructureAndData.ns', async function(req,res){
	var reqData=req.body;
	reqData.supId=req.supId;
	

	let [ responseMenuStructure, responseMenuData, responseAddonData] =
	await Promise.all([ 
		Models.vendorBookingServices.getStructureByMenuId(reqData), 
		reqData.resourceId ? Models.vendorBookingServices.getAttributeDataByResourceId(reqData) : Models.vendorBookingServices.getSettingsDataByMenuId(reqData),
		reqData.resourceId ? Models.vendorBookingServices.getAddonDataByResourceId(reqData):{isSuccess:true,data:[]}
	]);

	if(responseMenuStructure.isSuccess && responseMenuData.isSuccess && responseAddonData.isSuccess){
		var response={isSuccess:true,partOf:responseMenuData.partOf,dependantOn:responseMenuData.dependantOn , partOfGroup: responseMenuData.partOfGroup,menu:responseMenuStructure.data,data:responseMenuData.data,addon:responseAddonData.data}
		res.send(response);			
	}else{
		var response={isSuccess:false}			
	}

});


router.post('/saveResourceData.ns', async function(req,res){
	var reqData=req.body;
	reqData.supId=req.supId;

	var response=await Models.vendorBookingServices.saveResourceData(reqData);
	res.send(response);			

});

//attributeId,attributeValue
router.post('/addCustomAttribute.ns', async function(req,res){
	var reqData=req.body;
	reqData.supId=req.supId;

	var response=await Models.vendorBookingServices.addCustomAttribute(reqData);
	res.send(response);			

});

//id- which is resourceId
router.post('/delete.ns', async function(req,res){
	var reqData = req.body;	
	reqData.supId=req.supId;	
	var response=await Models.vendorBookingServices.delete(reqData);
	res.send(response);			
});



module.exports = router;	