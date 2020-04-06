var db = require("../../../server/connection");
var mysql = require('mysql');

var mysqlEscape = function(value){
	return mysql.escape(value);
}

module.exports = {
    getLocationByAttributeId:async function(supId,verticalMenuId){
        const strQuery = `select ID,RESOURCE_NAME from TBL_BOOKING_RESOURCES WHERE SUPPLIER_ID=${supId} AND TBL_BOOKING_VERTICALS_MENU_ID=${verticalMenuId} AND IS_DELETED=0 ORDER BY RESOURCE_NAME;`;		    
        const response=await db.connection.query(strQuery);
        let data=[];
        response.forEach(function(entry) {
            let locationData={
                id:entry.ID,
                value:entry.RESOURCE_NAME
            };
            data.push(locationData);
        }); 
        return data;           
    },getSearchForm: async function(reqData){
        const supId=mysqlEscape(reqData.supId);						        
        const verticalId=mysqlEscape(reqData.verticalId);
        let data=[];
        let params=[];
        try{
            let strQuery = `select NAME,TYPE,CASE WHEN TYPE='DATE' AND DEFAULT_VALUE IS NOT NULL THEN DATE_ADD(CURRENT_DATE,INTERVAL DEFAULT_VALUE DAY) ELSE DEFAULT_VALUE END DEFAULT_VALUE,ATTRIBUTES_ID FROM TBL_BOOKING_VERTICALS_SEARCH_FORM where TBL_BOOKING_VERTICALS_ID=${verticalId} ORDER BY SORT_ORDER;`;		    
            let response=await db.connection.query(strQuery);

            for (const entry of response) {
                let param={};
                let searchEntry={
                  name: entry.NAME,
                  type: entry.TYPE
                };

                if(entry.TYPE=="DROPDOWN"){
                    const locationData=await module.exports.getLocationByAttributeId(supId,entry.ATTRIBUTES_ID);
                    searchEntry.data=locationData;
                    param={paramId:locationData[0].id,paramValue:locationData[0].value};
                }else{
                    let arributeData={
                        id:entry.ATTRIBUTES_ID,
                        value:entry.DEFAULT_VALUE
                    };
                    searchEntry.data=arributeData;  
                    param={paramId:entry.ATTRIBUTES_ID,paramValue:entry.DEFAULT_VALUE};                    
                }
                params.push(param);
                data.push(searchEntry);
            }

            return {isSuccess : true,searchForm:data,params:params};			            
        }catch(err){
            console.log(`ERROR AT getSearchForm : ${err}`);					
            return {isSuccess : false, error:err};	
        }

    },getResourceBySearchParams: async function(reqData){
        const supId=mysqlEscape(reqData.supId);	
        let verticalId='',resourceId='',locationId='',strQuery ='';
        if(reqData.resourceId){
            locationId=mysqlEscape(reqData.locationId);                                        
            verticalId=mysqlEscape(reqData.verticalId);        
            resourceId=mysqlEscape(reqData.resourceId);      
        }else{
            locationId=mysqlEscape(reqData.params[0].paramId);            
        }

        try{
            if(reqData.resourceId)	    
                strQuery=`select A.ID,B.MENU_NAME DROPDOWN_NAME,A.RESOURCE_NAME,A.BASE_COST,A.UNITS_PER_SLOT,A.IMAGE,A.ADDONS,A.PART_OF_PARENT,A.DEPENDANT_ON_PARENT_LIST,A.GROUP_PARENT_ID from TBL_BOOKING_RESOURCES A,TBL_BOOKING_VERTICALS_MENU B WHERE A.TBL_BOOKING_VERTICALS_MENU_ID=B.ID AND JSON_CONTAINS(A.PART_OF_PARENT,'${locationId}') AND (A.ID=${resourceId} OR JSON_CONTAINS(A.DEPENDANT_ON_PARENT_LIST,'${resourceId}')) AND A.IS_DELETED=0`;
            else
                strQuery = `select A.ID,B.MENU_NAME DROPDOWN_NAME,A.RESOURCE_NAME,A.BASE_COST,A.UNITS_PER_SLOT,A.IMAGE,A.ADDONS,A.PART_OF_PARENT,A.DEPENDANT_ON_PARENT_LIST,A.GROUP_PARENT_ID from TBL_BOOKING_RESOURCES A,TBL_BOOKING_VERTICALS_MENU B WHERE A.TBL_BOOKING_VERTICALS_MENU_ID=B.ID AND JSON_CONTAINS(A.PART_OF_PARENT,'${locationId}') AND A.IS_DELETED=0`;	
            
            let response=await db.connection.query(strQuery);
            let data=[],groups=[];
            let groupIdList=[];
            for (const entry of response) {
                let resource={
                    id:entry.ID,
                    dropDownName:entry.DROPDOWN_NAME,    
                    name:entry.RESOURCE_NAME,
                    price:entry.BASE_COST,
                    units:entry.UNITS_PER_SLOT,
                    image:JSON.parse(entry.IMAGE),
                    addons:JSON.parse(entry.ADDONS),
                    partOf:JSON.parse(entry.PART_OF_PARENT),
                    dependantOn:JSON.parse(entry.DEPENDANT_ON_PARENT_LIST),   
                    groupParentId:entry.GROUP_PARENT_ID                 
                };

                if(entry.GROUP_PARENT_ID)
                    groupIdList.push(entry.GROUP_PARENT_ID);

                if(reqData.resourceId){
                    strQuery=`SELECT B.ID,A.GROUP_ID,A.NAME,C.VALUE FROM TBL_BOOKING_VERTICALS_DETAILS_PAGE_ATTRIBUTES A , TBL_BOOKING_ATTRIBUTES B , TBL_BOOKING_ATTRIBUTE_SUPPLIER_VALUES C WHERE A.TBL_BOOKING_VERTICALS_ID=${verticalId} AND A.ATTRIBUTES_ID=B.ID AND B.ID=C.TBL_BOOKING_ATTRIBUTES_ID AND C.TBL_BOOKING_RESOURCES_ID=${resourceId}`;
                    let resourceDetails=await db.connection.query(strQuery);
                    let details=[];
                    for (const resourceSingleEntry of resourceDetails) {
                        details.push({
                            id:resourceSingleEntry.ID,
                            groupId:resourceSingleEntry.GROUP_ID,
                            name:resourceSingleEntry.NAME,
                            values:JSON.parse(resourceSingleEntry.VALUE)
                        });
                    }                        
                    resource.details=details;
                }
                data.push(resource);
            }

            if(groupIdList.length>0){
                const groupsIn=groupIdList.join();
                strQuery=`select ID,RESOURCE_NAME from TBL_BOOKING_RESOURCES where ID IN (${groupsIn})`;
                let response=await db.connection.query(strQuery);
                response.forEach(function(entry) {
                    groups.push({
                        id:entry.ID,
                        name:entry.RESOURCE_NAME
                    });
                });                    
            }

            return {isSuccess : true,resourceList:data,groups:groups};			                        
        }catch(err){
            console.log(`ERROR AT getResourceBySearchParams : ${err}`);					
            return {isSuccess : false, error:err};	
        }
    },getSupplierwiseSettings:async function(reqData){
        const supId=mysqlEscape(reqData.supId);	
        const verticalId=mysqlEscape(reqData.verticalId);        
        const settingQuery=`select SLOT_TIME,SLOT_UNIT,CALENDAR_TYPE,ALLOW_TO_DATE,SETTINGS from TBL_BOOKING_SUPPLIERWISE_VERTICAL_SETTINGS_SUPPLIERWISE WHERE TBL_BOOKING_VERTICALS_ID=${verticalId} AND SUPPLIER_ID=${supId}`;
        let data={};
        try{
            const response=await db.connection.query(settingQuery);
            if(response.length>0){
                data={
                    slotTime:response[0].SLOT_TIME,
                    slotUnit:response[0].SLOT_UNIT,                    
                    calendarType:response[0].CALENDAR_TYPE,
                    allowToDate:response[0].ALLOW_TO_DATE,
                    settings:JSON.parse(response[0].SETTINGS)
                };
            }
            return {isSuccess : true, settingsData:data};	                        
        }catch(err){
            console.log(`ERROR AT getSupplierwiseSettings : ${err}`);					
            return {isSuccess : false, error:err};	            
        }            
    },getResourceAvailable: async function(reqData){
        let resourceAvailableCount=0;
        const supId=mysqlEscape(reqData.supId);	
        let verticalId=mysqlEscape(reqData.verticalId);        
        let locationId=mysqlEscape(reqData.locationId);                                                
        let resourceId=reqData.resourceId;      
        let startDateTime=mysqlEscape(reqData.startDateTime);                                        
        let endDateTime=mysqlEscape(reqData.endDateTimes);                                        
        let addons=reqData.addons?reqData.addons:[];
        let query=reqData.query?reqData.query:[];
        
        // resourceId can be group
        try{
            let strQuery=`SELECT UNITS_PER_SLOT FROM TBL_BOOKING_RESOURCES WHERE ID=${resourceId[0]} AND IS_DELETED=0`;
            const response=await db.connection.query(strQuery);
            if (response.length>0) {
                strQuery=`SELECT COUNT(*) cnt FROM TBL_BOOKED_HISTORY A WHERE A.SUPPLIER_ID=${supId} AND JSON_CONTAINS(A.RESOURCE_GROUP,'${locationId}') AND JSON_CONTAINS(A.RESOURCE_GROUP,'${resourceId[0]}') AND A.START_DATETIME<=${startDateTime} AND A.END_DATETIME>=${endDateTime}`;  
                const response1=await db.connection.query(strQuery);   
                resourceAvailableCount=response[0].UNITS_PER_SLOT-response1[0].cnt;           
            }
            return {isSuccess : true, resourceAvailableCount:resourceAvailableCount,price:555};	            
        }catch(err){
            console.log(`ERROR AT getResourceAvailable : ${err}`);					
            return {isSuccess : false, error:err};	
        }

    },getResourceTimings: async function(reqData){
        const supId=mysqlEscape(reqData.supId);	
        let locationId=mysqlEscape(reqData.locationId);                                                
        let resourceId=reqData.resourceId;      
        let startDate=mysqlEscape(reqData.startDate);                                        
        let endDate=mysqlEscape(reqData.endDate);
        let data=[];
        try{
            
            let strQuery=`select datediff(${endDate}, ${startDate}) numOfDays`;
            let response=await db.connection.query(strQuery);
            const numOfDays=response[0].numOfDays;
            let i=0;
            for(i=0;i<=numOfDays;i++){
                strQuery=`select date_add(${startDate}, INTERVAL ${i} DAY) dt`;
                response=await db.connection.query(strQuery);
                data.push({
                    date:response[0].dt,
                    startTime:'09:00:00',
                    endTime:'18:00:00',
                    blockedTime:[{startTime:'15:00:00',endTime:'16:30:00'}]
                });                
            }
            return {isSuccess : true, slotTime:30,slotUnit:"MINUTE", blockedDates:data};	            
        }catch(err){
            console.log(`ERROR AT getResourcePrice : ${err}`);					
            return {isSuccess : false, error:err};	
        }    


    }
};    