
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Bagaimana cara mendaftar di SMKN 1 Kendal?",
      answer:
        "Pendaftaran calon murid baru SMKN 1 Kendal dilakukan melalui sistem online pada website ini. Isi formulir dengan data yang valid, lalu Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran Anda. Pastikan data yang diinput sudah benar karena akan digunakan untuk proses selanjutnya.",
    },
    {
      question: "Apakah sistem ini sudah resmi untuk penerimaan siswa baru?",
      answer:
        "Sistem ini hanya merupakan penjaringan awal calon murid baru, bukan sistem penerimaan resmi. Setelah mendaftar di sistem ini, Anda akan mendapatkan informasi lengkap tentang proses seleksi resmi melalui grup WhatsApp yang telah ditentukan.",
    },
    {
      question: "Apa saja persyaratan umum untuk mendaftar?",
      answer:
        "Persyaratan umum meliputi: Lulusan SMP/MTs/sederajat atau yang akan lulus tahun ini, usia maksimal 21 tahun, dan memiliki SKHUN/ijazah atau surat keterangan lulus. Dokumen fisik akan dikumpulkan pada tahap selanjutnya setelah penjaringan awal.",
    },
    {
      question: "Bagaimana cara bergabung dengan grup WhatsApp?",
      answer:
        "Setelah berhasil mendaftar, Anda akan dialihkan ke halaman sukses yang berisi link grup WhatsApp sesuai urutan pendaftaran Anda. Anda bisa langsung mengklik link tersebut untuk bergabung dengan grup.",
    },
    {
      question: "Apakah saya bisa memilih grup WhatsApp sendiri?",
      answer:
        "Tidak, penentuan grup WhatsApp dilakukan secara otomatis oleh sistem berdasarkan urutan pendaftaran. Pendaftar ke-1 sampai ke-1000 akan diarahkan ke Grup 1, pendaftar ke-1001 sampai ke-2000 diarahkan ke Grup 2, dan seterusnya.",
    },
    {
      question: "Kapan batas waktu pendaftaran?",
      answer:
        "Batas waktu pendaftaran pada penjaringan awal adalah hingga kuota terpenuhi atau hingga pengumuman resmi dari pihak sekolah. Informasi lebih lanjut akan diumumkan melalui website resmi sekolah dan grup WhatsApp.",
    },
    {
      question: "Bagaimana jika saya mengalami kendala teknis saat mendaftar?",
      answer:
        "Jika mengalami kendala teknis, Anda dapat menghubungi helpdesk melalui fitur chat atau ticket system di halaman Helpdesk. Tim kami akan membantu Anda menyelesaikan masalah tersebut.",
    },
  ];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
