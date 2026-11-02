export interface DartChallenge {
  instruction: string;
  hint: string;
  starterCode: string;
  unlockCode: string;
  nextTopicId?: string;
  nextTopicTitle?: string;
}

export interface DartTopic {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Pemula' | 'Menengah';
  summary: string;
  conceptPoints: { title: string; explanation: string }[];
  dartCode: string;
  expectedOutput: string;
  keyProperties: { name: string; type: string; description: string }[];
  challenge: DartChallenge;
}

export const DART_TOPICS: DartTopic[] = [
  {
    id: 'dart-variables',
    title: 'Variabel, Tipe Data & Null Safety',
    subtitle: 'Fondasi penulisan tipe data statis dan keamanan nilai null di Dart',
    difficulty: 'Pemula',
    summary:
      'Dart adalah bahasa bertipe statis (statically typed) dengan type inference yang cerdas. Sejak Dart 2.12, sistem Sound Null Safety memastikan variabel tidak dapat bernilai null secara default kecuali dinyatakan secara eksplisit.',
    conceptPoints: [
      {
        title: 'Tipe Data Primitif',
        explanation:
          'Dart menyediakan tipe int, double, String, dan bool. Gunakan num jika suatu variabel dapat menampung int maupun double.',
      },
      {
        title: 'var vs final vs const',
        explanation:
          'var mengizinkan nilai diubah dengan tipe yang sama. final hanya bisa diisi satu kali saat runtime. const adalah konstanta tetap saat compile-time.',
      },
      {
        title: 'Sound Null Safety',
        explanation:
          'Tambahkan tanda tanya (?) pada tipe data untuk memperbolehkan null (contoh: String?). Gunakan operator ?? untuk memberikan nilai default fallback.',
      },
    ],
    keyProperties: [
      {
        name: 'Tipe Non-nullable',
        type: 'String name = "Budi"',
        description: 'Variabel wajib memiliki nilai dan tidak boleh null.',
      },
      {
        name: 'Tipe Nullable',
        type: 'String? nickname',
        description: 'Variabel diizinkan bernilai null.',
      },
      {
        name: 'Null-coalescing (??)',
        type: 'nickname ?? "Anonim"',
        description: 'Mengambil nilai fallback jika variabel bernilai null.',
      },
    ],
    dartCode: `void main() {
  // Variabel bertipe dasar
  String name = 'Siti Rahma';
  int age = 22;
  double score = 94.5;
  bool isEnrolled = true;

  // Null Safety
  String? bio; // Bernilai null secara aman
  String displayName = bio ?? 'Belum ada biodata.';

  print('Nama: $name');
  print('Umur: $age tahun');
  print('Skor: $score');
  print('Status: \${isEnrolled ? "Aktif" : "Non-aktif"}');
  print('Bio: $displayName');
}`,
    expectedOutput: `Nama: Siti Rahma
Umur: 22 tahun
Skor: 94.5
Status: Aktif
Bio: Belum ada biodata.`,
    challenge: {
      instruction:
        'Lengkapi fungsi void main() di bawah: deklarasikan variabel nama ("Siti Rahma"), umur (22), skor (94.5), status terdaftar (true), dan variabel nullable String? bio dengan fallback displayName menggunakan operator ?? bernilai "Belum ada biodata.". Cetak seluruhnya agar cocok dengan target output.',
      hint: 'Gunakan String name = "Siti Rahma";, int age = 22;, double score = 94.5;, bool isEnrolled = true;, String? bio;, dan bio ?? "Belum ada biodata.".',
      starterCode: `void main() {
  // 1. Tulis deklarasi variabel di bawah:
  // - name: String bernilai 'Siti Rahma'
  // - age: int bernilai 22
  // - score: double bernilai 94.5
  // - isEnrolled: bool bernilai true
  // - bio: String? (nullable, biarkan tanpa nilai awal / null)
  // - displayName: ambil dari bio ?? 'Belum ada biodata.'

  
  // 2. Cetak output menggunakan print() agar sesuai target output:

}`,
      unlockCode: 'FREE-DART-FUNC-201',
      nextTopicId: 'dart-functions',
      nextTopicTitle: 'Fungsi, Parameter & Arrow Syntax',
    },
  },
  {
    id: 'dart-functions',
    title: 'Fungsi, Parameter & Arrow Syntax',
    subtitle: 'Menulis fungsi modular dengan named parameters dan arrow syntax',
    difficulty: 'Pemula',
    summary:
      'Fungsi di Dart adalah objek kelas satu (first-class citizens) yang dapat disimpan dalam variabel atau diteruskan sebagai argumen. Dart mendukung positional parameters, named parameters, dan sintaks panah singkat (=>).',
    conceptPoints: [
      {
        title: 'Named Parameters ({})',
        explanation:
          'Membungkus parameter dalam kurung kurawal {} membuat pemanggilan fungsi menjadi sangat eksplisit dan mudah dibaca (pola standar yang digunakan di widget Flutter).',
      },
      {
        title: 'Kata Kunci required',
        explanation:
          'Menandai bahwa parameter bernama tersebut wajib diisi oleh pemanggil fungsi.',
      },
      {
        title: 'Arrow Syntax (=>)',
        explanation:
          'Shorthand untuk fungsi yang hanya memiliki satu ekspresi atau baris return tunggal.',
      },
    ],
    keyProperties: [
      {
        name: 'Named Params',
        type: '{required String title, int count = 0}',
        description: 'Parameter bernama dengan opsional nilai default.',
      },
      {
        name: 'Arrow Expression',
        type: 'int add(int a, int b) => a + b;',
        description: 'Sintaks satu baris untuk ekspresi fungsi.',
      },
    ],
    dartCode: `void main() {
  greetUser(name: 'Alexander', role: 'Mobile Developer');
  
  final area = calculateSquare(8);
  print('Luas persegi dengan sisi 8: $area');
}

// Named parameters dengan required dan default value
void greetUser({
  required String name,
  String role = 'Pelajar',
}) {
  print('Halo, $name! Anda login sebagai: $role');
}

// Arrow syntax singkat
int calculateSquare(int side) => side * side;`,
    expectedOutput: `Halo, Alexander! Anda login sebagai: Mobile Developer
Luas persegi dengan sisi 8: 64`,
    challenge: {
      instruction:
        'Buat fungsi greetUser dengan named parameters ({required String name, String role = "Pelajar"}), dan fungsi arrow calculateSquare(int side) => side * side. Panggil kedua fungsi di main() sesuai nilai target output.',
      hint: 'Perhatikan sintaks kurung kurawal pada parameter greetUser({required String name, String role = "Pelajar"}) dan operator arrow =>.',
      starterCode: `void main() {
  // TODO 1: Panggil fungsi greetUser dengan name: 'Alexander' dan role: 'Mobile Developer'


  // TODO 2: Panggil calculateSquare(8) dan cetak hasilnya:

}

// TODO 3: Tulis fungsi greetUser dengan named parameters di sini:


// TODO 4: Tulis fungsi arrow calculateSquare di sini:
`,
      unlockCode: 'FREE-DART-COLL-302',
      nextTopicId: 'dart-collections',
      nextTopicTitle: 'Collections: List, Set & Map',
    },
  },
  {
    id: 'dart-collections',
    title: 'Collections: List, Set & Map',
    subtitle: 'Struktur data utama untuk mengelola daftar dan pemetaan data di Dart',
    difficulty: 'Menengah',
    summary:
      'Dart memiliki dukungan bawaan yang sangat kaya untuk koleksi data: List (kumpulan terurut dengan indeks), Set (kumpulan elemen unik tanpa duplikat), dan Map (pasangan kunci-nilai key-value).',
    conceptPoints: [
      {
        title: 'List & Spread Operator (...)',
        explanation:
          'Spread operator (...) memungkinkan penyisipan elemen dari satu list ke list lain secara deklaratif.',
      },
      {
        title: 'Collection if & Collection for',
        explanation:
          'Dart memungkinkan penggunaan if dan for langsung di dalam pembuatan literal koleksi.',
      },
      {
        title: 'Higher-Order Methods',
        explanation:
          'Metode seperti map(), where() (filter), dan reduce() memudahkan manipulasi data secara fungsional.',
      },
    ],
    keyProperties: [
      {
        name: 'List<T>',
        type: '["Item 1", "Item 2"]',
        description: 'Koleksi terurut berbasis indeks.',
      },
      {
        name: 'Map<K, V>',
        type: '{"key": "value"}',
        description: 'Pemetaan key-value unik.',
      },
    ],
    dartCode: `void main() {
  final List<String> frameworks = ['Flutter', 'React', 'Vue'];
  frameworks.add('Svelte');

  final Map<String, dynamic> user = {
    'username': 'free_coder',
    'expYears': 3,
    'skills': frameworks,
  };

  print('Pengguna: \${user["username"]}');
  print('Daftar Skill: \${frameworks.join(", ")}');

  final longNames = frameworks.where((f) => f.length > 5).toList();
  print('Framework dengan nama > 5 huruf: \${longNames.join(", ")}');
}`,
    expectedOutput: `Pengguna: free_coder
Daftar Skill: Flutter, React, Vue, Svelte
Framework dengan nama > 5 huruf: Flutter, Svelte`,
    challenge: {
      instruction:
        'Buat List<String> frameworks berisi "Flutter", "React", "Vue", lalu tambahkan "Svelte" dengan method .add(). Buat Map user dengan username "free_coder" dan filter framework yang panjang namanya > 5 huruf dengan .where().',
      hint: 'Gunakan frameworks.add("Svelte"), lalu gunakan frameworks.where((f) => f.length > 5).toList().',
      starterCode: `void main() {
  // TODO 1: Buat List<String> frameworks dan tambahkan 'Svelte'


  // TODO 2: Buat Map<String, dynamic> user


  // TODO 3: Cetak Pengguna dan Daftar Skill


  // TODO 4: Filter framework dengan nama > 5 huruf via .where() dan cetak hasilnya

}`,
      unlockCode: 'FREE-DART-OOP-403',
      nextTopicId: 'dart-oop',
      nextTopicTitle: 'OOP: Kelas, Konstruktor & Enkapsulasi',
    },
  },
  {
    id: 'dart-oop',
    title: 'OOP: Kelas, Konstruktor & Enkapsulasi',
    subtitle: 'Pemrograman Berorientasi Objek untuk fondasi pembuatan widget kustom',
    difficulty: 'Menengah',
    summary:
      'Semua objek di Dart adalah turunan dari kelas Object. Pemahaman OOP Dart (Constructor, Getters/Setters, Inheritance, dan Mixins) sangat penting untuk memahami arsitektur widget Flutter.',
    conceptPoints: [
      {
        title: 'Generative Constructor',
        explanation:
          'Dart menyediakan sintaks ringkas this.property langsung pada deklarasi konstruktor.',
      },
      {
        title: 'Enkapsulasi Privat (_)',
        explanation:
          'Di Dart, tidak ada kata kunci private/public. Awalan garis bawah (_) membuat variabel atau method bersifat privat pada level library/file.',
      },
      {
        title: 'Inheritance & Override',
        explanation:
          'Menggunakan kata kunci extends dan anotasi @override untuk mengkhususkan perilaku kelas induk.',
      },
    ],
    keyProperties: [
      {
        name: 'Constructor initializing formals',
        type: 'Student({required this.name, required this.id});',
        description: 'Inisialisasi properti secara langsung dan ringkas.',
      },
      {
        name: 'Privat identifier',
        type: 'int _secretScore = 100;',
        description: 'Terkunci hanya untuk file lokal.',
      },
    ],
    dartCode: `class Developer {
  final String name;
  final String specialty;
  int _completedProjects;

  Developer({
    required this.name,
    required this.specialty,
    int initialProjects = 0,
  }) : _completedProjects = initialProjects;

  void completeProject(String projectName) {
    _completedProjects++;
    print('$name berhasil menyelesaikan proyek: $projectName');
  }

  int get totalProjects => _completedProjects;
}

void main() {
  final dev = Developer(name: 'Ahmad Fauzi', specialty: 'Flutter Mobile');
  dev.completeProject('Aplikasi E-Commerce');
  dev.completeProject('Platform Belajar Koding');

  print('Spesialisasi: \${dev.specialty}');
  print('Total Proyek Selesai: \${dev.totalProjects}');
}`,
    expectedOutput: `Ahmad Fauzi berhasil menyelesaikan proyek: Aplikasi E-Commerce
Ahmad Fauzi berhasil menyelesaikan proyek: Platform Belajar Koding
Spesialisasi: Flutter Mobile
Total Proyek Selesai: 2`,
    challenge: {
      instruction:
        'Lengkapi kelas Developer dengan properti name, specialty, dan privat _completedProjects. Buat method completeProject(String projectName) dan getter totalProjects. Di main(), buat developer "Ahmad Fauzi" (Flutter Mobile) dan selesaikan dua proyek.',
      hint: 'Ingat bahwa properti privat di Dart diawali garis bawah (_completedProjects) dan getter ditulis dengan get totalProjects => ...',
      starterCode: `class Developer {
  final String name;
  final String specialty;
  int _completedProjects;

  // TODO 1: Buat konstruktor Developer dengan named parameters required:


  // TODO 2: Buat method completeProject(String projectName) yang menaikkan _completedProjects:


  // TODO 3: Buat getter totalProjects:

}

void main() {
  // TODO 4: Buat objek dev, selesaikan 2 proyek, dan cetak spesialisasi serta total proyek:

}`,
      unlockCode: 'FREE-DART-ASYNC-504',
      nextTopicId: 'dart-async',
      nextTopicTitle: 'Asynchronous: Future, Async & Await',
    },
  },
  {
    id: 'dart-async',
    title: 'Asynchronous: Future, Async & Await',
    subtitle: 'Menangani proses latar belakang, pemanggilan API, dan delay data',
    difficulty: 'Menengah',
    summary:
      'Dart beroperasi secara single-threaded dengan Event Loop. Operasi yang memakan waktu (seperti membaca disk atau HTTP request) dijalankan secara asynchronous menggunakan kelas Future bersama async dan await.',
    conceptPoints: [
      {
        title: 'Objek Future',
        explanation:
          'Mewakili nilai potensial atau error yang baru akan tersedia di masa mendatang.',
      },
      {
        title: 'async & await',
        explanation:
          'Membuat alur penulisan kode asinkron tampak bersih dan berurutan layaknya kode sinkron biasa.',
      },
      {
        title: 'try-catch untuk Error Handling',
        explanation:
          'Menangkap potensi error dari jaringan atau proses asynchronous secara aman.',
      },
    ],
    keyProperties: [
      {
        name: 'Future<T>',
        type: 'Future<String> fetchData()',
        description: 'Janji data tipe T yang selesai di kemudian waktu.',
      },
      {
        name: 'await',
        type: 'final data = await fetchData();',
        description: 'Menunggu penyelesaian Future tanpa memblokir thread UI.',
      },
    ],
    dartCode: `Future<String> fetchUserData() async {
  // Simulasi penundaan jaringan 1 detik
  await Future.delayed(const Duration(milliseconds: 500));
  return 'Data Pengguna: Budi Santoso (Status: Verified)';
}

void main() async {
  print('1. Mengirim permintaan data ke server...');
  
  try {
    final result = await fetchUserData();
    print('2. Hasil diterima: $result');
  } catch (e) {
    print('Gagal mengambil data: $e');
  }

  print('3. Selesai memproses seluruh alur.');
}`,
    expectedOutput: `1. Mengirim permintaan data ke server...
2. Hasil diterima: Data Pengguna: Budi Santoso (Status: Verified)
3. Selesai memproses seluruh alur.`,
    challenge: {
      instruction:
        'Tulis fungsi asynchronous fetchUserData() yang mengembalikan Future<String> bernilai "Data Pengguna: Budi Santoso (Status: Verified)". Di dalam void main() async, panggil fungsi tersebut menggunakan await di dalam blok try-catch.',
      hint: 'Gunakan Future<String> fetchUserData() async dan await fetchUserData() di dalam blok try { ... }.',
      starterCode: `// TODO 1: Tulis fungsi asynchronous fetchUserData() di sini:



void main() async {
  print('1. Mengirim permintaan data ke server...');
  
  // TODO 2: Panggil fetchUserData() dengan await di dalam try-catch dan cetak hasilnya:


  print('3. Selesai memproses seluruh alur.');
}`,
      unlockCode: 'FREE-FLUTTER-UNLOCKED-99',
      nextTopicTitle: 'Jalur Flutter & Mobile UI (Lengkap)',
    },
  },
];
