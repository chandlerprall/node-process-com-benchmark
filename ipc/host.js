/*
mac, datum - pegs 100% host cpu at 56k messages / 38Mb per second
mac, datum2 - pegs 100% host cpu at 12k messages / 39Mb per second
 */

const {fork} = require('child_process');
const clientCount = process.argv[2] == null ? 1 : parseInt(process.argv[2], 10);
const datum = require('../datum.json');
const datumBytes = JSON.stringify(datum).length;

let bytes = 0;
let messages = 0;
const onMessage = payload => {
    bytes += datumBytes;
    messages++;
};

for (let i = 0; i < clientCount; i++) {
    const subprocess = fork('./client');
    subprocess.on('message', onMessage);
}

setInterval(
    () => {
        process.stdout.cursorTo(0, 0);
        process.stdout.clearLine();
        process.stdout.write(`bytes ${bytes}\n`);
        process.stdout.write(`messages ${messages}`);
        bytes = messages = 0;
    },
    1000
);

process.stdout.cursorTo(0, 0);
process.stdout.clearScreenDown();
process.stdout.write(`running with ${clientCount} clients`);