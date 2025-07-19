  document.getElementById('editFooterBtn').addEventListener('click', async function () {
            const footerModal = new bootstrap.Modal(document.getElementById('footerEditModal'));

            // Load existing footer data into the form before showing
            try {
                const res = await fetch('/api/get-footer');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        document.getElementById('address').value = data.address || '';
                        document.getElementById('telephone').value = data.telephone || '';
                        document.getElementById('email').value = data.email || '';
                        document.getElementById('facebook').value = data.facebook || '';
                        document.getElementById('instagram').value = data.instagram || '';
                        document.getElementById('linkedin').value = data.linkedin || '';
                        document.getElementById('twitter').value = data.twitter || '';
                    }
                }
            } catch (error) {
                console.error('Error loading footer data:', error);
            }

            footerModal.show();
        });

        document.getElementById('footerEditForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                address: document.getElementById('address').value,
                telephone: document.getElementById('telephone').value,
                email: document.getElementById('email').value,
                facebook: document.getElementById('facebook').value,
                instagram: document.getElementById('instagram').value,
                linkedin: document.getElementById('linkedin').value,
                twitter: document.getElementById('twitter').value
            };

            try {
                const res = await fetch('/api/save-footer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    alert('✅ Données enregistrées avec succès !');
                    location.reload(); // Reload to reflect changes in UI
                } else {
                    alert('❌ Erreur lors de l\'enregistrement.');
                }
            } catch (err) {
                alert('❌ Erreur serveur.');
                console.error('Server error:', err);
            }
        });

        // -------------------------------------------------------------------- show data ------------------------------------------------------------

        async function loadFooterData() {
            try {
                const res = await fetch('/api/get-footer');
                if (!res.ok) throw new Error('Failed to fetch footer data');

                const data = await res.json();

                document.getElementById('footer-address').textContent = data.address || '';
                document.getElementById('footer-telephone').textContent = data.telephone || '';
                document.getElementById('footer-email').textContent = data.email || '';

                if (data.facebook) document.getElementById('footer-facebook').href = data.facebook;
                if (data.instagram) document.getElementById('footer-instagram').href = data.instagram;
                if (data.linkedin) document.getElementById('footer-linkedin').href = data.linkedin;
                if (data.twitter) document.getElementById('footer-twitter').href = data.twitter;

            } catch (err) {
                console.error('Footer load error:', err);
            }
        }

        // Call it when page loads
        loadFooterData();