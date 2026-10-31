/* Edelbass — contenus du site.
   Modifier ce fichier pour mettre à jour le site, puis recharger la page.

   artists     Noms de la bannière. Un artiste = une seule entrée.
   upcoming    Prochaines soirées, de la plus proche à la plus lointaine.
               ticketUrl vide : pas de bouton. poster vide : pas d’affiche.
               info : précision libre (horaire, ouverture des portes…).
   pastEvents  Affiches, de la plus récente à la plus ancienne.
               photos : laisser [] tant que les images ne sont pas là.
               Exemple : photos: ["photos/05-09-2026/01.jpg"]
   products    Catalogue. Pas de paiement ici.
               Exemple :
               { name: "T-shirt", price: 35, image: "photos/tshirt.jpg", variants: ["S", "M", "L"] }
   contact     Laisser vide tant que l’adresse et le compte ne sont pas confirmés.
   committee   Prénom, nom et rôle. Pas de biographie inventée.
*/

const EDELBASS = {
  artists: [
    "Document One",
    "DJ Limited",
    "Comma Dee",
    "MC Fly DJ",
    "Zenom",
    "Hair K",
    "Titalx",
    "Herone",
    "Nyokl",
    "Muzz",
    "Crossy",
    "Diagnostix",
    "Jynx",
    "Annix",
    "Fade Black",
    "Vici",
    "Miss Understood",
    "ShockOne",
    "Oko",
    "Speen",
    "MMCM",
    "Spaceman Paps",
    "Formula",
    "EJ Kitto",
    "Fisik",
    "Mitikal",
    "Tedi",
    "Dobermann",
    "Mara",
    "Ardea",
    "Dephase",
    "John Does Visuals",
  ],

  upcoming: [
    {
      date: "28.11.2026",
      venue: "105 Labs",
      info: "",
      ticketUrl: "",
      poster: "",
    },
    {
      date: "12.12.2026",
      venue: "Le Rez",
      info: "",
      ticketUrl: "",
      poster: "",
    },
  ],

  pastEvents: [
    {
      date: "05.09.2026",
      poster: "Soiree 6 - 05.09.2026.png",
      width: 446,
      height: 561,
      photos: [],
    },
    {
      date: "09.05.2026",
      poster: "Soiree 5 - 09.05.2026.png",
      width: 677,
      height: 896,
      photos: [],
    },
    {
      date: "31.01.2026",
      poster: "Soiree 4 - 31.01.2026.png",
      width: 708,
      height: 900,
      photos: [],
    },
    {
      date: "11.10.2025",
      poster: "Soiree 3 - 11.10.2025.png",
      width: 683,
      height: 869,
      photos: [],
    },
    {
      date: "12.04.2025",
      poster: "Soiree 2 - 12.04.2025.png",
      width: 713,
      height: 891,
      photos: [],
    },
    {
      date: "23.11.2024",
      poster: "Soiree 1 - 23.11.2024.png",
      width: 866,
      height: 898,
      photos: [],
    },
  ],

  products: [],

  contact: {
    instagram: "",
    email: "",
  },

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
