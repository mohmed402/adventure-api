import { supabase } from '../supabaseClient'; // adjust if needed

export default async function handleLogout(){
  try {
    await supabase.auth.signOut();
    console.log('Logged out');


    localStorage.clear();
    window.location.reload(); 
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};