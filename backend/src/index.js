import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
dotenv.config();


const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());


const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('App berjalan');
});

app.use(router);



app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
});

export default app;
