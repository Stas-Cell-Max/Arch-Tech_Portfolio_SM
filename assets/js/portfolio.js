// === DOM ELEMENTS ===
const images = document.querySelectorAll(".images img"); // All images
const modal = document.querySelector(".modal"); // The modal element
const modalImg = document.querySelector(".modalImg"); // Image in the modal
const modalTxt = document.querySelector(".modalTxt"); // Text in the modal
const close = document.querySelector(".close"); // Modal close button
const prevBtn = document.querySelector(".prevBtn"); // Modal 'Prev' arrow
const nextBtn = document.querySelector(".nextBtn"); // Modal 'Next' arrow

// === STATE VARIABLES ===
let currentImageIndex;
let zoomLevel = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let maxOffsetX = 0;
let maxOffsetY = 0;

// === MODAL FUNCTIONALITY ===

// Open modal with selected image and keyboard navigation
images.forEach((image, index) => {
  image.addEventListener("click", () => {
    currentImageIndex = index;
    showImage(currentImageIndex);
    modal.classList.add("appear");
    document.addEventListener("keydown", handleKeyboardNavigation);
  });
});

function showImage(index) {
  modalImg.src = images[index].src;
  modalTxt.innerHTML = images[index].alt;
  modalImg.style.transform = `translate(0px, 0px) scale(1)`;
  zoomLevel = 1;
  offsetX = 0;
  offsetY = 0;
  modalImg.style.cursor = "default";
  close.focus();
  toggleBodyScroll(true); // Disable background scrolling
}

function handleKeyboardNavigation(e) {
  if (e.keyCode === 37) prevImage();
  else if (e.keyCode === 39) nextImage();
  else if (e.keyCode === 27) closeModal();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  showImage(currentImageIndex);
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  showImage(currentImageIndex);
}

function closeModal() {
  modal.classList.remove("appear");
  zoomLevel = 1;
  modalImg.style.transform = `scale(${zoomLevel})`;
  document.removeEventListener("keydown", handleKeyboardNavigation);
  toggleBodyScroll(false); // Enable background scrolling
}

// Close modal on button or touch event
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
close.addEventListener("click", closeModal);
close.addEventListener("touchend", closeModal);

// === ZOOM FUNCTIONALITY WITH MOUSE WHEEL ===
modalImg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = modalImg.getBoundingClientRect();
  const offsetXRel = (e.clientX - rect.left) / modalImg.width; // Relative X position
  const offsetYRel = (e.clientY - rect.top) / modalImg.height; // Relative Y position

  // Adjust zoom level based on scroll direction
  const oldZoomLevel = zoomLevel;
  zoomLevel = e.deltaY < 0 ? zoomLevel + 0.1 : zoomLevel - 0.1;
  zoomLevel = Math.min(Math.max(1, zoomLevel), 3); // Restrict zoom level within range

  // Calculate the change in scale
  const scaleChange = zoomLevel / oldZoomLevel;

  // Adjust offset to zoom at the pointer location
  offsetX = offsetX - (offsetXRel * modalImg.width) * (scaleChange - 1);
  offsetY = offsetY - (offsetYRel * modalImg.height) * (scaleChange - 1);

  // Calculate max offset to prevent dragging off-screen
  const imgWidth = modalImg.width * zoomLevel;
  const imgHeight = modalImg.height * zoomLevel;
  maxOffsetX = Math.max(0, (imgWidth - modal.clientWidth) / 2);
  maxOffsetY = Math.max(0, (imgHeight - modal.clientHeight) / 2);

  // Clamp offset values to stay within boundaries
  offsetX = Math.min(Math.max(offsetX, -maxOffsetX), maxOffsetX);
  offsetY = Math.min(Math.max(offsetY, -maxOffsetY), maxOffsetY);

  // Apply transform for zoom and position
  modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  modalImg.style.transition = "transform 0.2s ease-in-out"; // Smooth transition
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default";
});

// === DRAG FUNCTIONALITY FOR ZOOMED IMAGE ===
function endDrag() {
  isDragging = false;
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default";
  document.removeEventListener("mousemove", dragImage);
  document.removeEventListener("mouseup", endDrag);
}

function dragImage(e) {
  if (!isDragging) return;

  e.preventDefault();
  offsetX = Math.min(Math.max(e.pageX - startX, -maxOffsetX), maxOffsetX);
  offsetY = Math.min(Math.max(e.pageY - startY, -maxOffsetY), maxOffsetY);
  modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
}

modalImg.addEventListener("mousedown", (e) => {
  if (zoomLevel <= 1) return;

  isDragging = true;
  startX = e.pageX - offsetX;
  startY = e.pageY - offsetY;
  modalImg.style.cursor = "grabbing";
  document.addEventListener("mousemove", dragImage);
  document.addEventListener("mouseup", endDrag);
});

modalImg.addEventListener("mouseleave", endDrag);

// === MOBILE NAVIGATION & MENU TOGGLE ===
document.querySelector(".back-portfolio")?.addEventListener("touchend", () => {
  window.location.href = "index.html#portfolio";
});

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
menuToggle?.addEventListener("click", () => {
  mobileNav?.classList.toggle("hidden");
});

const headerToggle = document.querySelector("#headerToggle");
headerToggle?.addEventListener("click", () => {
  document.body.classList.toggle("header-visible");
});

// === TOUCH EVENTS FOR ZOOMING & PANNING ON MOBILE ===
let initialDistance = 0;
let isPinching = false;

modalImg.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    isPinching = true;
    initialDistance = getDistance(e.touches[0], e.touches[1]);
  } else if (e.touches.length === 1 && zoomLevel > 1) {
    isDragging = true;
    startX = e.touches[0].pageX - offsetX;
    startY = e.touches[0].pageY - offsetY;
  }
});

modalImg.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (isPinching && e.touches.length === 2) {
    const newDistance = getDistance(e.touches[0], e.touches[1]);
    const scaleChange = newDistance / initialDistance;
    zoomLevel = Math.min(Math.max(zoomLevel * scaleChange, 1), 3);
    initialDistance = newDistance;

    const rect = modalImg.getBoundingClientRect();
    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

    offsetX = Math.min(Math.max(offsetX - centerX * (scaleChange - 1), -maxOffsetX), maxOffsetX);
    offsetY = Math.min(Math.max(offsetY - centerY * (scaleChange - 1), -maxOffsetY), maxOffsetY);

    modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  } else if (isDragging && e.touches.length === 1) {
    offsetX = e.touches[0].pageX - startX;
    offsetY = e.touches[0].pageY - startY;
    offsetX = Math.min(Math.max(offsetX, -maxOffsetX), maxOffsetX);
    offsetY = Math.min(Math.max(offsetY, -maxOffsetY), maxOffsetY);

    modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  }
});

modalImg.addEventListener("touchend", (e) => {
  if (e.touches.length === 0) {
    isPinching = false;
    isDragging = false;
    modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default";
  }
});

function getDistance(touch1, touch2) {
  return Math.sqrt((touch1.pageX - touch2.pageX) ** 2 + (touch1.pageY - touch2.pageY) ** 2);
}

function toggleBodyScroll(disableScroll) {
    document.body.style.overflow = disableScroll ? 'hidden' : 'auto';
  }
  
  