document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = '/admin_home.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'La connexion a échoué',
        text: data.message
      });
    }

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong. Please try again later. server error!'
    });
    console.error('Login error:', err);
  }
});


document.getElementById("randomBtn").addEventListener("click", async () => {
  try {

    const response = await fetch("/api/control");
    const data = await response.json();

    if (data.eggValue === "1" || data.eggValue === 1) {

      Swal.fire({
        icon: "question",
        title: "Shhh… this is where the squirrels hold meetings.",
        text: "Congrats! You've discovered MontaNature's hidden secret. This message only appears once... just like a rare bird sighting. 🌿 Have a beautiful, green day!",
        showConfirmButton: true
      });


      await fetch("/api/control", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eggValue: "0",
          siteValue: data.siteValue || ""
        })
      });
    }

  } catch (err) {
    console.error("Error checking eggValue:", err);
    Swal.fire("Error", "Failed to check test status", "error");
  }
});

document.getElementById("showPassword").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  passwordField.type = this.checked ? "text" : "password";
});