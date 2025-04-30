import express from "express";
import supabase from "../supabaseClient.js"; // ✅ Correct import

const router = express.Router(); // ✅ Use express.Router()

// Define your GET route
router.get("/data", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});



router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updatedData)
      .eq("user_id", id)
      .select(); 

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) { // ✅ safer check
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "✅ User updated successfully", user: data[0] });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
