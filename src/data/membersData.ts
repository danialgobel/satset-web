export interface Member {
  name: string;
  instagram: string;
  handle: string;
}

export interface SquadGroup {
  id: string;
  number: string;
  title: string;
  photo: string;
  fullResPhoto: string;
  description: string;
  members: Member[];
}

export const squadsData: SquadGroup[] = [
  {
    id: "squad-01",
    number: "01",
    title: "Founding Circle",
    photo: "/assets/dokumentasi_baru/squad_portrait_02.webp",
    fullResPhoto: "/assets/dokumentasi_baru/squad_portrait_02.jpg",
    description: "Inisiator dan penggerak langkah awal Satsetwell.",
    members: [
      { name: "Fadil", handle: "@fyade1", instagram: "https://www.instagram.com/fyade1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Irsyad", handle: "@irsyddl_", instagram: "https://www.instagram.com/irsyddl_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }
    ]
  },
  {
    id: "squad-02",
    number: "02",
    title: "Core Brotherhood",
    photo: "/assets/dokumentasi_baru/brotherhood_wide_4k.webp",
    fullResPhoto: "/assets/dokumentasi_baru/brotherhood_wide_4k.jpg",
    description: "Penjaga ritme dan kebersamaan di setiap petualangan.",
    members: [
      { name: "Diki", handle: "@_7iiikkyiiss", instagram: "https://www.instagram.com/_7iiikkyiiss?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Danil", handle: "@hajjeddaniel", instagram: "https://www.instagram.com/hajjeddaniel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Nanda", handle: "@ndarizqi_13", instagram: "https://www.instagram.com/ndarizqi_13?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }
    ]
  },
  {
    id: "squad-03",
    number: "03",
    title: "Solid Vanguard",
    photo: "/assets/dokumentasi_baru/gathering_outdoor_4k.webp",
    fullResPhoto: "/assets/dokumentasi_baru/gathering_outdoor_4k.jpg",
    description: "Kawan seperjuangan dari masa kecil hingga saat ini.",
    members: [
      { name: "Zayyid", handle: "@hii.jeyyy", instagram: "https://www.instagram.com/hii.jeyyy?stkn=OXdpbXp2OXM3NDM=" },
      { name: "Ozil", handle: "@kozill", instagram: "https://www.instagram.com/kozill?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Ali", handle: "@alikazhim_", instagram: "https://www.instagram.com/alikazhim_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
      { name: "Farid", handle: "@ahmfarid_", instagram: "https://www.instagram.com/ahmfarid_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" }
    ]
  }
];

export interface ArchivePhoto {
  id: number;
  src: string;
  fullRes: string;
  caption: string;
  squad: string;
  category: 'new' | 'classic';
}

export const allArchivePhotos: ArchivePhoto[] = [
  // New Ultra HD Photos with Custom Names
  {
    id: 101,
    src: "/assets/dokumentasi_baru/brotherhood_wide_4k.webp",
    fullRes: "/assets/dokumentasi_baru/brotherhood_wide_4k.jpg",
    caption: "Kenawa Island",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 102,
    src: "/assets/dokumentasi_baru/gathering_outdoor_4k.webp",
    fullRes: "/assets/dokumentasi_baru/gathering_outdoor_4k.jpg",
    caption: "kumpulan power rangers",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 103,
    src: "/assets/dokumentasi_baru/circle_gathering_4k.webp",
    fullRes: "/assets/dokumentasi_baru/circle_gathering_4k.jpg",
    caption: "perekrutan member baru",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 105,
    src: "/assets/dokumentasi_baru/squad_portrait_02.webp",
    fullRes: "/assets/dokumentasi_baru/squad_portrait_02.jpg",
    caption: "Squad Portrait",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 106,
    src: "/assets/dokumentasi_baru/vintage_dclassic_01.webp",
    fullRes: "/assets/dokumentasi_baru/vintage_dclassic_01.jpg",
    caption: "Vintage DClassic I",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 107,
    src: "/assets/dokumentasi_baru/vintage_dclassic_02.webp",
    fullRes: "/assets/dokumentasi_baru/vintage_dclassic_02.jpg",
    caption: "Vintage DClassic II",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 108,
    src: "/assets/dokumentasi_baru/cinematic_vertical.webp",
    fullRes: "/assets/dokumentasi_baru/cinematic_vertical.jpg",
    caption: "pergantian shift malam",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 109,
    src: "/assets/dokumentasi_baru/hoga_moment_square.webp",
    fullRes: "/assets/dokumentasi_baru/hoga_moment_square.jpg",
    caption: "Hoga Pure Moments",
    squad: "Dokumentasi Baru",
    category: "new"
  },
  {
    id: 110,
    src: "/assets/dokumentasi_baru/highres_collective.webp",
    fullRes: "/assets/dokumentasi_baru/highres_collective.png",
    caption: "High-Res Collective",
    squad: "Dokumentasi Baru",
    category: "new"
  },

  // Classic Archive Photos
  { id: 1, src: "/assets/images/image01.jpg", fullRes: "/assets/images/image01.jpg", caption: "Satsetwell Gathering", squad: "Collective", category: "classic" },
  { id: 2, src: "/assets/images/image02.jpg", fullRes: "/assets/images/image02.jpg", caption: "Journey Moments", squad: "Archive", category: "classic" },
  { id: 3, src: "/assets/images/image03.jpg", fullRes: "/assets/images/image03.jpg", caption: "Fadil & Irsyad", squad: "Founding Circle", category: "classic" },
  { id: 4, src: "/assets/images/image04.jpg", fullRes: "/assets/images/image04.jpg", caption: "Official Insignia", squad: "Symbol", category: "classic" },
  { id: 5, src: "/assets/images/image05.jpg", fullRes: "/assets/images/image05.jpg", caption: "Brotherhood Bond", squad: "Solid Vanguard", category: "classic" },
  { id: 6, src: "/assets/images/image06.jpg", fullRes: "/assets/images/image06.jpg", caption: "Danial & Sudes", squad: "Brothers", category: "classic" },
  { id: 7, src: "/assets/images/image07.jpg", fullRes: "/assets/images/image07.jpg", caption: "Iqbal & Irsyad", squad: "Moments", category: "classic" },
  { id: 8, src: "/assets/images/image08.jpg", fullRes: "/assets/images/image08.jpg", caption: "Adib & Sakil", squad: "Young Blood", category: "classic" },
  { id: 9, src: "/assets/images/image09.jpg", fullRes: "/assets/images/image09.jpg", caption: "Diki, Danil & Nanda", squad: "Core Brotherhood", category: "classic" }
];
