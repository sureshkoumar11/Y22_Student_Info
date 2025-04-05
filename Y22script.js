async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22_Student_Info/main/data.xlsx";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get as 2D array

        console.log("✅ Excel Raw Data:", jsonData);
        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        return [];
    }
}

async function searchData() {
    const searchTerms = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim()
    ];

    if (searchTerms.every(term => term === "")) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";

    const rawData = await fetchExcelData();
    if (rawData.length < 2) return;

    const headers = rawData[0];
    const rows = rawData.slice(1);

    const filteredRows = rows.filter(row =>
        searchTerms.every((term, index) => {
            if (!term) return true;
            const cell = row[index] ?? "";
            return cell.toString().toLowerCase().includes(term);
        })
    );

    const table = document.getElementById("dataTable");
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    // Set headers
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Handle no results
    if (filteredRows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${headers.length}">No matching results found.</td></tr>`;
        table.style.display = "block";
        return;
    }

    // Add filtered rows
    filteredRows.forEach(row => {
        const tr = document.createElement("tr");

        headers.forEach((_, index) => {
            const td = document.createElement("td");
            td.textContent = row[index] ?? "";
            if (td.textContent.toLowerCase() === "cgpa") {
                tr.classList.add("highlight-row");
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    table.style.display = "block";
}
