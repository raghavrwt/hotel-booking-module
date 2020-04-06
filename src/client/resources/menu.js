export const verticals = { //on load direct hit
    "list": [
        {
            "id": 1,
            "name": "Hotels"
        }, {
            "id": 2,
            "name": "Spa"
        }
    ]
}

export const menus = {   //on request with vertical id
    "list": [
        {
            "name": "Location",
            "id": 1,
            "dependentOn": null,
            "type": "form",
            "values": [
                {
                    "resourceId":1,
                    "value":"ANDHERI",
                    /*bare necessary attrs*/
                }
            ],
            "pageStructure": {}

        }, {
            "name": "Rooms",
            "id": 2,
            "dependentOn": 1,
            "isMultiple": true,
            "type": "form",
            "pageStructure": {},    //structure of the form
            "values": [
                {
                    "resourceId": 2,
                    "value": "DELUXE"
                    //bare necessary attrs
                }
            ]
        }
    ]
}

export const resourceData = { //on request with resourceId
    "resourceId": 2,
    "attributes": {
        //form data
    }
}