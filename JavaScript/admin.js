document.addEventListener("DOMContentLoaded", () => {
    loadData();
    setupSearch();
});

let currentPage = 0;
let totalPages = 0;
let allData = []; // ✅ store current page data for search

// ✅ LOAD DATA WITH PAGINATION
function loadData(page = 0) {

    fetch(`https://career-backend-0nly.onrender.com/career/paginated?page=${page}&size=5`)
        .then(res => res.json())
        .then(data => {

            const table = document.getElementById("tableBody");
            table.innerHTML = "";

            allData = data.content; // ✅ store for search

            let totalExp = 0;

            data.content.forEach(user => {

                totalExp += user.experienceYears || 0;

                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name || "-"}</td>
                        <td>${user.degree || "-"}</td>
                        <td>${user.stream || "-"}</td>
                        <td>${user.experienceYears || "-"}</td>
                        <td>${user.primarySkills || "-"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-1" onclick="updateUser(${user.id})">
                                Update
                            </button>

                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

                table.innerHTML += row;
            });

            // ✅ STATS
            document.getElementById("totalUsers").innerText = data.totalElements;
            document.getElementById("totalExp").innerText = totalExp;
            document.getElementById("pageInfoTop").innerText = page + 1;

            // ✅ pagination info
            currentPage = data.number;
            totalPages = data.totalPages;

            document.getElementById("pageInfo").innerText =
                `Page ${currentPage + 1} of ${totalPages}`;
        })
        .catch(err => console.error(err));
}

// ✅ SEARCH (LIVE FILTER)
function setupSearch() {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();

        const filtered = allData.filter(user =>
            user.name && user.name.toLowerCase().includes(value)
        );

        renderTable(filtered);
    });
}

// ✅ RENDER FILTERED TABLE
function renderTable(data) {
    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name || "-"}</td>
                <td>${user.degree || "-"}</td>
                <td>${user.stream || "-"}</td>
                <td>${user.experienceYears || "-"}</td>
                <td>${user.primarySkills || "-"}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="updateUser(${user.id})">
                        Update
                    </button>

                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// ✅ DELETE (MODERN UI)
function deleteUser(id) {

    Swal.fire({
        title: "Are you sure?",
        text: "This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e74c3c",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`https://career-backend-0nly.onrender.com/career/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                Swal.fire("Deleted!", "User removed.", "success");
                loadData(currentPage);
            })
            .catch(err => console.error(err));
        }
    });
}

// ✅ UPDATE (FIXED - NO PROMPT, CLEAN UI)
function updateUser(id) {

    Swal.fire({
        title: "Update User",
        html: `
            <input id="swal-name" class="swal2-input" placeholder="Name">
            <input id="swal-degree" class="swal2-input" placeholder="Degree">
            <input id="swal-exp" type="number" class="swal2-input" placeholder="Experience">
            <input id="swal-updatedBy" class="swal2-input" placeholder="Updated By (required)">
        `,
        confirmButtonText: "Update",
        focusConfirm: false,
        preConfirm: () => {

            const name = document.getElementById("swal-name").value;
            const degree = document.getElementById("swal-degree").value;
            const exp = document.getElementById("swal-exp").value;
            const updatedBy = document.getElementById("swal-updatedBy").value;

            if (!updatedBy) {
                Swal.showValidationMessage("Updated By is required");
                return false;
            }

            return {
                name,
                degree,
                experienceYears: exp ? parseInt(exp) : 0,
                updatedBy
            };
        }
    }).then((result) => {

        if (result.isConfirmed) {

            fetch(`https://career-backend-0nly.onrender.com/career/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(result.value)
            })
            .then(res => res.text())
            .then(() => {
                Swal.fire("Updated!", "User updated successfully.", "success");
                loadData(currentPage);
            })
            .catch(err => {
                Swal.fire("Error!", err, "error");
            });
        }
    });
}
// ✅ NEXT PAGE
function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadData(currentPage);
    }
}

// ✅ PREVIOUS PAGE
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        loadData(currentPage);
    }
}