document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("careerForm");
    if (!form) return;

    // ✅ AGE CALCULATION (FIXED)
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("age");

    dobInput.addEventListener("input", function () {
        if (!this.value) {
            ageInput.value = "";
            return;
        }

        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age >= 0 ? age : "";
    });

    // ✅ SKILL TOGGLE
    document.getElementById("skillPrimary").addEventListener("change", function () {
        document.getElementById("primarySkills")
            .classList.toggle("d-none", !this.checked);
    });

    document.getElementById("skillSecondary").addEventListener("change", function () {
        document.getElementById("secondarySkills")
            .classList.toggle("d-none", !this.checked);
    });

    // ✅ FORM SUBMIT
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const dob = document.getElementById("dob").value;
        const age = document.getElementById("age").value;

        if (!dob || !age) {
            Swal.fire("Error!", "Please select valid Date of Birth", "error");
            return;
        }

        let primarySkills = [];
        document.querySelectorAll("#primarySkills input:checked")
            .forEach(cb => primarySkills.push(cb.value));

        let secondarySkills = [];
        document.querySelectorAll("#secondarySkills input:checked")
            .forEach(cb => secondarySkills.push(cb.value));

        const data = {
            name,
            dob,
            age,
            degree: document.getElementById("degree").value,
            stream: document.getElementById("stream").value,
            institute: document.getElementById("institute").value,
            jobTitle: document.getElementById("jobTitle").value,
            primarySkills: primarySkills.join(","),
            secondarySkills: secondarySkills.join(","),
            experienceYears: document.getElementById("experienceYears").value,
            previousCompany: document.getElementById("previousCompany").value
        };

        fetch("https://career-backend-0nly.onrender.com/career/saveCareer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.text())
        .then(() => {
            Swal.fire("Success!", "Form submitted successfully!", "success");
            form.reset();
            document.getElementById("age").value = "";
        })
        .catch(err => {
            Swal.fire("Error!", err, "error");
        });

    });

});