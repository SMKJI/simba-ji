
export interface Program {
  id: string;
  name: string;
  description: string;
  skills: string[];
  prospects: string[];
  imageUrl?: string; // Added to support the existing UI
}

export const programData: Program[] = [
  {
    id: 'tkj',
    name: 'Teknik Komputer dan Jaringan',
    description: 'Program keahlian yang mempelajari tentang instalasi, konfigurasi, dan pengelolaan jaringan komputer.',
    skills: [
      'Instalasi jaringan komputer',
      'Konfigurasi jaringan komputer',
      'Pengelolaan jaringan komputer',
      'Troubleshooting jaringan komputer',
    ],
    prospects: [
      'Teknisi Jaringan',
      'Administrator Jaringan',
      'Network Engineer',
      'System Integrator',
    ],
    imageUrl: "/lovable-uploads/59299995-348a-496b-891a-595c18b49599.png"
  },
  {
    id: 'rpl',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Program keahlian yang mempelajari tentang pengembangan perangkat lunak, mulai dari analisis, desain, implementasi, hingga pengujian.',
    skills: [
      'Pemrograman web',
      'Pemrograman mobile',
      'Pengembangan aplikasi desktop',
      'Pengujian perangkat lunak',
    ],
    prospects: [
      'Pengembang Perangkat Lunak',
      'Web Developer',
      'Mobile Developer',
      'Software Tester',
    ],
    imageUrl: "/lovable-uploads/a99f791a-889f-446a-894c-09442c2d1f8f.png"
  },
  {
    id: 'mm',
    name: 'Multimedia',
    description: 'Program keahlian yang mempelajari tentang pembuatan konten multimedia, seperti desain grafis, animasi, video, dan audio.',
    skills: [
      'Desain grafis',
      'Animasi 2D dan 3D',
      'Video editing',
      'Audio editing',
    ],
    prospects: [
      'Desainer Grafis',
      'Animator',
      'Video Editor',
      'Content Creator',
    ],
    imageUrl: "/lovable-uploads/99993995-4459-4794-899a-69494994a494.png"
  },
  {
    id: 'otkp',
    name: 'Otomatisasi dan Tata Kelola Perkantoran',
    description: 'Program keahlian yang mempelajari tentang administrasi perkantoran, korespondensi, kearsipan, dan penggunaan teknologi perkantoran.',
    skills: [
      'Administrasi perkantoran',
      'Korespondensi bisnis',
      'Kearsipan',
      'Teknologi perkantoran',
    ],
    prospects: [
      'Staf Administrasi',
      'Sekretaris',
      'Resepsionis',
      'Administrator Kantor',
    ],
    imageUrl: "/lovable-uploads/09090909-5454-4545-899b-78787878c78c.png"
  },
  {
    id: 'akl',
    name: 'Akuntansi dan Keuangan Lembaga',
    description: 'Program keahlian yang mempelajari tentang akuntansi, keuangan, perpajakan, dan pengelolaan keuangan lembaga.',
    skills: [
      'Pembukuan keuangan',
      'Perpajakan',
      'Akuntansi biaya',
      'Administrasi keuangan',
    ],
    prospects: [
      'Akuntan',
      'Staf Keuangan',
      'Auditor',
      'Konsultan Pajak',
    ],
    imageUrl: "/lovable-uploads/11111111-6565-4646-899c-90909090d90d.png"
  },
  {
    id: 'bdp',
    name: 'Bisnis Daring dan Pemasaran',
    description: 'Program keahlian yang mempelajari tentang bisnis online, pemasaran digital, e-commerce, dan strategi pemasaran online.',
    skills: [
      'Digital marketing',
      'E-commerce',
      'Manajemen bisnis online',
      'Analisis pasar',
    ],
    prospects: [
      'Spesialis Pemasaran Digital',
      'Manajer E-commerce',
      'Analis Pemasaran',
      'Content Creator',
    ],
    imageUrl: "/lovable-uploads/22222222-7676-4747-899d-12121212e12e.png"
  }
];
