document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addLabelCardForm");
    const wrapper = document.getElementById("adminLabelCardContainer") || document.querySelector(".steps-wrapper");
    const isAdmin = wrapper.id === "adminLabelCardContainer";

    // ---------------------- FETCH EXISTING CARDS ON LOAD ----------------------
    fetch("/api/labels")
        .then(res => res.json())
        .then(cards => {
            if (Array.isArray(cards)) {
                cards.forEach(card => addLabelCardToDOM(card, isAdmin));
            } else {
                console.warn("Unexpected data format:", cards);
            }
        })
        .catch(err => {
            console.error("Erreur lors du chargement des cartes :", err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur de chargement',
                text: 'Impossible de charger les cartes.'
            });
        });

    // ---------------------- ADD NEW CARD ----------------------
    if (isAdmin && form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const stepNumber = document.getElementById("labelStepNumber").value.trim();
            const icon = document.getElementById("labelIcon").value.trim();
            const heading = document.getElementById("labelHeading").value.trim();
            const description = document.getElementById("labelDescription").value.trim();
            const link = document.getElementById("labelLink").value.trim();

            const cardData = { stepNumber, icon, heading, description, link };

            try {
                const res = await fetch("/api/labels", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cardData)
                });

                const savedCard = await res.json();

                if (res.ok) {
                    addLabelCardToDOM(savedCard, isAdmin);
                    form.reset();
                    bootstrap.Modal.getInstance(document.getElementById("addLabelCardModal")).hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Carte ajoutée',
                        text: 'La nouvelle carte a été ajoutée avec succès.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: "Erreur lors de l’ajout : " + savedCard.message
                    });
                }

            } catch (err) {
                console.error("Erreur réseau :", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur réseau',
                    text: 'Une erreur réseau est survenue.'
                });
            }
        });
    }

    // ---------------------- DOM CREATE FUNCTION ----------------------
    function addLabelCardToDOM(card, isAdmin = false) {
        const cardHTML = `
        <div class="step-item position-relative" data-id="${card._id}" data-aos="fade-right" data-aos-delay="200">
            <div class="step-content">
                <div class="step-icon">
                    <i class="bi ${card.icon}"></i>
                </div>
                <div class="step-info">
                    <span class="step-number">${card.stepNumber}</span>
                    <h3>${card.heading}</h3>
                    <p>${card.description}</p>
                    <a href="${card.link}" class="btn btn-outline-primary mt-2" target="_blank">En savoir plus</a>
                </div>
            </div>
            ${isAdmin ? `
            <div class="position-absolute top-0 end-0 mt-2 me-2 d-flex gap-2">
                <button class="btn btn-outline-warning btn-sm rounded-pill edit-label-btn" data-id="${card._id}">Modifier</button>
                <button class="btn btn-outline-danger btn-sm rounded-pill delete-label-btn" data-id="${card._id}">Supprimer</button>
            </div>` : ''}
        </div>
        `;
        wrapper.insertAdjacentHTML("beforeend", cardHTML);
    }

    // ---------------------- EDIT CARD ----------------------
    wrapper.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-label-btn")) {
            const cardEl = e.target.closest(".step-item");
            const id = e.target.dataset.id;
            const heading = cardEl.querySelector("h3").textContent;
            const description = cardEl.querySelector("p").textContent;
            const icon = cardEl.querySelector("i").classList[1]; // assumes: bi bi-heart
            const stepNumber = cardEl.querySelector(".step-number").textContent;
            const link = cardEl.querySelector("a").href;

            document.getElementById("label-card-id").value = id;
            document.getElementById("edit-label-step-number").value = stepNumber;
            document.getElementById("edit-label-heading").value = heading;
            document.getElementById("edit-label-description").value = description;
            document.getElementById("edit-label-icon").value = icon;
            document.getElementById("edit-label-link").value = link;

            new bootstrap.Modal(document.getElementById("editLabelCardModal")).show();
        }
    });

    document.getElementById("editLabelCardForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("label-card-id").value;
        const updatedData = {
            stepNumber: document.getElementById("edit-label-step-number").value,
            heading: document.getElementById("edit-label-heading").value,
            description: document.getElementById("edit-label-description").value,
            icon: document.getElementById("edit-label-icon").value,
            link: document.getElementById("edit-label-link").value
        };

        fetch(`/api/labels/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Mise à jour réussie',
                        text: 'La carte a été mise à jour.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => location.reload());
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: 'Échec de la mise à jour'
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur réseau',
                    text: 'Une erreur réseau est survenue.'
                });
            });
    });

    // ---------------------- DELETE CARD ----------------------
    wrapper.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-label-btn")) {
            const cardEl = e.target.closest(".step-item");
            const id = e.target.dataset.id;

            const result = await Swal.fire({
                title: 'Êtes-vous sûr ?',
                text: "Cette action est irréversible !",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Oui, supprimer !',
                cancelButtonText: 'Annuler'
            });

            if (result.isConfirmed) {
                try {
                    const res = await fetch(`/api/labels/${id}`, {
                        method: "DELETE",
                    });

                    const data = await res.json();

                    if (res.ok && data.success) {
                        cardEl.remove();
                        Swal.fire({
                            icon: 'success',
                            title: 'Supprimé !',
                            text: 'La carte a été supprimée.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: "Échec de la suppression : " + (data.message || "inconnue"),
                        });
                    }
                } catch (err) {
                    console.error("Erreur réseau :", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur réseau',
                        text: 'Erreur réseau lors de la suppression',
                    });
                }
            }
        }
    });

});
