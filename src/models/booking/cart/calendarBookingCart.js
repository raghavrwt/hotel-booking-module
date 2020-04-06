var db = require("../../../server/connection");
var mysql = require('mysql');
const Models = require("../calendar");

var mysqlEscape = function(value){
	return mysql.escape(value);
}

module.exports = {
    addToCart:async function(reqData){

        const supId=mysqlEscape(reqData.supId);						        
        const sessionId=mysqlEscape(reqData.sessionId);
        const orderId=mysqlEscape(reqData.orderId);
        const customerId=mysqlEscape(reqData.customerId);
        const verticalId=mysqlEscape(reqData.verticalId);        
        const cartData=reqData.cartData;
        let strQuery='';
        let cartIds=[];
        try{
            for (const entry of cartData) {
                const resourceGroup=mysqlEscape(JSON.stringify(entry.resourceGroup));
                const startDate=mysqlEscape(entry.startDate);
                const endDate=mysqlEscape(entry.endDate);
                const addons=mysqlEscape(JSON.stringify(entry.addons));
                const query=mysqlEscape(JSON.stringify(entry.query));       
                const resourceGroupId=await Models.calendarBookingServices.createResourceGroup(entry.resourceGroup);                       
                strQuery=`INSERT INTO TBL_BOOKING_CART(ORDER_ID,SESSION_ID,CUSTOMER_ID,SUPPLIER_ID,VERTICAL_ID,RESOURCE_GROUP,RESOURCE_GROUP_ID,START_DATETIME,END_DATETIME
                    ,ADDON_LIST,QUERY_LIST,PRICE) VALUES(${orderId},${sessionId},${customerId},${supId},${verticalId},${resourceGroup},${resourceGroupId},${startDate},${endDate},${addons},${query},55)`;
                const response=await db.connection.query(strQuery);
                cartIds.push(response.insertId);
            }

            return {isSuccess : true,cartIds:cartIds};			                        
        }catch(err){
            console.log(`ERROR AT addToCart : ${err}`);					
            return {isSuccess : false, error:err};	
        }
    },deleteFromCart:async function(reqData){
        const cartId=mysqlEscape(reqData.cartId);
        const strQuery=`DELETE FROM TBL_BOOKING_CART WHERE ID=${cartId}`;
        try{            
            await db.connection.query(strQuery);
            return {isSuccess : true};	            
        }catch(err){
            console.log(`ERROR AT deleteFromCart : ${err}`);					
            return {isSuccess : false, error:err};	
        }
    },getCartItems:async function(reqData){
        const verticalId=mysqlEscape(reqData.verticalId);        
        const sessionId=mysqlEscape(reqData.sessionId);
        const supId=mysqlEscape(reqData.supId);						        
        
        let data=[];
        try{            
            let strQuery=`DELETE FROM TBL_BOOKING_CART WHERE SESSION_ID=${sessionId} AND SUPPLIER_ID=${supId} AND VERTICAL_ID=${verticalId} AND START_DATETIME<NOW()`;
            await db.connection.query(strQuery);

            strQuery=`select ID,RESOURCE_GROUP,START_DATETIME,END_DATETIME,ADDON_LIST,QUERY_LIST,PRICE from TBL_BOOKING_CART WHERE SESSION_ID=${sessionId} AND SUPPLIER_ID=${supId} AND VERTICAL_ID=${verticalId}`;            
            let response=await db.connection.query(strQuery);
            for (const entry of response) {
                data.push({
                    resourceGroup:JSON.parse(entry.RESOURCE_GROUP),
                    startDate:entry.START_DATETIME,
                    endDate:entry.END_DATETIME,
                    addons:JSON.parse(entry.ADDON_LIST),
                    query:JSON.parse(entry.QUERY_LIST),
                    price:entry.PRICE,
                    id:entry.ID
                });
            }
            return {isSuccess : true,cartItems:data};	            
        }catch(err){
            console.log(`ERROR AT deleteFromCart : ${err}`);					
            return {isSuccess : false, error:err};	
        }
    }        
};


/*
delete resourcegroup entries in deleteFromCart func
*/