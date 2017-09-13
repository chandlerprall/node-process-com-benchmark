const datum = require('../datum.json');

const messagesPerTick = 10;

setInterval(()=>{
    for (let i = 0; i < messagesPerTick; i++) {
        process.send(datum);
    }
});