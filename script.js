const form = document.querySelector('#lead-form');
const note = document.querySelector('#form-note');

form.addEventListener('submit', async (event) => {
  if (form.action.includes('formsubmit.co')) return;
  if (form.action.includes('REPLACE_WITH_FORM_ID')) {
    event.preventDefault();
    note.textContent = 'Form is ready — connect a Formspree endpoint to receive submissions.';
    note.style.color = '#164dff';
    return;
  }
  event.preventDefault();
  const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
  if (response.ok) {
    form.reset();
    note.textContent = 'Thanks — we’ll be in touch shortly.';
    note.style.color = '#164dff';
  } else {
    note.textContent = 'Something went wrong. Please email hello@awevo.ai.';
  }
});
