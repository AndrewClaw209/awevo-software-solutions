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
const form = document.querySelector('#lead-form');
const note = document.querySelector('#form-note');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = '…';
  note.textContent = 'Sending your inquiry…';
  note.style.color = '';

  const data = new FormData(form);
  try {
    await addDoc(collection(db, 'inquiries'), {
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim().toLowerCase(),
      message: String(data.get('message')).trim(),
      source: 'awevo-website',
      status: 'new',
      createdAt: serverTimestamp(),
    });
    form.reset();
    note.textContent = 'Thanks — your inquiry is in. We’ll be in touch shortly.';
    note.style.color = '#111';
  } catch (error) {
    console.error('Inquiry submission failed', error);
    note.textContent = 'We couldn’t send that just now. Please email hello@awevo.ai.';
    note.style.color = '#111';
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = '↗';
  }
});
