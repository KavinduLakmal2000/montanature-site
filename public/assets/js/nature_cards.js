document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("admin-nature-cards-container") || document.getElementById("nature-cards-container");
    const isAdmin = container.id === "admin-nature-cards-container";

    fetch('/api/nature-cards')
        .then(res => res.json())
        .then(cards => {
            cards.forEach(card => {
                const html = createNatureCardHTML(card, isAdmin);
                container.insertAdjacentHTML('beforeend', html);
            });
        })
        .catch(err => console.error("Error loading nature cards:", err));
});
function createNatureCardHTML(card, isAdmin = false) {
    return `
    <div class="col-lg-6" data-aos="fade-up" data-id="${card._id}">
      <div class="team-member d-flex align-items-start lift-on-hover position-relative p-3 rounded">
        <div class="member-icon me-4">
          <i class="bi ${card.icon} fs-1 text-success"></i>
        </div>
        <div class="member-info flex-grow-1 position-relative">
          <h4>${card.title}</h4>
          <span>${card.subheading}</span>
          <p>${card.description}</p>
          <a href="${card.link || '#'}" class="card-action d-flex align-items-center justify-content-center rounded-circle position-absolute end-0 bottom-0 me-2 mb-2">
            <i class="bi bi-arrow-up-right"></i>
          </a>

          ${isAdmin ? `
          <!-- Admin Buttons -->
          <div class="position-absolute top-0 end-0 m-2 d-flex gap-1">
            <button class="btn btn-outline-warning rounded-pill btn-sm edit-card-btn" data-id="${card._id}">Modifier</button>
            <button class="btn btn-outline-danger rounded-pill btn-sm delete-card-btn" data-id="${card._id}">Supprimer</button>
          </div>` : ``}
        </div>
      </div>
    </div>
  `;
}



document.getElementById("addNatureCardForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const newCard = {
        title: document.getElementById("natureCardTitle").value,
        icon: document.getElementById("natureCardIcon").value,
        subheading: document.getElementById("natureCardSubheading").value,
        description: document.getElementById("natureCardDescription").value,
        link: document.getElementById("natureCardLink").value || "#"
    };

    fetch("/api/nature-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire("Succès", "Carte ajoutée !", "success").then(() => location.reload());
                document.getElementById("addNatureCardForm").reset();
                bootstrap.Modal.getInstance(document.getElementById("addNatureCardModal")).hide();
            } else {
                Swal.fire("Erreur", "Échec de l'ajout de la carte.", "error");
            }
        })
        .catch(err => {
            console.error("Add nature card error:", err);
            Swal.fire("Erreur", "Erreur lors de l'ajout : " + err.message, "error");
        });
});


document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-card-btn")) {
        const cardId = e.target.dataset.id;

        // Get card details
        fetch(`/api/nature-cards`)
            .then(res => res.json())
            .then(cards => {
                const card = cards.find(c => c._id === cardId);
                if (!card) return;

                document.getElementById("editCardId").value = card._id;
                document.getElementById("editNatureCardTitle").value = card.title;
                document.getElementById("editNatureCardIcon").value = card.icon;
                document.getElementById("editNatureCardSubheading").value = card.subheading;
                document.getElementById("editNatureCardDescription").value = card.description;
                document.getElementById("editNatureCardLink").value = card.link;

                const modal = new bootstrap.Modal(document.getElementById("editNatureCardModal"));
                modal.show();
            });
    }
});

// ----------------------------------------------------------------------- edit card ---------------------------------------------------

document.getElementById("editNatureCardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const cardId = document.getElementById("editCardId").value;

    const updatedCard = {
        title: document.getElementById("editNatureCardTitle").value,
        icon: document.getElementById("editNatureCardIcon").value,
        subheading: document.getElementById("editNatureCardSubheading").value,
        description: document.getElementById("editNatureCardDescription").value,
        link: document.getElementById("editNatureCardLink").value || "#"
    };

    fetch(`/api/nature-cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCard)
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                Swal.fire("Succès", "Carte mise à jour !", "success").then(() => location.reload());
            } else {
                Swal.fire("Erreur", "Échec de la mise à jour.", "error");
            }
        })
        .catch(err => {
            console.error("Update card error:", err);
            Swal.fire("Erreur", "Erreur lors de la mise à jour : " + err.message, "error");
        });
});

//---------------------------------------------------- card delete --------------------------------------------------------------

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-card-btn")) {
        const cardId = e.target.dataset.id;

        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/nature-cards/${cardId}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire("Supprimé !", "La carte a été supprimée.", "success").then(() => location.reload());
                        } else {
                            Swal.fire("Erreur", "Suppression échouée.", "error");
                        }
                    })
                    .catch(err => {
                        console.error("Delete card error:", err);
                        Swal.fire("Erreur", "Erreur lors de la suppression : " + err.message, "error");
                    });
            }
        });
    }
});