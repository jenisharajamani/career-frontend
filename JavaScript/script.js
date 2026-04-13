document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("careerForm");
    if (!form) return;

    // ✅ AUTO AGE CALCULATION
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("age");

    dobInput.addEventListener("change", function () {
        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age;
    });

    // ✅ SKILL TOGGLE
    const skillPrimary = document.getElementById("skillPrimary");
    const skillSecondary = document.getElementById("skillSecondary");

    skillPrimary.addEventListener("change", function () {
        document.getElementById("primarySkills")
            .classList.toggle("d-none", !this.checked);
    });

    skillSecondary.addEventListener("change", function () {
        document.getElementById("secondarySkills")
            .classList.toggle("d-none", !this.checked);
    });

    // ✅ FORM SUBMIT
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        document.getElementById("nameError").innerText = "";
        document.getElementById("degreeError").innerText = "";
        document.getElementById("streamError").innerText = "";

        const name = document.getElementById("name").value.trim();
        const dob = dobInput.value;
        const age = ageInput.value;
        const degree = document.getElementById("degree").value;
        const stream = document.getElementById("stream").value.trim();

        let isValid = true;

        if (name.length < 3) {
            document.getElementById("nameError").innerText = "Min 3 characters";
            isValid = false;
        }

        if (!dob) {
            alert("Select DOB");
            isValid = false;
        }

        if (degree === "") {
            document.getElementById("degreeError").innerText = "Select degree";
            isValid = false;
        }

        if (stream.length < 2) {
            document.getElementById("streamError").innerText = "Min 2 chars";
            isValid = false;
        }

        if (!isValid) return;

        // ✅ SKILLS
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
            degree,
            stream,
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
        .then(res => {
            if (!res.ok) throw new Error("Failed");
            return res.text();
        })
        .then(() => {
            Swal.fire("Success!", "Form submitted!", "success");
            form.reset();

            document.getElementById("primarySkills").classList.add("d-none");
            document.getElementById("secondarySkills").classList.add("d-none");
        })
        .catch(() => {
            Swal.fire("Error!", "Something went wrong!", "error");
        });

    });

});