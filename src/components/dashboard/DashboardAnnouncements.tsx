
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardAnnouncements = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Pengumuman Terbaru
        </CardTitle>
        <CardDescription>
          Informasi terbaru tentang proses penjaringan awal calon murid baru
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Pembukaan Penjaringan Awal PPDB</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Baru</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              SMKN 1 Kendal telah membuka penjaringan awal calon peserta didik baru untuk tahun ajaran 2024/2025. Penjaringan ini bertujuan untuk mempersiapkan data calon siswa sebelum PPDB resmi dibuka.
            </p>
            <p className="text-xs text-gray-500">Diposting: 1 Januari 2024</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">Informasi Program Keahlian</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              SMKN 1 Kendal menawarkan berbagai program keahlian yang dapat dipilih oleh calon peserta didik baru. Silakan lihat detail program keahlian pada halaman Informasi PPDB.
            </p>
            <p className="text-xs text-gray-500">Diposting: 5 Januari 2024</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnnouncements;
