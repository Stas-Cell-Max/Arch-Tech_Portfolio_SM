const images = document.querySelectorAll(".images img"); // All images
const modal = document.querySelector(".modal"); // The modal element
const modalImg = document.querySelector(".modalImg"); // Image in the modal
const modalTxt = document.querySelector(".modalTxt"); // Text in the modal
const close = document.querySelector(".close"); // Modal close button
const prevBtn = document.querySelector(".prevBtn"); // Modal 'Prev' arrow
const nextBtn = document.querySelector(".nextBtn"); // Modal 'Next' arrow

let currentImageIndex; // To track the current image index
let zoomLevel = 1; // Track zoom level for each image
let isDragging = false; // To track if the image is being dragged
let startX = 0; // Track the initial X position of the mouse when dragging starts
let startY = 0; // Track the initial Y position of the mouse when dragging starts
let offsetX = 0; // The current X translation of the image
let offsetY = 0; // The current Y translation of the image
let maxOffsetX = 0; // Maximum allowed X offset for dragging
let maxOffsetY = 0; // Maximum allowed Y offset for dragging

// Open the modal and show the clicked image
images.forEach((image, index) => {
  image.addEventListener("click", () => {
    currentImageIndex = index;  // Set the current image index when an image is clicked
    showImage(currentImageIndex);
    modal.classList.add("appear"); // Show the modal

    // Add keyboard navigation functionality
    document.addEventListener("keydown", handleKeyboardNavigation);
  });
});

// Function to display the current image in the modal
function showImage(index) {
  modalImg.src = images[index].src; // Set the modal image source
  modalTxt.innerHTML = images[index].alt; // Set the modal text (alt text)
  modalImg.style.transform = `translate(0px, 0px) scale(1)`; // Reset zoom and position when switching images
  zoomLevel = 1; // Reset zoom level
  offsetX = 0;
  offsetY = 0;
  modalImg.style.cursor = "default"; // Reset cursor when zoom level is 1
  document.querySelector(".close").focus(); // Auto focus on the close button
}

// Handle keyboard navigation within the modal
function handleKeyboardNavigation(e) {
  if (e.keyCode === 37) {  // Left arrow key
    prevImage();
  } else if (e.keyCode === 39) {  // Right arrow key
    nextImage();
  } else if (e.keyCode === 27) {  // Escape key
    closeModal();
  }
}

// Function to show the previous image
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;  // Go to the previous image, wrapping around
  showImage(currentImageIndex); // Show the previous image
}

// Function to show the next image
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;  // Go to the next image, wrapping around
  showImage(currentImageIndex); // Show the next image
}

// Close the modal
function closeModal() {
  modal.classList.remove("appear"); // Hide the modal
  zoomLevel = 1; // Reset zoom when modal closes
  modalImg.style.transform = `scale(${zoomLevel})`;
  document.removeEventListener("keydown", handleKeyboardNavigation);  // Remove the keyboard navigation when modal is closed
}

// Event listener for 'Prev' arrow button
prevBtn.addEventListener("click", prevImage);

// Event listener for 'Next' arrow button
nextBtn.addEventListener("click", nextImage);

// Event listener for closing the modal
close.addEventListener("click", closeModal);

// Zoom in/out with mouse wheel
modalImg.addEventListener("wheel", (e) => {
  e.preventDefault(); // Prevent default scrolling

  const rect = modalImg.getBoundingClientRect(); // Get image dimensions
  const offsetXRel = (e.clientX - rect.left) / modalImg.width; // Relative X position
  const offsetYRel = (e.clientY - rect.top) / modalImg.height; // Relative Y position

  // Zoom logic
  if (e.deltaY < 0) {
    // Scroll up, zoom in
    zoomLevel += 0.1;
  } else {
    // Scroll down, zoom out
    zoomLevel -= 0.1;
  }

  // Set boundaries to prevent zooming out too far
  zoomLevel = Math.min(Math.max(1, zoomLevel), 3); // Zoom between 100% and 300%

  // Calculate max offset to prevent dragging the image off the screen
  const imgWidth = modalImg.width * zoomLevel;
  const imgHeight = modalImg.height * zoomLevel;
  maxOffsetX = Math.max(0, (imgWidth - modal.clientWidth) / 2);
  maxOffsetY = Math.max(0, (imgHeight - modal.clientHeight) / 2);

  // Calculate the new offset after zoom, staying within boundaries
  offsetX = Math.min(Math.max(offsetX - offsetXRel * modalImg.width * (zoomLevel - 1), -maxOffsetX), maxOffsetX);
  offsetY = Math.min(Math.max(offsetY - offsetYRel * modalImg.height * (zoomLevel - 1), -maxOffsetY), maxOffsetY);

  // Apply the zoom and translation
  modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  modalImg.style.transition = "transform 0.2s ease-in-out";

  // Change cursor to grab if zoom level is greater than 1
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default";
});

// Drag functionality
modalImg.addEventListener("mousedown", (e) => {
  if (zoomLevel > 1) { // Enable dragging only when zoomed in
    isDragging = true;
    startX = e.pageX - offsetX; // Calculate starting X position
    startY = e.pageY - offsetY; // Calculate starting Y position
    modalImg.style.cursor = "grabbing"; // Change cursor to grabbing
  }
});

modalImg.addEventListener("mousemove", (e) => {
  if (isDragging) {
    e.preventDefault(); // Prevent default image drag

    // Calculate new offsets
    offsetX = e.pageX - startX;
    offsetY = e.pageY - startY;

    // Keep the image within the modal bounds
    offsetX = Math.min(Math.max(offsetX, -maxOffsetX), maxOffsetX);
    offsetY = Math.min(Math.max(offsetY, -maxOffsetY), maxOffsetY);

    // Apply the translation and zoom
    modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  }
});

modalImg.addEventListener("mouseup", () => {
  isDragging = false;
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default"; // Change back to grab if zoomed in
});

modalImg.addEventListener("mouseleave", () => {
  isDragging = false;
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default"; // Reset cursor
});
