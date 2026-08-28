import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db.js";
import googleRoute from "./routes/auth.routes.js";

dotenv.config();

const app = express();


connectDB();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, 
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.use("/api/auth", googleRoute);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});