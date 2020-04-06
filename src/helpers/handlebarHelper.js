var handlebars = require("handlebars");
var fs = require("fs");
const path = require('path');
var partialFolderPath = path.join(__dirname ,"../src/helpers/common_component");
// following code register all the partials
fs.readdir(partialFolderPath, (err, files) => {
    files.forEach(file => {
        if(file.indexOf(".hbs") > -1){
            let partialName = file.split(".hbs")[0];
            handlebars.registerPartial(partialName,fs.readFileSync(partialFolderPath + "/" + file,'utf8'));
        }
    });
});
handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('choose', function(val1, val2) {
    return val1 ? val1 : val2;
});