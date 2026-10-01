import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js';
import { addDoc, collection, getFirestore, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCuM_38Pow_gc8oFj0MVY4EbqNyHUIy0Y4',
  authDomain: 'awevo-website.firebaseapp.com',
  projectId: 'awevo-website',
  storageBucket: 'awevo-website.firebasestorage.app',
  messagingSenderId: '28031451156',
  appId: '1:28031451156:web:20554d19c8e31a5f1a6701',
};

const db = getFirestore(initializeApp(firebaseConfig));
async function submitInquiry(form, note, submitButton, event) {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = '…';
  note.textContent = 'Sending your inquiry…';
  note.style.color = '';

  const data = new FormData(form);
  try {
    const inquiry = {
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim().toLowerCase(),
      message: String(data.get('message')).trim(),
      source: 'awevo-website',
      status: 'new',
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'inquiries'), inquiry);
    const notification = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inquiry.name, email: inquiry.email, message: inquiry.message }),
    });
    if (!notification.ok) throw new Error('Inquiry saved but notification failed');
    form.reset();
    note.textContent = 'Thanks — your inquiry is in. We’ll be in touch shortly.';
    note.style.color = '#111';
  } catch (error) {
    console.error('Inquiry submission failed', error);
    note.textContent = 'We couldn’t send that just now. Please email luis@awevosoftware.com.';
    note.style.color = '#111';
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = '↗';
  }
}

document.querySelectorAll('.lead-form').forEach((form) => {
  const note = form.querySelector('.form-note');
  const submitButton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', (event) => submitInquiry(form, note, submitButton, event));
});

const modal = document.querySelector('#inquiry-modal');
const modalForm = document.querySelector('#modal-lead-form');
const modalClose = () => {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
};

modal.querySelectorAll('[data-modal-close]').forEach((element) => element.addEventListener('click', modalClose));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) modalClose();
});

window.setTimeout(() => {
  if (sessionStorage.getItem('awevo-inquiry-modal-seen')) return;
  sessionStorage.setItem('awevo-inquiry-modal-seen', 'true');
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalForm.querySelector('input').focus();
}, 3000);
