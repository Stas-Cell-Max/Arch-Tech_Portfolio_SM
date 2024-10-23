const images = document.querySelectorAll(".images img");
const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modalImg");
const modalTxt = document.querySelector(".modalTxt");
const close = document.querySelector(".close");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

let currentImageIndex;

images.forEach((image, index) => {
  image.addEventListener("click", () => {
    currentImageIndex = index;  // Set the current image index when an image is clicked
    showImage(currentImageIndex);
    modal.classList.add("appear");

    document.addEventListener("keydown", handleKeyboardNavigation);
  });
});

function showImage(index) {
  modalImg.src = images[index].src;
  modalTxt.innerHTML = images[index].alt;
}

function handleKeyboardNavigation(e) {
  if (e.keyCode === 37) {  // Left arrow key
    prevImage();
  } else if (e.keyCode === 39) {  // Right arrow key
    nextImage();
  } else if (e.keyCode === 27) {  // Escape key
    closeModal();
  }
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;  // Wrap around to the last image
  showImage(currentImageIndex);
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;  // Wrap around to the first image
  showImage(currentImageIndex);
}

prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);

close.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.remove("appear");
  document.removeEventListener("keydown", handleKeyboardNavigation);  // Remove keyboard event listener when modal is closed
}
