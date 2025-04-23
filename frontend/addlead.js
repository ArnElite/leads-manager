document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = 'https://fxolvqfayvrxtkwjohtv.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4b2x2cWZheXZyeHRrd2pvaHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTgxOTgsImV4cCI6MjA2MDI3NDE5OH0.lK4FzEiSfP9tLCTcOlVVeEjk_bPJp01lRie0hkn-JN8';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  
    const form = document.getElementById('addLeadForm');
    const statusMessage = document.getElementById('statusMessage');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const leadData = {
        customer_name: formData.get('customer_name'),
        email: formData.get('email'),
        mobile_number: formData.get('mobile_number'),
        project_name: formData.get('project_name'),
        budget: formData.get('budget'),
        preferred_area: formData.get('preferred_area'),
        team_leader: formData.get('team_leader'),
        assigned_to: formData.get('assigned_to'),
        last_contacted_date: formData.get('last_contacted_date'),
        next_followup_date: formData.get('next_followup_date'),
        comments: formData.get('comments'),
        deal_status: formData.get('deal_status'),
        interest_level: formData.get('interest_level'),
        property_type: formData.get('property_type'),
        site_visit_done: formData.get('site_visit_done') === 'on'
      };
  
      // Optional validation
      const allowedStatuses = ['Not Contacted', 'Follow-up', 'Site Visit', 'Closed', 'Dropped'];
      if (!allowedStatuses.includes(leadData.deal_status)) {
        statusMessage.textContent = '❌ Invalid deal status selected.';
        return;
      }
  
      const { error } = await supabase.from('leads').insert([leadData]);
  
      if (error) {
        console.error('Insert Error:', error);
        statusMessage.textContent = `❌ Failed to add lead: ${error.message}`;
      } else {
        statusMessage.textContent = '✅ Lead added successfully!';
        form.reset();
      }
    });
  });
  