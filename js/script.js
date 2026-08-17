const packageData = {
  // Modal Data (Triggered by Service Cards)
  "Small Decks + Porches": {
    displayPrice: "$30 - $40",
    time: "1 - 2 hours",
    includes: ["Pre-rinse of surrounding area", "Soft-wash chemical application", "Surface pressure wash", "Final rinse and inspection"]
  },
  "Standard Decks + Porches": {
    displayPrice: "$90 - $120",
    time: "2 - 3 hours",
    includes: ["Pre-rinse of surrounding area", "Soft-wash chemical application", "Deep surface pressure wash", "Spot treatment for tough stains", "Final rinse"]
  },
  "Large Decks, Porches + Roofs": {
    displayPrice: "$60 - $70",
    time: "3 - 5 hours",
    includes: ["Pre-rinse of surrounding area", "Low-pressure roof soft-wash", "Deck and porch pressure wash", "Final rinse and inspection"]
  },
  "Regular Windows": {
    displayPrice: "$6 per side",
    time: "10 - 15 mins per window",
    includes: ["Exterior glass washing", "Streak-free squeegee finish", "Window sill wipe down"]
  },
  "Larger Windows": {
    displayPrice: "$8 per side",
    time: "15 - 20 mins per window",
    includes: ["Oversized exterior glass washing", "Streak-free squeegee finish", "Window sill wipe down"]
  },
  "Bin Cleaning": {
    displayPrice: "$20 per bin",
    time: "15 mins per bin",
    includes: ["High-pressure interior wash", "Exterior wipe down", "Deodorizer and sanitizer treatment"]
  }
};

function toggleMenu() {
  document.getElementById("nav").classList.toggle("open");
}

function openPackage(name) {
  const data = packageData[name];

  document.getElementById("modalTitle").textContent = name;
  document.getElementById("modalPrice").textContent = "Estimated Price: " + data.displayPrice;
  document.getElementById("modalTime").textContent = "Estimated time: " + data.time;

  const list = document.getElementById("modalIncludes");
  list.innerHTML = "";

  data.includes.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  const modalBookButton = document.getElementById("modalBookButton");
  modalBookButton.href = "#quote";
  modalBookButton.textContent = "Get a Quote for This";
  modalBookButton.classList.add("btn-primary");

  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// Logic to show/hide dynamic fields based on service selected
function toggleServiceFields() {
  const service = document.getElementById("package").value;
  
  // Hide all sections initially
  document.getElementById("window-fields").style.display = "none";
  document.getElementById("bin-fields").style.display = "none";
  document.getElementById("pressure-fields").style.display = "none";

  // Show the correct section
  if (service === "Window Cleaning") {
    document.getElementById("window-fields").style.display = "block";
  } else if (service === "Bin Cleaning") {
    document.getElementById("bin-fields").style.display = "block";
  } else if (service === "Pressure Washing") {
    document.getElementById("pressure-fields").style.display = "block";
  }

  // Reset inputs when swapping services
  document.getElementById("regularWindows").value = 0;
  document.getElementById("largeWindows").value = 0;
  document.getElementById("binCount").value = 0;
  document.querySelectorAll("#pressure-fields input[type='checkbox']").forEach(cb => cb.checked = false);

  updateQuote();
}

function updateQuote() {
  const service = document.getElementById("package").value;
  let total = 0;
  let detailsText = "";

  if (service === "Window Cleaning") {
    const regWindows = parseInt(document.getElementById("regularWindows").value) || 0;
    const lrgWindows = parseInt(document.getElementById("largeWindows").value) || 0;
    
    total = (regWindows * 6) + (lrgWindows * 8);
    
    if (regWindows > 0) detailsText += `${regWindows} Regular Windows. `;
    if (lrgWindows > 0) detailsText += `${lrgWindows} Large Windows. `;
    
  } else if (service === "Bin Cleaning") {
    const bins = parseInt(document.getElementById("binCount").value) || 0;
    
    total = bins * 20;
    if (bins > 0) detailsText += `${bins} Bins.`;
    
  } else if (service === "Pressure Washing") {
    document.querySelectorAll("#pressure-fields input:checked").forEach(addon => {
      total += Number(addon.dataset.price);
      detailsText += addon.value + ", ";
    });
  }

  // Fallback text if nothing is typed/checked yet
  if (detailsText === "") detailsText = "None";

  // Update Summary Box
  document.getElementById("sumPackage").textContent = service || "Not selected";
  document.getElementById("sumAddons").textContent = detailsText;
  document.getElementById("sumTotal").textContent = total > 0 ? "$" + total : "$0";

  // Update Hidden Inputs for Form Submission
  const hiddenTotal = document.getElementById("hiddenTotal");
  const hiddenDetails = document.getElementById("hiddenDetails");

  if (hiddenTotal) hiddenTotal.value = total > 0 ? "$" + total : "$0";
  if (hiddenDetails) hiddenDetails.value = detailsText;
}

// Review Form Logic
const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {
  reviewForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("reviewName").value);
    formData.append("rating", document.getElementById("reviewRating").value);
    formData.append("review", document.getElementById("reviewText").value);

    await fetch("https://script.google.com/macros/s/AKfycbzV_--eM3NaQjH77sCGpV7GgvdlYgbWpHHM9e8q3mODgQhOnza7E0KZQix2Vhv0Is1exA/exec", {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    document.getElementById("reviewMessage").textContent = "Review submitted. Thank you!";
    reviewForm.reset();
  });
}

// Before and after image sliders
document.querySelectorAll(".before-after-slider").forEach(slider => {
  const range = slider.querySelector(".slider-range");
  const afterImg = slider.querySelector(".after-img");

  if (!range || !afterImg) return;

  function updateSlider() {
    const value = range.value;
    afterImg.style.clipPath = `inset(0 0 0 ${value}%)`;
    slider.style.setProperty("--slider-position", value + "%");
  }

  range.addEventListener("input", updateSlider);
  updateSlider();
});
