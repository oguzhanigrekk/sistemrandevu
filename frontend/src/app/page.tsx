'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, Scissors, CalendarCheck, Clock, ShieldCheck, Map, Check, X, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavbarAuthButtons, PricingAuthButton } from '@/components/AuthButtons';

interface Salon {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  rating: number;
  type: string;
  hero_image: string;
  distance?: number;
  is_sponsored?: boolean;
}

const platformFeatures = [
  {
    title: '7/24 Randevu İmkanı',
    description: 'Mesai saatlerini beklemeden dilediğiniz an randevunuzu oluşturun.',
    icon: Clock,
  },
  {
    title: 'Anında Onay',
    description: 'Gerçek zamanlı takvimlerle anında randevu onayı alın.',
    icon: CalendarCheck,
  },
  {
    title: 'Güvenilir Yorumlar',
    description: 'Sadece hizmet almış gerçek müşterilerin yorumlarını inceleyin.',
    icon: ShieldCheck,
  },
];

export default function Home() {
  const [nearbySalons, setNearbySalons] = useState<Salon[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalons = (lat: number, lon: number) => {
      fetch(`/api/public/branches/nearby?lat=${lat}&lon=${lon}&radius=50`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setNearbySalons(data.data || []);
          } else {
            setLocationError(data.message || "Sunucudan veri alınamadı.");
          }
          setLoadingLocation(false);
        })
        .catch((err) => {
          setLocationError("Sunucu bağlantı hatası: " + err.message);
          setLoadingLocation(false);
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchSalons(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          let errorMsg = "Bilinmeyen bir hata oluştu.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Kullanıcı konum isteğini reddetti.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Konum bilgisi şu anda kullanılamıyor.";
              break;
            case error.TIMEOUT:
              errorMsg = "Konum isteği zaman aşımına uğradı.";
              break;
          }
          // Log Exception for user
          setLocationError(`Konum Hatası: ${errorMsg} (${error.message})`);
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Tarayıcınız konum servisini desteklemiyor veya güvenli bağlantı (HTTPS) gerekliği nedeniyle engellendi.");
      setLoadingLocation(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-primary-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex justify-between items-center transition-all bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="text-primary-600 dark:text-primary-500" size={28} />
            <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
              Sistem<span className="text-primary-500">Randevu</span>
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <NavbarAuthButtons />
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Nearby Salons Section - TOP Level */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-6 mt-8">
              Size En Yakın <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">
                Güzellik Noktaları
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4">
              Konumunuzu paylaşarak çevrenizdeki en iyi puanlı kuaförleri ve güzellik merkezlerini anında keşfedin.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 font-medium dark:text-neutral-400">
              <Map size={16} className="text-primary-500" />
              <span>Google Haritalar verileriyle anlık listelenmektedir.</span>
            </div>
          </div>

          <div className="min-h-[300px]">
            {loadingLocation ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
                <h3 className="text-xl font-bold dark:text-white mb-2">Konumunuz Aranıyor</h3>
                <p className="text-neutral-500">Size en yakın şubeleri bulmak için konum izni bekleniyor...</p>
              </div>
            ) : locationError !== null || nearbySalons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-red-100 dark:border-red-900 shadow-sm text-center">
                <MapPin className="text-red-400 dark:text-red-500 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold dark:text-white mb-2">Konum Bilgisi Alınamadı</h3>

                {/* Exception Output */}
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-mono max-w-lg mb-6 break-words border border-red-100 dark:border-red-900/50">
                  Exception: {locationError || "Yakınınızda salon bulunamadı."}
                </div>

                <p className="text-neutral-500 max-w-md mx-auto mb-6">
                  Cihazınızın konum servislerinin açık olduğundan ve HTTPS (Güvenli Bağlantı) kullandığınızdan emin olun. HTTP yerel ağ isteklerinde (192.168.x.x) mobil cihazlar güvenlik nedeniyle konumu kısıtlamaktadır.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {nearbySalons.map((salon) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={salon.id}
                    whileHover={{ scale: 1.03 }}
                    className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg border bg-white dark:bg-neutral-900 ${salon.is_sponsored ? 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-400/50' : 'border-neutral-100 dark:border-neutral-800'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <img
                      src={salon.hero_image}
                      alt={salon.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-duration-700"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop" }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                      {salon.is_sponsored ? (
                        <div className="glass-gold px-3 py-1 bg-yellow-400/90 backdrop-blur-md rounded-full text-xs font-black text-black shadow-sm flex items-center gap-1">
                          <Star size={12} className="fill-black" /> Sponsorlu
                        </div>
                      ) : (<div />)}

                      <div className="glass px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 dark:text-white max-w-[120px] truncate">
                        <Map size={12} /> Yakınınızda
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-5 z-20 w-full">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary-400 mb-1">{salon.type}</div>
                      <h3 className="text-white font-black text-xl mb-1 truncate">{salon.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-white text-sm font-medium">
                          <Star className="fill-yellow-400 text-yellow-400" size={14} />
                          <span>Puan: {salon.rating}</span>
                        </div>
                        <span className="text-neutral-300 text-xs flex items-center gap-1 truncate max-w-[140px]" title={salon.address}>
                          <MapPin size={12} /> Konum: {salon.address.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Platform Features Section */}
        <section className="py-20 bg-white dark:bg-neutral-900 rounded-[3rem] px-8 shadow-sm border border-neutral-100 dark:border-neutral-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white">Neden SistemRandevu?</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Size en iyi hizmeti sunan profesyonellerle saniyeler içinde buluşmanızı sağlayan modern randevu altyapısı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platformFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 transition-all hover:shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary-600 dark:text-primary-400" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* B2B SaaS Pricing Table */}
        <section className="mt-24 mb-10 py-16 bg-white dark:bg-neutral-900 rounded-[3rem] px-4 sm:px-8 shadow-sm border border-neutral-100 dark:border-neutral-800 scroll-mt-24" id="pricing">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mb-4 text-primary-600 dark:text-primary-500">
              <Building2 size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-neutral-900 dark:text-white">İşletmeniz İçin En Uygun Paket</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              SistemRandevu ile salonunuzu tamamen dijitalleştirin. İhtiyacınıza uygun olan paketi seçin ve hemen başlayın.
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto pb-4">
            <div className="min-w-[800px] bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">

              {/* Table Header */}
              <div className="grid grid-cols-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="col-span-3 p-6 flex flex-col justify-end">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Özellikler</h3>
                </div>

                <div className="col-span-1 p-6 text-center border-l-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">EN ÇOK TERCİH EDİLEN</div>
                  <h3 className="text-xl font-black text-primary-600 dark:text-primary-400 mb-2">Standart Paket</h3>
                  <div className="text-3xl font-black text-neutral-900 dark:text-white mb-1">
                    1.000 <span className="text-sm font-medium text-neutral-500">TL</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">+ KDV / Aylık</div>
                </div>

                <div className="col-span-1 p-6 text-center border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-center items-center">
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-3">Özel Paket</h3>
                  <div className="text-sm text-neutral-500 mb-3 px-2">Şubenize Özel İhtiyaçlar İçin</div>
                  <a href="https://wa.me/905386975882" target="_blank" rel="noopener noreferrer" className="mt-auto md:px-5 px-3 py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs md:text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-md flex items-center gap-1.5 md:gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                    Fiyat Alın
                  </a>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {[
                  { name: "Kullanıcı Sayısı", pro: "3 Kullanıcı", custom: "Sınırsız", highlight: false },
                  { name: "Müşteri Yönetimi", pro: true, custom: true, highlight: false },
                  { name: "Randevu Yönetimi", pro: "Sınırsız Randevu", custom: "Sınırsız", highlight: false },
                  { name: "Ücretsiz Randevu Hatırlatma", pro: true, custom: true, highlight: false },
                  { name: "Ürün / Hizmet Yönetimi", pro: true, custom: true, highlight: false },
                  { name: "SMS Yönetimi", pro: true, custom: true, highlight: false },
                  { name: "Mobil Uygulama", pro: true, custom: true, highlight: false },
                  { name: "Online Randevu Sistemi", pro: true, custom: true, highlight: false },
                  { name: "E-posta / Ticket Desteği", pro: true, custom: true, highlight: false },
                  { name: "Yabancı Dil Desteği (EN)", pro: true, custom: true, highlight: false },
                  { name: "Otomatik Hatırlatma SMS", pro: true, custom: true, highlight: false },
                  { name: "Hediye SMS", pro: "1.000 SMS (Yıllık)", custom: "Özel Limitler", highlight: true },
                  { name: "Satış / Adisyon Yönetimi", pro: true, custom: true, highlight: true },
                  { name: "Diyetisyen Modülü", pro: true, custom: true, highlight: false },
                  { name: "Şube Yönetimi", pro: true, custom: "Sınırsız Şube", highlight: true },
                  { name: "Google Takvim Entegrasyonu", pro: true, custom: true, highlight: true },
                  { name: "Ücretsiz Kurulum Desteği", pro: true, custom: true, highlight: false },
                  { name: "Telefon Desteği", pro: true, custom: true, highlight: false },
                  { name: "Raporlama Yönetimi", pro: "Standart", custom: "Gelişmiş Dışa Aktarım", highlight: true },
                  { name: "Personel Yetkilendirme", pro: true, custom: "Gelişmiş Rol Sistemi", highlight: true },
                  { name: "Toplu SMS Gönderimi", pro: true, custom: true, highlight: true },
                  { name: "Borç Takibi / Tahsilat", pro: false, custom: true, highlight: false },
                  { name: "Vardiya Yönetimi (Shift)", pro: false, custom: true, highlight: false },
                  { name: "Kasa (Gelir-Gider)", pro: false, custom: true, highlight: false },
                  { name: "Paket Satış Yönetimi", pro: false, custom: true, highlight: false },
                  { name: "Seans Yönetimi", pro: false, custom: true, highlight: false },
                  { name: "Personel Prim ve Ciro", pro: false, custom: true, highlight: false },
                  { name: "Fatura Yönetimi", pro: false, custom: true, highlight: false },
                  { name: "Stok Yönetimi", pro: false, custom: true, highlight: false },
                  { name: "Sınırsız Eğitim", pro: false, custom: true, highlight: false },
                ].map((feature, idx) => (
                  <div key={idx} className={`grid grid-cols-5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${feature.highlight ? 'bg-primary-50/30 dark:bg-primary-900/5' : ''}`}>
                    <div className="col-span-3 p-4 flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {feature.name}
                    </div>

                    <div className="col-span-1 p-4 flex items-center justify-center border-l border-neutral-100 dark:border-neutral-800/10 bg-primary-50/10 dark:bg-primary-900/5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {feature.pro === true ? (
                        <Check className="text-primary-500" size={20} />
                      ) : feature.pro === false ? (
                        <X className="text-neutral-300 dark:text-neutral-700" size={20} />
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 text-center">{feature.pro}</span>
                      )}
                    </div>

                    <div className="col-span-1 p-4 flex items-center justify-center border-l border-neutral-100 dark:border-neutral-800 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {feature.custom === true ? (
                        <Check className="text-green-500" size={20} />
                      ) : feature.custom === false ? (
                        <X className="text-neutral-300 dark:text-neutral-700" size={20} />
                      ) : (
                        <span className="text-green-600 dark:text-green-500 text-center">{feature.custom}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* CTA Buttons below table */}
          <div className="max-w-5xl mx-auto mt-8 flex flex-col items-center justify-center sm:flex-row sm:justify-end gap-4">
            <a href="https://wa.me/905386975882" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 rounded-full border border-green-500 text-green-600 dark:text-green-400 dark:border-green-600 font-bold hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors text-center shadow-sm">
              Özel Paket İçin İletişime Geçin
            </a>
            <PricingAuthButton />
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-neutral-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="text-primary-500" size={24} />
            <span className="text-xl font-black tracking-tighter">
              Sistem<span className="text-primary-500">Randevu</span>
            </span>
          </div>
          <div className="text-neutral-500 text-sm text-center md:text-right">
            © {new Date().getFullYear()} Modern Randevu Sistemleri A.Ş. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
