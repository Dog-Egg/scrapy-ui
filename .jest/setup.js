const temp = require("temp");

temp.track();
const file = temp.openSync();

process.env.SCRAPY_UI_DATABASE = file.path;
