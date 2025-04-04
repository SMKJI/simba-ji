
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-gray-600">
            Temukan jawaban untuk pertanyaan umum seputar penjaringan awal calon murid baru SMKN 1 Kendal
          </p>
        </div>
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              FAQ Penjaringan Awal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  Apa perbedaan penjaringan awal dengan SPMB resmi?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Penjaringan awal adalah tahap pengumpulan data calon murid yang berminat mendaftar di SMKN 1 Kendal. 
                  Data ini akan digunakan untuk persiapan SPMB resmi yang akan dilaksanakan melalui sistem terpisah. 
                  Penjaringan awal tidak menentukan penerimaan murid, melainkan hanya untuk pendataan dan pemberian informasi awal.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Apakah saya perlu mengunggah dokumen saat penjaringan awal?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Tidak, pada tahap penjaringan awal ini Anda tidak perlu mengunggah dokumen apapun. 
                  Anda hanya perlu mengisi formulir data diri secara lengkap. Dokumen-dokumen pendukung 
                  akan diminta saat SPMB resmi dibuka.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Bagaimana cara bergabung dengan grup WhatsApp?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Setelah mengisi formulir pendaftaran, Anda akan otomatis diarahkan ke halaman yang berisi 
                  link grup WhatsApp. Anda dapat langsung mengklik tombol "Gabung Grup WhatsApp Sekarang" 
                  atau menyalin link tersebut dan membukanya di aplikasi WhatsApp Anda.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  Kapan SPMB resmi akan dibuka?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  SPMB resmi SMKN 1 Kendal untuk tahun ajaran 2024/2025 akan dibuka pada tanggal 1 Juni 2024. 
                  Informasi lebih lanjut akan diumumkan melalui website resmi sekolah dan grup WhatsApp.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  Apa saja program keahlian yang tersedia di SMKN 1 Kendal?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  SMKN 1 Kendal menawarkan beberapa program keahlian, di antaranya:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Teknik Komputer dan Jaringan (TKJ)</li>
                    <li>Rekayasa Perangkat Lunak (RPL)</li>
                    <li>Multimedia (MM)</li>
                    <li>Akuntansi dan Keuangan Lembaga (AKL)</li>
                    <li>Otomatisasi dan Tata Kelola Perkantoran (OTKP)</li>
                    <li>Bisnis Daring dan Pemasaran (BDP)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  Apa yang harus saya lakukan setelah mengisi formulir penjaringan awal?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Setelah mengisi formulir penjaringan awal, Anda perlu bergabung dengan grup WhatsApp yang 
                  telah ditentukan. Melalui grup tersebut, Anda akan mendapatkan informasi terbaru seputar 
                  SPMB SMKN 1 Kendal dan langkah-langkah selanjutnya yang perlu Anda lakukan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FAQ;
