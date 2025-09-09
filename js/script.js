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

  // --- Shake ---
  const img = document.querySelector(".image1");
  const table = document.getElementById("table-users");

  function shakeElement(el) {
    if (el) {
      el.classList.add("shake");
      setTimeout(() => {
        el.classList.remove("shake");
      }, 500);
    }
  }

  if (img) {
    img.addEventListener("click", () => shakeElement(img));
  }

  if (table) {
    table.addEventListener("click", () => {
      shakeElement(table);
      shakeElement(img); 
    });
  }

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
