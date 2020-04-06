const express = require('express');
const path = require('path');
const app = express();
const ServerApi = require('../build/server_api');
const staticPath = path.resolve(__dirname, '../dist');
const test = '1212';
const bookingRoutesVendor = require("./routes/booking/vendor");
const bookingRoutesCalendar = require("./routes/booking/calendar");
const bookingRoutesCustomer = require("./routes/booking/customer");
const bookingRoutesCart = require("./routes/booking/cart");


app.use(express.static(staticPath, { maxAge: 365 * 24 * 60 * 60 * 1000 }));
const cachedHtml = {};


app.use(function addSupplierInfo(req,res,next){	
        req.supId=48636010;
        next();
	});
	
app.use("/omni_bookings/vendor",bookingRoutesVendor);
app.use("/omni_bookings/calendar",bookingRoutesCalendar);
app.use("/omni_bookings/customer",bookingRoutesCustomer);
app.use("/omni_bookings/cart",bookingRoutesCart);




app.get('*', (req, res) => {
	const strUserAgent = req.headers['user-agent'] || '';
	const isMobile =
		/Android|Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			strUserAgent
		) && !strUserAgent.match(/ipad/i);
	req.jdUserAgent = {
		isMobile,
		isMacOS: /Mac OS X/i.test(strUserAgent)
	};
	req.productSeoData = {};
	ServerApi.getHtml(req).then(data => {
		if (data.notFoundPage) {
			res.status(404);
		}
		res.send(data.content);
	});
});

app.listen(3051, () => {
	console.log(`Listening on port: 3051`);
});
