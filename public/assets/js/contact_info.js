
document.addEventListener("DOMContentLoaded", async () => {
  const editBtn = document.getElementById("edit-contact-btn");
  const form = document.getElementById("edit-contact-form");

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
    document.getElementById("contact-receive-email").value = contact.receiveEmail || "";
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
        receiveEmail: document.getElementById("contact-receive-email").value,
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
          alert("Contact info updated successfully.");
          location.reload();
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update contact info.");
      }
    });
  }
});

//--------------------------------------------------------- send form data to back end -----------------------------------------------

document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    loading.style.display = "block";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";

    try {
        const res = await fetch("/api/send-contact-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await res.json();

        loading.style.display = "none";

        if (res.ok) {
            sentMessage.style.display = "block";
            form.reset();
        } else {
            errorMessage.style.display = "block";
            errorMessage.textContent = data.error || "An error occurred.";
        }
    } catch (err) {
        loading.style.display = "none";
        errorMessage.style.display = "block";
        errorMessage.textContent = "Network error. Please try again.";
    }
});



