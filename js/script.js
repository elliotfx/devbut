document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello world from script.js");

  let fromjs = document.getElementById("fromjs");
  fromjs.style.color = "red";

  let welcome = document.getElementById("welcome");
  welcome.style.color = "orange";
  welcome.style.fontSize = "30px";

  function afficherHeure() {
    const maintenant = new Date();
    const heure = maintenant.toLocaleTimeString();
    document.getElementById("heure").textContent = heure;
  }
  afficherHeure();
  setInterval(afficherHeure, 1000);

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

  const caption = document.querySelector("caption");
  if (caption) {
    caption.addEventListener("mouseover", () => {
      caption.style.backgroundColor = "#ffe066";
    });
    caption.addEventListener("mouseout", () => {
      caption.style.backgroundColor = "";
    });
  }

  const img = document.querySelector(".image1");
  const table = document.getElementById("table-users");

  const shakeStates = new Map();

  function toggleShake(elementId) {
    const element = document.getElementById(elementId) || document.querySelector(elementId);
    if (!element) {
      console.warn(`Élément avec l'ID/sélecteur "${elementId}" non trouvé`);
      return;
    }
    const isCurrentlyShaking = shakeStates.get(elementId) || false;
    if (isCurrentlyShaking) {
      element.classList.remove("shake");
      shakeStates.set(elementId, false);
      console.log(`Élément ${elementId} : shake arrêté`);
    } else {
      element.classList.add("shake");
      shakeStates.set(elementId, true);
      console.log(`Élément ${elementId} : shake démarré`);
    }
  }

  function getButtonText(elementId) {
    const isShaking = shakeStates.get(elementId) || false;
    const elementName = elementId.includes('image') ? 'Image' : elementId.includes('table') ? 'Tableau' : 'Élément';
    return isShaking ? `Arrêter ${elementName}` : `Shaker ${elementName}`;
  }

  function createShakeButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.margin = "20px 0";
    buttonContainer.style.textAlign = "center";

    const imgButton = document.createElement("button");
    imgButton.textContent = getButtonText(".image1");
    imgButton.style.margin = "5px 10px";
    imgButton.style.padding = "10px 15px";
    imgButton.style.backgroundColor = "#007bff";
    imgButton.style.color = "white";
    imgButton.style.border = "none";
    imgButton.style.borderRadius = "5px";
    imgButton.style.cursor = "pointer";

    const tableButton = document.createElement("button");
    tableButton.textContent = getButtonText("#table-users");
    tableButton.style.margin = "5px 10px";
    tableButton.style.padding = "10px 15px";
    tableButton.style.backgroundColor = "#28a745";
    tableButton.style.color = "white";
    tableButton.style.border = "none";
    tableButton.style.borderRadius = "5px";
    tableButton.style.cursor = "pointer";

    imgButton.addEventListener("click", () => {
      toggleShake(".image1");
      imgButton.textContent = getButtonText(".image1");
    });

    tableButton.addEventListener("click", () => {
      toggleShake("#table-users");
      tableButton.textContent = getButtonText("#table-users");
    });

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

    if (table && table.parentNode) {
      table.parentNode.insertBefore(buttonContainer, table.nextSibling);
    }
  }

  if (img || table) {
    createShakeButton();
  }

  async function loadUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
    try {
      renderStatus("Chargement...");
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Données introuvables (erreur 404)");
        } else {
          throw new Error(`Erreur serveur : HTTP ${res.status}`);
        }
      }
      const users = await res.json();
      if (!users || users.length === 0) {
        renderStatus("Aucune donnée à afficher");
        return;
      }
      renderTable(users);
      renderStatus("");
    } catch (err) {
      console.error(err);
      renderStatus(err.message || "Erreur de chargement");
    }
  }

  function renderTable(users) {
    if (!table) return;
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    if (!users || users.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3" style="text-align:center;">Aucune donnée disponible</td>`;
      tbody.appendChild(tr);
      return;
    }
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
