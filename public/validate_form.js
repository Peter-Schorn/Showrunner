const submitButtons = document.querySelectorAll(".submit-validation") ?? [];

const emailRegex = /[a-zA-Z0-9._8+-]+@[a-zA-Z.-0-9]+\.[a-zA-Z]{2,}/;

submitButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {

        console.log("click .submit-validation");
        
        const username = Array.from(document.forms)
            .find((element) => { 
                return element.classList.contains("needs-validation");
            })
            ?.["username"]
            ?.value ?? "";
        
        let errorMessage = "";
        
        let stop = false;
        
        if (!button.checkValidity()) {
            stop = true;
        }
        else if (username.match(emailRegex)) {
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
        
        button.classList.add("was-validated");
        
    });
});
