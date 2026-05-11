const firebaseConfig = {
  apiKey: "AIzaSyDqljHTKIgh2qeaiNNdLXXyxExFSoK0HEQ",

  authDomain: "backend-75659.firebaseapp.com",

  projectId: "backend-75659",

  storageBucket: "backend-75659.firebasestorage.app",

  messagingSenderId: "262913201232",

  appId: "1:262913201232:web:b74b18d5a2b40fe608ad55",

  measurementId: "G-N3X88NZT00",
};

const form = document.getElementById("feedback-form");
const nameInput = document.getElementById("name");
const messageInput = document.getElementById("message");
const statusEl = document.getElementById("status");
const listEl = document.getElementById("feedback-list");

const collectionName = "feedback";
const baseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}`;
const keyParam = `?key=${firebaseConfig.apiKey}`;

function renderFeedback(items) {
  listEl.innerHTML = "";
  items.forEach((data) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `<strong>${data.name}</strong><div>${data.message}</div>`;
    listEl.appendChild(item);
  });
}

async function loadFeedback() {
  try {
    const response = await fetch(`${baseUrl}${keyParam}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const docs = (data.documents || []).map((doc) => {
      const fields = doc.fields || {};
      return {
        name: fields.name?.stringValue || "",
        message: fields.message?.stringValue || "",
        createdAt: fields.createdAt?.stringValue || "",
      };
    });
    docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    renderFeedback(docs);
  } catch (error) {
    console.error(error);
  }
}

loadFeedback();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Saving...";

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    statusEl.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const createdAt = new Date().toISOString();
    const response = await fetch(`${baseUrl}${keyParam}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: name },
          message: { stringValue: message },
          createdAt: { stringValue: createdAt },
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    statusEl.textContent = "Saved successfully!";
    form.reset();
    await loadFeedback();
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Save failed. Please try again.";
  }
});
