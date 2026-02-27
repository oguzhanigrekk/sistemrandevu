'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, Scissors, CalendarCheck, Clock, ShieldCheck, Map } from 'lucide-react';
import { useState, useEffect } from 'react';

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
          <div className="flex gap-4">
            <a href="http://localhost:8080/realms/kuafor_realm/account" className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-primary-600 text-white hover:bg-primary-500 transition-all shadow-md">
              Giriş Yap / Kayıt Ol
            </a>
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
