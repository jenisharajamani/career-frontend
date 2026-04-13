document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("careerForm");
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("age");

    if (!form) return;

    // =========================
    // ✅ AGE CALCULATION (FIXED)
    // =========================
    dobInput.addEventListener("change", function () {
        if (!this.value) {
            ageInput.value = "";
            return;
        }

        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || 
           (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age >= 0 ? age : "";
    });

    // =========================
    // ✅ FORM SUBMIT
    // =========================
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // =========================
        // ✅ PRIMARY SKILLS
        // =========================
        let primarySkills = [];
        document.querySelectorAll("#primarySkills input:checked")
            .forEach(cb => primarySkills.push(cb.value));

        // =========================
        // ✅ SECONDARY SKILLS
        // =========================
        let secondarySkills = [];
        document.querySelectorAll("#secondarySkills input:checked")
            .forEach(cb => secondarySkills.push(cb.value));

        // =========================
        // ✅ FORM DATA
        // =========================
        const data = {
            name: document.getElementById("name").value.trim(),
            dob: dobInput.value,
            age: ageInput.value,
            degree: document.getElementById("degree").value,
            stream: document.getElementById("stream").value.trim(),
            institute: document.getElementById("institute").value.trim(),
            primarySkills: primarySkills.join(","),
            secondarySkills: secondarySkills.join(","),
            experienceYears: document.getElementById("experienceYears").value,
            previousCompany: document.getElementById("previousCompany").value,
            jobTitle: document.getElementById("jobTitle").value
        };

        // =========================
        // ✅ SIMPLE VALIDATION
        // =========================
        if (!data.name || data.name.length < 3) {
            Swal.fire("Error!", "Name must be at least 3 characters", "error");
            return;
        }

        if (!data.dob) {
            Swal.fire("Error!", "Please select Date of Birth", "error");
            return;
        }

        if (!data.degree) {
            Swal.fire("Error!", "Please select a degree", "error");
            return;
        }

        // =========================
        // ✅ API CALL
        // =========================
        fetch("https://career-backend-0nly.onrender.com/career/saveCareer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async res => {
            const message = await res.text();

            if (!res.ok) {
                throw new Error(message);
            }

            return message;
        })
        .then(() => {
            // ✅ CLEAN SUCCESS MESSAGE
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Form submitted successfully!"
            });

            form.reset();
            ageInput.value = "";
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: err.message
            });
        });

    });

});