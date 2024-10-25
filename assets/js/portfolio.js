const images = document.querySelectorAll(".images img"); // All images
const modal = document.querySelector(".modal"); // The modal element
const modalImg = document.querySelector(".modalImg"); // Image in the modal
const modalTxt = document.querySelector(".modalTxt"); // Text in the modal
const close = document.querySelector(".close"); // Modal close button
const prevBtn = document.querySelector(".prevBtn"); // Modal 'Prev' arrow
const nextBtn = document.querySelector(".nextBtn"); // Modal 'Next' arrow

let currentImageIndex;
let zoomLevel = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let maxOffsetX = 0;
let maxOffsetY = 0;

images.forEach((image, index) => {
  image.addEventListener("click", () => {
    currentImageIndex = index;
    showImage(currentImageIndex);
    modal.classList.add("appear");

    // Add keyboard navigation functionality
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
}

prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
close.addEventListener("click", closeModal);
close.addEventListener("touchend", closeModal);

modalImg.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = modalImg.getBoundingClientRect();
  const offsetXRel = (e.clientX - rect.left) / modalImg.width;
  const offsetYRel = (e.clientY - rect.top) / modalImg.height;

  zoomLevel = e.deltaY < 0 ? zoomLevel + 0.1 : zoomLevel - 0.1;
  zoomLevel = Math.min(Math.max(1, zoomLevel), 3);

  const imgWidth = modalImg.width * zoomLevel;
  const imgHeight = modalImg.height * zoomLevel;
  maxOffsetX = Math.max(0, (imgWidth - modal.clientWidth) / 2);
  maxOffsetY = Math.max(0, (imgHeight - modal.clientHeight) / 2);

  offsetX = Math.min(Math.max(offsetX - offsetXRel * modalImg.width * (zoomLevel - 1), -maxOffsetX), maxOffsetX);
  offsetY = Math.min(Math.max(offsetY - offsetYRel * modalImg.height * (zoomLevel - 1), -maxOffsetY), maxOffsetY);

  modalImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
  modalImg.style.transition = "transform 0.2s ease-in-out";
  modalImg.style.cursor = zoomLevel > 1 ? "grab" : "default";
});

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

// Mobile navigation toggle
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
