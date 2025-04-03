let studentData = [];

// Fetch Excel Data on Page Load
document.addEventListener("DOMContentLoaded", async () => {
    studentData = await fetchExcelData();
    if (studentData.length > 0) {
        document.getElementById("noSearchMessage").innerText = "Enter search terms to see results.";
    } else {
        document.getElementById("noSearchMessage").innerText = "❌ No data available.";
    }
});

// Function to Fetch Excel File
async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22_Student_Info/main/data.xlsx"; // ✅ Ensure this is correct
        
        console.log("🔄 Fetching Excel File from:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`❌ HTTP Error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        console.log("📄 Content Type Received:", contentType);

        if (!contentType || !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            throw new Error("❌ Invalid content type received.");
        }

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log("✅ Excel Data Loaded:", jsonData);

        if (jsonData.length === 0) {
            console.warn("⚠️ Warning: Excel file is empty or incorrectly formatted.");
        }

        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        document.getElementById("noSearchMessage").innerText = "❌ Failed to load data.";
        return [];
    }
}

// Function to Search Data
function searchData() {
    console.log("🔎 Running search...");
    console.log("📊 Current Data:", studentData);

    if (!studentData || studentData.length === 0) {
        console.log("❌ No data available for search.");
        document.getElementById("noSearchMessage").innerText = "No data available.";
        return;
    }

    const search1 = document.getElementById("searchInput1").value.toLowerCase();
    const search2 = document.getElementById("searchInput2").value.toLowerCase();
    const search3 = document.getElementById("searchInput3").value.toLowerCase();
    const search4 = document.getElementById("searchInput4").value.toLowerCase();
    const search5 = document.getElementById("searchInput5").value.toLowerCase();
    const search6 = document.getElementById("searchInput6").value.toLowerCase();

    const filteredData = studentData.filter(row => {
        return (
            (!search1 || (row["Faculty Emp ID"] && row["Faculty Emp ID"].toString().toLowerCase().includes(search1))) &&
            (!search2 || (row["Student University ID"] && row["Student University ID"].toString().toLowerCase().includes(search2))) &&
            (!search3 || (row["Course Code"] && row["Course Code"].toString().toLowerCase().includes(search3))) &&
            (!search4 || (row["Name of the Course"] && row["Name of the Course"].toString().toLowerCase().includes(search4))) &&
            (!search5 || (row["Course Bucket"] && row["Course Bucket"].toString().toLowerCase().includes(search5))) &&
            (!search6 || (row["Semester"] && row["Semester"].toString().toLowerCase().includes(search6)))
        );
    });

    console.log("🔎 Search Results:", filteredData);
    displayTable(filteredData);
}

// Function to Display Table Data
function displayTable(data) {
    const table = document.getElementById("dataTable");
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (!data.length) {
        document.getElementById("noSearchMessage").innerText = "No results found.";
        table.style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").innerText = "";
    table.style.display = "table";

    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.innerText = header;
        tableHead.appendChild(th);
    });

    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.innerText = row[header] || "";
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
