import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });


const PORT = process.env.PORT || 5000;



const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://pemweb-lanjut-frontend.vercel.app",
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Akses ditolak oleh kebijakan CORS Backend."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Mount API router
app.use(router);

// Serve static files from the React frontend app
const frontendBuildPath = path.resolve(__dirname, "../../frontend/build");
app.use(express.static(frontendBuildPath));

// All remaining GET requests that don't match our API routes should be served by the React app
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});



app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
});

export default app;
