const fs = require("fs");
const content = fs.readFileSync("/home/ubuntu/data/coauthor_0.json", "utf8");
const rawData = JSON.parse(content);
const keys = Object.keys(rawData);
console.log(keys.slice(0,10));
