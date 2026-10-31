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
  return String(path)
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

function parseDate(value) {
  const match = String(value || "").match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function splitUpcoming(events, now) {
  const sorted = events.slice().sort((a, b) => {
    const left = parseDate(a.date);
    const right = parseDate(b.date);
    if (!left && !right) return 0;
    if (!left) return 1;
    if (!right) return -1;
    return left - right;
  });
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const future = sorted.filter((event) => {
    const date = parseDate(event.date);
    return date && date >= today;
  });
  if (future.length) {
    const past = sorted.filter((event) => !future.includes(event));
    return { primary: future[0], rest: future.slice(1).concat(past) };
  }
  return { primary: sorted[sorted.length - 1] || null, rest: sorted.slice(0, -1).reverse() };
}

function posterFigure(event, className) {
  if (!event.poster) return "";
  const width = Number(event.posterWidth || event.width);
  const height = Number(event.posterHeight || event.height);
  const size =
    Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0
      ? ` width="${width}" height="${height}"`
      : "";
  return `
    <figure class="${className}">
      <img src="${assetUrl(event.poster)}" alt="Affiche du ${escapeHtml(event.date)}"${size}>
    </figure>
  `;
}

function ticketLink(url) {
  const href = safeUrl(url);
  if (!href) return "";
  return `<p class="ticket"><a class="text-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Billetterie</a></p>`;
}

function billHtml(lineup) {
  const lines = billLines(lineup);
  if (!lines.length) return "";
  return `<ul class="bill">${lines
    .map((line) => {
      const group = line.group ? `<span class="bill__group">${escapeHtml(line.group)}</span>` : "";
      const cls = line.lead ? ` class="is-lead"` : "";
      return `<li${cls}>${group}${escapeHtml(line.text)}</li>`;
    })
    .join("")}</ul>`;
}

function detailBlock(event) {
  const venue = event.venue ? `<p class="venue">${escapeHtml(event.venue)}</p>` : "";
  const info = event.info ? `<p class="info">${escapeHtml(event.info)}</p>` : "";
  const description = event.description ? `<p class="description">${escapeHtml(event.description)}</p>` : "";
  return `${venue}${info}${description}${billHtml(event.lineup)}${ticketLink(event.ticketUrl)}${posterFigure(event, "inline-poster")}`;
}

function renderChrome() {
  const mount = document.querySelector("[data-chrome]");
  if (!mount) return;
  const page = document.body.dataset.page;
  const links = NAV.map((item) => {
    const current = item.id === page ? ` aria-current="page"` : "";
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }).join("");
  const names = EDELBASS.artists.map((name) => `<li>${escapeHtml(name)}</li>`).join("");

  mount.innerHTML = `
    <div class="top">
      <header class="site-header">
        <div class="header-inner">
          <a class="logo" href="index.html" aria-label="Edelbass, accueil">
            <img src="assets/logo-edelbass.png" alt="" width="589" height="100">
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
          <nav class="site-nav" id="site-nav">${links}</nav>
        </div>
      </header>
      <div class="marquee" role="region" aria-label="Artistes déjà programmés par Edelbass">
        <button class="marquee__toggle" type="button" aria-pressed="false">Pause</button>
        <div class="marquee__viewport">
          <div class="marquee__track">
            <ul class="marquee__group">${names}</ul>
            <ul class="marquee__group" aria-hidden="true">${names}</ul>
          </div>
        </div>
      </div>
    </div>
  `;

  const toggle = mount.querySelector(".nav-toggle");
  const nav = mount.querySelector(".site-nav");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Fermer" : "Menu";
  };
  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  const marquee = mount.querySelector(".marquee");
  const pause = mount.querySelector(".marquee__toggle");
  pause.addEventListener("click", () => {
    const paused = marquee.classList.toggle("is-paused");
    pause.setAttribute("aria-pressed", paused ? "true" : "false");
    pause.textContent = paused ? "Lecture" : "Pause";
  });
}

function renderUpcoming() {
  const primaryMount = document.querySelector("[data-upcoming]");
  const restMount = document.querySelector("[data-upcoming-rest]");
  if (!primaryMount && !restMount) return;
  const events = EDELBASS.upcoming || [];
  if (!events.length) {
    if (primaryMount) {
      primaryMount.innerHTML = `<h1>Prochaines soirées</h1><p class="empty">Aucune soirée annoncée pour le moment.</p>`;
    }
    if (restMount) restMount.innerHTML = "";
    return;
  }

  const { primary, rest } = splitUpcoming(events, new Date());
  if (primaryMount && primary) {
    primaryMount.innerHTML = `
      <article class="next">
        <h1 class="next__date">${escapeHtml(primary.date)}</h1>
        <hr class="next__mark">
        ${detailBlock(primary)}
      </article>
    `;
  }
  if (restMount) {
    restMount.innerHTML = rest.length
      ? `
        <section class="later">
          <h2>Ensuite</h2>
          <ul class="later__list">
            ${rest
              .map(
                (event) => `
                  <li>
                    <p class="later__date">${escapeHtml(event.date)}</p>
                    ${detailBlock(event)}
                  </li>
                `
              )
              .join("")}
          </ul>
        </section>
      `
      : "";
  }
}

function posterItems(events) {
  return events
    .map(
      (event) => `
        <li>
          <a class="poster-link" href="${escapeHtml(event.href)}">
            <img src="${assetUrl(event.poster)}" alt="Affiche Edelbass du ${escapeHtml(event.date)}" width="${event.width}" height="${event.height}" loading="lazy">
            <span>${escapeHtml(event.date)}</span>
          </a>
        </li>
      `
    )
    .join("");
}

function pastEventsSorted() {
  return EDELBASS.pastEvents.slice().sort((a, b) => {
    const left = parseDate(a.date);
    const right = parseDate(b.date);
    if (!left && !right) return 0;
    if (!left) return 1;
    if (!right) return -1;
    return right - left;
  });
}

function renderPastPreview() {
  const mount = document.querySelector("[data-past-preview]");
  if (!mount) return;
  mount.innerHTML = posterItems(pastEventsSorted());
}

function renderPastEvents() {
  const mount = document.querySelector("[data-past]");
  if (!mount) return;
  mount.innerHTML = posterItems(pastEventsSorted());
}

function renderIntro() {
  const mount = document.querySelector("[data-intro]");
  if (!mount || !EDELBASS.intro) return;
  mount.innerHTML = `
    <h2>L’association</h2>
    <p>${escapeHtml(EDELBASS.intro)}</p>
    <p><a class="text-link" href="about.html">About Us</a></p>
  `;
}

function renderEventPage() {
  const mount = document.querySelector("[data-event-page]");
  if (!mount) return;
  const event = EDELBASS.pastEvents.find((item) => item.id === document.body.dataset.event);
  if (!event) {
    document.title = "Soirée introuvable — Edelbass";
    mount.innerHTML = `<h1>Soirée introuvable</h1><p><a class="text-link" href="past-events.html">Soirées passées</a></p>`;
    return;
  }

  document.title = `${event.date} — Edelbass`;
  const venue = event.venue ? `<p class="venue">${escapeHtml(event.venue)}</p>` : "";
  const info = event.info ? `<p class="info">${escapeHtml(event.info)}</p>` : "";
  const bill = billHtml(event.lineup);
  mount.innerHTML = `
    <article class="night">
      <p class="kicker">Past Events</p>
      <h1>${escapeHtml(event.date)}</h1>
      ${venue}
      ${info}
      ${ticketLink(event.ticketUrl)}
      <figure class="night__poster">
        <img src="${assetUrl(event.poster)}" alt="Affiche Edelbass du ${escapeHtml(event.date)}" width="${event.width}" height="${event.height}">
      </figure>
      ${bill ? `<section class="band"><h2>Programmation</h2>${bill}</section>` : ""}
      ${renderGallery(event)}
      <p class="night__back"><a class="text-link" href="past-events.html">Toutes les affiches</a></p>
    </article>
  `;
  mountViewer(event);
}

function photoData(photo, index, date) {
  if (typeof photo === "string") {
    return { src: photo, alt: `Photo ${index + 1} du ${date}`, width: 0, height: 0 };
  }
  return {
    src: photo.src,
    alt: photo.alt || `Photo ${index + 1} du ${date}`,
    width: Number(photo.width) || 0,
    height: Number(photo.height) || 0,
  };
}

function renderGallery(event) {
  const photos = event.photos || [];
  if (!photos.length) {
    return `<section class="band" id="photos"><h2>Photos</h2><p class="empty">Aucune photo publiée pour cette soirée.</p></section>`;
  }
  const items = photos
    .map((photo, index) => {
      const item = photoData(photo, index, event.date);
      const size =
        item.width > 0 && item.height > 0 ? ` width="${item.width}" height="${item.height}"` : "";
      return `
        <li>
          <a id="photo-${index + 1}" href="#photo-${index + 1}">
            <img src="${assetUrl(item.src)}" alt="${escapeHtml(item.alt)}"${size} loading="lazy">
          </a>
        </li>
      `;
    })
    .join("");
  return `<section class="band" id="photos"><h2>Photos</h2><ul class="photo-grid">${items}</ul></section>`;
}

function mountViewer(event) {
  const photos = event.photos || [];
  if (!photos.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "viewer";
  dialog.setAttribute("aria-label", `Photos du ${event.date}`);
  dialog.innerHTML = `
    <div class="viewer__bar">
      <button type="button" data-prev>Précédente</button>
      <button type="button" data-next>Suivante</button>
      <button type="button" data-close>Fermer</button>
    </div>
    <figure>
      <img alt="">
      <figcaption aria-live="polite"></figcaption>
    </figure>
  `;
  document.body.append(dialog);

  const image = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  let current = -1;
  let clearing = false;

  function paint(index) {
    const item = photoData(photos[index], index, event.date);
    current = index;
    image.src = assetUrl(item.src);
    image.alt = item.alt;
    caption.textContent = `${index + 1} / ${photos.length}`;
  }

  function indexFromHash() {
    const match = location.hash.match(/^#photo-(\d+)$/);
    if (!match) return -1;
    const index = Number(match[1]) - 1;
    if (index < 0 || index >= photos.length) return -1;
    return index;
  }

  function sync(openDialog) {
    const index = indexFromHash();
    if (index === -1) {
      if (dialog.open) dialog.close();
      return;
    }
    paint(index);
    if (openDialog && !dialog.open) dialog.showModal();
  }

  function go(index) {
    const count = photos.length;
    const next = (index + count) % count;
    history.pushState(null, "", `#photo-${next + 1}`);
    sync(true);
  }

  function forgetHash() {
    if (clearing || !location.hash.startsWith("#photo-")) return;
    clearing = true;
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    clearing = false;
  }

  function shut() {
    forgetHash();
    if (dialog.open) dialog.close();
  }

  dialog.querySelector("[data-prev]").addEventListener("click", () => go(current - 1));
  dialog.querySelector("[data-next]").addEventListener("click", () => go(current + 1));
  dialog.querySelector("[data-close]").addEventListener("click", shut);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) shut();
  });
  dialog.addEventListener("cancel", forgetHash);
  dialog.addEventListener("close", forgetHash);
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(current + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      go(0);
    } else if (event.key === "End") {
      event.preventDefault();
      go(photos.length - 1);
    }
  });

  document.querySelector("#photos")?.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#photo-']");
    if (!link) return;
    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    sync(true);
  });

  window.addEventListener("hashchange", () => sync(true));
  sync(true);
}

function renderMerchPreview() {
  const mount = document.querySelector("[data-merch-preview]");
  if (!mount) return;
  if (!EDELBASS.products.length) {
    mount.innerHTML = `<p class="empty">Aucune pièce en vente pour le moment.</p>`;
    return;
  }
  mount.innerHTML = `<ul class="product-grid">${productItems(EDELBASS.products.slice(0, 4))}</ul>`;
}

function productItems(products) {
  return products
    .map((product) => {
      const image = product.image
        ? `<img src="${assetUrl(product.image)}" alt="${escapeHtml(product.name)}">`
        : "";
      const price = typeof product.price === "number" ? `<p class="product-price">${formatPrice(product.price)}</p>` : "";
      const variants =
        product.variants && product.variants.length
          ? `<p class="product-variants">${product.variants.map(escapeHtml).join(" · ")}</p>`
          : "";
      return `<li><article class="product">${image}<h3>${escapeHtml(product.name)}</h3>${price}${variants}</article></li>`;
    })
    .join("");
}

function renderProducts() {
  const mount = document.querySelector("[data-products]");
  if (!mount) return;
  const note = `<p class="empty">Ce site ne prend pas de commande.</p>`;
  if (!EDELBASS.products.length) {
    mount.innerHTML = `<p class="empty">Aucune pièce en vente pour le moment.</p>${note}`;
    return;
  }
  mount.innerHTML = `${note}<ul class="product-grid">${productItems(EDELBASS.products)}</ul>`;
}

function renderCommittee() {
  const mount = document.querySelector("[data-committee]");
  if (!mount) return;
  mount.innerHTML = EDELBASS.committee
    .map((member) => {
      const photo = member.photo
        ? `<img src="${assetUrl(member.photo)}" alt="" width="160" height="160">`
        : "";
      return `
        <article class="member">
          ${photo}
          <h3>${escapeHtml(member.name)}</h3>
          <p>${escapeHtml(member.role)}</p>
        </article>
      `;
    })
    .join("");
}

function renderContact() {
  const mount = document.querySelector("[data-contact]");
  if (!mount) return;
  const items = [];
  const instagram = safeUrl(EDELBASS.contact.instagram);
  if (instagram) {
    const label = EDELBASS.contact.instagramHandle || "Instagram";
    items.push(
      `<li><a href="${escapeHtml(instagram)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`
    );
  }
  const email = safeUrl(EDELBASS.contact.email);
  if (email) {
    const label = String(EDELBASS.contact.email).replace(/^mailto:/i, "");
    items.push(`<li><a href="${escapeHtml(email)}">${escapeHtml(label)}</a></li>`);
  }
  mount.innerHTML = items.length
    ? `<ul class="contact-list">${items.join("")}</ul>`
    : `<p class="empty">Aucun contact publié pour le moment.</p>`;
}

renderChrome();
renderIntro();
renderUpcoming();
renderPastPreview();
renderPastEvents();
renderEventPage();
renderMerchPreview();
renderProducts();
renderCommittee();
renderContact();
