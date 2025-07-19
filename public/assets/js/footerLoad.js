
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