document.addEventListener("DOMContentLoaded", () => {
  const headingEl = document.getElementById("activity-main-heading");
  const descriptionEl = document.getElementById("activity-description");

  // Fetch and load existing data
  fetch("/api/activity-heading")
    .then(res => res.json())
    .then(data => {
      if (data) {
        headingEl.innerHTML = data.mainHeading;
        descriptionEl.innerHTML = data.description;
      }
    })
    .catch(err => console.error("Error loading activity heading:", err));

  // Pre-fill modal on open
  const headingModal = document.getElementById("headingEditModal");
  headingModal.addEventListener("show.bs.modal", () => {
    document.getElementById("editMainHeading").value = headingEl.textContent.trim();
    document.getElementById("editDescription").value = descriptionEl.textContent.trim();
  });

  // Handle form submit
  document.getElementById("headingEditForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const mainHeading = document.getElementById("editMainHeading").value;
    const description = document.getElementById("editDescription").value;

    const res = await fetch("/api/activity-heading", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mainHeading, description })
    });

    const result = await res.json();
    if (result.success) {
      headingEl.innerHTML = result.data.mainHeading;
      descriptionEl.innerHTML = result.data.description;

      const modalInstance = bootstrap.Modal.getInstance(headingModal);
      modalInstance.hide();
    } else {
      alert("Échec de la mise à jour.");
    }
  });
});

