import express from "express";
import supabase from "../supabaseClient.js";

const router = express.Router();

// 🔐 INSERT user into 'users' table (called after frontend signup)
router.post('/insertUser', async (req, res) => {
  const { name, email } = req.body;

  try {
    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists in users table.' });
    }

    // 2. Insert new user
    const { error: insertError } = await supabase.from('users').insert([
      {
        name,
        email,
        status: 1,           
        role: 'user',       
        last_active: new Date().toISOString().split('T')[0],
      },
    ]);

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return res.status(400).json({ error: insertError.message });
    }

    res.json({ success: true, message: 'User inserted into users table.' });

  } catch (err) {
    console.error('InsertUser server error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});
export default router;
