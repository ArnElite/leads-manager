const SUPABASE_URL = 'https://fxolvqfayvrxtkwjohtv.supabase.co';
const SUPABASE_KEY = 'your-key-here';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentRole = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'login.html';
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('email', user.email)
    .single();

  if (profileError || !profile) {
    alert('Failed to fetch profile. Try again.');
    return;
  }

  currentUser = profile.name;
  currentRole = profile.role;

  loadLeads();
});

async function loadLeads() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const leadsList = document.getElementById('leadsList');
  leadsList.innerHTML = '';

  if (error || !leads) {
    leadsList.innerHTML = '<tr><td colspan="16">Failed to load leads.</td></tr>';
    return;
  }

  if (leads.length === 0) {
    leadsList.innerHTML = '<tr><td colspan="16">No leads available.</td></tr>';
    return;
  }

  leads.forEach((lead) => {
    const tr = document.createElement('tr');

    // Create Action Buttons Based on Role
    let actions = '';

    if (currentRole === 'CEO' || lead.assigned_to === currentUser) {
      actions += `<button onclick="editLead('${lead.id}')">Edit</button> `;
    }

    if (currentRole === 'CEO') {
      actions += `<button onclick="deleteLead('${lead.id}')">Delete</button>`;
    }

    tr.innerHTML = `
      <td>${lead.customer_name || 'Unnamed'}</td>
      <td>${lead.email || 'N/A'}</td>
      <td>${lead.mobile_number || 'N/A'}</td>
      <td>${lead.project_name || 'N/A'}</td>
      <td>${lead.budget || 'N/A'}</td>
      <td>${lead.preferred_area || 'N/A'}</td>
      <td>${lead.team_leader || 'N/A'}</td>
      <td>${lead.assigned_to || 'N/A'}</td>
      <td>${lead.last_contacted_date || 'N/A'}</td>
      <td>${lead.next_followup_date || 'N/A'}</td>
      <td>${lead.comments || 'N/A'}</td>
      <td>${lead.deal_status || 'N/A'}</td>
      <td>${lead.interest_level || 'N/A'}</td>
      <td>${lead.property_type || 'N/A'}</td>
      <td>${lead.site_visit_done ? 'Yes' : 'No'}</td>
      <td>${actions}</td>
    `;
    leadsList.appendChild(tr);
  });
}

function sortByArea() {
  const rows = Array.from(document.querySelectorAll("#leadsList tr"));
  rows.sort((a, b) => {
    const areaA = a.children[5].innerText.toLowerCase(); // Preferred Area
    const areaB = b.children[5].innerText.toLowerCase();
    return areaA.localeCompare(areaB);
  });
  updateTable(rows);
}

function sortByFollowUp() {
  const rows = Array.from(document.querySelectorAll("#leadsList tr"));
  rows.sort((a, b) => {
    const dateA = new Date(a.children[9].innerText); // Next Follow-Up Date
    const dateB = new Date(b.children[9].innerText);
    return dateA - dateB;
  });
  updateTable(rows);
}

function updateTable(sortedRows) {
  const tbody = document.getElementById("leadsList");
  tbody.innerHTML = "";
  sortedRows.forEach(row => tbody.appendChild(row));
}


function editLead(leadId) {
  window.location.href = `editlead.html?id=${leadId}`;
}

async function deleteLead(leadId) {
  if (!confirm('Are you sure you want to delete this lead?')) return;

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    alert('Failed to delete lead.');
    console.error(error);
    return;
  }

  alert('Lead deleted successfully.');
  loadLeads(); // Refresh
}
