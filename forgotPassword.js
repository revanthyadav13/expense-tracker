document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const forgotEmailInput = document.getElementById("forgot-email");
    const forgotPasswordSubmit = document.getElementById("forgot-password-submit");

    forgotPasswordForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const email = forgotEmailInput.value;

        try {
            const response = await axios.post("http://localhost:3000/password/forgotpassword", { email });

            if (response.status === 200) {
                alert("Password reset email sent. Please check your inbox.");
            }
        } catch (error) {
            console.error("Error sending password reset request:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
