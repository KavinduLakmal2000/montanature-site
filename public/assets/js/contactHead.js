document.addEventListener("DOMContentLoaded", async () => {

// Load and display data on page
  fetch("/api/contact-heading-data")
    .then(res => res.json())
    .then(data => {
      document.getElementById("main-heading-display").innerHTML = data.heading;
      document.getElementById("main-description-display").innerHTML = data.description;
    });

  // Open modal and populate fields
  document.getElementById("editHeadingBtn").addEventListener("click", () => {
    fetch("/api/contact-heading-data")
      .then(res => res.json())
      .then(data => {
        document.getElementById("editMainHeading").value = data.heading;
        document.getElementById("editDescription").value = data.description;
        document.getElementById("headingEditModal").setAttribute("data-id", data._id);
        $("#headingEditModal").modal("show");
      });
  });

  // Handle form submit with SweetAlert
  document.getElementById("headingEditForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const heading = document.getElementById("editMainHeading").value;
    const description = document.getElementById("editDescription").value;
    const id = document.getElementById("headingEditModal").getAttribute("data-id");

    try {
      const res = await fetch("/api/contact-heading-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, heading, description })
      });

      // Try parsing JSON even if status isn't 200
      const result = await res.json();

      if (res.status === 200 || res.status === 201) {
        document.getElementById("main-heading-display").innerHTML = result.heading;
        document.getElementById("main-description-display").innerHTML = result.description;
        $("#headingEditModal").modal("hide");

        Swal.fire({
          icon: "success",
          title: "Mise à jour réussie",
          text: "Le texte principal a été modifié avec succès.",
          confirmButtonColor: "#28a745"
        });
      } else {
        // If server responded but with a non-OK status
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: result?.error || "Une erreur inattendue est survenue.",
          confirmButtonColor: "#dc3545"
        });
      }
    } catch (err) {
      // If fetch fails completely (network error, etc.)
      console.error("Fetch failed:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur réseau",
        text: "La mise à jour a échoué. Veuillez réessayer.",
        confirmButtonColor: "#dc3545"
      });
    }
  });





});