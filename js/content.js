/* Edelbass — contenus du site.
   Une seule source : modifier ici, puis recharger.

   upcoming     Prochaines soirées, champs vides non affichés.
                poster, info, description, ticketUrl, lineup : laisser vides
                tant que l’information n’est pas connue.
   pastEvents   De la plus récente à la plus ancienne.
                lineup : noms lus sur l’affiche. pair relie à l’artiste suivant
                (« b2b », « × », « – »). lead : nom en grand sur l’affiche.
                photos : [] tant qu’il n’y a pas de fichiers.
                { src, alt, width, height }
   products     Catalogue, dix pièces au plus. Pas de paiement.
                { name, price, image, variants }
                Laisser [] : aucune pièce n’est fournie.
   contact      E-mail vide : rien dans les fichiers du projet.
   committee    Prénom, nom et rôle déjà écrits. Pas de photo fournie.
*/

const EDELBASS = {
  intro:
    "Edelbass est une association qui souhaite promouvoir la drum and bass à Genève par des soirées et des événements musicaux.",

  contact: {
    instagram: "https://www.instagram.com/edelbass.dnb/",
    instagramHandle: "@edelbass.dnb",
    email: "",
  },

  upcoming: [
    {
      date: "28.11.2026",
      venue: "105 Labs",
      info: "",
      description: "",
      ticketUrl: "",
      poster: "",
      lineup: [],
    },
    {
      date: "12.12.2026",
      venue: "Le Rez",
      info: "",
      description: "",
      ticketUrl: "",
      poster: "",
      lineup: [],
    },
  ],

  pastEvents: [
    {
      id: "05-09-2026",
      href: "soiree-05-09-2026.html",
      date: "05.09.2026",
      venue: "PTR, Pl. des Volontaires 4, 1204 Genève",
      info: "",
      ticketUrl: "",
      poster: "media/soiree-05-09-2026.jpg",
      width: 446,
      height: 561,
      photos: [],
      lineup: [
        { name: "Mara", from: "CH", lead: true },
        { name: "Ardea", pair: "–" },
        { name: "Dephase", pair: "–" },
        { name: "Nyokl", pair: "–" },
        { name: "Speen", pair: "–" },
        { name: "MMCM", pair: "b2b" },
        { name: "Titalx" },
        { name: "Spaceman Paps", role: "Hosted by" },
        { name: "John Does Visuals", role: "VJ" },
      ],
    },
    {
      id: "09-05-2026",
      href: "soiree-09-05-2026.html",
      date: "09.05.2026",
      venue: "PTR, Pl. des Volontaires 4, 1204 Genève",
      info: "5th edition",
      ticketUrl: "",
      poster: "media/soiree-09-05-2026.jpg",
      width: 677,
      height: 896,
      photos: [],
      lineup: [
        { name: "Formula", from: "UK", lead: true },
        { name: "EJ Kitto", from: "UK", lead: true },
        { name: "Fisik", pair: "–" },
        { name: "Mitikal", pair: "–" },
        { name: "Tedi", pair: "–" },
        { name: "Zenom" },
        { name: "Spaceman Paps", role: "Hosted by MC" },
        { name: "Dobermann", role: "VJ" },
      ],
    },
    {
      id: "31-01-2026",
      href: "soiree-31-01-2026.html",
      date: "31.01.2026",
      venue: "PTR, Pl. des Volontaires 4, 1204 Genève",
      info: "",
      ticketUrl: "",
      poster: "media/soiree-31-01-2026.jpg",
      width: 708,
      height: 900,
      photos: [],
      lineup: [
        { name: "ShockOne", from: "AUS", lead: true },
        { name: "Oko", from: "UK", lead: true },
        { name: "Hair K", pair: "–" },
        { name: "Titalx", pair: "–" },
        { name: "Speen", pair: "–" },
        { name: "MMCM" },
        { name: "Spaceman Paps", role: "Hosted by" },
      ],
    },
    {
      id: "11-10-2025",
      href: "soiree-11-10-2025.html",
      date: "11.10.2025",
      venue: "PTR Usine, Geneva",
      info: "00:00–06:00",
      ticketUrl: "https://eventfrog.ch/neksussound",
      poster: "media/soiree-11-10-2025.jpg",
      width: 683,
      height: 869,
      photos: [],
      lineup: [
        { name: "Annix", lead: true },
        { name: "Fade Black", lead: true },
        { name: "Vici", lead: true },
        { name: "Miss Understood", role: "Support" },
      ],
    },
    {
      id: "12-04-2025",
      href: "soiree-12-04-2025.html",
      date: "12.04.2025",
      venue: "PTR, Pl. des Volontaires 4, 1204 Genève",
      info: "",
      ticketUrl: "",
      poster: "media/soiree-12-04-2025.jpg",
      width: 713,
      height: 891,
      photos: [],
      lineup: [
        { name: "Muzz", from: "UK", lead: true },
        { name: "Crossy", from: "UK", pair: "–", lead: true },
        { name: "Diagnostix", from: "UK" },
        { name: "Jynx", from: "FR", lead: true },
        { name: "Zenom", group: "Edelbass crew", pair: "b2b" },
        { name: "Titalx", pair: "–" },
        { name: "Hair K" },
      ],
    },
    {
      id: "23-11-2024",
      href: "soiree-23-11-2024.html",
      date: "23.11.2024",
      venue: "",
      info: "",
      ticketUrl: "",
      poster: "media/soiree-23-11-2024.jpg",
      width: 866,
      height: 898,
      photos: [],
      lineup: [
        { name: "Document One", from: "UK", lead: true },
        { name: "DJ Limited", from: "UK", pair: "×", lead: true },
        { name: "Comma Dee", from: "UK" },
        { name: "MC Fly DJ", from: "FR", lead: true },
        { name: "Zenom" },
        { name: "Hair K", pair: "b2b" },
        { name: "Titalx" },
        { name: "Herone", pair: "b2b" },
        { name: "Nyokl" },
      ],
    },
  ],

  products: [],

  committee: [
    { name: "Anastacia Senchenko", role: "Secrétaire" },
    { name: "Alexandre Lopez", role: "Président" },
    { name: "Ben Buchner", role: "Programmateur" },
    { name: "Alexandre", role: "Responsable technique" },
    { name: "Justine", role: "Responsable communication" },
    { name: "Greg", role: "Responsable multimédia" },
    { name: "Moïra Cleusix", role: "Trésorière" },
  ],
};

function formatArtist(artist) {
  const from = artist.from ? ` (${artist.from})` : "";
  if (artist.role === "Support") return `${artist.name}${from}, support`;
  if (artist.role) return `${artist.role} ${artist.name}${from}`;
  return `${artist.name}${from}`;
}

function billLines(lineup) {
  const lines = [];
  const people = lineup || [];
  let index = 0;
  while (index < people.length) {
    const start = people[index];
    const parts = [formatArtist(start)];
    while (people[index].pair && index + 1 < people.length) {
      parts.push(people[index].pair);
      index += 1;
      parts.push(formatArtist(people[index]));
    }
    lines.push({
      group: start.group || "",
      text: parts.join(" "),
      lead: Boolean(start.lead),
    });
    index += 1;
  }
  return lines;
}

function collectArtists(events) {
  const seen = new Set();
  const names = [];
  const chronological = events.slice().reverse();
  for (const event of chronological) {
    for (const artist of event.lineup || []) {
      const key = artist.name.toLocaleLowerCase("fr-CH");
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(artist.name);
    }
  }
  return names;
}

EDELBASS.artists = collectArtists(EDELBASS.pastEvents);
