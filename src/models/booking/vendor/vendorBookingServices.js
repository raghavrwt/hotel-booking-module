var db = require("../../../server/connection");
var mysql = require('mysql');

var mysqlEscape = function(value){
	return mysql.escape(value);
}

// select * from TBL_BOOKING_PAGE_STRUCTURE A  , TBL_BOOKING_SEGMENTS B where A.TBL_BOOKING_VERTICALS_MENU_ID=2 AND A.SEGMENT_GROUP_ID=B.SEGMENT_GROUP_ID ORDER BY B.SORT_ORDER

module.exports = {
	getMenu: async function(reqData){
				const supId=mysqlEscape(reqData.supId);
				let strQuery = `select B.ID VERTICAL_ID,B.VERTICAL_NAME,C.ID MENU_ID,C.MENU_NAME,C.MENU_TITLE,C.TYPE,C.PARENT_ID,C.PART_OF,C.DEPENDANT_ON,C.IS_GROUP,C.IS_MULTIPLE,C.ALLOW_ADDON,C.IS_RESOURCE from TBL_BOOKING_SUPPLIERWISE_VERTICALS A , TBL_BOOKING_VERTICALS B , TBL_BOOKING_VERTICALS_MENU C where A.SUPPLIER_ID=${supId} AND A.TBL_BOOKING_VERTICALS_ID=B.ID and B.ID=C.TBL_BOOKING_VERTICALS_ID ORDER BY B.ID,C.SORT_ORDER;`;		
				try{
					let response=await db.connection.query(strQuery);
					let data=[];
					let prevVerticalId="";
					let prevMenuId="";					
					let verticalData={};
					let menuData={};

					for (const entry of response) {
						if(prevVerticalId!=entry.VERTICAL_ID){
							if(prevVerticalId!=""){
								verticalData.menu.push(menuData);	
								menuData={};													
								data.push(verticalData);
								verticalData={};
							}
							prevVerticalId=entry.VERTICAL_ID;
							verticalData={
								vertical_id:entry.VERTICAL_ID,
								vertical_name:entry.VERTICAL_NAME,
								menu:[]
							};						
						}

						let singleMenuItem={
							id:entry.MENU_ID,
							name:entry.MENU_NAME,
							title:entry.MENU_TITLE,
							type:entry.TYPE,
							parentId:entry.PARENT_ID,
							partOf:entry.PART_OF,
							dependantOn:entry.DEPENDANT_ON,
							isGroup:entry.IS_GROUP,
							allowMultiple:entry.IS_MULTIPLE,
							allowAddon:entry.ALLOW_ADDON,
							isResource:entry.IS_RESOURCE							
						};						

						strQuery=`SELECT ID RESOURCE_ID,RESOURCE_NAME FROM TBL_BOOKING_RESOURCES WHERE TBL_BOOKING_VERTICALS_MENU_ID=${singleMenuItem.id} AND IS_DELETED=0;`;
						let resourceData = await db.connection.query(strQuery);
						resourceData.forEach(function(resourceEntry) {
							if(!singleMenuItem.data)
								singleMenuItem.data=[];
								singleMenuItem.data.push({
									resourceId:resourceEntry.RESOURCE_ID,
									resourceName:resourceEntry.RESOURCE_NAME
								});
						});						

						if(singleMenuItem.parentId){
							if(menuData.subMenu)
								menuData.subMenu.push(singleMenuItem);
							else{
								menuData.subMenu=[];
								menuData.subMenu.push(singleMenuItem);								
							}
						}
						else{
							if(prevMenuId!="" && !(JSON.stringify(menuData) === JSON.stringify({})) ){
								verticalData.menu.push(menuData);							
							}
							prevMenuId=singleMenuItem.id;							
							menuData=singleMenuItem;	
						}
						
					}

					if(prevVerticalId!=""){
						verticalData.menu.push(menuData);						
						data.push(verticalData);
					}

					return {isSuccess : true,menuData:data};			
				}catch(err){
					console.log(`ERROR AT getMenu : ${err}`);					
					return {isSuccess : false, error:err};	
				}				

		},getStructureByMenuId: async function(reqData){
			const supId=mysqlEscape(reqData.supId);
			const menuId=mysqlEscape(reqData.menuId);
			let strQuery = `select B.TITLE,B.SUB_TITLE,B.ATTRIBUTES_GROUP_ID,B.REPEAT_SEGMENT from TBL_BOOKING_PAGE_STRUCTURE A  , TBL_BOOKING_SEGMENTS B 
			where A.TBL_BOOKING_VERTICALS_MENU_ID=${menuId} AND A.SEGMENT_GROUP_ID=B.SEGMENT_GROUP_ID ORDER BY B.SORT_ORDER;`;		
			try{
				let response=await db.connection.query(strQuery);
				let data=[];				
				for (const entry of response) {
					let segment={
						title:entry.TITLE,
						sub_title:entry.SUB_TITLE,
						repeat:entry.REPEAT_SEGMENT
					};
					
					let attributes_group_id=entry.ATTRIBUTES_GROUP_ID;
					let strQuery =`select A.ID,NAME,TYPE,TIME_INTERVAL_MIN,MAX_LENGTH,REQUIRED,RESOURCE_TYPE,SECTION_WIDTH_WEB,SECTION_WIDTH_MOBILE,MIN,MAX,SPINNER,TOOLTIP,LEFTSECTION,RIGHTSECTION,ALLOWCUSTOM,IFNULL(GROUP_CONCAT(VALUE ORDER BY B.SORT_ORDER SEPARATOR '~'),'') ATTRIBUTE_VALUES 
					from TBL_BOOKING_ATTRIBUTES A LEFT OUTER JOIN TBL_BOOKING_ATTRIBUTE_VALUES B ON (A.ID=B.TBL_BOOKING_ATTRIBUTES_ID AND B.SUPPLIER_ID IN (0,${supId})) 
					where A.ATTRIBUTES_GROUP_ID=${attributes_group_id} GROUP BY A.ID,NAME,TYPE,MAX_LENGTH,REQUIRED,RESOURCE_TYPE,SECTION_WIDTH_WEB,SECTION_WIDTH_MOBILE,MIN,MAX,SPINNER,TOOLTIP,LEFTSECTION,RIGHTSECTION,ALLOWCUSTOM ORDER BY A.SORT_ORDER`;
					let attributesNameList=await db.connection.query(strQuery);
					let attributesData=[];
					for (const attributeName of attributesNameList) {
						let attribute={
							attributeId:attributeName.ID,
							name:attributeName.NAME,
							type:attributeName.TYPE,
							interval:attributeName.TIME_INTERVAL_MIN,
							maxLength:attributeName.MAX_LENGTH,
							required:attributeName.REQUIRED,
							resourceType:attributeName.RESOURCE_TYPE,
							sectionWidthWeb:attributeName.SECTION_WIDTH_WEB,
							sectionWidthMobile:attributeName.SECTION_WIDTH_MOBILE,
							min:attributeName.MIN,
							max:attributeName.MAX,
							spinner:attributeName.SPINNER,
							tooltip:attributeName.TOOLTIP,
							leftSection:attributeName.LEFTSECTION,
							rightSection:attributeName.RIGHTSECTION,
							allowCustomAttributes:attributeName.ALLOWCUSTOM,
							values:attributeName.ATTRIBUTE_VALUES==''?[]:attributeName.ATTRIBUTE_VALUES.split('~')
						};
						attributesData.push(attribute);
					}
					segment.attributes=attributesData;					
					data.push(segment);
				}
				return {isSuccess : true,data:data};			
			}catch(err){
				console.log(`ERROR AT getStructureByMenuId : ${err}`);				
				return {isSuccess : false, error:err};	
			}				

		}, getAttributeDataByResourceId: async function(reqData){
			const supId=mysqlEscape(reqData.supId);
			const resourceId=mysqlEscape(reqData.resourceId);
			let strQuery = `select TBL_BOOKING_ATTRIBUTES_ID,VALUE ATTRIBUTE_VALUES from TBL_BOOKING_ATTRIBUTE_SUPPLIER_VALUES where SUPPLIER_ID=${supId} AND TBL_BOOKING_RESOURCES_ID=${resourceId} ;`;		
			try{
				let response=await db.connection.query(strQuery);
				let data=[];
				response.forEach(function(entry) {
					let attribute={
						attributeId:entry.TBL_BOOKING_ATTRIBUTES_ID,
						values:JSON.parse(entry.ATTRIBUTE_VALUES)
					};	
					data.push(attribute);
				});
				
				let partOf=[],dependantOn=[],partOfGroup=null;	
				strQuery = `select PART_OF_PARENT,DEPENDANT_ON_PARENT_LIST,GROUP_PARENT_ID FROM TBL_BOOKING_RESOURCES WHERE ID=${resourceId} ;`;		
				response=await db.connection.query(strQuery);
				response.forEach(function(entry) {
					partOf=JSON.parse(entry.PART_OF_PARENT);
					dependantOn=JSON.parse(entry.DEPENDANT_ON_PARENT_LIST);	
					partOfGroup=entry.GROUP_PARENT_ID;
				});
								
				return {isSuccess : true,data:data,partOf:partOf,dependantOn:dependantOn,partOfGroup:partOfGroup};			
			}catch(err){
				console.log(`ERROR AT getAttributeDataByResourceId : ${err}`);				
				return {isSuccess : false, error:err};	
			}				

		}, getSettingsDataByMenuId: async function(reqData){
			const supId=mysqlEscape(reqData.supId);
			const menuId=mysqlEscape(reqData.menuId);
			let strQuery = `select TBL_BOOKING_ATTRIBUTES_ID,VALUE ATTRIBUTE_VALUES from TBL_BOOKING_SETTINGS_ATTRIBUTE_SUPPLIER_VALUES where SUPPLIER_ID=${supId} AND TBL_BOOKING_VERTICALS_MENU_ID=${menuId} ;`;		
			try{
				let response=await db.connection.query(strQuery);
				let data=[];
				response.forEach(function(entry) {
					let attribute={
						attributeId:entry.TBL_BOOKING_ATTRIBUTES_ID,
						values:JSON.parse(entry.ATTRIBUTE_VALUES)
					};	
					data.push(attribute);
				});

				return {isSuccess : true,data:data,partOf:null,dependantOn:null};			
			}catch(err){
				console.log(`ERROR AT getSettingsDataByMenuId : ${err}`);				
				return {isSuccess : false, error:err};	
			}				
		}, getAddonDataByResourceId: async function(reqData){
			const supId=mysqlEscape(reqData.supId);
			const resourceId=mysqlEscape(reqData.resourceId);
			let strQuery = `select ID,NAME,MAX_QTY,PRICE_PER_QTY,PRICE_TYPE from TBL_BOOKING_SUPPLIERWISE_ADDONS where SUPPLIER_ID=${supId} AND TBL_BOOKING_RESOURCES_ID=${resourceId};`;		
			try{
				let response=await db.connection.query(strQuery);
				let data=[];
				response.forEach(function(entry) {
					let attribute={
						addonId:entry.ID,
						name:entry.NAME,
						maxQty:entry.MAX_QTY,
						pricePerQty:entry.PRICE_PER_QTY,
						priceType:entry.PRICE_TYPE
					};	
					data.push(attribute);
				});

				return {isSuccess : true,data:data};			
			}catch(err){
				console.log(`ERROR AT getAddonDataByResourceId : ${err}`);				
				return {isSuccess : false, error:err};	
			}				

		},saveResourceData:async function(reqData){
			const supId=mysqlEscape(reqData.supId);			
			const menuId=mysqlEscape(reqData.menuId);
			const partOf=reqData.partOf?mysqlEscape(JSON.stringify(reqData.partOf)):null;
			const dependantOn=reqData.dependantOn?mysqlEscape(JSON.stringify(reqData.dependantOn)):null;
			const partOfGroup=reqData.partOfGroup?mysqlEscape(JSON.stringify(reqData.partOfGroup)):null;
			let resourceName="";
			let unitsPerSlot=1;
			let slotTime=null;
			let slotUnit=null;
			let queryParams={};
			let baseCost=0;
			let pricing={};	
			let image=[];					
			let settings={};					
			let attributeValues=[];
			const resourceId=reqData.resourceId?mysqlEscape(reqData.resourceId):null;			
			const isEdit=reqData.resourceId?true:false;			
			let weekendPrice=null;
			let weekdayPrice=null;
			

			reqData.attributeData.forEach(function(attribute) {
				let attributeSingle={
					attributeId:attribute.attributeId,
					attributeValue:attribute.values
				};
				attributeValues.push(attributeSingle);
				if(attribute.resourceType){
					switch(attribute.resourceType){
						case "NAME":
							resourceName=mysqlEscape(attribute.values[0]);
						break;
						case "UNIT":
							unitsPerSlot=mysqlEscape(attribute.values[0]);
						break;
						case "SLOT_TIME":
							slotTime=mysqlEscape(attribute.values[0]);
						break;
						case "SLOT_UNIT":
							slotUnit=mysqlEscape(attribute.values[0]);
						break;
						case "QUERY":
							queryParams[attribute.attributeName]=attribute.values[0];
						break;
						case "PHOTO":
							image=attribute.values;
						break;
						case "BASE_PRICE":
							baseCost=mysqlEscape(attribute.values[0]);
							weekdayPrice=baseCost;
						case "PRICE":
							weekendPrice=attribute.resourceType=="PRICE"?mysqlEscape(attribute.values[0]):weekendPrice;
							pricing[attribute.attributeName]=attribute.values[0];
						break;
						case "SETTINGS":
							if(attribute.values.length==1)
								settings[attribute.attributeName]=attribute.values[0];
							else
								settings[attribute.attributeName]=attribute.values;
							
					}
				}
			});				
			

			queryParams=mysqlEscape(JSON.stringify(queryParams));
			pricing=mysqlEscape(JSON.stringify(pricing));
			image=mysqlEscape(JSON.stringify(image));
			

			try{
				if( !(JSON.stringify(settings) === JSON.stringify({})) ||  slotTime){
					settings=mysqlEscape(JSON.stringify(settings));		
					let updateQry=`update TBL_BOOKING_SUPPLIERWISE_VERTICAL_SETTINGS_SUPPLIERWISE set SETTINGS=${settings} where SUPPLIER_ID=${supId} AND TBL_BOOKING_VERTICALS_ID=(select TBL_BOOKING_VERTICALS_ID from TBL_BOOKING_VERTICALS_MENU where ID=${menuId})`;					
					if(slotTime){
						updateQry=`update TBL_BOOKING_SUPPLIERWISE_VERTICAL_SETTINGS_SUPPLIERWISE set SETTINGS=${settings},SLOT_TIME=${slotTime},SLOT_UNIT=${slotUnit} where SUPPLIER_ID=${supId} AND TBL_BOOKING_VERTICALS_ID=(select TBL_BOOKING_VERTICALS_ID from TBL_BOOKING_VERTICALS_MENU where ID=${menuId})`;											
					}
					await db.connection.query(updateQry);

					for (const attributeSingle of attributeValues) {
						const attributeId=mysqlEscape(attributeSingle.attributeId);
						const attributeValue=mysqlEscape(JSON.stringify(attributeSingle.attributeValue));
	
						let insertQuery=`insert into TBL_BOOKING_SETTINGS_ATTRIBUTE_SUPPLIER_VALUES(SUPPLIER_ID,TBL_BOOKING_VERTICALS_MENU_ID,TBL_BOOKING_ATTRIBUTES_ID,VALUE) values
						(${supId},${menuId},${attributeId},${attributeValue})
						ON DUPLICATE KEY UPDATE VALUE=${attributeValue}
						`;
						await db.connection.query(insertQuery);					
					}	
					return {isSuccess : true };														
				}		

				let strQuery = `insert into TBL_BOOKING_RESOURCES(ID,SUPPLIER_ID,TBL_BOOKING_VERTICALS_MENU_ID,RESOURCE_NAME,PART_OF_PARENT,DEPENDANT_ON_PARENT_LIST,GROUP_PARENT_ID,UNITS_PER_SLOT,QUERY_PARAMS,BASE_COST,PRICING,IMAGE) 
				values(${resourceId},${supId},${menuId},${resourceName},${partOf},${dependantOn},${partOfGroup},${unitsPerSlot},${queryParams},${baseCost},${pricing},${image})
				ON DUPLICATE KEY UPDATE RESOURCE_NAME=${resourceName},PART_OF_PARENT=${partOf},DEPENDANT_ON_PARENT_LIST=${dependantOn},GROUP_PARENT_ID=${partOfGroup},UNITS_PER_SLOT=${unitsPerSlot},QUERY_PARAMS=${queryParams},BASE_COST=${baseCost},PRICING=${pricing},IMAGE=${image}
				`;
				let response=await db.connection.query(strQuery);


				if(!isEdit && !response.insertId)
					return {isSuccess : false};

				
				let tbl_booking_resource_id=isEdit?reqData.resourceId:mysqlEscape(response.insertId);
			   
				//insert attribute values

								//insert addon values	
				let attributeIdList=[];	
				if(isEdit){			
					strQuery=`select TBL_BOOKING_ATTRIBUTES_ID as ID FROM TBL_BOOKING_ATTRIBUTE_SUPPLIER_VALUES WHERE SUPPLIER_ID=${supId} AND TBL_BOOKING_RESOURCES_ID=${tbl_booking_resource_id}`;		
					response=await db.connection.query(strQuery);					
					for (const entry of response) {
						attributeIdList.push(entry.ID);
					}	
				}


				for (const attributeSingle of attributeValues) {
					const attributeId=mysqlEscape(attributeSingle.attributeId);
					const attributeValue=mysqlEscape(JSON.stringify(attributeSingle.attributeValue));
					if(isEdit){									
						let index = attributeIdList.indexOf(attributeSingle.attributeId);
						if (index > -1) {
							attributeIdList.splice(index, 1);
						}
					}

					strQuery=`insert into TBL_BOOKING_ATTRIBUTE_SUPPLIER_VALUES(SUPPLIER_ID,TBL_BOOKING_RESOURCES_ID,TBL_BOOKING_ATTRIBUTES_ID,VALUE) values
					(${supId},${tbl_booking_resource_id},${attributeId},${attributeValue})
					ON DUPLICATE KEY UPDATE VALUE=${attributeValue}
					`;
					response=await db.connection.query(strQuery);					

				}	
				
				if(isEdit && attributeIdList.length>0){
					const list=attributeIdList.join();
					strQuery=`DELETE FROM TBL_BOOKING_ATTRIBUTE_SUPPLIER_VALUES WHERE SUPPLIER_ID=${supId} AND TBL_BOOKING_RESOURCES_ID=${tbl_booking_resource_id} AND TBL_BOOKING_ATTRIBUTES_ID IN (${list})`;
					response=await db.connection.query(strQuery);										
				}


				//insert addon values	
				let addonIdList=[];	
				if(isEdit){			
					strQuery=`select ID FROM TBL_BOOKING_SUPPLIERWISE_ADDONS WHERE SUPPLIER_ID=${supId} AND TBL_BOOKING_RESOURCES_ID=${tbl_booking_resource_id}`;		
					response=await db.connection.query(strQuery);					
					for (const entry of response) {
						addonIdList.push(entry.ID);
					}	
				}

				for (const addon of reqData.addonsData) {
					const name=mysqlEscape(addon.name);
					const maxQty=mysqlEscape(addon.maxQty);
					const pricePerQty=mysqlEscape(addon.pricePerQty);
					const priceType=mysqlEscape(addon.priceType);
					const addonId=addon.addonId?mysqlEscape(addon.addonId):null;	

					if(addonId && isEdit){
						let index = addonIdList.indexOf(addon.addonId);
						if (index > -1) {
							addonIdList.splice(index, 1);
						}
					}

					strQuery=`insert into TBL_BOOKING_SUPPLIERWISE_ADDONS(ID,SUPPLIER_ID,TBL_BOOKING_RESOURCES_ID,NAME,MAX_QTY,PRICE_PER_QTY,PRICE_TYPE) VALUES
					(${addonId},${supId},${tbl_booking_resource_id},${name},${maxQty},${pricePerQty},${priceType})
					ON DUPLICATE KEY UPDATE NAME=${name},MAX_QTY=${maxQty},PRICE_PER_QTY=${pricePerQty},PRICE_TYPE=${priceType}`;
					response=await db.connection.query(strQuery);					
					
				}					
	
				if(isEdit && addonIdList.length>0){
					const list=addonIdList.join();
					strQuery=`DELETE FROM TBL_BOOKING_SUPPLIERWISE_ADDONS WHERE ID IN (${list})`;
					response=await db.connection.query(strQuery);										
				}

				strQuery=`select ID,NAME,MAX_QTY,PRICE_PER_QTY,PRICE_TYPE from TBL_BOOKING_SUPPLIERWISE_ADDONS where TBL_BOOKING_RESOURCES_ID=${tbl_booking_resource_id}`;
				response=await db.connection.query(strQuery);										
				let addonUpdateData=[];
				response.forEach(function(entry) {
					let addonUpdateDataSingle={
						id:entry.ID,
						name:entry.NAME,
						maxQty:entry.MAX_QTY,
						pricePerQty:entry.PRICE_PER_QTY,
						priceType:entry.PRICE_TYPE
					};
					addonUpdateData.push(addonUpdateDataSingle);
				});						
				if(addonUpdateData.length>0){
					addonUpdateData=mysqlEscape(JSON.stringify(addonUpdateData));
					strQuery=`UPDATE TBL_BOOKING_RESOURCES SET ADDONS=${addonUpdateData} where ID=${tbl_booking_resource_id}`;
					await db.connection.query(strQuery);															
				}

				//ADD RATES INFO HERE
			//INSERT INTO TBL_BOOKING_WEEKLY_RATES(SUPPLIER_ID,DAY,START_TIME,END_TIME,RESOURCE_GROUP_ID,RESOURCE_GROUP,RATE) VALUES();
			if(reqData.partOf && reqData.partOf.length>0){ 
				strQuery=`SELECT IFNULL(json_extract(SETTINGS,'$."Your Weekends"'),'["SAT", "SUN"]') WEEKENDS FROM TBL_BOOKING_SUPPLIERWISE_VERTICAL_SETTINGS_SUPPLIERWISE 
				WHERE TBL_BOOKING_VERTICALS_ID=(SELECT TBL_BOOKING_VERTICALS_ID FROM TBL_BOOKING_VERTICALS_MENU WHERE ID=${menuId}) AND SUPPLIER_ID=${supId}`;
				response=await db.connection.query(strQuery);
				let weekDays=["MON","TUE","WED","THU","FRI","SAT","SUN"];
				const weekEnds=JSON.parse(response[0].WEEKENDS);															
				//insert weekend rates
				for (const weekendDay of weekEnds) {						
					let index = weekDays.indexOf(weekendDay);
					if (index > -1) weekDays.splice(index, 1);	
					strQuery=`DELETE FROM TBL_BOOKING_WEEKLY_RATES WHERE SUPPLIER_ID=${supId} AND RESOURCE_ID=${tbl_booking_resource_id} AND START_TIME IS NULL AND END_TIME IS NULL and DAY='${weekendDay}'`;												
					await db.connection.query(strQuery);							
					for (const locationId of reqData.partOf) {
						strQuery=`INSERT INTO TBL_BOOKING_WEEKLY_RATES(SUPPLIER_ID,DAY,START_TIME,END_TIME,LOCATION_ID,RESOURCE_ID,RATE) VALUES(
							${supId},'${weekendDay}',null,null,${locationId},${tbl_booking_resource_id},${weekendPrice}
						)`;
						await db.connection.query(strQuery);	
					}
				}

				//insert weekday rates
				for (const weekDay of weekDays) {
					strQuery=`DELETE FROM TBL_BOOKING_WEEKLY_RATES WHERE SUPPLIER_ID=${supId} AND RESOURCE_ID=${tbl_booking_resource_id} AND START_TIME IS NULL AND END_TIME IS NULL and DAY='${weekDay}'`;												
					await db.connection.query(strQuery);																			
					for (const locationId of reqData.partOf) {
						strQuery=`INSERT INTO TBL_BOOKING_WEEKLY_RATES(SUPPLIER_ID,DAY,START_TIME,END_TIME,LOCATION_ID,RESOURCE_ID,RATE) VALUES(
							${supId},'${weekDay}',null,null,${locationId},${tbl_booking_resource_id},${weekdayPrice}
						)`;
						await db.connection.query(strQuery);	
					}
				}					
			}

				return {isSuccess : true , resourceId:parseInt(tbl_booking_resource_id)};			
			}catch(err){
				console.log(`ERROR AT saveResourceData : ${err}`);
				return {isSuccess : false, error:err};	
			}				
			
			

		},addCustomAttribute:async function(reqData){
			const supId=mysqlEscape(reqData.supId);			
			const attributeId=mysqlEscape(reqData.attributeId);
			const attributeValue=mysqlEscape(reqData.attributeValue);
			
			try{
				let strQuery=`insert ignore into TBL_BOOKING_ATTRIBUTE_VALUES(SUPPLIER_ID,TBL_BOOKING_ATTRIBUTES_ID,VALUE,SORT_ORDER) 
				select ${supId},${attributeId},${attributeValue},ifnull(max(SORT_ORDER),0)+1 SORT_ORDER from TBL_BOOKING_ATTRIBUTE_VALUES 
				where TBL_BOOKING_ATTRIBUTES_ID=${attributeId} AND SUPPLIER_ID IN (0,${supId})`;
				await db.connection.query(strQuery);
				return {isSuccess : true};					
			}catch(err){
				console.log(`ERROR AT addCustomAttribute : ${err}`);
				return {isSuccess : false, error:err};	
			}								
			
		},delete:async function(reqData){       
			const supId=mysqlEscape(reqData.supId);						
			const id=mysqlEscape(reqData.id);
			try{  
				let strQuery=`UPDATE TBL_BOOKING_RESOURCES SET IS_DELETED=1 WHERE ID=${id} or GROUP_PARENT_ID=${id}`;				
				await db.connection.query(strQuery);            

				strQuery=` SELECT ID,PART_OF_PARENT,DEPENDANT_ON_PARENT_LIST FROM TBL_BOOKING_RESOURCES  WHERE SUPPLIER_ID=${supId} AND (JSON_CONTAINS(PART_OF_PARENT, '${id}') OR JSON_CONTAINS(DEPENDANT_ON_PARENT_LIST, '${id}'))`;
				let response=await db.connection.query(strQuery);					
				for (const entry of response) {
					let PART_OF_PARENT=JSON.parse(entry.PART_OF_PARENT);
					let DEPENDANT_ON_PARENT_LIST=JSON.parse(entry.DEPENDANT_ON_PARENT_LIST);

					let index = PART_OF_PARENT.indexOf(reqData.id);
					if (index > -1) {
						PART_OF_PARENT.splice(index, 1);
					}

					index = DEPENDANT_ON_PARENT_LIST.indexOf(reqData.id);
					if (index > -1) {
						DEPENDANT_ON_PARENT_LIST.splice(index, 1);
					}

					PART_OF_PARENT=mysqlEscape(JSON.stringify(PART_OF_PARENT));
					DEPENDANT_ON_PARENT_LIST=mysqlEscape(JSON.stringify(DEPENDANT_ON_PARENT_LIST));
					
					strQuery=`UPDATE TBL_BOOKING_RESOURCES SET PART_OF_PARENT=${PART_OF_PARENT} , DEPENDANT_ON_PARENT_LIST=${DEPENDANT_ON_PARENT_LIST} WHERE ID=${entry.ID}`;
					await db.connection.query(strQuery);	
				}	

				return {isSuccess : true};		                                
			}catch(err){
				console.log(`ERROR AT delete of vendorBookingService.js: ${err}`);					
				return {isSuccess : false, error:err};	
			}	
		} 		
};
