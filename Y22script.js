async function searchData() {
    const searchTerms = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim()
    ];

    console.log("🔍 Search terms:", searchTerms);

    if (searchTerms.every(term => term === "")) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";

    const jsonData = await fetchExcelData();
    if (jsonData.length === 0) {
        console.warn("⚠️ No data available.");
        return;
    }

    const filteredData = jsonData.filter(row => {
        const rowValues = Object.values(row).map(value => value.toString().toLowerCase());
        return searchTerms.every(term => term === "" || rowValues.some(value => value.includes(term)));
    });

    console.log("🔎 Filtered Data:", filteredData);

    const table = document.getElementById("dataTable");
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        table.style.display = "block";
        return;
    }

    // Get only the first 7 keys from the first row as headers
    const allHeaders = Object.keys(jsonData[0]);
    const headers = allHeaders.slice(0, 7);

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        let highlightRow = false;

        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header] !== undefined ? row[header] : "";

            if (td.textContent.trim().toLowerCase() === "cgpa") {
                highlightRow = true;
            }

            tr.appendChild(td);
        });

        if (highlightRow) {
            tr.classList.add("highlight-row");
        }

        tableBody.appendChild(tr);
    });

    table.style.display = "block";
}
