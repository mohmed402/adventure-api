import express from "express";
import supabase from "../supabaseClient.js"; // ✅ Correct import

const router = express.Router();


// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body; // ✅ Correctly coming from the frontend

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      console.error('Auth Error:', authError.message);
      return res.status(400).json({ error: authError.message });
    }

    // ✅ 2. Insert into your custom 'users' table
    const { error: insertError } = await supabase.from('users').insert([
      {
        email: email,  // ✅ Correct: use email from req.body
        name: name,    // ✅ Correct: use name from req.body
        status: 1,     // Active
        last_active: new Date().toISOString().split('T')[0],
      },
    ]);

    if (insertError) {
      console.error('Insert Error:', insertError.message);
      return res.status(400).json({ error: insertError.message });
    }

    res.json({ success: true, message: 'Account created successfully!' });

  } catch (err) {
    console.error('Signup Server Error:', err.message);
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: 'Logged in successfully!',
      token: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    console.error('Signin error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});


export default router;
