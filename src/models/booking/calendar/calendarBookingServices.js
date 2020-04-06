var db = require("../../../server/connection");
var mysql = require('mysql');

var mysqlEscape = function(value){
	return mysql.escape(value);
}

module.exports = {
    getAllResourcesByMenuId: async function(reqData){
        const supId=mysqlEscape(reqData.supId);			
        const menuId=mysqlEscape(reqData.menuId);

        let data={
            calendarName:"Reservation Calendar"
        }; 
        let location=[];
        let resource=[];

        try{
            let strQuery = `SELECT C.ID,C.RESOURCE_NAME FROM TBL_BOOKING_RESOURCES C ,(
                SELECT ID FROM TBL_BOOKING_VERTICALS_MENU A ,(select TBL_BOOKING_VERTICALS_ID from TBL_BOOKING_VERTICALS_MENU where ID=${menuId}) B WHERE A.TBL_BOOKING_VERTICALS_ID=B.TBL_BOOKING_VERTICALS_ID AND IS_RESOURCE=1 AND PART_OF IS NULL AND DEPENDANT_ON IS NULL
            ) D WHERE C.SUPPLIER_ID=${supId} AND C.TBL_BOOKING_VERTICALS_MENU_ID=D.ID AND C.IS_DELETED=0 ORDER BY C.RESOURCE_NAME;`;		    
            let response=await db.connection.query(strQuery);

            response.forEach(function(entry) {
                let locationData={
                    id:entry.ID,
                    name:entry.RESOURCE_NAME
                };	
                location.push(locationData);
            });

            data.location=location;

            resource.push({
                id:-1,
                name:"All",
                partOf:null,
                dependantOn:null,
                qty:null
            });

            strQuery=`SELECT C.ID,C.RESOURCE_NAME,C.PART_OF_PARENT,C.DEPENDANT_ON_PARENT_LIST,UNITS_PER_SLOT FROM TBL_BOOKING_RESOURCES C ,(
                SELECT ID FROM TBL_BOOKING_VERTICALS_MENU A ,(select TBL_BOOKING_VERTICALS_ID from TBL_BOOKING_VERTICALS_MENU where ID=${menuId}) B WHERE A.TBL_BOOKING_VERTICALS_ID=B.TBL_BOOKING_VERTICALS_ID AND IS_RESOURCE=1 AND (PART_OF IS NOT NULL )
            ) D WHERE C.SUPPLIER_ID=${supId} AND C.TBL_BOOKING_VERTICALS_MENU_ID=D.ID AND C.IS_DELETED=0 ORDER BY C.RESOURCE_NAME`

            response=await db.connection.query(strQuery);
            
            response.forEach(function(entry) {
                let resourceData={
                        id:entry.ID,
                        name:entry.RESOURCE_NAME,
                        partOf:JSON.parse(entry.PART_OF_PARENT),
                        dependantOn:JSON.parse(entry.DEPENDANT_ON_PARENT_LIST),
                        qty:entry.UNITS_PER_SLOT
                };	
                resource.push(resourceData);
            });

            data.resource=resource;
            
            strQuery=`select SLOT_TIME,SLOT_UNIT,CALENDAR_TYPE,ALLOW_TO_DATE from TBL_BOOKING_SUPPLIERWISE_VERTICAL_SETTINGS_SUPPLIERWISE A ,(
                select TBL_BOOKING_VERTICALS_ID from TBL_BOOKING_VERTICALS_MENU where ID=${menuId}
            ) B  WHERE A.SUPPLIER_ID=${supId} AND A.TBL_BOOKING_VERTICALS_ID=B.TBL_BOOKING_VERTICALS_ID`
               
            response=await db.connection.query(strQuery);
            
            response.forEach(function(entry) {
                data.baseTimeSlot=entry.SLOT_TIME,
                data.timeSlotUnit=entry.SLOT_UNIT,
                data.calendarTimeType=entry.CALENDAR_TYPE,
                data.allowToDate=entry.ALLOW_TO_DATE
            });

            return {isSuccess : true,data:data};			            
        }catch(err){
            console.log(`ERROR AT getAllResourcesByMenuId : ${err}`);					
            return {isSuccess : false, error:err};	
        }


    },getAllBookingsByLocation:async function(reqData){

        const supId=mysqlEscape(reqData.supId);			
        const locationId=mysqlEscape(reqData.locationId);
        const resourceId=mysqlEscape(reqData.resourceId);
        const startDateTime=mysqlEscape(reqData.startDateTime);
        const endDateTime=mysqlEscape(reqData.endDateTime);       
        let strquery="",rates=[],blockedDates=[],bookings=[];

        try{
            if(reqData.resourceId==-1)
                strQuery=`select ID,BASE_COST from TBL_BOOKING_RESOURCES where SUPPLIER_ID=${supId} AND JSON_CONTAINS(PART_OF_PARENT,'${locationId}') AND IS_DELETED=0`;
            else
                strQuery=`select ID,BASE_COST from TBL_BOOKING_RESOURCES where SUPPLIER_ID=${supId} AND JSON_CONTAINS(PART_OF_PARENT,'${locationId}') AND ID=${resourceId} AND IS_DELETED=0`;
            
            response=await db.connection.query(strQuery);
            response.forEach(function(entry) {
                rates.push({
                    "resourceId":[reqData.locationId,entry.ID],
                    "rate":entry.BASE_COST
                });
            });


            strQuery=`SELECT ID,RESOURCE_GROUP,concat(START_DATETIME,'') START_DATETIME,concat(END_DATETIME,'') END_DATETIME,RATE FROM TBL_BOOKING_CUSTOM_RATES WHERE SUPPLIER_ID=${supId} AND START_DATETIME>${startDateTime} AND END_DATETIME<${endDateTime} AND JSON_CONTAINS(RESOURCE_GROUP,'${locationId}')`;
            if(reqData.resourceId!=-1)
            strQuery=`${strQuery} AND JSON_CONTAINS(RESOURCE_GROUP,'${resourceId}')`;
            
            response=await db.connection.query(strQuery);            
            response.forEach(function(entry) {
                rates.push({
                    "id":entry.ID,
                    "resourceId":JSON.parse(entry.RESOURCE_GROUP),
                    "rate":entry.RATE,
                    "startDateTime":entry.START_DATETIME,
                    "endDateTime":entry.END_DATETIME
                });
            });


            
            strQuery=`SELECT ID,RESOURCE_GROUP,concat(START_DATETIME,'') START_DATETIME,concat(END_DATETIME,'') END_DATETIME FROM TBL_BOOKING_BLOCKED_DATES WHERE SUPPLIER_ID=${supId} AND START_DATETIME>=${startDateTime} AND END_DATETIME<=${endDateTime} AND JSON_CONTAINS(RESOURCE_GROUP,'${locationId}')`;
            if(reqData.resourceId!=-1)
            strQuery=`${strQuery} AND JSON_CONTAINS(RESOURCE_GROUP,'${resourceId}')`;
            
            response=await db.connection.query(strQuery);            
            response.forEach(function(entry) {
                blockedDates.push({
                    "id":entry.ID,
                    "resourceId":JSON.parse(entry.RESOURCE_GROUP),
                    "startDateTime":entry.START_DATETIME,
                    "endDateTime":entry.END_DATETIME
                });
            });


            strQuery=`SELECT A.ID,A.CUSTOMER_ID,B.CUSTOMERNAME,A.RESOURCE_GROUP,concat(A.START_DATETIME,'') START_DATETIME,concat(A.END_DATETIME,'') END_DATETIME,A.PAID,A.PAYMENT_TYPE,A.AMOUNT,A.UNITS,A.ADDON_LIST FROM TBL_BOOKED_HISTORY A ,customer B WHERE A.SUPPLIER_ID=${supId} AND A.CUSTOMER_ID=B.ID AND A.START_DATETIME>${startDateTime} AND A.END_DATETIME<${endDateTime} AND JSON_CONTAINS(A.RESOURCE_GROUP,'${locationId}')`;
            if(reqData.resourceId!=-1)
            strQuery=`${strQuery} AND JSON_CONTAINS(A.RESOURCE_GROUP,'${resourceId}')`;

            response=await db.connection.query(strQuery);            
            response.forEach(function(entry) {
                bookings.push({
                    "id":entry.ID,
                    "customerId":entry.CUSTOMER_ID,
                    "customerName":entry.CUSTOMERNAME,                    
                    "resourceId":JSON.parse(entry.RESOURCE_GROUP),
                    "startDateTime":entry.START_DATETIME,
                    "endDateTime":entry.END_DATETIME,
                    "paid":entry.PAID,
                    "paymentType":entry.PAYMENT_TYPE,
                    "amount":entry.AMOUNT,
                    "units":entry.UNITS,
                    "addons":JSON.parse(entry.ADDON_LIST)
                });
            });
            
            let data={
                rates:rates,
                blockedDates:blockedDates,
                bookings:bookings
            }
            return {isSuccess : true, data:data};		            
        }
        catch(err){
            console.log(`ERROR AT getAllBookingsByLocation : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
    },createResourceGroup:async function(resourceList){
        let idList=[];
        let resourceGroupId=0;   
        let strQuery="",response="";
        for (const entry of resourceList) {
            strQuery=`insert into TBL_BOOKING_RESOURCE_GROUP(TBL_BOOKING_RESOURCES_ID) VALUES(${entry})`;
            response=await db.connection.query(strQuery);            
            idList.push(response.insertId);
            resourceGroupId=response.insertId;                
        }
        const idListString=idList.join()
        strQuery=`UPDATE TBL_BOOKING_RESOURCE_GROUP SET RESOURCE_GROUP_ID=${resourceGroupId} WHERE ID IN (${idListString})`;
        await db.connection.query(strQuery);            
        return resourceGroupId;
    },addRates:async function(reqData){       
        const supId=mysqlEscape(reqData.supId);			
        const resourceId=mysqlEscape(JSON.stringify(reqData.resourceId));
        const startDateTime=mysqlEscape(reqData.startDateTime);
        const endDateTime=mysqlEscape(reqData.endDateTime);       
        const rate=mysqlEscape(reqData.rate); 
        let strQuery="",response="";
        try{            
            const resourceGroupId=await module.exports.createResourceGroup(reqData.resourceId);                       
            strQuery=`INSERT INTO TBL_BOOKING_CUSTOM_RATES(SUPPLIER_ID,START_DATETIME,END_DATETIME,RESOURCE_GROUP,RESOURCE_GROUP_ID,RATE) VALUES(
                ${supId},${startDateTime},${endDateTime},${resourceId},${resourceGroupId},${rate}
            )`;
            response=await db.connection.query(strQuery);            
            
            let rateId=response.insertId;         
            return {isSuccess : true, id:rateId};		                                
        }catch(err){
            console.log(`ERROR AT addRates : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
    },blockResource:async function(reqData){       
        const supId=mysqlEscape(reqData.supId);			
        const resourceId=mysqlEscape(JSON.stringify(reqData.resourceId));
        const startDateTime=mysqlEscape(reqData.startDateTime);
        const endDateTime=mysqlEscape(reqData.endDateTime);       
        let strQuery="",response="";
        try{            
            const resourceGroupId=await module.exports.createResourceGroup(reqData.resourceId);                       
            strQuery=`INSERT INTO TBL_BOOKING_BLOCKED_DATES(SUPPLIER_ID,START_DATETIME,END_DATETIME,RESOURCE_GROUP,RESOURCE_GROUP_ID) VALUES(
                ${supId},${startDateTime},${endDateTime},${resourceId},${resourceGroupId}
            )`;
            response=await db.connection.query(strQuery);            
            
            let rateId=response.insertId;         
            return {isSuccess : true, id:rateId};		                                
        }catch(err){
            console.log(`ERROR AT blockResource : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
    },delete:async function(reqData){       
        const supId=mysqlEscape(reqData.supId);			
        const id=mysqlEscape(reqData.id);
        const type=mysqlEscape(JSON.stringify(reqData.type));
        let strQuery="";
        let tableName="";
        try{  
            switch(reqData.type){
                case "booking":
                    tableName="TBL_BOOKED_HISTORY";
                break;
                case "blocked dates":
                    tableName="TBL_BOOKING_BLOCKED_DATES";
                break;
                case "custom rates":
                    tableName="TBL_BOOKING_CUSTOM_RATES";
                break;
                case "weekly rates":
                tableName="TBL_BOOKING_WEEKLY_RATES";
                break;
            }          

            if(reqData.type!="weekly rates"){
                strQuery=`DELETE FROM TBL_BOOKING_RESOURCE_GROUP where RESOURCE_GROUP_ID=(select RESOURCE_GROUP_ID from ${tableName} WHERE ID=${id})`;
                await db.connection.query(strQuery);            
                strQuery=`DELETE FROM ${tableName} WHERE ID=${id}`;
                await db.connection.query(strQuery); 
            }else{
                strQuery=`DELETE FROM ${tableName} WHERE ID=${id} and START_TIME IS NOT NULL AND END_TIME IS NOT NULL`;
                await db.connection.query(strQuery);                 
            }           

            return {isSuccess : true};		                                
        }catch(err){
            console.log(`ERROR AT delete : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
    },addBooking:async function(reqData){   
        const supId=mysqlEscape(reqData.supId);	
        //const locationId=mysqlEscape(reqData.locationId);	
        reqData.resourceId.push(reqData.locationId);       
        const resourceId=mysqlEscape(JSON.stringify(reqData.resourceId));
        const startDateTime=mysqlEscape(reqData.startDateTime);
        const endDateTime=mysqlEscape(reqData.endDateTime);
        const query=mysqlEscape(JSON.stringify(reqData.query));                       
        const addons=mysqlEscape(JSON.stringify(reqData.addons));             
        const name=mysqlEscape(reqData.name);       
        const email=mysqlEscape(reqData.email);       
        const mobile=mysqlEscape(reqData.mobile);  
        const customerId=mysqlEscape('5dcbcea0498e975e393b024b');            
        const paid=1;
        const paymentType=mysqlEscape('COD');
        const amount=111;
        const units=1;
        const priceBreakup=null;
        let strQuery="",response="";
        try{            
            const resourceGroupId=await module.exports.createResourceGroup(reqData.resourceId);                       
            strQuery=`INSERT INTO TBL_BOOKED_HISTORY(
                SUPPLIER_ID,CUSTOMER_ID,RESOURCE_GROUP_ID,RESOURCE_GROUP,START_DATETIME,END_DATETIME,PAID,
                PAYMENT_TYPE,AMOUNT,UNITS,ADDON_LIST,QUERY_LIST,PRICE_BREAKUP)
                VALUES(${supId},${customerId},${resourceGroupId},${resourceId},${startDateTime},${endDateTime},${paid},
                ${paymentType},${amount},${units},${addons},${query},${priceBreakup});`;
            response=await db.connection.query(strQuery);            

            let rateId=response.insertId;         
            return {isSuccess : true, id:rateId , customerName:"RAVI TEJA"};		                                
        }catch(err){
            console.log(`ERROR AT addBooking : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
    },getAllWeeklyRatesByLocation:async function(reqData){   
        const supId=mysqlEscape(reqData.supId);	
        const locationId=mysqlEscape(reqData.locationId);	
        const resourceId=mysqlEscape(reqData.resourceId);	
        const day=mysqlEscape(reqData.day);	        
        let data=[];
        try{       
            let filterQuery=``;
            if(reqData.resourceId)
                filterQuery=` AND RESOURCE_ID=${resourceId}`;
            if(reqData.day)
                filterQuery=` AND DAY=${day}`;
                
            const strQuery=`select ID,DAY,START_TIME,END_TIME,RESOURCE_ID,RATE from TBL_BOOKING_WEEKLY_RATES where SUPPLIER_ID=${supId} and location_id=${locationId} ${filterQuery} order by DAY,RESOURCE_ID,START_TIME,END_TIME`;       
            const response=await db.connection.query(strQuery);            
            
            response.forEach(function(entry) {                
                data.push({
                    id:entry.ID,
                    day:entry.DAY,
                    startTime:entry.START_TIME,
                    endTime:entry.END_TIME,
                    resourceId:entry.RESOURCE_ID,
                    rate:entry.RATE
                });
            });

            return {isSuccess : true, data:data};		                                            
        }catch(err){
            console.log(`ERROR AT getAllWeeklyRatesByLocation : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
            
    },addWeeklyRates:async function(reqData){   
        const supId=mysqlEscape(reqData.supId);	
        const locationId=mysqlEscape(reqData.locationId);	
        const resourceId=mysqlEscape(reqData.resourceId);	
        const startTime=mysqlEscape(reqData.startTime);
        const endTime=mysqlEscape(reqData.endTime);        
        const startTimeQry=reqData.startTime?' = '+ mysqlEscape(reqData.startTime): ' is '+ mysqlEscape(reqData.startTime);
        const endTimeQry=reqData.endTime?' = '+ mysqlEscape(reqData.endTime): ' is '+ mysqlEscape(reqData.endTime);	
        const rate=mysqlEscape(reqData.rate);	
        let strQuery="";
        let rateIdList=[];
        try{     
            for (const singleDay of reqData.day) {                
                const day=mysqlEscape(singleDay);	                
                strQuery=`DELETE FROM TBL_BOOKING_WEEKLY_RATES WHERE SUPPLIER_ID=${supId} AND LOCATION_ID=${locationId} AND RESOURCE_ID=${resourceId} AND DAY=${day} AND START_TIME ${startTimeQry} AND END_TIME ${endTimeQry}`;												            
                await db.connection.query(strQuery);   
                strQuery=`INSERT INTO TBL_BOOKING_WEEKLY_RATES(SUPPLIER_ID,LOCATION_ID,RESOURCE_ID,DAY,START_TIME,END_TIME,RATE) VALUES(
                    ${supId},${locationId},${resourceId},${day},${startTime},${endTime},${rate})`;       
                const response=await db.connection.query(strQuery);                                   
                const rateId=response.insertId;    
                rateIdList.push(rateId);     
            }
           return {isSuccess : true, ids:rateIdList};		            
        }catch(err){
            console.log(`ERROR AT addWeeklyRates : ${err}`);					
            return {isSuccess : false, error:err};	
        }	
            
    }           
};

