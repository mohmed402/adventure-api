import express from "express";
import cors from "cors";

import userTable from "./routes/userTable.js"; 
import authRoutes from './routes/auth.js';
import insertUser from './routes/insertUser.js';
import cityRoutes from './routes/city.js';
import cityCheck from './routes/cityCheck.js';
import saveCityRoutes from './routes/saveCity.js';
import weather from './routes/weather.js';
import getCityData from './routes/getCityData.js';


const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:3000",
  `https://adventure-api-jet.vercel.app`,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.use("/users", userTable);
app.use('/auth', authRoutes);
app.use('/auth', insertUser);
app.use('/city', cityRoutes);
app.use('/cityCheck', cityCheck);
app.use('/city', saveCityRoutes);
app.use('/weather', weather);
app.use('/city', getCityData);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
