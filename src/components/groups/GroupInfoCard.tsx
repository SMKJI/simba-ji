
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GroupInfoCard = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Informasi Penting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-1">Perhatian</h3>
            <p className="text-sm text-yellow-700">
              Pastikan Anda menggunakan nomor yang terdaftar saat pendaftaran untuk bergabung ke grup WhatsApp. Admin akan memverifikasi nomor Anda.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-1">Tata Tertib Grup</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
              <li>Gunakan bahasa yang sopan dan santun</li>
              <li>Dilarang mengirim pesan yang tidak berkaitan dengan PPDB</li>
              <li>Sampaikan pertanyaan dengan jelas dan ringkas</li>
              <li>Hormati semua anggota grup</li>
              <li>Jangan mengirim pesan di luar jam operasional (08.00 - 16.00)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInfoCard;
