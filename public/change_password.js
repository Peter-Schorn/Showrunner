const changePasswordForm = document.getElementById("change-password-form");

changePasswordForm.addEventListener("submit", validate);

function validate(event) {

    console.log("changePasswordForm: validate");

    // TODO: only call on error?
    event.preventDefault();
    
    const errorElement = document.getElementById("change-password-error-message");
    
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password.length < 4 || confirmPassword.length < 4) {
        errorElement.innerHTML = "Password must be at least 4 characters";
    }
    else if (password === confirmPassword) {
        changePasswordForm.submit();
    }
    else {
        errorElement.innerHTML = "Passwords do not match.";
    }

}