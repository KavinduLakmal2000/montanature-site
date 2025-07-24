document.addEventListener("DOMContentLoaded", () => {
  const headingEl = document.getElementById("label-main-heading");
  const descriptionEl = document.getElementById("label-description");

  // Fetch and load existing data
  fetch("/api/label-heading")
    .then(res => res.json())
    .then(data => {
      if (data) {
        headingEl.innerHTML = data.mainHeading;
        descriptionEl.innerHTML = data.description;
      }
    })
    .catch(err => console.error("Error loading label heading:", err));

  // Pre-fill modal on open
  const headingModal = document.getElementById("headingEditModal");
  headingModal.addEventListener("show.bs.modal", () => {
    document.getElementById("editMainHeading").value = headingEl.innerHTML.trim();
    document.getElementById("editDescription").value = descriptionEl.innerHTML.trim();
  });

  // Handle form submit
  document.getElementById("headingEditModal").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mainHeading = document.getElementById("editMainHeading").value;
    const description = document.getElementById("editDescription").value;

    try {
      const res = await fetch("/api/label-heading", {
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

        Swal.fire({
          icon: 'success',
          title: 'Mise à jour réussie',
          text: 'Les données ont été mises à jour avec succès.',
          confirmButtonColor: '#3085d6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Échec',
          text: 'Échec de la mise à jour.',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error("Erreur serveur :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Une erreur est survenue côté serveur.',
        confirmButtonColor: '#d33'
      });
    }
  });

});
