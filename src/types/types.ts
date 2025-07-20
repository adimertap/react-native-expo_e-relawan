export interface ProvinsiType {
  provinsi_id: number;
  provinsi: string;
}

export interface KabupatenType {
  kabupaten_id: number;
  provinsi_id?: number;
  kabupaten: string;
}

export interface UserType {
  user_id?: number;
  provinsi_id?: number;
  kabupaten_id?: number;
  nama: string;
  email: string;
  password: string;
  role?: string;
  jenis_kelamin?: string;
  phone?: string;
  alamat?: string;
  tanggal_lahir?: string;
  active?: string;
  profesi?: string;
  photo?: string;
  apk_version?: string;
  avg_rating?: number;
  gol_darah?: string;
  umur?: number;
  created_at?: string;
  provinsi?: ProvinsiType;
  kabupaten?: KabupatenType;
  subs_kegiatan? :SubsKegiatanType[];
}

export interface OrganisasiType {
  organisasi_id?: number;
  user_id?: number;
  kode_organisasi?: string;
  description?: string;
  tanggal_berdiri?: string;
  website_organisasi?: string;
  alamat?: string;
  dokumen_pendukung?: string;
  is_verified?: string;
  verified_at?: string;
  active?: string;
  created_at?: string;
  user?: UserType;
}

export interface OrganisasiRegistrationType extends Omit<UserType, 'user_id' | 'role' | 'active' | 'created_at'> {
  website_organisasi?: string;
  description?: string;
  tanggal_berdiri?: string;
}

export interface TopicType {
  topic_id?: number;
  topic_nama?: string;
  deskripsi?: string;
  active?: string;
}

export interface JenisKegiatanType {
  jenis_kegiatan_id?: number;
  jenis_kegiatan?: string;
  active?: string;
}

export interface KegiatanType {
  kegiatan_id?: number;
  nama_kegiatan?: string;
  deskripsi_kegiatan?: string;
  user_id?: number;
  topic_id?: number;
  jenis_kegiatan_id?: number;
  provinsi_id?: number;
  kabupaten_id?: number;
  start_date?: string;
  end_date?: string;
  deadline?: string;
  image?: string;
  location?: string;
  relawan_dibutuhkan?: string;
  total_jam_kerja?: string;
  tugas_relawan?: string;
  kriteria_relawan?: string;
  active?: string;
  reject_note?: string;
  status?: string;
  is_verified?: string;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
  user?: UserType;
  topic?: TopicType;
  perlu_pertanyaan?: string;
  dokumen_pendukung?: string;
  jenis_kegiatan?: JenisKegiatanType;
  provinsi?: ProvinsiType;
  kabupaten?: KabupatenType;
  subs_kegiatan?: SubsKegiatanType[];
}

export interface SubsKegiatanType {
  subs_kegiatan_id?: number;
  user_id?: number;
  kegiatan_id?: number;
  active?: string;
  status_kegiatan?: string;
  is_verified?: string;
  verified_at?: string;
  about_me?: string;
  user_cv?: string;
  user?: UserType;
  kegiatan?: KegiatanType;
  created_at?: string;
  rating?: number;
  review?: string;
  rating_for_user?: number;
  review_for_user?: string;
}

export interface NotifikasiType {
  notifikasi_id?: number;
  jenis?:string;
  user_id?: number;
  subject?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
  sent_status?: string;
  user?: UserType;
}