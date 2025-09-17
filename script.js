window.onload = function () {
  const qrForm = document.getElementById("qrForm");
  const printBtn = document.getElementById("print-btn"); // matches HTML
  const aiDiv = document.getElementById("aiResult");
  let today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
  document.getElementById("supply_date").value = today;
  qrForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect form data
    let qr_id = document.getElementById("qr_id").value;
    let type = document.getElementById("type").value;
    let vendor = document.getElementById("vendor").value;
    let batch = document.getElementById("batch").value;
    let supply_date = document.getElementById("supply_date").value;
    let warranty = document.getElementById("warranty").value;

    // Prepare data
    let data = `
QR_ID: ${qr_id},
Type: ${type},
Vendor: ${vendor},
Batch: ${batch},
Supply Date: ${supply_date},
Warranty: ${warranty}
`;

    // Clear old QR
    document.getElementById("qrcode").innerHTML = "";

    // Generate new QR
    new QRCode(document.getElementById("qrcode"), {
      text: data,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Show print button
    printBtn.style.display = "block";

    // AI Analysis
    let today = new Date();
    let supplyYear = new Date(supply_date).getFullYear();
    let warrantyYears = parseInt(warranty);
    let expiryYear = supplyYear + (isNaN(warrantyYears) ? 0 : warrantyYears);

    let aiMessage = "";
    if (today.getFullYear() > expiryYear) {
      aiMessage = "❌ Expired – Replace immediately.";
      aiDiv.style.color = "red";
    } else if (vendor === "Other") {
      aiMessage = "⚠️ Unverified Vendor – Extra inspection needed.";
      aiDiv.style.color = "orange";
    } else {
      aiMessage = "✅ Valid – No issue detected.";
      aiDiv.style.color = "green";
    }

    aiDiv.innerText = "AI Analysis: " + aiMessage;
  });

  // Print QR code
  printBtn.addEventListener("click", function () {
    let qrDiv = document.getElementById("qrcode").innerHTML;
    let printWindow = window.open("", "", "height=400,width=400");
    printWindow.document.write(
      "<html><head><title>Print QR</title></head><body>"
    );
    printWindow.document.write(qrDiv);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  });
};
