document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://fxolvqfayvrxtkwjohtv.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b2x2cWZheXZyeHRrd2pvaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTgxOTgsImV4cCI6MjA2MDI3NDE5OH0.lK4FzEiSfP9tLCTcOlVVeEjk_bPJp01lRie0hkn-JN8';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById('loginForm');

  if (!form) {
    console.error("Form with ID 'loginForm' not found.");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    // Redirect to dashboard on successful login
    window.location.href = 'dashboard.html';
  });
});
    