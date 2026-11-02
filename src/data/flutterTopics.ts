import type { FlutterTopic } from '../types/flutter';

export const FLUTTER_TOPICS: FlutterTopic[] = [
  {
    id: 'what-is-widget',
    title: 'Apa itu Widget?',
    subtitle: 'Konsep dasar deklaratif: "Everything is a Widget"',
    category: 'core',
    categoryLabel: 'Konsep Inti',
    difficulty: 'Pemula',
    summary:
      'Di Flutter, hampir setiap elemen visual dan tata letak adalah Widget. Tidak seperti platform lain yang membedakan views dan layout controllers, Flutter menyatukan semuanya ke dalam model komposisi pohon widget (Widget Tree).',
    conceptPoints: [
      {
        title: 'Komposisi Deklaratif',
        explanation:
          'Anda mendeskripsikan bagaimana tampilan UI berdasarkan state saat ini. Saat state berubah, Flutter membangun kembali (rebuild) deskripsi antarmuka secara efisien.',
      },
      {
        title: 'Semua Elemen adalah Widget',
        explanation:
          'Struktur halaman (Scaffold), elemen visual (Text, Image), layout (Row, Column, Center), hingga aspek dekorasi (Padding, Theme) semuanya merupakan widget.',
      },
      {
        title: 'Immutable & Ringan',
        explanation:
          'Objek widget bersifat immutable (konfigurasi tetap). Flutter menciptakan kembali instance widget baru dengan biaya komputasi yang sangat murah.',
      },
    ],
    keyProperties: [
      {
        name: 'key',
        type: 'Key?',
        description: 'Mengontrol bagaimana satu widget menggantikan widget lain di dalam pohon elemen.',
      },
      {
        name: 'child',
        type: 'Widget?',
        description: 'Widget tunggal yang dibungkus atau berada di dalam widget ini.',
      },
      {
        name: 'children',
        type: 'List<Widget>',
        description: 'Daftar banyak widget turunan (digunakan pada Row, Column, Stack, ListView).',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('FreeLab Demo'),
          backgroundColor: Colors.blueAccent,
        ),
        body: const Center(
          child: Text(
            'Halo! Semuanya di Flutter adalah Widget.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}`,
    treeData: {
      id: 'root-mat',
      name: 'MaterialApp',
      type: 'framework',
      description: 'Widget root aplikasi yang mengonfigurasi tema, navigasi, dan Material Design.',
      children: [
        {
          id: 'scaffold-1',
          name: 'Scaffold',
          type: 'framework',
          description: 'Kerangka visual Material Design standar yang menyediakan AppBar, Body, Drawer, dan FAB.',
          children: [
            {
              id: 'appbar-1',
              name: 'AppBar',
              type: 'layout',
              description: 'Bilah navigasi atas (top bar) untuk judul dan aksi layar.',
              children: [
                {
                  id: 'text-title',
                  name: 'Text ("FreeLab Demo")',
                  type: 'leaf',
                  description: 'Judul halaman aplikasi.',
                },
              ],
            },
            {
              id: 'center-1',
              name: 'Center',
              type: 'layout',
              description: 'Widget tata letak yang menempatkan child-nya tepat di tengah area yang tersedia.',
              children: [
                {
                  id: 'text-body',
                  name: 'Text ("Halo! Semuanya di Flutter...")',
                  type: 'component',
                  description: 'Widget teks visual utama yang menampilkan pesan pengenalan.',
                },
              ],
            },
          ],
        },
      ],
    },
    defaultParams: {
      containerColor: '#0284c7',
      containerRadius: 12,
      containerPadding: 16,
    },
    challenge: {
      instruction:
        'Lengkapi kode widget di bawah: tambahkan AppBar dengan judul "Halo Flutter", lalu di bagian body tambahkan widget Center dengan Text bertuliskan "Saya Belajar Widget di FreeLab", ukuran font 18 (fontSize: 18), dan warna Colors.blueAccent.',
      hint: 'Gunakan properti title: Text("Halo Flutter") pada AppBar, serta TextStyle(fontSize: 18, color: Colors.blueAccent) pada Text.',
      starterCode: `import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        // TODO 1: Tambahkan AppBar dengan judul Text('Halo Flutter'):


        // TODO 2: Tambahkan body Center dengan child Text('Saya Belajar Widget di FreeLab')
        // dan TextStyle(fontSize: 18, color: Colors.blueAccent):

      ),
    );
  }
}`,
      unlockCode: 'FREE-FLUTTER-STATE-101',
      nextTopicId: 'stateless-vs-stateful',
      nextTopicTitle: 'Stateless vs StatefulWidget',
      criteria: [
        {
          id: 'appbar-title',
          label: 'AppBar dengan judul Text("Halo Flutter")',
          description: 'Memiliki AppBar dengan title terdefinisi.',
        },
        {
          id: 'body-text',
          label: 'Body Center dengan Text("Saya Belajar Widget di FreeLab")',
          description: 'Memiliki Text di dalam Center.',
        },
        {
          id: 'text-style-size',
          label: 'fontSize dikonfigurasi 18',
          description: 'Memiliki TextStyle dengan fontSize 18.',
        },
        {
          id: 'text-style-color',
          label: 'Warna teks Colors.blueAccent',
          description: 'Memiliki TextStyle dengan warna kustom.',
        },
      ],
    },
  },
  {
    id: 'stateless-vs-stateful',
    title: 'Stateless vs StatefulWidget',
    subtitle: 'Memahami pengelolaan data statis dan dinamis',
    category: 'core',
    categoryLabel: 'Konsep Inti',
    difficulty: 'Pemula',
    summary:
      'StatelessWidget digunakan untuk komponen yang tampilannya murni bergantung pada konfigurasi awal dan tidak pernah berubah saat runtime. Sebaliknya, StatefulWidget memiliki objek State terpisah yang mampu mempertahankan nilai dan merender ulang UI saat setState() dipanggil.',
    conceptPoints: [
      {
        title: 'StatelessWidget',
        explanation:
          'Cocok untuk label, ikon, atau kartu informasi statis. Hanya memiliki method build(BuildContext context).',
      },
      {
        title: 'StatefulWidget',
        explanation:
          'Memiliki dua kelas terpisah: kelas widget publik dan kelas State pendamping. Digunakan untuk form input, animasi, atau counter interaktif.',
      },
      {
        title: 'Fungsi setState()',
        explanation:
          'Memberi tahu framework Flutter bahwa state internal telah berubah, sehingga framework menjadwalkan eksekusi build() berikutnya untuk memperbarui tampilan.',
      },
    ],
    keyProperties: [
      {
        name: 'createState()',
        type: 'State<StatefulWidget>',
        description: 'Method wajib pada StatefulWidget untuk menginisiasi instance State pendamping.',
      },
      {
        name: 'setState(fn)',
        type: 'void',
        description: 'Memperbarui nilai variabel internal dan memicu render ulang widget subtree.',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  void _decrement() {
    setState(() {
      if (_counter > 0) _counter--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('State Demo')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Jumlah ketukan tombol:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: const Icon(Icons.add),
      ),
    );
  }
}`,
    treeData: {
      id: 'counter-scaffold',
      name: 'Scaffold',
      type: 'framework',
      description: 'Kerangka utama halaman counter.',
      children: [
        {
          id: 'appbar-counter',
          name: 'AppBar',
          type: 'layout',
          description: 'Navigasi atas.',
        },
        {
          id: 'center-counter',
          name: 'Center',
          type: 'layout',
          description: 'Pusat tata letak.',
          children: [
            {
              id: 'col-counter',
              name: 'Column',
              type: 'layout',
              description: 'Menyusun teks label dan angka counter secara vertikal.',
              children: [
                {
                  id: 'text-label',
                  name: 'Text ("Jumlah ketukan tombol:")',
                  type: 'leaf',
                  description: 'Stateless label penjelasan.',
                },
                {
                  id: 'text-value',
                  name: 'Text ("$_counter")',
                  type: 'component',
                  description: 'Dynamic text yang terikat dengan state counter.',
                },
              ],
            },
          ],
        },
        {
          id: 'fab-counter',
          name: 'FloatingActionButton',
          type: 'component',
          description: 'Tombol aksi melayang yang memicu _increment() via setState().',
        },
      ],
    },
    defaultParams: {
      counter: 0,
    },
    challenge: {
      instruction:
        'Lengkapi kelas StatefulWidget CounterPage: deklarasikan variabel int _counter bernilai awal 5, buat method _increment() menggunakan setState(), dan tambahkan FloatingActionButton untuk memicu method tersebut.',
      hint: 'Gunakan int _counter = 5;, void _increment() { setState(() { _counter++; }); }, dan FloatingActionButton(onPressed: _increment).',
      starterCode: `import 'package:flutter/material.dart';

class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  // TODO 1: Inisialisasi variabel state int _counter dengan nilai awal 5:


  // TODO 2: Buat method _increment() yang memanggil setState() untuk menambah _counter:


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hitung Angka')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Jumlah ketukan tombol:'),
            // TODO 3: Tampilkan variabel _counter:

          ],
        ),
      ),
      // TODO 4: Pasang FloatingActionButton dengan onPressed _increment:

    );
  }
}`,
      unlockCode: 'FREE-FLUTTER-BOX-202',
      nextTopicId: 'container',
      nextTopicTitle: 'Container Widget',
      criteria: [
        {
          id: 'stateful-structure',
          label: 'Struktur StatefulWidget & State pendamping',
          description: 'Memiliki kelas StatefulWidget dan createState().',
        },
        {
          id: 'counter-init',
          label: 'Variabel int _counter diinisialisasi',
          description: 'Mendeklarasikan state counter.',
        },
        {
          id: 'setstate-usage',
          label: 'Penggunaan method setState()',
          description: 'Memanggil setState untuk merebuild antarmuka.',
        },
        {
          id: 'fab-present',
          label: 'FloatingActionButton dengan onPressed',
          description: 'Menyediakan tombol aksi floating.',
        },
      ],
    },
  },
  {
    id: 'container',
    title: 'Container Widget',
    subtitle: 'Kotak pembungkus multi-guna untuk ukuran, jarak, dan dekorasi',
    category: 'layout',
    categoryLabel: 'Layout & Tata Letak',
    difficulty: 'Pemula',
    summary:
      'Container menggabungkan kemampuan melukis (painting), penempatan posisi (positioning), dan ukuran (sizing). Ini adalah widget paling serbaguna di Flutter, mirip dengan <div> berdekorasi di web development.',
    conceptPoints: [
      {
        title: 'BoxDecoration',
        explanation:
          'Properti decoration memungkinkan Anda menentukan warna background, border, borderRadius (sudut membulat), dan box shadow.',
      },
      {
        title: 'Margin vs Padding',
        explanation:
          'Padding memberi ruang di dalam kotak (antara border dan isi child), sedangkan margin memberi ruang di luar kotak (antara border dan elemen sekitar).',
      },
      {
        title: 'Constraints & Sizing',
        explanation:
          'Jika tidak diberi width dan height, Container akan mencoba menyesuaikan ukurannya dengan child-nya, atau mengisi ruang yang diberikan parent-nya.',
      },
    ],
    keyProperties: [
      {
        name: 'width & height',
        type: 'double?',
        description: 'Dimensi eksplisit lebar dan tinggi kotak dalam satuan logical pixel.',
      },
      {
        name: 'padding',
        type: 'EdgeInsetsGeometry?',
        description: 'Jarak antara konten child dengan tepi dalam Container.',
      },
      {
        name: 'decoration',
        type: 'Decoration?',
        description: 'Dekorasi visual menggunakan BoxDecoration (warna, border, borderRadius).',
      },
      {
        name: 'alignment',
        type: 'AlignmentGeometry?',
        description: 'Posisi perataan child di dalam area Container.',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildContainerDemo() {
  return Center(
    child: Container(
      width: 220,
      height: 180,
      padding: const EdgeInsets.all(16.0),
      margin: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: Colors.amber,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: Colors.white, width: 2),
      ),
      alignment: Alignment.center,
      child: const Text(
        'Container Cantik',
        style: TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),
  );
}`,
    treeData: {
      id: 'center-container-demo',
      name: 'Center',
      type: 'layout',
      description: 'Memosisikan Container di tengah layar.',
      children: [
        {
          id: 'container-node',
          name: 'Container',
          type: 'component',
          description: 'Widget pembungkus dengan dekorasi kustom, border radius, dan padding.',
          children: [
            {
              id: 'text-container-child',
              name: 'Text ("Container Cantik")',
              type: 'leaf',
              description: 'Konten child di dalam Container.',
            },
          ],
        },
      ],
    },
    defaultParams: {
      containerColor: '#0284c7',
      containerRadius: 16,
      containerPadding: 20,
    },
    challenge: {
      instruction:
        'Lengkapi fungsi buildContainerDemo(): rancang Container dengan dimensi width: 220, height: 180, warna Colors.amber, dan sudut membulat borderRadius: BorderRadius.circular(16). Berikan child Text("Container Siap") di tengahnya.',
      hint: 'Gunakan width: 220, height: 180, color: Colors.amber, dan borderRadius: BorderRadius.circular(16).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildContainerDemo() {
  return Center(
    // TODO 1: Bungkus dengan Container berdimensi width: 220 dan height: 180:
    child: Container(
      // TODO 2: Tentukan warna Colors.amber dan borderRadius 16 di sini:

      
      // TODO 3: Beri child Text('Container Siap'):
      
    ),
  );
}`,
      unlockCode: 'FREE-FLUTTER-FLEX-303',
      nextTopicId: 'row-and-column',
      nextTopicTitle: 'Row & Column',
      criteria: [
        {
          id: 'container-sizing',
          label: 'Dimensi width: 220 dan height: 180',
          description: 'Container memiliki lebar dan tinggi eksplisit.',
        },
        {
          id: 'container-color',
          label: 'Warna background Colors.amber',
          description: 'Container memiliki konfigurasi warna latar.',
        },
        {
          id: 'container-radius',
          label: 'BorderRadius minimal 16',
          description: 'Container memiliki sudut melengkung.',
        },
      ],
    },
  },
  {
    id: 'row-and-column',
    title: 'Row & Column',
    subtitle: 'Fondasi susunan fleksibel vertikal dan horizontal',
    category: 'layout',
    categoryLabel: 'Layout & Tata Letak',
    difficulty: 'Pemula',
    summary:
      'Row dan Column adalah tulang punggung sistem layout flex di Flutter. Row menyusun deretan widget secara mendatar (sumbu X), sedangkan Column menyusun deretan widget secara menurun (sumbu Y).',
    conceptPoints: [
      {
        title: 'MainAxisAlignment',
        explanation:
          'Mengatur distribusi widget di sepanjang sumbu utama (horizontal untuk Row, vertikal untuk Column). Nilai populer: start, center, end, spaceBetween, spaceAround, spaceEvenly.',
      },
      {
        title: 'CrossAxisAlignment',
        explanation:
          'Mengatur posisi perataan widget pada sumbu silang (vertikal untuk Row, horizontal untuk Column). Nilai: start, center, end, stretch.',
      },
      {
        title: 'MainAxisSize',
        explanation:
          'Menentukan apakah Row/Column mengambil ruang maksimal (MainAxisSize.max) atau menyusut sesuai ukuran gabungan children-nya (MainAxisSize.min).',
      },
    ],
    keyProperties: [
      {
        name: 'children',
        type: 'List<Widget>',
        description: 'Daftar widget yang disusun di dalam baris atau kolom.',
      },
      {
        name: 'mainAxisAlignment',
        type: 'MainAxisAlignment',
        description: 'Perataan pada sumbu utama.',
        defaultValue: 'MainAxisAlignment.start',
      },
      {
        name: 'crossAxisAlignment',
        type: 'CrossAxisAlignment',
        description: 'Perataan pada sumbu silang.',
        defaultValue: 'CrossAxisAlignment.center',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildFlexLayoutDemo() {
  final List<Widget> boxes = [
    _buildBox('Kotak 1', Colors.blue),
    _buildBox('Kotak 2', Colors.teal),
    _buildBox('Kotak 3', Colors.indigo),
  ];

  return Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.center,
    children: boxes,
  );
}

Widget _buildBox(String label, Color color) {
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    margin: const EdgeInsets.all(6),
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(8),
    ),
    child: Text(
      label,
      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
    ),
  );
}`,
    treeData: {
      id: 'flex-parent',
      name: 'Column / Row',
      type: 'layout',
      description: 'Menyusun daftar widget dengan perataan mainAxis & crossAxis.',
      children: [
        {
          id: 'box-1',
          name: 'Container (Kotak 1)',
          type: 'component',
          description: 'Elemen anak pertama.',
        },
        {
          id: 'box-2',
          name: 'Container (Kotak 2)',
          type: 'component',
          description: 'Elemen anak kedua.',
        },
        {
          id: 'box-3',
          name: 'Container (Kotak 3)',
          type: 'component',
          description: 'Elemen anak ketiga.',
        },
      ],
    },
    defaultParams: {
      flexDirection: 'column',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
    },
    challenge: {
      instruction:
        'Lengkapi fungsi buildFlexLayoutDemo(): gunakan widget Column dengan perataan mainAxisAlignment: MainAxisAlignment.center, dan susun 3 elemen kotak _buildBox di dalam daftar children.',
      hint: 'Gunakan Column(mainAxisAlignment: MainAxisAlignment.center, children: boxes).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildFlexLayoutDemo() {
  final List<Widget> boxes = [
    _buildBox('Kotak 1', Colors.blue),
    _buildBox('Kotak 2', Colors.teal),
    _buildBox('Kotak 3', Colors.indigo),
  ];

  // TODO: Kembalikan widget Column dengan mainAxisAlignment.center dan children: boxes:

}

Widget _buildBox(String label, Color color) {
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    margin: const EdgeInsets.all(6),
    decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8)),
    child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
  );
}`,
      unlockCode: 'FREE-FLUTTER-STACK-404',
      nextTopicId: 'stack-positioned',
      nextTopicTitle: 'Stack & Positioned',
      criteria: [
        {
          id: 'flex-direction',
          label: 'Menggunakan layout Column',
          description: 'Elemen disusun secara menurun menggunakan Column.',
        },
        {
          id: 'main-axis-align',
          label: 'mainAxisAlignment: MainAxisAlignment.center',
          description: 'Perataan sumbu utama berada di tengah.',
        },
        {
          id: 'flex-children',
          label: 'Memuat 3 kotak children',
          description: 'Children memuat deretan kotak flex.',
        },
      ],
    },
  },
  {
    id: 'stack-positioned',
    title: 'Stack & Positioned',
    subtitle: 'Menumpuk widget secara berlapis di atas satu sama lain',
    category: 'layout',
    categoryLabel: 'Layout & Tata Letak',
    difficulty: 'Menengah',
    summary:
      'Stack memungkinkan penumpukan elemen di sumbu Z (layer). Widget Positioned digunakan di dalam Stack untuk menentukan jarak pasti dari tepi atas, bawah, kiri, atau kanan.',
    conceptPoints: [
      {
        title: 'Layering Order',
        explanation:
          'Widget pertama di dalam daftar children berada di lapisan paling bawah (background), sedangkan widget terakhir berada di lapisan paling atas.',
      },
      {
        title: 'Widget Positioned',
        explanation:
          'Memberikan koordinat absolut (top, right, bottom, left) terhadap batas Stack.',
      },
      {
        title: 'Kasus Penggunaan',
        explanation:
          'Sangat cocok untuk foto profil dengan status badge online, banner gambar dengan teks overlay, atau kartu kredit digital.',
      },
    ],
    keyProperties: [
      {
        name: 'alignment',
        type: 'AlignmentGeometry',
        description: 'Menentukan posisi default untuk child yang tidak dibungkus Positioned.',
        defaultValue: 'AlignmentDirectional.topStart',
      },
      {
        name: 'fit',
        type: 'StackFit',
        description: 'Bagaimana child yang tidak diposisikan mengisi ukuran Stack.',
        defaultValue: 'StackFit.loose',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildStackCard() {
  return Center(
    child: SizedBox(
      width: 260,
      height: 180,
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF0284C7),
              borderRadius: BorderRadius.circular(16),
            ),
            padding: const EdgeInsets.all(20),
            child: const Text('Flutter Member Card', style: TextStyle(color: Colors.white)),
          ),
          Positioned(
            top: 14,
            right: 14,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('VIP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ),
        ],
      ),
    ),
  );
}`,
    treeData: {
      id: 'stack-root',
      name: 'Stack',
      type: 'layout',
      description: 'Menumpuk elemen berlapis.',
      children: [
        {
          id: 'card-bg',
          name: 'Container (Background Card)',
          type: 'component',
          description: 'Lapisan kartu bawah.',
        },
        {
          id: 'pos-badge',
          name: 'Positioned (top: 14, right: 14)',
          type: 'layout',
          description: 'Penentu koordinat lapisan atas.',
          children: [
            {
              id: 'badge-item',
              name: 'Container ("PRO" Badge)',
              type: 'leaf',
              description: 'Badge yang melayang di atas kartu.',
            },
          ],
        },
      ],
    },
    defaultParams: {},
    challenge: {
      instruction:
        'Lengkapi fungsi buildStackCard(): gunakan widget Stack untuk menumpuk elemen kartu, dan tempatkan badge bertuliskan "VIP" di pojok kanan atas menggunakan widget Positioned(top: 14, right: 14).',
      hint: 'Gunakan Stack(children: [ ... ]), lalu tambahkan Positioned(top: 14, right: 14, child: Text("VIP")).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildStackCard() {
  return Center(
    child: SizedBox(
      width: 260,
      height: 180,
      child: Stack(
        children: [
          // Background Card
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF0284C7),
              borderRadius: BorderRadius.circular(16),
            ),
            padding: const EdgeInsets.all(20),
            child: const Text('Flutter Member Card', style: TextStyle(color: Colors.white)),
          ),
          // TODO: Tambahkan Positioned(top: 14, right: 14) berisi badge Text('VIP'):

        ],
      ),
    ),
  );
}`,
      unlockCode: 'FREE-FLUTTER-BTN-505',
      nextTopicId: 'interactive-buttons',
      nextTopicTitle: 'Tombol & Interaksi Gestur',
      criteria: [
        {
          id: 'stack-structure',
          label: 'Menggunakan widget Stack',
          description: 'Elemen ditumpuk di dalam Stack.',
        },
        {
          id: 'positioned-usage',
          label: 'Widget Positioned (top: 14, right: 14)',
          description: 'Positioned memiliki koordinat top dan right.',
        },
        {
          id: 'badge-content',
          label: 'Lencana bertuliskan "VIP"',
          description: 'Teks badge bernilai VIP.',
        },
      ],
    },
  },
  {
    id: 'interactive-buttons',
    title: 'Tombol & Interaksi Gestur',
    subtitle: 'ElevatedButton, OutlinedButton, dan respon sentuhan',
    category: 'input',
    categoryLabel: 'Input & Tombol',
    difficulty: 'Pemula',
    summary:
      'Flutter menyediakan ragam tombol siap pakai sesuai standar Material Design: ElevatedButton (tombol utama bermateri), OutlinedButton (tombol dengan garis tepi), dan TextButton (tombol datar tanpa background).',
    conceptPoints: [
      {
        title: 'Event onPressed',
        explanation:
          'Callback yang dieksekusi saat tombol disentuh. Jika onPressed bernilai null, tombol otomatis beralih ke state disabled.',
      },
      {
        title: 'ButtonStyle',
        explanation:
          'Dikonfigurasi melalui ElevatedButton.styleFrom() untuk mengatur warna latar, radius sudut, elevasi bayangan, dan padding tombol.',
      },
      {
        title: 'Feedback Ripple Effect',
        explanation:
          'Material InkWell memberikan efek gelombang sentuhan (ripple) yang mulus saat pengguna menekan tombol.',
      },
    ],
    keyProperties: [
      {
        name: 'onPressed',
        type: 'VoidCallback?',
        description: 'Fungsi yang dipanggil ketika tombol di-tap.',
      },
      {
        name: 'style',
        type: 'ButtonStyle?',
        description: 'Aturan styling visual tombol.',
      },
      {
        name: 'child',
        type: 'Widget',
        description: 'Isi tombol (biasanya Text atau Row yang berisi Icon dan Text).',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildButtonShowcase(BuildContext context) {
  return Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ElevatedButton.icon(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Aksi berhasil dijalankan!'),
                duration: Duration(seconds: 2),
              ),
            );
          },
          icon: const Icon(Icons.send, size: 18),
          label: const Text('Kirim Data'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.emerald,
            foregroundColor: Colors.white,
          ),
        ),
      ],
    ),
  );
}`,
    treeData: {
      id: 'button-parent',
      name: 'ElevatedButton.icon',
      type: 'component',
      description: 'Tombol interaktif dengan ikon dan teks.',
      children: [
        {
          id: 'btn-icon',
          name: 'Icon (Icons.send)',
          type: 'leaf',
          description: 'Ikon visual.',
        },
        {
          id: 'btn-label',
          name: 'Text ("Kirim Data")',
          type: 'leaf',
          description: 'Teks tombol.',
        },
      ],
    },
    defaultParams: {
      buttonClicks: 0,
      activeSnackbar: null,
    },
    challenge: {
      instruction:
        'Lengkapi fungsi buildButtonShowcase(): buat widget ElevatedButton.icon dengan label Text("Kirim Data"), callback onPressed aktif, dan atur warna latar backgroundColor: Colors.emerald pada ElevatedButton.styleFrom.',
      hint: 'Gunakan ElevatedButton.icon(onPressed: () {}, label: Text("Kirim Data"), style: ElevatedButton.styleFrom(backgroundColor: Colors.emerald)).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildButtonShowcase(BuildContext context) {
  return Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // TODO: Buat ElevatedButton.icon dengan label 'Kirim Data',
        // onPressed aktif, dan backgroundColor: Colors.emerald:

      ],
    ),
  );
}`,
      unlockCode: 'FREE-FLUTTER-INPUT-606',
      nextTopicId: 'text-field-input',
      nextTopicTitle: 'TextField & Input Pengguna',
      criteria: [
        {
          id: 'elevated-button-usage',
          label: 'Menggunakan ElevatedButton',
          description: 'Tombol menggunakan widget ElevatedButton.',
        },
        {
          id: 'button-onpressed',
          label: 'onPressed callback aktif',
          description: 'onPressed tidak bernilai null.',
        },
        {
          id: 'button-style-color',
          label: 'Warna backgroundColor: Colors.emerald',
          description: 'Tombol berwarna emerald.',
        },
      ],
    },
  },
  {
    id: 'text-field-input',
    title: 'TextField & Input Pengguna',
    subtitle: 'Menerima masukan teks, formulir, dan validasi',
    category: 'input',
    categoryLabel: 'Input & Tombol',
    difficulty: 'Menengah',
    summary:
      'TextField adalah widget utama untuk input formulir teks di Flutter. Didukung oleh TextEditingController untuk membaca, memodifikasi nilai, dan InputDecoration untuk mempercantik gaya input.',
    conceptPoints: [
      {
        title: 'TextEditingController',
        explanation:
          'Objek pengendali untuk membaca nilai input teks secara langsung atau menetapkan teks awal secara terprogram.',
      },
      {
        title: 'InputDecoration',
        explanation:
          'Mengatur labelText, hintText, prefixIcon, suffixIcon, dan border (OutlineInputBorder atau UnderlineInputBorder).',
      },
      {
        title: 'Event onChanged',
        explanation:
          'Dipanggil seketika setiap kali karakter dalam kolom teks bertambah atau berkurang.',
      },
    ],
    keyProperties: [
      {
        name: 'controller',
        type: 'TextEditingController?',
        description: 'Pengendali teks dan seleksi kursor.',
      },
      {
        name: 'decoration',
        type: 'InputDecoration?',
        description: 'Tampilan visual kotak input (border, hint, icon, label).',
      },
      {
        name: 'onChanged',
        type: 'ValueChanged<String>?',
        description: 'Callback saat isi teks berubah.',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

class InputDemo extends StatefulWidget {
  const InputDemo({super.key});

  @override
  State<InputDemo> createState() => _InputDemoState();
}

class _InputDemoState extends State<InputDemo> {
  String _displayName = '';

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            onChanged: (val) {
              setState(() {
                _displayName = val;
              });
            },
            decoration: InputDecoration(
              labelText: 'Nama Lengkap',
              hintText: 'Masukkan nama Anda...',
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _displayName.isEmpty ? 'Belum ada nama.' : 'Halo, $_displayName!',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}`,
    treeData: {
      id: 'input-col',
      name: 'Column',
      type: 'layout',
      description: 'Menyusun TextField dan Teks hasil input.',
      children: [
        {
          id: 'tf-widget',
          name: 'TextField',
          type: 'component',
          description: 'Input teks pengguna dengan InputDecoration.',
        },
        {
          id: 'tf-result',
          name: 'Text ("Halo, $_displayName!")',
          type: 'leaf',
          description: 'Teks dinamis yang merespons perubahan input.',
        },
      ],
    },
    defaultParams: {
      inputText: 'Budi Santoso',
    },
    challenge: {
      instruction:
        'Lengkapi kelas _InputDemoState: buat widget TextField dengan properti decoration: InputDecoration(labelText: "Nama Lengkap", hintText: "Masukkan nama...").',
      hint: 'Gunakan TextField(decoration: InputDecoration(labelText: "Nama Lengkap", hintText: "..."))',
      starterCode: `import 'package:flutter/material.dart';

class InputDemo extends StatefulWidget {
  const InputDemo({super.key});

  @override
  State<InputDemo> createState() => _InputDemoState();
}

class _InputDemoState extends State<InputDemo> {
  String _displayName = '';

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // TODO: Buat TextField dengan InputDecoration labelText: 'Nama Lengkap':

        ],
      ),
    );
  }
}`,
      unlockCode: 'FREE-FLUTTER-CTRL-707',
      nextTopicId: 'switch-and-slider',
      nextTopicTitle: 'Switch & Slider',
      criteria: [
        {
          id: 'textfield-usage',
          label: 'Menggunakan widget TextField',
          description: 'Memiliki input teks TextField.',
        },
        {
          id: 'input-decoration',
          label: 'InputDecoration dengan labelText',
          description: 'Memiliki dekorasi input labelText.',
        },
      ],
    },
  },
  {
    id: 'switch-and-slider',
    title: 'Switch & Slider',
    subtitle: 'Kontrol interaktif untuk boolean dan rentang nilai angka',
    category: 'input',
    categoryLabel: 'Input & Tombol',
    difficulty: 'Pemula',
    summary:
      'Switch digunakan untuk mengaktifkan atau mematikan pengaturan biner (on/off), sedangkan Slider memungkinkan pengguna memilih nilai dari suatu rentang kontinu.',
    conceptPoints: [
      {
        title: 'Dua Arah (Controlled State)',
        explanation:
          'Switch dan Slider membutuhkan nilai variabel state untuk properti value, serta callback onChanged untuk memperbarui variabel tersebut lewat setState.',
      },
      {
        title: 'Slider Divisions & Label',
        explanation:
          'Properti divisions membagi slider menjadi beberapa step diskrit, dan properti label menampilkan tooltip angka saat slider digeser.',
      },
    ],
    keyProperties: [
      {
        name: 'value',
        type: 'bool (Switch) / double (Slider)',
        description: 'Nilai aktif saat ini.',
      },
      {
        name: 'onChanged',
        type: 'ValueChanged<T>?',
        description: 'Callback saat pengguna menggeser atau menekan kontrol.',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildControlsDemo({
  required bool isDark,
  required ValueChanged<bool> onToggleTheme,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      SwitchListTile(
        title: const Text('Mode Malam'),
        value: isDark,
        onChanged: onToggleTheme,
      ),
    ],
  );
}`,
    treeData: {
      id: 'switch-col',
      name: 'Column',
      type: 'layout',
      description: 'Menyusun SwitchListTile dan Slider.',
      children: [
        {
          id: 'switch-node',
          name: 'SwitchListTile',
          type: 'component',
          description: 'Baris tile dengan label, subtitle, icon, dan switch toggle.',
        },
      ],
    },
    defaultParams: {
      isSwitchOn: true,
      sliderValue: 65,
    },
    challenge: {
      instruction:
        'Lengkapi fungsi buildControlsDemo(): gunakan widget SwitchListTile dengan title: const Text("Mode Malam") dan pasang variabel boolean isDark pada properti value.',
      hint: 'Gunakan SwitchListTile(title: const Text("Mode Malam"), value: isDark, onChanged: onToggleTheme).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildControlsDemo({
  required bool isDark,
  required ValueChanged<bool> onToggleTheme,
}) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      // TODO: Buat SwitchListTile dengan title 'Mode Malam' dan value: isDark:

    ],
  );
}`,
      unlockCode: 'FREE-FLUTTER-LIST-808',
      nextTopicId: 'listview',
      nextTopicTitle: 'ListView & Scrollable Data',
      criteria: [
        {
          id: 'switch-usage',
          label: 'Menggunakan SwitchListTile',
          description: 'Memiliki widget SwitchListTile.',
        },
        {
          id: 'switch-state-bound',
          label: 'Terikat ke variabel state boolean value',
          description: 'Properti value dihubungkan ke isDark.',
        },
      ],
    },
  },
  {
    id: 'listview',
    title: 'ListView & Scrollable Data',
    subtitle: 'Menampilkan daftar item berulang secara efisien',
    category: 'list',
    categoryLabel: 'List & Scroll',
    difficulty: 'Menengah',
    summary:
      'ListView adalah widget paling populer untuk menampilkan daftar data yang dapat di-scroll. Varian ListView.builder merender item secara malas (lazy-loading) hanya ketika item memasuki layar, sangat hemat memori untuk ribuan data.',
    conceptPoints: [
      {
        title: 'ListView Default vs ListView.builder',
        explanation:
          'ListView standar membuat semua children sekaligus di memori (cocok untuk sedikit item). ListView.builder hanya membangun item yang sedang terlihat di layar viewport.',
      },
      {
        title: 'ListTile',
        explanation:
          'Widget standar pelengkap ListView yang memiliki slot leading (avatar/ikon kiri), title, subtitle, dan trailing (ikon panah/tombol aksi kanan).',
      },
    ],
    keyProperties: [
      {
        name: 'itemCount',
        type: 'int?',
        description: 'Jumlah total item di dalam daftar.',
      },
      {
        name: 'itemBuilder',
        type: 'IndexedWidgetBuilder',
        description: 'Fungsi pembangun yang mengembalikan widget untuk setiap index tertentu.',
      },
      {
        name: 'scrollDirection',
        type: 'Axis',
        description: 'Arah gulir: Axis.vertical (default) atau Axis.horizontal.',
      },
    ],
    dartCode: `import 'package:flutter/material.dart';

Widget buildUserListView(List<String> items) {
  return ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) {
      final item = items[index];
      return Card(
        child: ListTile(
          title: Text(item),
          subtitle: const Text('Flutter Learner Developer'),
        ),
      );
    },
  );
}`,
    treeData: {
      id: 'list-root',
      name: 'ListView.builder',
      type: 'layout',
      description: 'Daftar gulir dengan lazy rendering.',
      children: [
        {
          id: 'card-list-node',
          name: 'Card',
          type: 'component',
          description: 'Kartu pembungkus item.',
          children: [
            {
              id: 'list-tile-node',
              name: 'ListTile',
              type: 'component',
              description: 'Baris data dengan slot leading, title, subtitle, dan trailing.',
            },
          ],
        },
      ],
    },
    defaultParams: {
      listItems: [
        'Belajar Dasar Widget',
        'Memahami StatelessWidget',
        'State Management Provider',
        'Navigasi & Routing App',
        'Integrasi REST API',
      ],
    },
    challenge: {
      instruction:
        'Lengkapi fungsi buildUserListView(): gunakan ListView.builder untuk merender daftar items. Pada itemBuilder, kembalikan widget Card yang membungkus ListTile dengan title Text(item).',
      hint: 'Gunakan ListView.builder(itemCount: items.length, itemBuilder: (context, index) => Card(child: ListTile(title: Text(items[index])))).',
      starterCode: `import 'package:flutter/material.dart';

Widget buildUserListView(List<String> items) {
  // TODO: Kembalikan ListView.builder yang merender Card dan ListTile:
  return ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) {
      final item = items[index];
      // Return Card dengan ListTile di sini:

    },
  );
}`,
      unlockCode: 'FREE-FLUTTER-MASTER-999',
      nextTopicTitle: 'Seluruh Modul Flutter Selesai',
      criteria: [
        {
          id: 'listview-builder',
          label: 'Menggunakan ListView.builder',
          description: 'Menggunakan builder untuk rendering performan.',
        },
        {
          id: 'list-tile-usage',
          label: 'Merender Card dan ListTile',
          description: 'Item dibungkus dalam Card dan ListTile.',
        },
      ],
    },
  },
];
