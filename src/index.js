import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
dotenv.config();


const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());


app.use(cors());

app.get('/', (req, res) => {
    res.send('App berjalan');
});

app.use(router);



app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
});
