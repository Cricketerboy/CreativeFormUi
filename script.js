var MultiStepForm = /** @class */ (function () {
    function MultiStepForm() {
        this.currentStep = 1;
        this.formData = {
            name: "",
            dob: "",
            gender: "",
            email: "",
            phone: "",
            address: ""
        };
        this.formElement = document.getElementById("multiStepForm");
        this.summaryElement = document.getElementById("summary");
        this.steps = document.querySelectorAll(".form-step");
        this.progressSteps = document.querySelectorAll(".progress-indicator .step");
        this.addEventListeners();
        this.loadFromLocalStorage();
        this.updateForm();
    }
    MultiStepForm.prototype.addEventListeners = function () {
        var _this = this;
        var nextBtn1 = document.getElementById("nextBtn1");
        nextBtn1 === null || nextBtn1 === void 0 ? void 0 : nextBtn1.addEventListener("click", function () {
            if (_this.validateStep1()) {
                _this.saveStep1();
                _this.goToStep(2);
            }
        });
        var prevBtn2 = document.getElementById("prevBtn2");
        prevBtn2 === null || prevBtn2 === void 0 ? void 0 : prevBtn2.addEventListener("click", function () { return _this.goToStep(1); });
        var nextBtn2 = document.getElementById("nextBtn2");
        nextBtn2 === null || nextBtn2 === void 0 ? void 0 : nextBtn2.addEventListener("click", function () {
            if (_this.validateStep2()) {
                _this.saveStep2();
                _this.showSummary();
                _this.goToStep(3);
            }
        });
        var prevBtn3 = document.getElementById("prevBtn3");
        prevBtn3 === null || prevBtn3 === void 0 ? void 0 : prevBtn3.addEventListener("click", function () { return _this.goToStep(2); });
        // Handle Edit Button in Step 3
        var editBtn = document.getElementById("editBtn");
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener("click", function () { return _this.goToStep(1); }); // Redirect to Step 1 for editing
        this.formElement.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Form submitted successfully!");
            _this.clearLocalStorage();
        });
    };
    MultiStepForm.prototype.goToStep = function (step) {
        this.currentStep = step;
        this.updateForm();
        this.saveToLocalStorage();
    };
    MultiStepForm.prototype.updateForm = function () {
        var _this = this;
        this.steps.forEach(function (stepEl) {
            if (parseInt(stepEl.getAttribute("data-step")) === _this.currentStep) {
                stepEl.classList.add("active");
            }
            else {
                stepEl.classList.remove("active");
            }
        });
        this.progressSteps.forEach(function (progressEl) {
            if (parseInt(progressEl.getAttribute("data-step")) <= _this.currentStep) {
                progressEl.classList.add("active");
            }
            else {
                progressEl.classList.remove("active");
            }
        });
    };
    MultiStepForm.prototype.validateStep1 = function () {
        var valid = true;
        var name = document.getElementById("name").value.trim();
        var dob = document.getElementById("dob").value.trim();
        var genderEls = document.getElementsByName("gender");
        var genderSelected = false;
        for (var i = 0; i < genderEls.length; i++) {
            if (genderEls[i].checked) {
                genderSelected = true;
                break;
            }
        }
        if (!name) {
            this.showError("name", "Name is required");
            valid = false;
        }
        else {
            this.clearError("name");
        }
        if (!dob) {
            this.showError("dob", "Date of Birth is required");
            valid = false;
        }
        else {
            this.clearError("dob");
        }
        if (!genderSelected) {
            this.showError("gender", "Gender is required");
            valid = false;
        }
        else {
            this.clearError("gender");
        }
        return valid;
    };
    MultiStepForm.prototype.saveStep1 = function () {
        var _this = this;
        this.formData.name = document.getElementById("name").value.trim();
        this.formData.dob = document.getElementById("dob").value.trim();
        var genderEls = document.getElementsByName("gender");
        genderEls.forEach(function (el) {
            if (el.checked) {
                _this.formData.gender = el.value;
            }
        });
    };
    MultiStepForm.prototype.validateStep2 = function () {
        var valid = true;
        var email = document.getElementById("email").value.trim();
        var phone = document.getElementById("phone").value.trim();
        var address = document.getElementById("address").value.trim();
        if (!email) {
            this.showError("email", "Email is required");
            valid = false;
        }
        else if (!this.validateEmail(email)) {
            this.showError("email", "Enter a valid email address");
            valid = false;
        }
        else {
            this.clearError("email");
        }
        if (!phone) {
            this.showError("phone", "Phone is required");
            valid = false;
        }
        else if (!this.validatePhone(phone)) {
            this.showError("phone", "Enter a valid 10-digit phone number");
            valid = false;
        }
        else {
            this.clearError("phone");
        }
        if (!address) {
            this.showError("address", "Address is required");
            valid = false;
        }
        else {
            this.clearError("address");
        }
        return valid;
    };
    MultiStepForm.prototype.saveStep2 = function () {
        this.formData.email = document.getElementById("email").value.trim();
        this.formData.phone = document.getElementById("phone").value.trim();
        this.formData.address = document.getElementById("address").value.trim();
    };
    MultiStepForm.prototype.showSummary = function () {
        var _this = this;
        this.summaryElement.innerHTML = "\n            <h3>Review Your Information</h3>\n            <p><strong>Name:</strong> ".concat(this.formData.name, "</p>\n            <p><strong>Date of Birth:</strong> ").concat(this.formData.dob, "</p>\n            <p><strong>Gender:</strong> ").concat(this.formData.gender, "</p>\n            <p><strong>Email:</strong> ").concat(this.formData.email, "</p>\n            <p><strong>Phone:</strong> ").concat(this.formData.phone, "</p>\n            <p><strong>Address:</strong> ").concat(this.formData.address, "</p>\n        ");
        // Add fade-in animation
        this.summaryElement.style.opacity = "0";
        setTimeout(function () {
            _this.summaryElement.style.opacity = "1";
            _this.summaryElement.style.transform = "translateY(0)";
        }, 300);
    };
    MultiStepForm.prototype.validateEmail = function (email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    MultiStepForm.prototype.validatePhone = function (phone) {
        var phoneRegex = /^[0-9]{10}$/; // Allows exactly 10 digits
        return phoneRegex.test(phone);
    };
    MultiStepForm.prototype.showError = function (fieldId, message) {
        if (fieldId === "gender") {
            // Select the error message inside the parent div of the gender radio group
            var genderError = document.querySelector(".radio-group + .error-message");
            if (genderError) {
                genderError.textContent = message;
                genderError.style.display = "block";
            }
        }
        else {
            var field = document.getElementById(fieldId);
            if (field) {
                var errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains("error-message")) {
                    errorElement.textContent = message;
                    errorElement.style.display = "block";
                }
            }
        }
    };
    MultiStepForm.prototype.clearError = function (fieldId) {
        if (fieldId === "gender") {
            var genderError = document.querySelector(".radio-group + .error-message");
            if (genderError) {
                genderError.textContent = "";
                genderError.style.display = "none";
            }
        }
        else {
            var field = document.getElementById(fieldId);
            if (field) {
                var errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains("error-message")) {
                    errorElement.textContent = "";
                    errorElement.style.display = "none";
                }
            }
        }
    };
    MultiStepForm.prototype.saveToLocalStorage = function () {
        localStorage.setItem("formData", JSON.stringify(this.formData));
        localStorage.setItem("currentStep", this.currentStep.toString());
    };
    MultiStepForm.prototype.loadFromLocalStorage = function () {
        var _this = this;
        var storedData = localStorage.getItem("formData");
        var storedStep = localStorage.getItem("currentStep");
        if (storedData) {
            this.formData = JSON.parse(storedData);
            // Fill in the form fields
            document.getElementById("name").value = this.formData.name;
            document.getElementById("dob").value = this.formData.dob;
            var genderEls = document.getElementsByName("gender");
            genderEls.forEach(function (el) {
                if (el.value === _this.formData.gender) {
                    el.checked = true;
                }
            });
            document.getElementById("email").value = this.formData.email;
            document.getElementById("phone").value = this.formData.phone;
            document.getElementById("address").value = this.formData.address;
        }
        if (storedStep) {
            this.currentStep = parseInt(storedStep);
            this.updateForm();
        }
    };
    MultiStepForm.prototype.clearLocalStorage = function () {
        localStorage.removeItem("formData");
        localStorage.removeItem("currentStep");
    };
    return MultiStepForm;
}());
document.addEventListener("DOMContentLoaded", function () {
    new MultiStepForm();
});
