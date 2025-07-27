async function loadMessages() {
    const res = await fetch('/api/contact-messages'); // Your backend route
    const messages = await res.json();
    const tbody = document.getElementById('messageTableBody');
    tbody.innerHTML = '';

    messages.forEach(msg => {
        const row = `
        <tr>
          <td>${msg.name}</td>
          <td>${msg.email}</td> 
          <td>${msg.subject}</td>
          <td>${msg.message}</td>
          <td>${new Date(msg.createdAt).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger rounded-pill" onclick="deleteMessage('${msg._id}')">
              <i class="bi bi-trash"></i> Supprimer
            </button>
          </td>
        </tr>
      `;
        tbody.innerHTML += row;
    });
}

async function deleteMessage(id) {
    const confirmation = await Swal.fire({
        title: 'Confirmer la suppression',
        text: "Ce message sera supprimé définitivement.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Oui, supprimer'
    });

    if (confirmation.isConfirmed) {
        const res = await fetch(`/api/contact-messages/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            Swal.fire('Supprimé !', 'Le message a été supprimé.', 'success');
            loadMessages();
        } else {
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
        }
    }
}

// Load messages on page load
document.addEventListener('DOMContentLoaded', loadMessages);

