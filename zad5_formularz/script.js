const themeStylesheet = document.getElementById("theme-stylesheet");
const themeToggle = document.getElementById("theme-toggle");

if (themeStylesheet && themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isRedTheme = themeStylesheet.getAttribute("href") === "red.css";

    themeStylesheet.setAttribute("href", isRedTheme ? "green.css" : "red.css");
    themeToggle.textContent = isRedTheme
      ? "Zmień motyw na czerwony"
      : "Zmień motyw na zielony";
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const successMessage = document.getElementById("form-success");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(fieldId, message) {
    const field = fields[fieldId];
    const errorEl = document.getElementById(`${fieldId}-error`);

    if (field) {
      field.classList.add("input-error");
      field.setAttribute("aria-invalid", "true");
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(fieldId) {
    const field = fields[fieldId];
    const errorEl = document.getElementById(`${fieldId}-error`);

    if (field) {
      field.classList.remove("input-error");
      field.removeAttribute("aria-invalid");
    }

    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function validateRequired(fieldId, label) {
    const value = fields[fieldId]?.value.trim() || "";

    if (!value) {
      setError(fieldId, `Pole \"${label}\" jest wymagane.`);
      return false;
    }

    clearError(fieldId);
    return true;
  }

  function validateNameField(fieldId, label) {
    const isFilled = validateRequired(fieldId, label);
    if (!isFilled) {
      return false;
    }

    const value = fields[fieldId].value.trim();
    if (/\d/.test(value)) {
      setError(fieldId, `${label} nie może zawierać cyfr.`);
      return false;
    }

    clearError(fieldId);
    return true;
  }

  function validateEmail() {
    const isFilled = validateRequired("email", "E-mail");
    if (!isFilled) {
      return false;
    }

    const emailValue = fields.email.value.trim();
    if (!emailRegex.test(emailValue)) {
      setError("email", "Podaj poprawny adres e-mail, np. nazwa@domena.pl.");
      return false;
    }

    clearError("email");
    return true;
  }

  function validateMessage() {
    return validateRequired("message", "Wiadomość");
  }

  function validateForm() {
    const isFirstNameValid = validateNameField("firstName", "Imię");
    const isLastNameValid = validateNameField("lastName", "Nazwisko");
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    return isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (successMessage) {
      successMessage.textContent = "";
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (successMessage) {
      successMessage.textContent =
        "Formularz został poprawnie zwalidowany. Brak wysyłki do backendu.";
    }

    contactForm.reset();
    Object.keys(fields).forEach((fieldId) => clearError(fieldId));
  });

  fields.firstName?.addEventListener("blur", () => {
    validateNameField("firstName", "Imię");
  });

  fields.lastName?.addEventListener("blur", () => {
    validateNameField("lastName", "Nazwisko");
  });

  fields.email?.addEventListener("blur", () => {
    validateEmail();
  });

  fields.message?.addEventListener("blur", () => {
    validateMessage();
  });
}
