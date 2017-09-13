/*
mac, datum - pegs 100% host cpu at 186k messages / 125Mb per second
mac, datum2 - pegs 100% host cpu at 38k messages / 128Mb per second
 */

const {spawn} = require('child_process');
const {createServer} = require('net');
const clientCount = process.argv[2] == null ? 1 : parseInt(process.argv[2], 10);

let bytes = 0;
let messages = 0;
const onMessage = payload => {
    bytes += datumBytes;
    messages++;
};

const server = createServer(
    connection => {
        let payloadSize = 0;
        let buffer;
        
        function processBuffer() {
            if (buffer.length >= 4 && payloadSize === 0) {
                // need to read payload size
                payloadSize = buffer[0] + (buffer[1] << 8) + (buffer[2] << 16) + (buffer[3] << 24);
                buffer = buffer.slice(4);
            }
    
            if (buffer.length >= payloadSize) {
                const payload = JSON.parse(buffer.slice(0, payloadSize).toString());
                buffer = buffer.slice(payloadSize);
                payloadSize = 0;
                messages++;
                
                if (buffer.length >= 4) {
                    processBuffer();
                }
            }
        }
        
        connection.on('data', data => {
            bytes += data.length;
            if (buffer == null) {
                buffer = data;
            } else {
                buffer = Buffer.concat([buffer, data], buffer.length + data.length);
            }
            processBuffer();
        });
    }
);
server.listen(
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