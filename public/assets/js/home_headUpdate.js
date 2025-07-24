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
        // Update content on page
        document.querySelector(".main-heading h1").innerHTML = data.data.mainHeading;
        document.querySelector(".description p").innerHTML = data.data.description;
        document.querySelector(".stats-card h2").innerHTML = data.data.statsNumber;
        document.querySelector(".stats-card p").innerHTML = data.data.statsLabel;

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById("headingEditModal")).hide();

        // Show SweetAlert success
        Swal.fire({
          icon: 'success',
          title: 'Mise à jour réussie',
          text: 'Les données ont été mises à jour avec succès.',
          confirmButtonColor: '#3085d6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la mise à jour.',
          confirmButtonColor: '#d33'
        });
      }
    })
    .catch(err => {
      console.error('Erreur serveur :', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Une erreur est survenue côté serveur.',
        confirmButtonColor: '#d33'
      });
    });
});







