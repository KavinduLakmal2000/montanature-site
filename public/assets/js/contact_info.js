document.addEventListener("DOMContentLoaded", async () => {
  const editBtn = document.getElementById("edit-contact-btn");
  const form = document.getElementById("edit-contact-form");
  const formMessage = document.getElementById("messageForm");

  // Elements to display contact info on site
  const addressEl = document.getElementById("display-address");
  const emailListEl = document.getElementById("display-emails");
  const hoursWeekdaysEl = document.getElementById("display-hours-weekdays");
  const hoursSaturdayEl = document.getElementById("display-hours-saturday");
  const mapIframe = document.getElementById("google-map-iframe");

  let contactData = null;

  // -------------------- 1. Fetch & Display on Site -------------------- 
  try {
    const res = await fetch("/api/contact-info");
    contactData = await res.json();

    if (addressEl) addressEl.textContent = contactData.address || "N/A";

    if (emailListEl) {
      emailListEl.innerHTML = "";
      (contactData.emails || []).forEach(email => {
        const p = document.createElement("p");
        p.textContent = email;
        emailListEl.appendChild(p);
      });
    }

    if (hoursWeekdaysEl) hoursWeekdaysEl.textContent = contactData.hours?.weekdays || "N/A";
    if (hoursSaturdayEl) hoursSaturdayEl.textContent = contactData.hours?.saturday || "N/A";

    if (mapIframe && contactData.locationLink) {
      mapIframe.src = contactData.locationLink;
    }

  } catch (err) {
    console.error("Error loading contact data:", err);
  }

  // -------------------- 2. Prefill Modal for Admin Edit --------------------
  editBtn?.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/contact-info");
      const contact = await res.json();

      document.getElementById("contact-id").value = contact._id || "";
      document.getElementById("contact-address").value = contact.address || "";
      document.getElementById("contact-emails").value = (contact.emails || []).join(", ");
      document.getElementById("contact-weekdays").value = contact.hours?.weekdays || "";
      document.getElementById("contact-saturday").value = contact.hours?.saturday || "";
      document.getElementById("contact-location-link").value = contact.locationLink || "";

      // Show modal programmatically
      const modal = new bootstrap.Modal(document.getElementById("editContactModal"));
      modal.show();
    } catch (err) {
      console.error("Failed to load contact:", err);
    }
  });

  // -------------------- 3. Submit Modal Form --------------------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedData = {
        address: document.getElementById("contact-address").value,
        emails: document.getElementById("contact-emails").value.split(",").map(e => e.trim()),
        hours: {
          weekdays: document.getElementById("contact-weekdays").value,
          saturday: document.getElementById("contact-saturday").value
        },
        locationLink: document.getElementById("contact-location-link").value
      };


      try {
        const res = await fetch("/api/contact-info", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });

        const result = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Mise à jour réussie',
            text: 'Les informations de contact ont été mises à jour.',
            timer: 1800,
            showConfirmButton: false
          }).then(() => {
            location.reload(); // ✅ Reload after the alert
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: result.error || 'Une erreur est survenue lors de la mise à jour.'
          });
        }

      } catch (err) {
        console.error("Update failed:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur réseau',
          text: 'Impossible de mettre à jour les données.'
        });
      }
    });
  }

  /// -------------------------------------------------------------- send message --------------------------------------------------

  formMessage.addEventListener("submit", async (e) => {
    e.preventDefault(); // ✅ Prevents page refresh

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const formData = { name, email, subject, message };

    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        formMessage.reset();
        Swal.fire({
          icon: 'success',
          title: 'Message envoyé',
          text: 'Votre message a bien été envoyé.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: result.error || 'Une erreur est survenue.'
        });
      }

    } catch (err) {
      console.error("Network error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur réseau',
        text: 'Impossible d’envoyer le message.'
      });
    }
  });



});

