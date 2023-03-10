const forms = document.querySelectorAll(".needs-validation") ?? [];

const emailRegex = /[a-zA-Z0-9._8+-]+@[a-zA-Z.-0-9]+\.[a-zA-Z]{2,}/;

function validate(event) {

    console.log("form submit .needs-validation");
    
    const username = document.getElementById("username")?.value ?? "";
    const password = document.getElementById("password")?.value ?? "";
    
    let errorMessage = "";
    
    let stop = false;
    
    if (username.match(emailRegex)) {
        stop = true;
        errorMessage = "username cannot be email";
        console.log(errorMessage);
    }
    
    const errorMessageElement = document.querySelector(
        "#username-error-message"
    );
    if (errorMessageElement) {
        errorMessageElement.textContent = errorMessage;
    }
    
    if (stop === true) {
        console.log("stop");
        event.preventDefault();
        event.stopPropagation();
    }
    
}

forms.forEach(function(form) {
    
    form.addEventListener("submit", validate);
    form.querySelector(`button[type="submit]"`)?.addEventListener("click", validate);
    
});

document.getElementById("username")?.addEventListener("input", validate);
document.getElementById("password")?.addEventListener("input", validate);