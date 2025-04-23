document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://fxolvqfayvrxtkwjohtv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b2x2cWZheXZyeHRrd2pvaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTgxOTgsImV4cCI6MjA2MDI3NDE5OH0.lK4FzEiSfP9tLCTcOlVVeEjk_bPJp01lRie0hkn-JN8';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  
    const leadId = new URLSearchParams(window.location.search).get('id');
    const form = document.getElementById('editLeadForm');
    const errorElem = document.getElementById('error');
  
    if (!form || !leadId) {
      console.error("Form or Lead ID not found.");
      return;
    }
  
    // Fetch the lead data from Supabase when the page loads
    async function fetchLeadData() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
  
      if (error) {
        console.error('Error fetching lead:', error);
        alert('Error fetching lead data!');
        return;
      }
  
      // Populate the form with the data
      document.getElementById('customer-name').value = data.customer_name;
      document.getElementById('email').value = data.email;
      document.getElementById('mobile-number').value = data.mobile_number;
      document.getElementById('project-name').value = data.project_name;
      document.getElementById('budget').value = data.budget;
      document.getElementById('preferred-area').value = data.preferred_area;
      document.getElementById('team-leader').value = data.team_leader;
      document.getElementById('assigned-to').value = data.assigned_to;
      document.getElementById('last-contacted-date').value = data.last_contacted_date;
      document.getElementById('next-followup-date').value = data.next_followup_date;
      document.getElementById('comments').value = data.comments;
      document.getElementById('deal_status').value = data.deal_status;
      document.getElementById('interest-level').value = data.interest_level;
      document.getElementById('property-type').value = data.property_type;
      document.getElementById('site-visit-done').checked = data.site_visit_done;
    }
  
    // Handle form submission to save changes
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const updatedLead = {
        customer_name: form['customer_name'].value,
        email: form['email'].value,
        mobile_number: form['mobile_number'].value,
        project_name: form['project_name'].value,
        budget: form['budget'].value,
        preferred_area: form['preferred_area'].value,
        team_leader: form['team_leader'].value,
        assigned_to: form['assigned_to'].value,
        last_contacted_date: form['last_contacted_date'].value,
        next_followup_date: form['next_followup_date'].value,
        comments: form['comments'].value,
        deal_status: form['deal_status'].value,
        interest_level: form['interest_level'].value,
        property_type: form['property_type'].value,
        site_visit_done: form['site-visit-done'].checked,
      };
  
      const { error } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', leadId);
  
      if (error) {
        console.error('Error updating lead:', error);
        errorElem.textContent = 'Failed to save changes. Please try again.';
        return;
      }
  
      alert('Lead updated successfully!');
      window.location.href = 'leads.html'; // Redirect after saving
    });
  
    // Load the lead data when the page is ready
    fetchLeadData();
  });
  