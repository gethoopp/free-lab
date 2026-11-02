# DESIGN.md: FreeLab Design System & Direction

> **Design Direction for FreeLab: Dart & Flutter Interactive Learning Platform**
> Mode: antislop DURING.
> Dials: `ENERGY 2 / RHYTHM 2 / MOTION 2`

---

## 1. Product Identity & Purpose
- **Product Name**: FreeLab (Platform Pembelajaran Interaktif Dart & Flutter)
- **Target Audience**: Mahasiswa, developer pemula, dan mobile engineer yang ingin memahami konsep widget Flutter secara visual dan langsung bereksperimen.
- **Mood / Character**: Artisanal technical workshop / modern IDE studio. Bersih, presisi, fokus pada konten kode dan preview mobile yang nyata. Bukan landing page marketing generik; ini adalah alat pembelajaran langsung (direct developer tool).

---

## 2. Liveliness Dials & Rationale
- **ENERGY: 2 (Balanced)**
  - Tampilan tenang namun berkarakter, kontras tajam antar panel tanpa visual noise yang mengganggu konsentrasi belajar.
- **RHYTHM: 2 (Structured with Functional Breaks)**
  - Tata letak dua panel terbagi (Curriculum & Code di kiri, Live Phone Emulator di kanan) dengan transisi mulus saat berpindah konsep atau beralih ke Widget Tree Inspector.
- **MOTION: 2 (Interactive Feedback & Transitions)**
  - Micro-interactions terarah: pergantian tab materi, tap feedback pada tombol emulator, toggle status, dan animasi render dinamis yang membantu pemahaman hierarki widget. Tidak ada animasi looping tak berujung (R-19).

---

## 3. Strict Color Palette (2-3 Core + 1 Deliberate Accent)
Sesuai aturan R-29 dan R-01, palet dibatasi secara ketat tanpa gradien ungu-biru generic:

### Dark Mode (Railway-Inspired Industrial Studio)
- **Base Canvas**: `#08070C` (Deep Railway Obsidian)
- **Surface / Card / Bezel**: `#12101B` (Crisp Matte Obsidian Card) dengan 1px border `#221F33`
- **Text Primary**: `#FFFFFF` / `#F3F4F6` (High contrast, WCAG AAA compliant)
- **Text Secondary / Muted**: `#8E8C9A` (Subdued neutral lavender-tinted grey)
- **Deliberate Accent**: `#7C3AED` / `#A78BFA` (Railway Signature Violet): *hanya untuk state aktif, indikator tab terseleksi, dan tombol aksi utama.*

### Light Mode (Clean Documentation Experience)
- **Base Canvas**: `#F8FAFC` (Crisp Off-White)
- **Surface / Card / Bezel**: `#FFFFFF` dengan 1px border `#E2E8F0`
- **Text Primary**: `#0F172A`
- **Text Secondary / Muted**: `#64748B`
- **Deliberate Accent**: `#0284C7` (Flutter Deep Blue)

---

## 4. Typography System (R-06)
- **UI & Content**: `Open Sans` (`'Open Sans'`, `system-ui`, `-apple-system`, `sans-serif`) untuk keterbacaan tinggi dan keramahan visual materi edukasi.
- **Code & Syntax**: Monospace Stack (`JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`) untuk kode Dart dan parameter widget.
- **Hierarchy**:
  - H1 Topic: 24px - 28px, Semibold, tight tracking.
  - H2 Sub-section: 18px - 20px, Medium.
  - Body Text: 14px - 15px, Regular, leading 1.6.
  - Code Block: 13px - 14px, leading 1.5.

---

## 5. Anti-Slop Safeguards & Craftsmanship Checklist
1. **R-01 & R-13**: Tidak ada full-page colored glow background atau neon purple orb.
2. **R-05**: Layout dirancang khusus untuk split-screen IDE & Mobile Emulator; bukan AI bento-grid atau template 3 kartu.
3. **R-09**: Bebas badge hampa "AI-Powered" / "Next-Gen". Semua label menunjukkan tipe widget nyata (`Layout`, `State`, `Input`, `Basic`).
4. **R-17 & R-18**: Tidak ada statistik palsu atau ulasan fiktif.
5. **R-21 & R-34**: Light/Dark theme toggle wajib berfungsi penuh tanpa merusak warna atau kontras.
6. **R-26**: Setiap kontrol interaktif (klik widget, ganti parameter, tap tombol di emulator, switch) harus memiliki fungsionalitas nyata.
7. **R-39**: Semua elemen interaktif memiliki `cursor: pointer`, outline focus yang jelas untuk navigasi keyboard, dan nama aksesibel.
