import express from "express";
import supabase from "../supabaseClient.js"; // ✅ Correct import

const router = express.Router(); // ✅ Use express.Router()

// Define your GET route
router.get("/data", async (req, res) => {
  const { data, error } = await supabase.from("cities").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});


export default router;
