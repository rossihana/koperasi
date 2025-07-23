# Use Case Diagram Sistem Koperasi

```
@startuml
skinparam packageStyle rectangle
skinparam usecaseStyle roundbox
skinparam actorStyle hollow
left to right direction

!define LIGHTBLUE
!define LIGHTRED

actor Anggota as member
actor Admin as admin

rectangle "Sistem Koperasi" {
    package "Manajemen Profil" {
        usecase "Lihat Profil" as UC3
        usecase "Update Profil" as UC4
    }

    package "Manajemen Piutang" {
        usecase "Lihat Riwayat\nPiutang" as UC12
        usecase "Ajukan Pinjaman" as UC9
        usecase "Lihat Status\nPinjaman" as UC11
        usecase "Bayar Angsuran" as UC10
    }

    package "Autentikasi" {
        usecase "Login" as UC1
        usecase "Logout" as UC2
    }

    package "Manajemen Simpanan" {
        usecase "Lihat Riwayat\nSimpanan" as UC8
        usecase "Setor Simpanan" as UC5
        usecase "Lihat Saldo\nSimpanan" as UC7
        usecase "Tarik Simpanan\nSukarela" as UC6
    }

    package "Administrasi" {
        usecase "Kelola Anggota" as UC13
        usecase "Generate Laporan" as UC16
        usecase "Proses Transaksi\nSimpanan" as UC14
        usecase "Proses Transaksi\nPiutang" as UC15
    }
}

' Relasi Anggota ke Use Cases
member --> UC1
member --> UC2
member --> UC3
member --> UC4
member --> UC7
member --> UC8
member --> UC9
member --> UC11
member --> UC12

' Relasi Admin ke Use Cases
UC1 <-- admin
UC2 <-- admin
UC13 <-- admin
UC14 <-- admin
UC15 <-- admin
UC16 <-- admin
UC5 <-- admin
UC6 <-- admin
UC10 <-- admin

' Relasi Include dengan garis putus-putus
UC5 ..> UC7 : <<include>>
UC6 ..> UC7 : <<include>>
UC9 ..> UC11 : <<include>>
UC10 ..> UC11 : <<include>>

' Relasi Extend dengan garis putus-putus
UC14 ..> UC8 : <<extend>>
UC15 ..> UC12 : <<extend>>

@enduml

```
```

## Deskripsi Use Case

### 1. Autentikasi
- **Login**: Proses autentikasi untuk masuk ke sistem
- **Logout**: Proses keluar dari sistem

### 2. Manajemen Profil
- **Lihat Profil**: Melihat detail informasi profil
- **Update Profil**: Mengubah data profil

### 3. Manajemen Simpanan
- **Setor Simpanan**: Melakukan setoran (pokok, wajib, sukarela, hari raya)
- **Tarik Simpanan Sukarela**: Melakukan penarikan simpanan sukarela
- **Lihat Saldo Simpanan**: Melihat saldo semua jenis simpanan
- **Lihat Riwayat Simpanan**: Melihat history transaksi simpanan

### 4. Manajemen Piutang
- **Ajukan Pinjaman**: Mengajukan permohonan pinjaman baru
- **Bayar Angsuran**: Melakukan pembayaran angsuran pinjaman
- **Lihat Status Pinjaman**: Melihat status pinjaman aktif
- **Lihat Riwayat Piutang**: Melihat history transaksi piutang

### 5. Administrasi
- **Kelola Anggota**: Mengelola data anggota koperasi
- **Proses Transaksi Simpanan**: Memproses transaksi simpanan anggota
- **Proses Transaksi Piutang**: Memproses transaksi piutang anggota
- **Generate Laporan**: Membuat laporan keuangan dan transaksi

## Hubungan Antar Use Case

### Include Relationships
- Setor dan Tarik Simpanan include Lihat Saldo (untuk validasi)
- Ajukan Pinjaman dan Bayar Angsuran include Lihat Status Pinjaman (untuk validasi)

### Extend Relationships
- Proses Transaksi Simpanan extend Lihat Riwayat Simpanan (menambah riwayat baru)
- Proses Transaksi Piutang extend Lihat Riwayat Piutang (menambah riwayat baru)

## Aktor dan Hak Akses

### Anggota
- Dapat mengakses fitur-fitur dasar untuk mengelola simpanan dan piutang pribadi
- Melihat riwayat dan status transaksi pribadi
- Mengelola profil pribadi

### Admin
- Memiliki semua akses Anggota
- Dapat mengelola data anggota
- Memproses transaksi simpanan dan piutang
- Membuat laporan
