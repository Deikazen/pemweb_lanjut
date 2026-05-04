import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/userRoute.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('App berjalan');
});

app.use(router);
app.use(express.json());



app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
});
