export type Person = { nama: string; prodi: string; angkatan: string; foto?: string | null };
export type Jabatan = Person & { jabatan: string };
 
// Contoh hasil: "S1 Matematika '23". Ubah awalan "S1" di sini kalau ada yang bukan S1.
export const labelProdi = (p: Person): string => `S1 ${p.prodi} '${p.angkatan}`;
 
export const pengurusHarian: Jabatan[] = [
  { jabatan: "Gubernur", nama: "Ronaldo Situmorang", prodi: "Matematika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866474/Ronaldo-Situmorang.jpg" },
  { jabatan: "Wakil Gubernur", nama: "Fauzan Febriyanto", prodi: "Fisika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866474/Fauzan-Febriyanto.jpg"  },
  { jabatan: "Sekretaris Jenderal", nama: "Sabrina Fatmawati", prodi: "Kimia", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866474/Sabrina-Fatmawati.jpg"  },
];
 
// Tingkat 2: Biro Kesekretariatan & Biro Kebendaharaan (satu section di halaman)
export const biroKesekretariatanKebendaharaan: Jabatan[] = [
  { jabatan: "Sekretaris 1", nama: "Alzyra Latifa Dwisma Putri", prodi: "Matematika", angkatan: "25",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/alzyra.jpg"  },
  { jabatan: "Sekretaris 2", nama: "Nofiansyah Zain Yazif", prodi: "Matematika", angkatan: "25",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/nofiansyah.jpg"  },
  { jabatan: "Bendahara 1", nama: "Karina Atha Najmi", prodi: "Matematika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866889/karina.jpg"  },
  { jabatan: "Bendahara 2", nama: "Delia Eka Nuraini", prodi: "Matematika", angkatan: "25",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866889/delia.jpg"  },
];
 
// Biro Pusat Jaminan Mutu Organisasi (PJMO)
export const biroPjmo: Jabatan[] = [
  { jabatan: "Kepala Biro", nama: "Haris Tata Kirana Yusfiansyah", prodi: "Fisika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/haris.jpg"  },
  { jabatan: "Wakil Kepala Biro", nama: "Herlyna Fitriyani", prodi: "Fisika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/herlyna.jpg"  },
  { jabatan: "Sekretaris Biro", nama: "Galuh Pradiptya Apriyant", prodi: "Fisika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/galuh.jpg"  },
  { jabatan: "Staff Biro", nama: "Wiji Lestari", prodi: "Matematika", angkatan: "25",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866890/wiji.jpg"  },
  { jabatan: "Staff Biro", nama: "Diva Felisa Alia Putri", prodi: "Fisika", angkatan: "25",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866889/diva.jpg"  },
];
 
// Tingkat 3: Koordinator Bidang (urutan tampil sesuai desain)
export const koordinatorBidang: Jabatan[] = [
  { jabatan: "K. Bidang Internal", nama: "Ricky Bintang Zakaria", prodi: "Matematika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867064/bintang.jpg"  },
  { jabatan: "K. Bidang Eksternal", nama: "Arby Baligh Andian Alfarizi", prodi: "Biologi", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867063/arby.jpg"  },
  { jabatan: "K. Bidang Akselerasi Keilmuan dan Karir", nama: "Candra Risqi Rahmadani", prodi: "IPA dan Lingkungan", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867064/candra.heic"  },
  { jabatan: "K. Bidang Kemahasiswaan", nama: "Fina Lugita", prodi: "Kimia", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867095/fina.jpg"  },
  { jabatan: "K. Bidang Pergerakan", nama: "Fauzi Helmi Romadhon", prodi: "IPA dan Lingkungan", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867064/fauzi.jpg"  },
  { jabatan: "K. Bidang Sosial Lingkungan", nama: "Rendy Malandi", prodi: "Matematika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793867095/rendy.jpg"  },
];
 
// Kepala Departemen, kunci = slug di tabel departments
export const kepalaDepartemen: Record<string, Person> = {
  adkesma: { nama: "Inayatul Isnaeni", prodi: "Biologi", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/inayatul.jpg"  },
  ekokraf: { nama: "Daffa' Akma Assadaad", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899705/daffa.jpg"  },
  pkskm: { nama: "Nadhifa Rayya Fahrozi", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/nadhifa.jpg"  },
  harkam: { nama: "Yaumulana Rizky Zadin", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899705/maul.jpg"  },
  kpsdm: { nama: "Arina Septi Aprilia", prodi: "Biologi", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899705/arina.jpg"  },
  soraya: { nama: "Fatma", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/fatma.jpg"  },
  menfo: { nama: "Muhammad Raja Fahada", prodi: "Ilmu Komputer", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899708/raja.jpg"  },
  relstrat: { nama: "Mada Hatma Wijaya", prodi: "IPA dan Lingkungan", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899709/mada.heic"  },
  preskel: { nama: "Enrico Widiansyah", prodi: "Ilmu Komputer", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899705/enrico.jpg"  },
  kalma: { nama: "Fahsa Mayrazzaq Putra", prodi: "Matematika", angkatan: "23",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899705/fahsa.jpg"  },
  sosmas: { nama: "Disa Nastha Gesiya", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899707/disa.jpg"  },
  lh: { nama: "Umar Alfaruq", prodi: "IPA dan Lingkungan", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/umar.jpg"  },
  kastrat: { nama: "Muhammad Faza Al Fath", prodi: "Matematika", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/faza.jpg"  },
  akmedpro: { nama: "Kemal Maulana", prodi: "IPA dan Lingkungan", angkatan: "24",
     foto: "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793899706/kemal.jpg"  },
};
 
// Bagan "Peta Alur Komando": bidang -> departemen (slug dipakai untuk link ke /struktur/[slug])
export const bagan = {
  pimpinan: { tertinggi: "Gubernur Mahasiswa", pendamping: "Wakil Gubernur Mahasiswa", koordinasi: "Sekretaris Jenderal" },
  biro: [
    { peran: "Manajemen Dana", nama: "Biro Keuangan" },
    { peran: "Tata Kelola Surat", nama: "Biro Kesekretariatan" },
    { peran: "Mutu & Evaluasi", nama: "Biro PJMO" },
  ],
  bidang: [
    { kode: "Bidang I", koordinator: "Koord. Kemahasiswaan", departemen: [{ slug: "adkesma", label: "Adkesma" }, { slug: "ekokraf", label: "Ekokraf" }, { slug: "pkskm", label: "PKSKM" }] },
    { kode: "Bidang II", koordinator: "Koord. Internal", departemen: [{ slug: "harkam", label: "Harkam" }, { slug: "kpsdm", label: "KPSDM" }, { slug: "soraya", label: "Soraya" }] },
    { kode: "Bidang III", koordinator: "Koord. Eksternal", departemen: [{ slug: "menfo", label: "Menfo" }, { slug: "relstrat", label: "Relstrat" }] },
    { kode: "Bidang IV", koordinator: "Koord. Aksela", departemen: [{ slug: "preskel", label: "Preskel" }, { slug: "kalma", label: "Kalma" }] },
    { kode: "Bidang V", koordinator: "Koord. Sosling", departemen: [{ slug: "sosmas", label: "Sosmas" }, { slug: "lh", label: "LH" }] },
    { kode: "Bidang VI", koordinator: "Koord. Pergerakan", departemen: [{ slug: "kastrat", label: "Kastrat" }, { slug: "akmedpro", label: "Akmedpro" }] },
  ],
};