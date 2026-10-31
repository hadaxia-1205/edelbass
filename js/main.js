const NAV = [
  { href: "index.html", id: "whats-up", label: "What's Up" },
  { href: "merchandising.html", id: "merch", label: "Merchandising" },
  { href: "past-events.html", id: "past", label: "Past Events" },
  { href: "about.html", id: "about", label: "About Us" },
  { href: "contact.html", id: "contact", label: "Contact" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assetUrl(path) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function safeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const withScheme = raw.includes("@") && !raw.includes(":") ? `mailto:${raw}` : raw;
  try {
    const url = new URL(withScheme, window.location.href);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
      return url.href;
    }
  } catch {
    return "";
  }
  return "";
}

function formatPrice(price) {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}

function renderChrome() {
  const mount = document.querySelector("[data-chrome]");
  if (!mount) return;
  const page = document.body.dataset.page;
  const links = NAV.map((item) => {
    const current = item.id === page ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }).join("");

  const names = EDELBASS.artists
    .map((name) => `<li>${escapeHtml(name)}</li>`)
    .join("");

  mount.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="logo" href="index.html" aria-label="Edelbass, accueil">
          <img src="assets/logo-edelbass.png" alt="" width="589" height="100">
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          Menu
        </button>
        <nav class="site-nav" id="site-nav">${links}</nav>
      </div>
    </header>
    <div class="marquee" role="region" aria-label="Artistes déjà programmés par Edelbass">
      <div class="marquee__track">
        <ul class="marquee__group">${names}</ul>
        <ul class="marquee__group" aria-hidden="true">${names}</ul>
      </div>
    </div>
  `;

  const toggle = mount.querySelector(".nav-toggle");
  const nav = mount.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Fermer" : "Menu";
  });
}

function renderUpcoming() {
  const mount = document.querySelector("[data-upcoming]");
  if (!mount) return;
  const events = EDELBASS.upcoming;
  if (!events.length) {
    mount.innerHTML = `<p class="empty">Aucune soirée annoncée pour le moment.</p>`;
    return;
  }

  mount.innerHTML = events
    .map((event) => {
      const ticket = safeUrl(event.ticketUrl);
      const poster = event.poster
        ? `<img class="event-poster" src="${assetUrl(event.poster)}" alt="Affiche du ${escapeHtml(event.date)}">`
        : "";
      const info = event.info ? `<p class="event-info">${escapeHtml(event.info)}</p>` : "";
      const button = ticket
        ? `<a class="ticket" href="${escapeHtml(ticket)}" target="_blank" rel="noopener noreferrer">Billetterie</a>`
        : "";
      return `
        <article class="event-card">
          ${poster}
          <div class="event-copy">
            <p class="event-date">${escapeHtml(event.date)}</p>
            <h2 class="event-venue">${escapeHtml(event.venue)}</h2>
            ${info}
          </div>
          ${button}
        </article>
      `;
    })
    .join("");
}

function renderPastEvents() {
  const mount = document.querySelector("[data-past]");
  if (!mount) return;

  mount.innerHTML = `
    <ul class="poster-grid">
      ${EDELBASS.pastEvents
        .map(
          (event, index) => `
            <li>
              <button class="poster-button" type="button" data-event="${index}">
                <img src="${assetUrl(event.poster)}" alt="Affiche Edelbass du ${escapeHtml(event.date)}" width="${event.width}" height="${event.height}">
                <span>${escapeHtml(event.date)}</span>
              </button>
            </li>
          `
        )
        .join("")}
    </ul>
  `;

  const dialog = document.createElement("dialog");
  dialog.className = "event-dialog";
  dialog.innerHTML = `
    <div class="event-dialog__bar">
      <p class="event-dialog__date"></p>
      <button class="event-dialog__close" type="button">Fermer</button>
    </div>
    <img class="event-dialog__poster" alt="">
    <div class="event-dialog__photos"></div>
  `;
  document.body.append(dialog);

  const dateEl = dialog.querySelector(".event-dialog__date");
  const posterEl = dialog.querySelector(".event-dialog__poster");
  const photosEl = dialog.querySelector(".event-dialog__photos");

  dialog.querySelector(".event-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  mount.addEventListener("click", (event) => {
    const button = event.target.closest("[data-event]");
    if (!button) return;
    const item = EDELBASS.pastEvents[Number(button.dataset.event)];
    if (!item) return;
    dateEl.textContent = item.date;
    posterEl.src = assetUrl(item.poster);
    posterEl.alt = `Affiche Edelbass du ${item.date}`;
    posterEl.width = item.width;
    posterEl.height = item.height;

    if (item.photos && item.photos.length) {
      photosEl.innerHTML = `
        <ul class="photo-grid">
          ${item.photos
            .map((photo, photoIndex) => {
              const src = typeof photo === "string" ? photo : photo.src;
              const alt = typeof photo === "string" ? `Photo ${photoIndex + 1} du ${item.date}` : photo.alt;
              return `<li><img src="${assetUrl(src)}" alt="${escapeHtml(alt)}"></li>`;
            })
            .join("")}
        </ul>
      `;
    } else {
      photosEl.innerHTML = `<p class="empty">Les photos de cette soirée seront ajoutées ici.</p>`;
    }

    dialog.showModal();
  });
}

function renderProducts() {
  const mount = document.querySelector("[data-products]");
  if (!mount) return;
  if (!EDELBASS.products.length) {
    mount.innerHTML = `<p class="empty">Le merchandising arrive bientôt.</p>`;
    return;
  }

  mount.innerHTML = `
    <ul class="product-grid">
      ${EDELBASS.products
        .map((product) => {
          const image = product.image
            ? `<img src="${assetUrl(product.image)}" alt="${escapeHtml(product.name)}">`
            : "";
          const variants =
            product.variants && product.variants.length
              ? `<p class="product-variants">${product.variants.map(escapeHtml).join(" · ")}</p>`
              : "";
          return `
            <li>
              <article class="product">
                ${image}
                <h2>${escapeHtml(product.name)}</h2>
                <p class="product-price">${formatPrice(product.price)}</p>
                ${variants}
              </article>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

function renderCommittee() {
  const mount = document.querySelector("[data-committee]");
  if (!mount) return;
  mount.innerHTML = EDELBASS.committee
    .map(
      (member) => `
        <article class="member">
          <h3>${escapeHtml(member.name)}</h3>
          <p>${escapeHtml(member.role)}</p>
        </article>
      `
    )
    .join("");
}

function renderContact() {
  const mount = document.querySelector("[data-contact]");
  if (!mount) return;
  const instagram = safeUrl(EDELBASS.contact.instagram);
  const email = safeUrl(EDELBASS.contact.email);
  const items = [];

  if (instagram) {
    items.push(
      `<li><a href="${escapeHtml(instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a></li>`
    );
  }
  if (email) {
    const label = EDELBASS.contact.email.replace(/^mailto:/i, "");
    items.push(`<li><a href="${escapeHtml(email)}">${escapeHtml(label)}</a></li>`);
  }

  mount.innerHTML = items.length
    ? `<ul class="contact-list">${items.join("")}</ul>`
    : `<p class="empty">Instagram et l’e-mail seront publiés ici.</p>`;
}

renderChrome();
renderUpcoming();
renderPastEvents();
renderProducts();
renderCommittee();
renderContact();
