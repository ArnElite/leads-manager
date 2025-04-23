const SUPABASE_URL = 'https://fxolvqfayvrxtkwjohtv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b2x2cWZheXZyeHRrd2pvaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTgxOTgsImV4cCI6MjA2MDI3NDE5OH0.lK4FzEiSfP9tLCTcOlVVeEjk_bPJp01lRie0hkn-JN8'; // truncated for clarity
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'login.html';
    return;
  }

  const email = user.email;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('email', email)
    .single();

  if (profileError || !profileData) {
    alert('Failed to fetch user details. Redirecting to login.');
    window.location.href = 'login.html';
    return;
  }

  const { name, role } = profileData;

  document.getElementById('user-name').textContent = name;
  document.getElementById('user-role').textContent = role;

  document.getElementById('lead-section').style.display = 'block';

  // Show Add Lead button for CEO only
  if (role === 'CEO') {
    const addButton = document.getElementById('addLeadBtn');
    addButton.style.display = 'inline-block';
    addButton.addEventListener('click', () => {
      window.location.href = 'addlead.html'; // Redirect to add lead page
    });
  }

  // View Leads button (available for all)
  const viewLeadsBtn = document.getElementById('viewLeadsBtn');
  viewLeadsBtn.addEventListener('click', () => {
    window.location.href = 'leads.html'; // Redirect to view leads page
  });
});

function logout() {
  supabase.auth.signOut().then(() => {
    window.location.href = 'login.html';
  });
}
