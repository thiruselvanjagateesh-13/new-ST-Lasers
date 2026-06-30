// firebase.js - initializes Firebase (Firestore) and provides simple helpers
// NOTE: This file expects the Firebase compat SDKs to already be loaded in the page.

const firebaseConfig = {
  apiKey: "AIzaSyAK64eSKDRPLes3ekAXSjotZW_8wHHq1XI",
  authDomain: "proj-adf8a.firebaseapp.com",
  projectId: "proj-adf8a",
  storageBucket: "proj-adf8a.firebasestorage.app",
  messagingSenderId: "73183599221",
  appId: "1:73183599221:web:2b8d67a4626a6b9e2b763c",
  measurementId: "G-Y4R46EE8H7"
};

// Initialize Firebase app and Firestore (compat layer)
if (!window.firebase || !window.firebase.initializeApp) {
  console.error('Firebase compat SDK not loaded. Please include firebase-app-compat.js and firebase-firestore-compat.js before this file.');
} else {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  window._firebase = {
    db,

    // Add a new invoice document to 'invoices' collection. Returns the new doc id.
    addInvoice: async function(bill) {
      const docRef = await db.collection('invoices').add({
        inv_no: bill.invNo,
        customer_name: bill.customer,
        bill_date: bill.date,
        grand_total: parseFloat(bill.grandTotal) || 0,
        all_data: bill,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    },

    // Get invoices ordered by created_at desc. Returns array of {id, ...data}
    getInvoices: async function() {
      const snapshot = await db.collection('invoices').orderBy('created_at', 'desc').get();
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    // Get invoice by document id. Returns {id, ...data} or null
    getInvoiceById: async function(id) {
      const d = await db.collection('invoices').doc(id).get();
      if (!d.exists) return null;
      return { id: d.id, ...d.data() };
    },

    // Delete invoice document by id
    deleteInvoice: async function(id) {
      await db.collection('invoices').doc(id).delete();
    }
  };
}
