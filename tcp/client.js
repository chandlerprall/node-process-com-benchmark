const {createConnection} = require('net');
const datum = require('../datum2.json');
const datumBuffer = Buffer.from(JSON.stringify(datum));
const datumLength = datumBuffer.length;

const datumLengthBuffer = new Uint32Array(1);
const datumLengthBufferDataView = new DataView(datumLengthBuffer.buffer);
datumLengthBufferDataView.setUint32(0, datumLength, true);
const datumLengthBufferBuffer = Buffer.from(datumLengthBuffer.buffer);

const messageBuffer = Buffer.concat([datumLengthBufferBuffer, datumBuffer], 4 + datumBuffer.length);

const messagesPerTick = 8;

const client = createConnection(
    {
        host: '127.0.0.1',
        port: 1338
    },
    () => {
        setInterval(() => {
            for (let i = 0; i < messagesPerTick; i++) {
                client.write(messageBuffer);
            }
        });
    }
);