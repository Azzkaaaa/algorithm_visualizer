# Algorithm Visualizer

Website untuk memvisualisasikan eksekusi algoritma Python secara langkah demi langkah.

User dapat memasukkan kode Python, nama function, dan argument function. Backend akan menjalankan kode tersebut, merekam execution trace, lalu frontend menampilkan:

- Baris kode yang sedang dieksekusi
- Nilai local variables
- Perubahan isi array
- Pointer seperti `i`, `j`, `left`, `right`, dan `middle`
- Hasil akhir function
- Kontrol Previous, Next, Play, Pause, Reset, dan kecepatan animasi

> **Peringatan:** runner saat ini masih menggunakan `exec()` secara langsung dan belum memiliki sandbox. Gunakan hanya secara lokal dengan kode yang dipercaya. Jangan deploy ke publik sebelum sistem eksekusi diisolasi.

---

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Pytest

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

## Struktur Project

```text
algorithm_visualizer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── serializer.py
│   │   └── tracer.py
│   ├── tests/
│   │   └── test_trace.py
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/
│   ├── app/
│   │   └── page.tsx
│   ├── components/
│   │   ├── ActiveCode.tsx
│   │   ├── ArrayVisualizer.tsx
│   │   ├── CodeInputPanel.tsx
│   │   ├── ExecutionControls.tsx
│   │   └── VariablePanel.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── trace.ts
│   ├── .env.local
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Pastikan software berikut sudah terpasang:

- Python 3.11 atau lebih baru
- Node.js 20 atau lebih baru
- npm
- Git

Cek versi melalui terminal:

```powershell
python --version
node --version
npm --version
git --version
```

Pada beberapa instalasi Windows, command Python mungkin menggunakan:

```powershell
py --version
```

---

# Menjalankan Backend

## 1. Masuk ke folder backend

Dari root repository:

```powershell
cd backend
```

## 2. Buat virtual environment

```powershell
py -m venv .venv
```

## 3. Aktifkan virtual environment

### PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

Apabila PowerShell menolak eksekusi script:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### Git Bash

```bash
source .venv/Scripts/activate
```

Setelah aktif, terminal biasanya menampilkan prefix:

```text
(.venv)
```

## 4. Install dependency backend

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

## 5. Jalankan FastAPI

```powershell
uvicorn app.main:app --reload
```

Backend akan berjalan di:

```text
http://127.0.0.1:8000
```

Dokumentasi Swagger:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

Response yang diharapkan:

```json
{
  "status": "ok"
}
```

---

# Menjalankan Frontend

Buka terminal kedua dan biarkan backend tetap berjalan.

## 1. Masuk ke folder frontend

```powershell
cd frontend
```

## 2. Install dependency frontend

```powershell
npm install
```

## 3. Buat konfigurasi API

Pastikan file berikut tersedia:

```text
frontend/.env.local
```

Isinya:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Jika `.env.local` baru dibuat saat development server sedang berjalan, restart frontend.

## 4. Jalankan Next.js

```powershell
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:3000
```

---

# Menjalankan Backend dan Frontend Bersamaan

Gunakan dua terminal.

## Terminal 1 — Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

## Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

---

# Menjalankan Automated Test

Dari folder `backend` dengan virtual environment aktif:

```powershell
python -m pytest -q
```

Hasil yang diharapkan:

```text
2 passed
```

Untuk menjalankan test dengan output lebih detail:

```powershell
python -m pytest -v
```

---

# Memeriksa Frontend

Dari folder `frontend`:

```powershell
npm run lint
```

Untuk memastikan production build berhasil:

```powershell
npm run build
```

---

# Cara Menggunakan

## Contoh: Two Sum

### Python code

```python
def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []
```

### Function name

```text
two_sum
```

### Function arguments

```json
[
  [2, 7, 11, 15],
  9
]
```

Klik **Run code**.

Hasil akhirnya:

```json
[
  0,
  1
]
```

Gunakan kontrol berikut untuk melihat execution trace:

- **Previous** — kembali ke step sebelumnya
- **Next** — maju satu step
- **Play** — menjalankan trace secara otomatis
- **Pause** — menghentikan autoplay
- **Reset** — kembali ke step pertama
- **Speed** — mengubah kecepatan animasi

---

## Contoh: Bubble Sort

### Python code

```python
def bubble_sort(nums):
    n = len(nums)

    for i in range(n):
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]

    return nums
```

### Function name

```text
bubble_sort
```

### Function arguments

```json
[
  [5, 2, 8, 1, 3]
]
```

Ketika isi array berubah, elemen yang berubah akan diberi highlight.

---

## Contoh: Binary Search

### Python code

```python
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        middle = (left + right) // 2

        if nums[middle] == target:
            return middle

        if nums[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1
```

### Function name

```text
binary_search
```

### Function arguments

```json
[
  [1, 3, 5, 7, 9, 11],
  9
]
```

---

# Format Input

Kolom **Function arguments** harus berisi JSON array.

Function dengan dua parameter:

```python
def example(nums, target):
    ...
```

Input:

```json
[
  [1, 2, 3],
  5
]
```

Akan dijalankan sebagai:

```python
example([1, 2, 3], 5)
```

Function dengan satu parameter:

```python
def example(nums):
    ...
```

Input:

```json
[
  [1, 2, 3]
]
```

Akan dijalankan sebagai:

```python
example([1, 2, 3])
```

Nama pada kolom **Function name** harus sama persis dengan nama function yang didefinisikan di dalam kode.

---

# Endpoint API

## Health check

```http
GET /api/health
```

## Membuat execution trace

```http
POST /api/trace
```

Contoh request:

```json
{
  "code": "def add(a, b):\n    return a + b",
  "function_name": "add",
  "args": [2, 3],
  "kwargs": {}
}
```

Contoh response:

```json
{
  "result": 5,
  "steps": [
    {
      "step": 0,
      "line": 1,
      "event": "call",
      "function": "add",
      "locals": {
        "a": 2,
        "b": 3
      },
      "return_value": null
    }
  ]
}
```

---

# Troubleshooting

## `ModuleNotFoundError: No module named 'app'`

Pastikan command dijalankan dari folder `backend`:

```powershell
cd backend
python -m pytest -q
```

Untuk development server:

```powershell
uvicorn app.main:app --reload
```

## `Attribute "app" not found in module "app.main"`

Pastikan `backend/app/main.py` memiliki object:

```python
app = FastAPI()
```

## Frontend gagal terhubung ke backend

Pastikan:

- Backend berjalan di `http://127.0.0.1:8000`
- Frontend berjalan di `http://localhost:3000`
- `frontend/.env.local` berisi URL backend yang benar
- Konfigurasi CORS backend mengizinkan `http://localhost:3000`

Setelah mengubah `.env.local`, restart frontend:

```powershell
npm run dev
```

## Port 8000 sedang digunakan

Jalankan backend pada port lain:

```powershell
uvicorn app.main:app --reload --port 8001
```

Kemudian ubah `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```

## Port 3000 sedang digunakan

Next.js biasanya menawarkan port lain secara otomatis. Gunakan URL yang ditampilkan di terminal.

---

# Batasan Saat Ini

- Hanya mendukung kode Python
- Belum memiliki sandbox yang aman
- Visualisasi masih berdasarkan tipe data dan perbandingan antar-step
- Sistem belum selalu memahami makna algoritmis suatu variabel
- Pointer array masih dideteksi melalui nama variabel umum
- Belum mendukung input interaktif melalui `input()`
- Belum mendukung database, akun, dan penyimpanan project

---

# Rencana Pengembangan

- Monaco Editor
- Preset algoritma
- Visualisasi stack dan queue
- Call stack untuk rekursi
- Visualisasi tree dan graph
- Deteksi operasi swap, insert, dan delete
- Sandbox terisolasi
- Dukungan C++ dan Java
- Penyimpanan kode dan riwayat eksekusi
