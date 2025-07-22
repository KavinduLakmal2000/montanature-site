document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("admin-cards-container") || document.getElementById("cards-container");
  const isAdmin = container.id === "admin-cards-container";

  fetch('/api/cards')
    .then(response => response.json())
    .then(cards => {
      cards.forEach(card => {
        const cardHTML = createCardHTML(card, isAdmin);
        container.insertAdjacentHTML('beforeend', cardHTML);
      });

      // Isotope init
      imagesLoaded(container, function () {
        const iso = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: 'masonry'
        });

        const filterButtons = document.querySelectorAll('.portfolio-filters li');
        filterButtons.forEach(button => {
          button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('filter-active'));
            button.classList.add('filter-active');

            const filterValue = button.getAttribute('data-filter');
            iso.arrange({ filter: filterValue });
          });
        });

        container.isotopeInstance = iso;
      });
    })
    .catch(error => {
      console.error('Error loading cards:', error);
    });
});

function createCardHTML(card, isAdmin = false) {
  return `
    <div class="col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item filter-${card.category}">
      <article class="portfolio-entry">
        <figure class="entry-image">
          <img src="${card.image}" class="img-fluid" alt="${card.title}">
          <div class="entry-overlay">
            <div class="overlay-content">
              <div class="entry-meta">${card.category}</div>
              <h3 class="entry-title">${card.title}</h3>
              <div class="entry-links">
                <a href="${card.lightbox}" class="glightbox" data-glightbox="title: ${card.title}; description: ${card.description};">
                  <i class="bi bi-arrows-angle-expand"></i>
                </a>
                <a href="#"><i class="bi bi-arrow-right"></i></a>
              </div>
              ${isAdmin ? `
              <div class="admin-controls mt-2 d-flex gap-2 justify-content-center">
                <button class="btn btn-sm btn-warning edit-btn" data-id="${card._id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${card._id}">Delete</button>
              </div>` : ''}
            </div>
          </div>
        </figure>
      </article>
    </div>
  `;
}



document.getElementById("addCardForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newCard = {
    title: document.getElementById("cardTitle").value,
    category: document.getElementById("cardCategory").value,
    image: document.getElementById("cardImage").value,
    description: document.getElementById("cardDescription").value,
    lightbox: document.getElementById("cardImage").value // same as image for now
  };

fetch("/api/cards", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newCard)
})
  .then(async (res) => {
    if (!res.ok) throw new Error("Server responded with " + res.status);
    return res.json();
  })
  .then((data) => {
    if (data.success) {
      alert("Card added!");
      document.getElementById("addCardForm").reset();
      const cardHTML = createCardHTML(data.card);
      document.getElementById("admin-cards-container").insertAdjacentHTML('afterbegin', cardHTML);
      bootstrap.Modal.getInstance(document.getElementById("addCardModal")).hide();
    } else {
      alert("Failed to add card.");
    }
  })
  .catch((err) => {
    console.error("Error adding card:", err);
    alert("Error occurred: " + err.message);
  });

});

if (document.getElementById("admin-cards-container")) {
  // Handle DELETE
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const cardId = e.target.getAttribute('data-id');
      if (confirm('Supprimer cette carte ?')) {
        fetch(`/api/cards/${cardId}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              e.target.closest('.portfolio-item').remove();
              alert("Carte supprimée !");
            } else {
              alert("Erreur lors de la suppression.");
            }
          })
          .catch(err => {
            console.error("Delete error:", err);
          });
      }
    }
  });

  // Handle EDIT (open modal)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const cardId = e.target.getAttribute('data-id');
      const cardEl = e.target.closest('.portfolio-item');

      document.getElementById("editCardId").value = cardId;
      document.getElementById("editCardTitle").value = cardEl.querySelector('.entry-title').textContent;
      document.getElementById("editCardCategory").value = cardEl.className.match(/filter-(\w+)/)[1];
      document.getElementById("editCardImage").value = cardEl.querySelector('img').getAttribute('src');
      document.getElementById("editCardDescription").value = cardEl.querySelector('.glightbox').getAttribute('data-glightbox').split('description: ')[1].replace(';', '');

      new bootstrap.Modal(document.getElementById("editCardModal")).show();
    }
  });

  // Handle submit updated form
  document.getElementById("editCardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("editCardId").value;

    const updatedCard = {
      title: document.getElementById("editCardTitle").value,
      category: document.getElementById("editCardCategory").value,
      image: document.getElementById("editCardImage").value,
      description: document.getElementById("editCardDescription").value,
      lightbox: document.getElementById("editCardImage").value
    };

    fetch(`/api/cards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCard)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Carte mise à jour !");
          location.reload();
        } else {
          alert("Erreur lors de la mise à jour.");
        }
      })
      .catch(err => {
        console.error("Update error:", err);
      });
  });
}
