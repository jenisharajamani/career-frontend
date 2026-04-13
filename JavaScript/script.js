document.addEventListener("DOMContentLoaded", function () {

    // ❗ Prevent errors if page doesn't have form (important fix)
    const form = document.getElementById("careerForm");
    if (!form) return;

    // ✅ AUTO AGE
    document.getElementById("dob").addEventListener("change", function () {
        const dob = new Date(this.value);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        document.getElementById("age").value = age;
    });

    // ✅ SKILL TOGGLE (SAFE FIX)
    const skillPrimary = document.getElementById("skillPrimary");
    const skillSecondary = document.getElementById("skillSecondary");

    if (skillPrimary) {
        skillPrimary.addEventListener("change", function () {
            document.getElementById("primarySkills")
                .classList.toggle("d-none", !this.checked);
        });
    }

    if (skillSecondary) {
        skillSecondary.addEventListener("change", function () {
            document.getElementById("secondarySkills")
                .classList.toggle("d-none", !this.checked);
        });
    }

    // ✅ FORM SUBMIT
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // ✅ SAFE ERROR CLEARING (important fix)
        const nameError = document.getElementById("nameError");
        const degreeError = document.getElementById("degreeError");
        const streamError = document.getElementById("streamError");

        if (nameError) nameError.innerText = "";
        if (degreeError) degreeError.innerText = "";
        if (streamError) streamError.innerText = "";

        const successMsg = document.getElementById("successMsg");
        if (successMsg) {
            successMsg.classList.add("d-none");
        }

        // ✅ GET VALUES
        const name = document.getElementById("name").value.trim();
        const dob = document.getElementById("dob").value;
        const age = document.getElementById("age").value;
        const degree = document.getElementById("degree").value;
        const stream = document.getElementById("stream").value.trim();
        const institute = document.getElementById("institute").value.trim();
        const jobTitle = document.getElementById("jobTitle").value.trim();

        let isValid = true;

        if (name.length < 3) {
            if (nameError) nameError.innerText = "Name must be at least 3 characters";
            isValid = false;
        }

        if (!dob) {
            alert("Please select Date of Birth");
            isValid = false;
        }

        if (degree === "") {
            if (degreeError) degreeError.innerText = "Please select a degree";
            isValid = false;
        }

        if (stream.length < 2) {
            if (streamError) streamError.innerText = "Stream must be at least 2 characters";
            isValid = false;
        }

        if (!isValid) return;

        // ✅ SKILLS (UPDATED FIX — no checkbox dependency)
        let primarySkills = [];
        document.querySelectorAll("#primarySkills input:checked")
            .forEach(cb => primarySkills.push(cb.value));

        let secondarySkills = [];
        document.querySelectorAll("#secondarySkills input:checked")
            .forEach(cb => secondarySkills.push(cb.value));

        // ✅ DATA
        const data = {
            name,
            dob,
            age,
            degree,
            stream,
            institute,
            jobTitle,
            primarySkills: primarySkills.join(","),
            secondarySkills: secondarySkills.join(","), 
            experienceYears: document.getElementById("experienceYears").value,
            previousCompany: document.getElementById("previousCompany").value
        };

        // ✅ CORRECT API
        fetch("https://career-backend-0nly.onrender.com/career/saveCareer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) return res.text().then(err => { throw err });
            return res.text();
        })
        .then(() => {
            Swal.fire("Success!", "Form submitted successfully!", "success");

            form.reset();

            const primarySkillsDiv = document.getElementById("primarySkills");
            const secondarySkillsDiv = document.getElementById("secondarySkills");

            if (primarySkillsDiv) primarySkillsDiv.classList.add("d-none");
            if (secondarySkillsDiv) secondarySkillsDiv.classList.add("d-none");
        })
        .catch(err => {
            Swal.fire("Error!", err, "error");
        });

    });

});