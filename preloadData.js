// @ts-check

const preloadData = require('./util/loadData');

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017").then(connection => {
    const data = preloadData();
    mongoose.model('Paper').insertMany(data[0]).catch(err => {
        console.error("Failed to load papers.");
    });
    mongoose.model('Scholar').insertMany(data[1]).catch(err => {
        console.error("Failed to load scolars.");
    });
});