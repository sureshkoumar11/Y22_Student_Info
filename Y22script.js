async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22_Student_Info/main/data.xlsx"; 
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        return [];
    }
}

async function searchData() {
    const jsonData = await fetchExcelData();
    if (jsonData.length === 0) return;

    // Map each input to its corresponding column
    const searchMapping = [
        { id: "searchInput1", column: "Faculty Emp ID" },
        { id: "searchInput2", column: "University ID" },
        { id: "searchInput3", column: "Year" },
        { id: "searchInput4", column: "Course Code" },
        { id: "searchInput5", column: "Bucket" },
        { id: "searchInput6", column: "Semester" },
        { id: "searchInput7", column: "CGPA" }
    ];

    const activeFilters = searchMapping
        .map(({ id, column }) => {
            const value = document.getElementById(id).value.toLowerCase().trim();
            return value ? { column, value } : null;
        })
        .filter(Boolean);

    if (activeFilters.length === 0) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";

    // Only match each term in its corresponding column
    const filteredData = jsonData.filter(row => {
        return activeFilters.every(({ column, value }) => {
            const cell = row[column] ? row[column].toString().toLowerCase() : "";
            return cell.includes(value);
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

    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header] || "";
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    table.style.display = "block";
}
