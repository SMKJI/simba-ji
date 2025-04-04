
interface Program {
  id: string;
  name: string;
  description: string;
  skills: string[];
  image?: string; // Make image property optional
  prospects: string[]; // Add prospects property
}

export const programs: Program[] = [
  {
    id: '1',
    name: 'Teknik Komputer dan Jaringan',
    description: 'Program yang mempelajari tentang perakitan komputer, troubleshooting hardware, instalasi jaringan, dan administrasi server.',
    skills: ['Networking', 'Hardware', 'Server Administration', 'Troubleshooting'],
    image: '/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png',
    prospects: ['Network Administrator', 'IT Support', 'System Administrator', 'Network Engineer']
  },
  {
    id: '2',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Program yang mempelajari tentang pengembangan aplikasi, pemrograman, database, dan metodologi pengembangan software.',
    skills: ['Programming', 'Web Development', 'Database', 'Software Engineering'],
    image: '/lovable-uploads/a6c5cdf7-de60-4835-b170-c3f5fb173dd9.png',
    prospects: ['Software Developer', 'Web Developer', 'Database Administrator', 'QA Engineer']
  },
  {
    id: '3',
    name: 'Multimedia',
    description: 'Program yang mempelajari tentang desain grafis, animasi, editing video, dan produksi konten digital.',
    skills: ['Graphic Design', 'Animation', 'Video Editing', 'Digital Marketing'],
    image: '/lovable-uploads/dd215b4c-67a6-49e0-a4f9-0b5b40ae757e.jpg',
    prospects: ['Graphic Designer', 'Animator', 'Video Editor', 'Content Creator']
  },
  {
    id: '4',
    name: 'Teknik Elektronika',
    description: 'Program yang mempelajari tentang rangkaian elektronika, mikrokontroler, robotika, dan sistem otomasi.',
    skills: ['Electronics', 'Microcontroller', 'Robotics', 'Automation'],
    image: '/lovable-uploads/f80cfd6d-02d6-4eb0-87f9-8098e1f98c56.png',
    prospects: ['Electronics Technician', 'Robotics Engineer', 'IoT Developer', 'Automation Specialist']
  },
  {
    id: '5',
    name: 'Akuntansi',
    description: 'Program yang mempelajari tentang pembukuan, perpajakan, audit keuangan, dan aplikasi akuntansi.',
    skills: ['Accounting', 'Taxation', 'Auditing', 'Financial Analysis'],
    image: '/lovable-uploads/24659fba-05c4-4437-9fc8-aaa694a28a50.png',
    prospects: ['Accountant', 'Tax Consultant', 'Financial Auditor', 'Finance Staff']
  },
  {
    id: '6',
    name: 'Administrasi Perkantoran',
    description: 'Program yang mempelajari tentang manajemen kantor, korespondensi, kearsipan, dan administrasi bisnis.',
    skills: ['Office Management', 'Correspondence', 'Filing', 'Business Administration'],
    image: '/lovable-uploads/113dca04-6a33-4058-a2ba-d238187a8d97.jpg',
    prospects: ['Office Administrator', 'Secretary', 'Administrative Assistant', 'Office Manager']
  }
];

export type { Program };
