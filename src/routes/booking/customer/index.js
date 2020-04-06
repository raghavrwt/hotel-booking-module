var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const Models = require("../../../models/booking/customer");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// verticalId 
router.post('/getSearchForm.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
    let [ searchForm, settingsData] = await Promise.all([ 
		Models.customerBookingServices.getSearchForm(reqData),        
        Models.customerBookingServices.getSupplierwiseSettings(reqData)
    ]);


    if(searchForm.isSuccess){
        searchForm.settingsData=settingsData.settingsData;
        if(!reqData.params)
            reqData.params=searchForm.params;
        var response=await Models.customerBookingServices.getResourceBySearchParams(reqData);
        if(response.isSuccess){
            searchForm.resourceList=response.resourceList;
            searchForm.groups=response.groups;
        }
        res.send(searchForm);		

    }else{
        res.send(searchForm);		        
    }	
});

router.post('/getResourceBySearchParams.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;     

    let [ response, settingsData] = await Promise.all([ 
		Models.customerBookingServices.getResourceBySearchParams(reqData),        
        Models.customerBookingServices.getSupplierwiseSettings(reqData)
    ]);

    response.settingsData=settingsData.settingsData;    
	res.send(response);			
});


router.post('/getResourceAvailable.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
 	var response=await Models.customerBookingServices.getResourceAvailable(reqData);
	res.send(response);			
});
    
router.post('/getResourceTimings.ns', async function(req,res){
    var reqData = req.body;	
    reqData.supId=req.supId;
 	var response=await Models.customerBookingServices.getResourceTimings(reqData);
	res.send(response);			
});




//select ID,RESOURCE_NAME,BASE_COST,QUERY_PARAMS,PRICING from TBL_BOOKING_RESOURCES WHERE JSON_CONTAINS(PART_OF_PARENT,'26') AND JSON_EXTRACT(QUERY_PARAMS,"$.""Max Kids""")>=2 and JSON_EXTRACT(QUERY_PARAMS,"$.""Max Guests""")>=0

module.exports = router;	