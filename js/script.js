document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello world from script.js");

  let fromjs = document.getElementById("fromjs");
  fromjs.style.color = "red";

  let welcome = document.getElementById("welcome");
  welcome.style.color = "orange";
  welcome.style.fontSize = "30px";

  // --- Afficher l'heure en direct ---
  function afficherHeure() {
    const maintenant = new Date();
    const heure = maintenant.toLocaleTimeString();
    document.getElementById("heure").textContent = heure;
  }
  afficherHeure();
  setInterval(afficherHeure, 1000);

  // --- Liste ---
  const liste = document.getElementById("maListe");
  if (liste && liste.firstElementChild) {
    liste.removeChild(liste.firstElementChild);
    console.log("Premier élément supprimé de la liste.");
  }

  if (liste) {
    const nouvelElement = document.createElement("li");
    nouvelElement.textContent = "Orange";
    liste.appendChild(nouvelElement);
    console.log("Nouvel élément ajouté à la liste.");
  }

  // --- Caption hover ---
  const caption = document.querySelector("caption");
  if (caption) {
    caption.addEventListener("mouseover", () => {
      caption.style.backgroundColor = "#ffe066";
    });
    caption.addEventListener("mouseout", () => {
      caption.style.backgroundColor = "";
    });
  }

  // --- Fonctionnalité Shake/Unshake refactorisée ---
  const img = document.querySelector(".image1");
  const table = document.getElementById("table-users");

  // Objet pour tracker l'état de shake de chaque élément
  const shakeStates = new Map();

  /**
   * Fonction unifiée pour gérer le shake/unshake d'un élément
   * @param {string} elementId - L'ID de l'élément
   */
  function toggleShake(elementId) {
    const element = document.getElementById(elementId) || document.querySelector(elementId);
    
    if (!element) {
      console.warn(`Élément avec l'ID/sélecteur "${elementId}" non trouvé`);
      return;
    }

    const isCurrentlyShaking = shakeStates.get(elementId) || false;

    if (isCurrentlyShaking) {
      // Unshake : arrêter le shake
      element.classList.remove("shake");
      shakeStates.set(elementId, false);
      console.log(`Élément ${elementId} : shake arrêté`);
    } else {
      // Shake : démarrer le shake
      element.classList.add("shake");
      shakeStates.set(elementId, true);
      console.log(`Élément ${elementId} : shake démarré`);
      
      // Optionnel : arrêter automatiquement le shake après 5 secondes
      // Décommentez les lignes suivantes si vous voulez cette fonctionnalité
      /*
      setTimeout(() => {
        if (shakeStates.get(elementId)) {
          toggleShake(elementId);
        }
      }, 5000);
      */
    }
  }

  /**
   * Fonction pour obtenir le texte du bouton en fonction de l'état
   * @param {string} elementId - L'ID de l'élément
   * @returns {string} - Le texte à afficher sur le bouton
   */
  function getButtonText(elementId) {
    const isShaking = shakeStates.get(elementId) || false;
    const elementName = elementId.includes('image') ? 'Image' : 
                       elementId.includes('table') ? 'Tableau' : 'Élément';
    return isShaking ? `Arrêter ${elementName}` : `Shaker ${elementName}`;
  }

  // --- Création du bouton unique pour contrôler les éléments ---
  function createShakeButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.margin = "20px 0";
    buttonContainer.style.textAlign = "center";

    // Bouton pour l'image
    const imgButton = document.createElement("button");
    imgButton.textContent = getButtonText(".image1");
    imgButton.style.margin = "5px 10px";
    imgButton.style.padding = "10px 15px";
    imgButton.style.backgroundColor = "#007bff";
    imgButton.style.color = "white";
    imgButton.style.border = "none";
    imgButton.style.borderRadius = "5px";
    imgButton.style.cursor = "pointer";

    // Bouton pour le tableau
    const tableButton = document.createElement("button");
    tableButton.textContent = getButtonText("#table-users");
    tableButton.style.margin = "5px 10px";
    tableButton.style.padding = "10px 15px";
    tableButton.style.backgroundColor = "#28a745";
    tableButton.style.color = "white";
    tableButton.style.border = "none";
    tableButton.style.borderRadius = "5px";
    tableButton.style.cursor = "pointer";

    // Event listeners
    imgButton.addEventListener("click", () => {
      toggleShake(".image1");
      imgButton.textContent = getButtonText(".image1");
    });

    tableButton.addEventListener("click", () => {
      toggleShake("#table-users");
      tableButton.textContent = getButtonText("#table-users");
    });

    // Hover effects
    [imgButton, tableButton].forEach(btn => {
      btn.addEventListener("mouseover", () => {
        btn.style.opacity = "0.8";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.opacity = "1";
      });
    });

    buttonContainer.appendChild(imgButton);
    buttonContainer.appendChild(tableButton);

    // Insérer les boutons après le tableau
    if (table && table.parentNode) {
      table.parentNode.insertBefore(buttonContainer, table.nextSibling);
    }
  }

  // Supprimer les anciens event listeners de click sur l'image et le tableau
  // et créer les nouveaux boutons
  if (img || table) {
    createShakeButton();
  }

  // --- API Users (code existant) ---
  async function loadUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
    try {
      renderStatus("Chargement...");
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const users = await res.json();
      renderTable(users);
      renderStatus(""); 
    } catch (err) {
      console.error(err);
      renderStatus("Erreur de chargement");
    }
  }

  function renderTable(users) {
    if (!table) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; 

    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderStatus(msg) {
    if (!caption) return;
    if (!caption.dataset.defaultText) caption.dataset.defaultText = caption.textContent || "People";
    caption.textContent = msg || caption.dataset.defaultText;
  }

  if (caption) {
    caption.style.cursor = "pointer";
    caption.title = "Clique pour recharger les données";
    caption.addEventListener("click", loadUsers);
  }

  loadUsers();
});