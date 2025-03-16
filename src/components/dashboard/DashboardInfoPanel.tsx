
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardInfoPanel = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Informasi PPDB
        </CardTitle>
        <CardDescription>
          Penerimaan Peserta Didik Baru SMKN 1 Kendal
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Tahapan Penjaringan Awal</h3>
            <p className="text-sm text-gray-600">
              Penjaringan awal ini bertujuan untuk mengumpulkan data calon peserta didik yang berminat mendaftar di SMKN 1 Kendal. Data ini akan digunakan untuk persiapan PPDB resmi yang akan dilaksanakan melalui sistem terpisah.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Jadwal Penting</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex justify-between">
                <span>Pembukaan Penjaringan Awal</span>
                <span className="font-medium">1 Januari 2024</span>
              </li>
              <li className="flex justify-between">
                <span>Penutupan Penjaringan Awal</span>
                <span className="font-medium">31 Maret 2024</span>
              </li>
              <li className="flex justify-between">
                <span>Pembukaan PPDB Resmi</span>
                <span className="font-medium">1 Juni 2024</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Informasi Kontak</h3>
            <p className="text-sm text-gray-600">
              Untuk informasi lebih lanjut, silakan hubungi panitia PPDB SMKN 1 Kendal melalui:
            </p>
            <ul className="text-sm text-gray-600 mt-2">
              <li>Email: ppdb@smkn1kendal.sch.id</li>
              <li>WhatsApp: 081234567890</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardInfoPanel;
