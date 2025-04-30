import express from "express";
import cors from "cors";

import userTable from "./routes/userTable.js"; 
import authRoutes from './routes/auth.js';
import insertUser from './routes/insertUser.js';

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:3000",
  // `${process.env.REACT_PUBLIC_DOMAIN_URL}`,
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

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
