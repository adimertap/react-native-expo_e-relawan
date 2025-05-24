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
  created_at?: string;
  provinsi?: ProvinsiType;
  kabupaten?: KabupatenType;
}

export interface OrganisasiType {
  organisasi_id?: number;
  user_id?: number;
  kode_organisasi?: string;
  description?: string;
  tanggal_berdiri?: string;
  website_organisasi?: string;
  alamat?: string;
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