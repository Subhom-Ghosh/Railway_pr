// Global array to store all QR entries (local export)
const qrDataSheet = [];

const prefixMap = {
  "Rail clips": "RC",
  "Rail liners": "RL",
  "Fish Plates": "FP",
  "Rail Anchors": "RA",
  "Rail Dowels": "RD"
};
window.onload = function () {
  const qrForm = document.getElementById("qrForm");
  const printBtn = document.getElementById("print-btn");
  const aiDiv = document.getElementById("aiResult");
  const toast = document.getElementById("toast");
  const darkToggle = document.getElementById("darkToggle");
  const resetTypeBtn = document.getElementById("resetType");
  const exportBtn = document.getElementById("export-btn");
  const typeSelect = document.getElementById("type");
  const qrIdInput = document.getElementById("qr_id");

  document.getElementById("supply_date").value = new Date().toISOString().split("T")[0];

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // Function to generate next ID
  function getNextId(type) {
    const prefix = prefixMap[type];
    const key = `qr_counter_${prefix}`;
    let count = parseInt(localStorage.getItem(key)) || 1;
    const qrId = `${prefix}${String(count).padStart(4, "0")}`;
    return { qrId, nextCount: count + 1, key };
  }

  // Auto-generate QR ID when type is selected
  typeSelect.addEventListener("change", () => {
    const type = typeSelect.value;
    if (!type || !prefixMap[type]) {
      qrIdInput.value = "";
      return;
    }
    const { qrId } = getNextId(type);
    qrIdInput.value = qrId;
  });

  // Handle form submit
  qrForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const type = typeSelect.value;
    const vendor = document.getElementById("vendor").value.trim();
    const batch = document.getElementById("batch").value.trim();
    const supply_date = document.getElementById("supply_date").value;
    const warranty = parseInt(document.getElementById("warranty").value);

    if (!type || !vendor || !batch || isNaN(warranty) || warranty <= 0) {
      showToast("⚠️ Please fill all fields correctly.");
      return;
    }

    const { qrId, nextCount, key } = getNextId(type);
    qrIdInput.value = qrId;
    typeSelect.disabled = true;

    const qrData = `
QR_ID: ${qrId},
Type: ${type},
Vendor: ${vendor},
Batch: ${batch},
Supply Date: ${supply_date},
Warranty: ${warranty} Years
`;

    // Generate QR Code
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
      text: qrData,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    

    printBtn.style.display = "block";
    showToast(`✅ QR Code ${qrId} generated!`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // AI Validation
    const expiryYear = new Date(supply_date).getFullYear() + warranty;
    const currentYear = new Date().getFullYear();

    let aiMessage = "";
    if (currentYear > expiryYear) {
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
    localStorage.setItem(key, nextCount);

    // Prepare entry object
    const entry = {
      QR_ID: qrId,
      Type: type,
      Vendor: vendor,
      Batch: batch,
      Supply_Date: supply_date,
      Warranty: warranty + " Years",
      Status: aiMessage,
      Timestamp: new Date().toISOString()
    };

    qrDataSheet.push(entry);

    // ✅ Send to Google Sheet
    sendToSheet(entry);
  });

  // Print QR
  printBtn.addEventListener("click", function () {
    const qrDiv = document.getElementById("qrcode").innerHTML;
    const printWindow = window.open("", "", "height=400,width=400");
    printWindow.document.write(`
      <html>
        <head><title>Print QR</title></head>
        <body style="text-align:center; font-family:Arial;">
          <h2>QR Code</h2>
          <div style="margin-top:20px;">${qrDiv}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  });

  // Reset form for new entry
  resetTypeBtn.addEventListener("click", () => {
    typeSelect.disabled = false;
    typeSelect.value = "";
    qrIdInput.value = "";
    document.getElementById("qrcode").innerHTML = "";
    aiDiv.innerText = "";
    printBtn.style.display = "none";
    showToast("🔄 Ready for new entry.");
  });

};

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

var form = document.getElementById('qrForm');
form.addEventListener("submit", e => {
    e.preventDefault()
    fetch(form.action, {
        method: "POST",
        body: new FormData(form),
    }).then(
        response => response.json()
    ).then((html) => {
        alert('Submitted !! 😊 Thank you ');
        window.location.href = '';
        location.reload();
    });
});
