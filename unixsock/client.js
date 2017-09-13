const {createConnection} = require('net');
const datum = require('../datum.json');
const datumBuffer = Buffer.from(JSON.stringify(datum));
const datumLength = datumBuffer.length;

const datumLengthBuffer = new Uint32Array(1);
const datumLengthBufferDataView = new DataView(datumLengthBuffer.buffer);
datumLengthBufferDataView.setUint32(0, datumLength, true);
const datumLengthBufferBuffer = Buffer.from(datumLengthBuffer.buffer);

const messageBuffer = Buffer.concat([datumLengthBufferBuffer, datumBuffer], 4 + datumBuffer.length);

const messagesPerTick = 100;

const client = createConnection(
    {
        path: '/tmp/benchmark.sock'
    },
    () => {
        setInterval(() => {
            for (let i = 0; i < messagesPerTick; i++) {
                client.write(messageBuffer);
            }
        });
    }
);