# İş Asistanı — Kurulum Rehberi

## Adım 1 — GitHub'a Yükle

1. GitHub'a giriş yap → https://github.com
2. Sağ üstteki "+" butonuna tıkla → "New repository"
3. Repository adı: `is-asistani`
4. "Public" seç → "Create repository"
5. Açılan sayfada "uploading an existing file" linkine tıkla
6. Bu klasördeki TÜM dosyaları sürükle-bırak yap (klasör yapısını koru!)
7. "Commit changes" butonuna bas

## Adım 2 — Vercel'e Bağla

1. https://vercel.com adresine git
2. "Continue with GitHub" ile giriş yap
3. "Add New Project" → az önce oluşturduğun `is-asistani` reposunu seç
4. "Import" butonuna bas

## Adım 3 — API Anahtarını Ekle

1. Vercel'de projeyi import ederken **"Environment Variables"** bölümüne gel
2. Şu değeri ekle:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (kendi anahtarın)
3. "Deploy" butonuna bas

## Adım 4 — Hazır!

Vercel sana `https://is-asistani-xxxx.vercel.app` gibi bir link verecek.
Bu linki arkadaşınla paylaş — direkt kullanabilir, hiçbir kurulum gerekmez!

---

## API Anahtarı Nereden Alınır?

1. https://console.anthropic.com/settings/keys adresine git
2. "Create Key" butonuna tıkla
3. Anahtarı kopyala (sk-ant- ile başlar)
