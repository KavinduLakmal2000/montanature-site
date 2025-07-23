window.addEventListener("DOMContentLoaded", () => {
  fetch("/api/heading")
    .then(res => res.json())
    .then(data => {
      if (data) {
        document.querySelector(".main-heading h1").innerHTML = data.mainHeading;
        document.querySelector(".description p").innerHTML = data.description;
        document.querySelector(".stats-card h2").innerHTML = data.statsNumber;
        document.querySelector(".stats-card p").innerHTML = data.statsLabel;
      }
    });
});


// Load data into modal fields when opening
document.getElementById("headingEditModal").addEventListener("show.bs.modal", () => {
  fetch("/api/heading")
    .then(res => res.json())
    .then(data => {
      document.getElementById("editMainHeading").value = data.mainHeading || "";
      document.getElementById("editDescription").value = data.description || "";
      document.getElementById("editStatsNumber").value = data.statsNumber || "";
      document.getElementById("editStatsLabel").value = data.statsLabel || "";
    });
});


// Handle form submission
document.getElementById("headingEditForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const updatedHeading = {
    mainHeading: document.getElementById("editMainHeading").value,
    description: document.getElementById("editDescription").value,
    statsNumber: document.getElementById("editStatsNumber").value,
    statsLabel: document.getElementById("editStatsLabel").value
  };

  fetch("/api/heading", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedHeading)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.querySelector(".main-heading h1").innerHTML = data.data.mainHeading;
        document.querySelector(".description p").innerHTML = data.data.description;
        document.querySelector(".stats-card h2").innerHTML = data.data.statsNumber;
        document.querySelector(".stats-card p").innerHTML = data.data.statsLabel;

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById("headingEditModal")).hide();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    });
});






