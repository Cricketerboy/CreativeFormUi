// Define an interface for the form data
interface UserFormData {
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
}

class MultiStepForm {
    private currentStep: number = 1;
    private formData: UserFormData = {
        name: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        address: ""
    };
    private formElement: HTMLFormElement;
    private summaryElement: HTMLElement;
    private steps: NodeListOf<HTMLElement>;
    private progressSteps: NodeListOf<HTMLElement>;
  
    constructor() {
      this.formElement = document.getElementById("multiStepForm") as HTMLFormElement;
      this.summaryElement = document.getElementById("summary") as HTMLElement;
      this.steps = document.querySelectorAll(".form-step");
      this.progressSteps = document.querySelectorAll(".progress-indicator .step");
  
      this.addEventListeners();
      this.loadFromLocalStorage();
      this.updateForm();
    }
  
    private addEventListeners() {
        const nextBtn1 = document.getElementById("nextBtn1");
        nextBtn1?.addEventListener("click", () => {
          if (this.validateStep1()) {
            this.saveStep1();
            this.goToStep(2);
          }
        });
      
        const prevBtn2 = document.getElementById("prevBtn2");
        prevBtn2?.addEventListener("click", () => this.goToStep(1));
      
        const nextBtn2 = document.getElementById("nextBtn2");
        nextBtn2?.addEventListener("click", () => {
          if (this.validateStep2()) {
            this.saveStep2();
            this.showSummary();
            this.goToStep(3);
          }
        });
      
        const prevBtn3 = document.getElementById("prevBtn3");
        prevBtn3?.addEventListener("click", () => this.goToStep(2));
      
        // Handle Edit Button in Step 3
        const editBtn = document.getElementById("editBtn");
        editBtn?.addEventListener("click", () => this.goToStep(1)); // Redirect to Step 1 for editing
      
        this.formElement.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Form submitted successfully!");
          this.clearLocalStorage();
        });
      }
      
  
    private goToStep(step: number) {
      this.currentStep = step;
      this.updateForm();
      this.saveToLocalStorage();
    }
  
    private updateForm() {
      this.steps.forEach((stepEl) => {
        if (parseInt(stepEl.getAttribute("data-step")!) === this.currentStep) {
          stepEl.classList.add("active");
        } else {
          stepEl.classList.remove("active");
        }
      });
  
      this.progressSteps.forEach((progressEl) => {
        if (parseInt(progressEl.getAttribute("data-step")!) <= this.currentStep) {
          progressEl.classList.add("active");
        } else {
          progressEl.classList.remove("active");
        }
      });
    }
  
    private validateStep1(): boolean {
        let valid = true;
        const name = (document.getElementById("name") as HTMLInputElement).value.trim();
        const dob = (document.getElementById("dob") as HTMLInputElement).value.trim();
        const genderEls = document.getElementsByName("gender") as NodeListOf<HTMLInputElement>;
        
        let genderSelected = false;
        for (let i = 0; i < genderEls.length; i++) {
          if (genderEls[i].checked) {
            genderSelected = true;
            break;
          }
        }
      
        if (!name) {
          this.showError("name", "Name is required");
          valid = false;
        } else {
          this.clearError("name");
        }
      
        if (!dob) {
          this.showError("dob", "Date of Birth is required");
          valid = false;
        } else {
          this.clearError("dob");
        }
      
        if (!genderSelected) {
          this.showError("gender", "Gender is required");
          valid = false;
        } else {
          this.clearError("gender");
        }
      
        return valid;
      }
      
  
    private saveStep1() {
      this.formData.name = (document.getElementById("name") as HTMLInputElement).value.trim();
      this.formData.dob = (document.getElementById("dob") as HTMLInputElement).value.trim();
      const genderEls = document.getElementsByName("gender") as NodeListOf<HTMLInputElement>;
      genderEls.forEach((el) => {
        if (el.checked) {
          this.formData.gender = el.value;
        }
      });
    }
  
    private validateStep2(): boolean {
      let valid = true;
      const email = (document.getElementById("email") as HTMLInputElement).value.trim();
      const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
      const address = (document.getElementById("address") as HTMLTextAreaElement).value.trim();
  
      if (!email) {
        this.showError("email", "Email is required");
        valid = false;
      } else if (!this.validateEmail(email)) {
        this.showError("email", "Enter a valid email address");
        valid = false;
      } else {
        this.clearError("email");
      }
  
      if (!phone) {
        this.showError("phone", "Phone is required");
        valid = false;
    } else if (!this.validatePhone(phone)) {
        this.showError("phone", "Enter a valid 10-digit phone number");
        valid = false;
    } else {
        this.clearError("phone");
    }

  
      if (!address) {
        this.showError("address", "Address is required");
        valid = false;
      } else {
        this.clearError("address");
      }
      return valid;
    }
  
    private saveStep2() {
      this.formData.email = (document.getElementById("email") as HTMLInputElement).value.trim();
      this.formData.phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
      this.formData.address = (document.getElementById("address") as HTMLTextAreaElement).value.trim();
    }
  
    private showSummary() {
        this.summaryElement.innerHTML = `
            <h3>Review Your Information</h3>
            <p><strong>Name:</strong> ${this.formData.name}</p>
            <p><strong>Date of Birth:</strong> ${this.formData.dob}</p>
            <p><strong>Gender:</strong> ${this.formData.gender}</p>
            <p><strong>Email:</strong> ${this.formData.email}</p>
            <p><strong>Phone:</strong> ${this.formData.phone}</p>
            <p><strong>Address:</strong> ${this.formData.address}</p>
        `;
    
        // Add fade-in animation
        this.summaryElement.style.opacity = "0";
        setTimeout(() => {
            this.summaryElement.style.opacity = "1";
            this.summaryElement.style.transform = "translateY(0)";
        }, 300);
    }
  
    private validateEmail(email: string): boolean {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }


    private validatePhone(phone: string): boolean {
        const phoneRegex = /^[0-9]{10}$/; // Allows exactly 10 digits
        return phoneRegex.test(phone);
    }
  
    private showError(fieldId: string, message: string) {
        if (fieldId === "gender") {
            // Select the error message inside the parent div of the gender radio group
            const genderError = document.querySelector(".radio-group + .error-message") as HTMLElement;
            if (genderError) {
                genderError.textContent = message;
                genderError.style.display = "block";
            }
        } else {
            const field = document.getElementById(fieldId);
            if (field) {
                const errorElement = field.nextElementSibling as HTMLElement;
                if (errorElement && errorElement.classList.contains("error-message")) {
                    errorElement.textContent = message;
                    errorElement.style.display = "block";
                }
            }
        }
    }
    private clearError(fieldId: string) {
        if (fieldId === "gender") {
            const genderError = document.querySelector(".radio-group + .error-message") as HTMLElement;
            if (genderError) {
                genderError.textContent = "";
                genderError.style.display = "none";
            }
        } else {
            const field = document.getElementById(fieldId);
            if (field) {
                const errorElement = field.nextElementSibling as HTMLElement;
                if (errorElement && errorElement.classList.contains("error-message")) {
                    errorElement.textContent = "";
                    errorElement.style.display = "none";
                }
            }
        }
    }
    private saveToLocalStorage() {
      localStorage.setItem("formData", JSON.stringify(this.formData));
      localStorage.setItem("currentStep", this.currentStep.toString());
    }
  
    private loadFromLocalStorage() {
      const storedData = localStorage.getItem("formData");
      const storedStep = localStorage.getItem("currentStep");
      if (storedData) {
        this.formData = JSON.parse(storedData);
        // Fill in the form fields
        (document.getElementById("name") as HTMLInputElement).value = this.formData.name;
        (document.getElementById("dob") as HTMLInputElement).value = this.formData.dob;
        const genderEls = document.getElementsByName("gender") as NodeListOf<HTMLInputElement>;
        genderEls.forEach((el) => {
          if (el.value === this.formData.gender) {
            el.checked = true;
          }
        });
        (document.getElementById("email") as HTMLInputElement).value = this.formData.email;
        (document.getElementById("phone") as HTMLInputElement).value = this.formData.phone;
        (document.getElementById("address") as HTMLTextAreaElement).value = this.formData.address;
      }
      if (storedStep) {
        this.currentStep = parseInt(storedStep);
        this.updateForm();
      }
    }
  
    private clearLocalStorage() {
      localStorage.removeItem("formData");
      localStorage.removeItem("currentStep");
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    new MultiStepForm();
  });
  