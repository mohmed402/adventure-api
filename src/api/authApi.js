import { supabase } from '../supabaseClient';

export async function authRequest(formData, type = 'signup') {
  try {
    let response;

    if (type === 'signup') {
      // 1. Sign up with Supabase Auth (sends confirmation email)
      response = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // 2. Insert into your custom 'users' table via your backend
      const insertRes = await fetch('https://adventure-api-production.up.railway.app/auth/insertUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
        }),
      });

      const insertData = await insertRes.json();
      if (!insertRes.ok) {
        throw new Error(insertData.error || 'Failed to insert user');
      }

    } else if (type === 'signin') {
      // 1. Sign in
      response = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const user = response.data.user;

      // 2. Fetch profile from users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('status, role')
        .eq('email', user.email)
        .single();

      if (error) {
        throw new Error('User record not found in users table');
      }

      // 3. Check access
      const isAllowed = profile.status === 1 || profile.role === 'admin';

      if (!isAllowed) {
        await supabase.auth.signOut(); // Prevent session from persisting
        throw new Error('Your account is not active or authorized to log in.');
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
