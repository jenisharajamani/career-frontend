document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("careerForm");
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("age");

    // ✅ AGE FIX
    dobInput.addEventListener("input", function () {
        if (!this.value) return;

        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age;
    });

    // ✅ SUBMIT
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // PRIMARY SKILLS
        let primarySkills = [];
        document.querySelectorAll("#careerForm > div:nth-of-type(1) input:checked")
            .forEach(cb => primarySkills.push(cb.value));

        // SECONDARY SKILLS
        let secondarySkills = [];
        document.querySelectorAll("#careerForm > div:nth-of-type(2) input:checked")
            .forEach(cb => secondarySkills.push(cb.value));

        const data = {
            name: document.getElementById("name").value,
            dob: dobInput.value,
            age: ageInput.value,
            degree: document.getElementById("degree").value,
            stream: document.getElementById("stream").value,
            institute: document.getElementById("institute").value,
            primarySkills: primarySkills.join(","),
            secondarySkills: secondarySkills.join(","),
            experienceYears: document.getElementById("experienceYears").value,
            previousCompany: document.getElementById("previousCompany").value,
            jobTitle: document.getElementById("jobTitle").value
        };

        fetch("https://career-backend-0nly.onrender.com/career/saveCareer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            Swal.fire("Success!", "Saved successfully!", "success");
            form.reset();
            ageInput.value = "";
        })
        .catch(() => {
            Swal.fire("Error!", "Something went wrong", "error");
        });

    });

});