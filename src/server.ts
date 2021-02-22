import express from 'express';

const app = express();

app.listen(3333, () => console.log("Server running!"));

app.get('/', (req, res) => {
    return res.json({ message: 'Hello NLW' });
});