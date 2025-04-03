async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22_Student_Info/main/Y22data.xlsx";
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            console.warn("⚠️ Warning: Unexpected content type received.");
        }

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
