import { MapPin, Phone, Mail, Building2, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '../../lib/api';

export function OfficesBranches() {
  const [heroTitle, setHeroTitle] = useState('المكاتب والفروع');
  const [heroSubtitle, setHeroSubtitle] = useState('نخدم مجتمعنا عبر شبكة من المكاتب والفروع');
  const [introText, setIntroText] = useState('تعرف على مواقعنا ووسائل التواصل');
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: heroTitle,
      subtitle: heroSubtitle,
      image: "url('/hero-left.jpg')",
    },
    {
      title: 'قريبون منكم',
      subtitle: 'تواصلوا معنا في أقرب فرع لكم',
      image: "url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200')",
    },
  ];

  useEffect(() => {
    loadOfficesData();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const loadOfficesData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getOfficesBranches();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'المكاتب والفروع');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
      }
      
      // Set offices
      setOffices(data.offices || []);
    } catch (error) {
      console.error('Error loading offices data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  // Update slides with dynamic content
  const dynamicSlides = [
    {
      title: heroTitle,
      subtitle: heroSubtitle,
      image: slides[0].image,
    },
    slides[1],
  ];

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero slider */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 right-0 bg-no-repeat bg-center bg-cover transition-all duration-700"
          style={{ backgroundImage: dynamicSlides[currentSlide].image, filter: 'brightness(0.65)' }}
        />
        <div className="container mx-auto px-4 py-24 lg:py-20 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-10 h-10" />
              <span className="text-emerald-200 font-semibold">شبكة المكاتب والفروع</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white">
              {dynamicSlides[currentSlide].title}
            </h1>
            <p className="text-emerald-50 text-lg mb-8">{dynamicSlides[currentSlide].subtitle}</p>
            <a href="#branches" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow">
              استكشف الفروع
              <ChevronLeft className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Branches section */}
      <section className="container mx-auto px-4 py-16" id="branches">
        <div className="max-w-3xl ml-auto text-right">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">فروعنا</h2>
          {introText && (
            <p className="text-gray-600">{introText}</p>
          )}
        </div>

        {offices.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {offices.map((office) => (
              <div key={office.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-gray-900">{office.name}</h3>
                      <p className="text-emerald-600 font-semibold">{office.city}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    {office.address && (
                      <div className="flex items-center justify-end gap-3 text-gray-700">
                        <span>{office.address}</span>
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                    {office.phone && (
                      <div className="flex items-center justify-end gap-3 text-gray-700" dir="ltr">
                        <span>{office.phone}</span>
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                    {office.email && (
                      <div className="flex items-center justify-end gap-3 text-gray-700" dir="ltr">
                        <span>{office.email}</span>
                        <Mail className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                  </div>
                </div>
                {office.map_embed_url && (
                  <div className="aspect-video w-full">
                    <iframe
                      src={office.map_embed_url}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`خريطة - ${office.name}`}
                      aria-label={`خريطة ${office.city}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mt-10">
            <p className="text-gray-500 text-lg">لا توجد مكاتب أو فروع متاحة حالياً</p>
          </div>
        )}
      </section>
    </div>
  );
}
