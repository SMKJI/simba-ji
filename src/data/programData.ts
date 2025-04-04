
export type Program = {
  id: string;
  name: string;
  description: string;
  skills: string[];
  prospects: string[];
};

export const programs: Program[] = [
  {
    id: 'tkj',
    name: 'Teknik Komputer dan Jaringan',
    description: 'Program keahlian yang mempelajari tentang instalasi jaringan komputer, perakitan komputer, dan troubleshooting perangkat keras & jaringan.',
    skills: ['Instalasi jaringan', 'Perakitan komputer', 'Troubleshooting', 'Network security'],
    prospects: ['IT Support', 'Network Administrator', 'System Administrator', 'Network Engineer']
  },
  {
    id: 'rpl',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Program keahlian yang mempelajari tentang pengembangan perangkat lunak, pemrograman, dan manajemen basis data.',
    skills: ['Pemrograman', 'Basis Data', 'Web Development', 'Mobile Development'],
    prospects: ['Programmer', 'Software Developer', 'Web Developer', 'Database Administrator']
  },
  {
    id: 'mm',
    name: 'Multimedia',
    description: 'Program keahlian yang mempelajari tentang desain grafis, animasi, editing video, dan pengembangan media interaktif.',
    skills: ['Desain Grafis', 'Animasi', 'Video Editing', 'Photography'],
    prospects: ['Graphic Designer', 'Video Editor', 'Animator', 'Content Creator']
  },
  {
    id: 'akl',
    name: 'Akuntansi dan Keuangan Lembaga',
    description: 'Program keahlian yang mempelajari tentang akuntansi, keuangan, perpajakan, dan aplikasi komputer akuntansi.',
    skills: ['Akuntansi Dasar', 'Perpajakan', 'Komputer Akuntansi', 'Administrasi Keuangan'],
    prospects: ['Staff Accounting', 'Tax Consultant', 'Finance Staff', 'Auditor']
  },
  {
    id: 'otkp',
    name: 'Otomatisasi dan Tata Kelola Perkantoran',
    description: 'Program keahlian yang mempelajari tentang administrasi perkantoran, kesekretariatan, dan manajemen kantor.',
    skills: ['Administrasi Perkantoran', 'Kesekretariatan', 'Korespondensi', 'Kearsipan'],
    prospects: ['Secretary', 'Administrative Staff', 'Office Manager', 'Customer Service']
  },
  {
    id: 'bdp',
    name: 'Bisnis Daring dan Pemasaran',
    description: 'Program keahlian yang mempelajari tentang pemasaran, bisnis online, manajemen bisnis, dan komunikasi pemasaran.',
    skills: ['Digital Marketing', 'E-commerce', 'Sales', 'Customer Relationship'],
    prospects: ['Digital Marketer', 'Online Shop Owner', 'Sales Executive', 'Marketing Staff']
  }
];
