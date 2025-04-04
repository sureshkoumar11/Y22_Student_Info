async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22_Student_Info/main/data.xlsx"; 
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log("✅ Excel Data Loaded:", jsonData);
        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        return [];
    }
}

async function searchData() {
    const searchInputs = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim(),
        document.getElementById("searchInput7").value.toLowerCase().trim()
    ];

    if (searchInputs.every(term => term === "")) {
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

    const headers = Object.keys(jsonData[0]);

    const filteredData = jsonData.filter(row => {
        return searchInputs.every((term, index) => {
            if (term === "") return true;
            const header = headers[index];
            const cellValue = row[header] ? row[header].toString().toLowerCase() : "";
            return cellValue.includes(term);
        });
    });

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
            td.textContent = row[header];

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
