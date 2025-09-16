document.getElementById("qrForm").addEventListener("submit", function (e) {
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
    correctLevel: QRCode.CorrectLevel.H
  });

  // Show print button
  document.getElementById("button").style.display = "block";
});

// Print QR code
document.getElementById("button").addEventListener("click", function () {
  let qrDiv = document.getElementById("qrcode").innerHTML;
  let printWindow = window.open('', '', 'height=400,width=400');
  printWindow.document.write('<html><head><title>Print QR</title></head><body>');
  printWindow.document.write(qrDiv);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
});
