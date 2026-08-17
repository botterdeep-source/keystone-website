const packageData = {
  // Modal Data (Triggered by Service Cards)
  "Small Decks + Porches": {
    calcPrice: 35, // Median for calculator
    displayPrice: "$30 - $40",
    time: "1 - 2 hours",
    includes: ["Pre-rinse of surrounding area", "Soft-wash chemical application", "Surface pressure wash", "Final rinse and inspection"]
  },
  "Standard Decks + Porches": {
    calcPrice: 105, // Median for calculator
    displayPrice: "$90 - $120",
    time: "2 - 3 hours",
    includes: ["Pre-rinse of surrounding area", "Soft-wash chemical application", "Deep surface pressure wash", "Spot treatment for tough stains", "Final rinse"]
  },
  "Large Decks, Porches + Roofs": {
    calcPrice: 65, // Median for calculator
    displayPrice: "$60 - $70",
    time: "3 - 5 hours",
    includes: ["Pre-rinse of surrounding area", "Low-pressure roof soft-wash", "Deck and porch pressure wash", "Final rinse and inspection"]
  },
  "Regular Windows": {
    calcPrice: 6,
    displayPrice: "$6 per side",
    time: "10 - 15 mins per window",
    includes: ["Exterior glass washing", "Streak-free squeegee finish", "Window sill wipe down"]
  },
  "Larger Windows": {
    calcPrice: 8,
    displayPrice: "$8 per side",
    time: "15 - 20 mins per window",
    includes: ["Oversized exterior glass washing", "Streak-free squeegee finish", "Window sill wipe down"]
  },
  "Bin Cleaning": {
    calcPrice: 20,
    displayPrice: "$20 per bin",
    time: "15 mins per bin",
    includes: ["High-pressure interior wash", "Exterior wipe down", "Deodorizer and sanitizer treatment"]
  },

  // Quote Form Dropdown Data (Base starting prices)
  "Window Cleaning": {
    calcPrice: 0, 
    displayPrice: "Varies by window count",
    time: "Varies"
  },
  "Pressure Washing": {
    calcPrice: 0, 
    displayPrice: "Varies by property size",
    time: "Varies"
  },
  "Full Exterior Package": {
    calcPrice: 199, 
    displayPrice: "Starting at $199",
    time: "4 - 6 hours"
  }
};

// Base upcharges mapped to the property dropdown in index.html
const propertyUpcharge = {
  "Single Story Home": 0,
  "Two Story Home": 40,
  "Townhouse / Condo": 20,
  "Commercial Property": 0 // Usually custom quoted
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

  // Configure modal button to jump to the single quote section
  const modalBookButton = document.getElementById("modalBookButton");
  modalBookButton.href = "#quote";
  modalBookButton.textContent = "Get a Quote for This";
  modalBookButton.classList.add("btn-primary");

  document.getElementById("modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

function updateQuote() {
  // We use the ID 'vehicle' to map to the property dropdown from the HTML
  const property = document.getElementById("vehicle").value;
  const selectedPackage = document.getElementById("package").value;

  let packagePrice = selectedPackage ? packageData[selectedPackage].calcPrice : 0;
  let propertyPrice = property ? propertyUpcharge[property] : 0;

  let addonTotal = 0;
  document.querySelectorAll("#quote .addon input:checked").forEach(addon => {
    addonTotal += Number(addon.dataset.price);
  });

  let total = packagePrice + propertyPrice + addonTotal;

  document.getElementById("sumVehicle").textContent = property || "Not selected";
  document.getElementById("sumPackage").textContent = selectedPackage || "Not selected";
  document.getElementById("sumAddons").textContent = "$" + addonTotal;
  
  // Show "Varies" if the total is 0 to avoid confusing the user on variable services
  document.getElementById("sumTotal").textContent = total > 0 ? "$" + total : "Varies based on details";

  const hiddenTotal = document.getElementById("hiddenTotal");
  const hiddenAddonTotal = document.getElementById("hiddenAddonTotal");

  if (hiddenTotal) hiddenTotal.value = total > 0 ? "$" + total : "Varies";
  if (hiddenAddonTotal) hiddenAddonTotal.value = "$" + addonTotal;
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

  // Skip sliders that don't have both elements
  if (!range || !afterImg) return;

  function updateSlider() {
    const value = range.value;
    afterImg.style.clipPath = `inset(0 0 0 ${value}%)`;
    slider.style.setProperty("--slider-position", value + "%");
  }

  range.addEventListener("input", updateSlider);
  updateSlider();
});
