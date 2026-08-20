const DATA_PATH = "flowers.json";
const STORAGE_PREFIX = "micro-garden-position:";

const garden = document.querySelector("#garden");
const bouquetLayer = document.querySelector("#bouquet-layer");
const gardenStatus = document.querySelector("#garden-status");
const modal = document.querySelector("#bouquet-modal");
const modalOccasion = document.querySelector("#modal-occasion");
const modalTitle = document.querySelector("#modal-title");
const modalYear = document.querySelector("#modal-year");
const modalMessage = document.querySelector("#modal-message");
const modalLink = document.querySelector("#modal-link");

let previouslyFocused = null;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getSavedPosition(flower) {
  try {
    const saved = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${flower.id}`));
    if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
      return { x: clamp(saved.x, 4, 96), y: clamp(saved.y, 18, 96) };
    }
  } catch (error) {
    console.warn("The saved bouquet position could not be read.", error);
  }
  return flower.defaultPosition;
}

function savePosition(id, position) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(position));
  } catch (error) {
    console.warn("The bouquet position could not be saved.", error);
  }
}

function bouquetArtwork() {
  return `
    <span class="garden-flower f1"></span>
    <span class="garden-flower f2"></span>
    <span class="garden-flower f3"></span>
    <span class="garden-flower f4"></span>
    <span class="garden-flower f5"></span>
    <span class="garden-bouquet-wrap"></span>
    <span class="garden-bouquet-ribbon"></span>
  `;
}

function placeBouquet(element, position) {
  element.style.left = `${position.x}%`;
  element.style.top = `${position.y}%`;
}

function openModal(flower, trigger) {
  previouslyFocused = trigger;
  modalOccasion.textContent = `${flower.occasion} ${flower.year}`;
  modalTitle.textContent = flower.title;
  modalYear.textContent = `Planted: ${flower.year}`;
  modalMessage.textContent = flower.message;
  modalLink.href = flower.path;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
  previouslyFocused?.focus();
}

function enableDragging(element, flower) {
  let pointerId = null;
  let startPoint = null;
  let dragged = false;

  element.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startPoint = { x: event.clientX, y: event.clientY };
    dragged = false;
    element.setPointerCapture(pointerId);
    element.classList.add("is-dragging");
  });

  element.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || !startPoint) return;
    if (Math.hypot(event.clientX - startPoint.x, event.clientY - startPoint.y) > 5) dragged = true;
    if (!dragged) return;

    const bounds = garden.getBoundingClientRect();
    const position = {
      x: clamp(((event.clientX - bounds.left) / bounds.width) * 100, 4, 96),
      y: clamp(((event.clientY - bounds.top) / bounds.height) * 100, 18, 96)
    };
    placeBouquet(element, position);
  });

  function finishDrag(event) {
    if (event.pointerId !== pointerId) return;
    element.classList.remove("is-dragging");
    if (dragged) {
      savePosition(flower.id, {
        x: Number.parseFloat(element.style.left),
        y: Number.parseFloat(element.style.top)
      });
    }
    pointerId = null;
    startPoint = null;
  }

  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("click", (event) => {
    if (dragged) {
      event.preventDefault();
      dragged = false;
      return;
    }
    openModal(flower, element);
  });
}

function createBouquet(flower) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "bouquet-marker";
  element.dataset.bouquetId = flower.id;
  element.setAttribute("aria-label", `${flower.occasion} ${flower.year}: ${flower.title}. Drag to move or click for details.`);
  element.innerHTML = bouquetArtwork();
  placeBouquet(element, getSavedPosition(flower));
  enableDragging(element, flower);
  bouquetLayer.appendChild(element);
}

async function plantGarden() {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) throw new Error(`Could not load ${DATA_PATH} (${response.status})`);
    const flowers = await response.json();
    if (!Array.isArray(flowers)) throw new Error("Flower data must be an array.");

    flowers.forEach(createBouquet);
    gardenStatus.hidden = true;
  } catch (error) {
    console.error(error);
    gardenStatus.classList.add("error");
    gardenStatus.textContent = "The bouquets could not be planted. Open this garden through a local web server (or GitHub Pages) so flowers.json can be read.";
  }
}

modal.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab" && !modal.hidden) {
    const focusable = [...modal.querySelectorAll("button, a[href]")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

plantGarden();
