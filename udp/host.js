/*
mac, datum - pegs 100% host cpu at 46k messages / 31Mb per second
mac, datum2 - pegs 100% host cpu at 24k messages / 82Mb per second
 */

const {spawn} = require('child_process');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const clientCount = process.argv[2] == null ? 1 : parseInt(process.argv[2], 10);

let bytes = 0;
let messages = 0;
const onMessage = payload => {
    bytes += datumBytes;
    messages++;
};

function processBuffer(connection) {
    let {buffer, payloadSize} = connection;
    
    if (buffer.length >= 4 && payloadSize === 0) {
        // need to read payload size
        payloadSize = buffer[0] + (buffer[1] << 8) + (buffer[2] << 16) + (buffer[3] << 24);
        buffer = buffer.slice(4);
    }
    
    let continueProcessing = false;
    
    if (buffer.length >= payloadSize) {
        const payload = JSON.parse(buffer.slice(0, payloadSize).toString());
        buffer = buffer.slice(payloadSize);
        payloadSize = 0;
        messages++;
        
        if (buffer.length >= 4) {
            continueProcessing = true;
        }
    }
    
    connection.buffer = buffer;
    connection.payloadSize = payloadSize;
    if (continueProcessing === true) {
        processBuffer(connection);
    }
}

let connections = new Map();
server.on('message', (data, rinfo) => {
    bytes += data.length;
    const {port} = rinfo
    let connection;
    if (!connections.has(port)) {
        connection = {payloadSize: 0, buffer: data};
        connections.set(port, connection);
    } else {
        connection = connections.get(port);
        connection.buffer = Buffer.concat([connection.buffer, data]);
    }
    
    processBuffer(connection);
});

server.bind(
    1338,
    () => {
        for (let i = 0; i < clientCount; i++) {
            const subprocess = spawn('../node', ['client']);
        }
    }
);

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