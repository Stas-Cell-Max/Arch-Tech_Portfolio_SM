const images = document.querySelectorAll(".images img"); // All images
const modal = document.querySelector(".modal"); // The modal element
const modalImg = document.querySelector(".modalImg"); // Image in the modal
const modalTxt = document.querySelector(".modalTxt"); // Text in the modal
const close = document.querySelector(".close"); // Modal close button
const prevBtn = document.querySelector(".prev-arrow"); // Modal 'Prev' arrow
const nextBtn = document.querySelector(".next-arrow"); // Modal 'Next' arrow

let currentImageIndex; // To track the current image index

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
  document.removeEventListener("keydown", handleKeyboardNavigation);  // Remove the keyboard navigation when modal is closed
}

// Event listener for 'Prev' arrow button
prevBtn.addEventListener("click", prevImage);

// Event listener for 'Next' arrow button
nextBtn.addEventListener("click", nextImage);

// Event listener for closing the modal
close.addEventListener("click", closeModal);
