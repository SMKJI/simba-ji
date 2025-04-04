export interface Program {
  id: string;
  name: string;
  description: string;
  skills: string[];
  prospects: string[]; // Added missing property
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
  },
];
