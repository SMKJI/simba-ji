
export interface Program {
  id: string;
  name: string;
  description: string;
  skills: string[];
  prospects: string[];
  imageUrl?: string;
}

export const programData: Program[] = [
  {
    id: 'akl',
    name: 'Akuntansi dan Keuangan Lembaga',
    description: 'Program keahlian yang mempelajari pengelolaan keuangan, akuntansi lembaga, dan praktik pembukuan sesuai standar akuntansi terkini.',
    skills: [
      'Akuntansi dasar dan menengah',
      'Pengelolaan kas dan bank',
      'Pembuatan laporan keuangan',
      'Perpajakan perusahaan',
    ],
    prospects: [
      'Staf Akuntansi',
      'Auditor Junior',
      'Kasir Perusahaan',
      'Admin Keuangan',
    ],
    imageUrl: "/lovable-uploads/59299995-348a-496b-891a-595c18b49599.png"
  },
  {
    id: 'bp',
    name: 'Broadcast dan Perfilman',
    description: 'Program keahlian yang fokus pada produksi konten siaran, teknik penyiaran, dan produksi film profesional.',
    skills: [
      'Pengoperasian kamera broadcast',
      'Editing video profesional',
      'Manajemen produksi film',
      'Teknik penyiaran langsung',
    ],
    prospects: [
      'Kameraman Profesional',
      'Editor Video',
      'Produser Konten',
      'Teknisi Studio',
    ],
    imageUrl: "/lovable-uploads/a99f791a-889f-446a-894c-09442c2d1f8f.png"
  },
  {
    id: 'bus',
    name: 'Busana',
    description: 'Program keahlian dalam desain dan produksi busana, meliputi teknik menjahit hingga manajemen mode.',
    skills: [
      'Desain fashion digital',
      'Pola dan konstruksi busana',
      'Tekstil dan material',
      'Manajemen produksi garmen',
    ],
    prospects: [
      'Desainer Fashion',
      'Penjahit Profesional',
      'Stylist Busana',
      'Pengusaha Konveksi',
    ],
    imageUrl: "/lovable-uploads/99993995-4459-4794-899a-69494994a494.png"
  },
  {
    id: 'dkv',
    name: 'Desain Komunikasi Visual',
    description: 'Program keahlian dalam menciptakan solusi visual untuk kebutuhan komunikasi dan media.',
    skills: [
      'Desain grafis digital',
      'Fotografi komersial',
      'Ilustrasi digital',
      'Animasi dasar',
    ],
    prospects: [
      'Graphic Designer',
      'Art Director',
      'UI/UX Designer',
      'Digital Illustrator',
    ],
    imageUrl: "/lovable-uploads/09090909-5454-4545-899b-78787878c78c.png"
  },
  {
    id: 'mplb',
    name: 'Menejemen Perkantoran dan Layanan Bisnis',
    description: 'Program keahlian dalam administrasi perkantoran modern dan manajemen layanan bisnis profesional.',
    skills: [
      'Manajemen dokumen digital',
      'Korespondensi bisnis',
      'Sistem informasi perkantoran',
      'Pelayanan pelanggan',
    ],
    prospects: [
      'Sekretaris Eksekutif',
      'Office Manager',
      'Customer Service Expert',
      'Administrasi Gudang',
    ],
    imageUrl: "/lovable-uploads/11111111-6565-4646-899c-90909090d90d.png"
  },
  {
    id: 'pm',
    name: 'Pemasaran',
    description: 'Program keahlian dalam strategi pemasaran modern baik digital maupun konvensional.',
    skills: [
      'Digital marketing',
      'Analisis pasar',
      'Manajemen merek',
      'Penjualan langsung',
    ],
    prospects: [
      'Digital Marketer',
      'Sales Manager',
      'Market Researcher',
      'Brand Strategist',
    ],
    imageUrl: "/lovable-uploads/22222222-7676-4747-899d-12121212e12e.png"
  }
];
