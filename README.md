# AWEVO Software Solutions website

Static, responsive landing page for AWEVO Software Solutions.

## Lead form setup

The form writes validated inquiries to the `inquiries` collection in Firebase project `awevo-website`. Firestore rules allow public creates with bounded fields but deny reads, updates, and deletes. Connect Firebase Trigger Email (or a server-side mail provider) to the collection to notify `luis@awevosoftware.com`.

## Local preview

Run any static server from this directory, for example:

```bash
npx serve .
```
