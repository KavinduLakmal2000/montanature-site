window.addEventListener("DOMContentLoaded", () => {
    fetch('/api/admin-access')
        .then(response => response.json())
        .then(data => {
            if (!data.value) {
                window.location.href = '/notfound.html';
                //alert("test");
            }
        })
        .catch(err => {
            console.error("Error checking admin access:", err);
            window.location.href = '/notfound.html';
        });

});


let inactivityTime = function () {
    let timeout;

    function logout() {
        window.location.href = '/logout_login';
    }

    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(logout, 30 * 60 * 1000); // 5 minutes
    }

    // Events to reset the timer
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    document.onclick = resetTimer;
    document.onscroll = resetTimer;
};

inactivityTime();