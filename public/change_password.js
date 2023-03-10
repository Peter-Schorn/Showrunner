const changePasswordForm = document.getElementById("change-password-form");

changePasswordForm.addEventListener("submit", validate);

function validate(event) {

    console.log("changePasswordForm: validate");

    // TODO: only call on error?
    event.preventDefault();
    
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password === confirmPassword) {
        changePasswordForm.submit();
    }
    else {
        const errorElement = document.getElementById("change-password-error-message");
        errorElement.innerHTML = "Passwords do not match.";
    }

}