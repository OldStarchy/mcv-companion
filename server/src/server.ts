import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const message = 'Hello, world!';
const clientRoot = '../client/dist/';

app.use(bodyParser.json());
app.use(express.static(clientRoot));

app.get('/api', (req, res) => {
	res.send({ message });
});

app.listen(port, () => console.log(`MCV Companion listening on port ${port}.`));
