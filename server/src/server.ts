import express from 'express';

const app = express();
const port = 3000;
const message = "Hello, world!";


app.get('/', (req, res) => res.send(message));

app.listen(port, () => console.log(`MCV Companion listening on port ${port}.`));
