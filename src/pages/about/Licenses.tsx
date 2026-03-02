import { useEffect, useMemo, useState } from 'react';
import { Building2, ShieldCheck, FileText } from 'lucide-react';
import { PartnerLogo } from '../../components/PartnerLogo';
import { PartnersCarousel } from '../../components/PartnersCarousel';
import { publicApi } from '../../lib/api';
import * as LucideIcons from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
  Building2,
  ShieldCheck,
  FileText,
  DollarSign: LucideIcons.DollarSign,
  Stethoscope: LucideIcons.Stethoscope,
  Briefcase: LucideIcons.Briefcase,
  Heart: LucideIcons.Heart,
  Users: LucideIcons.Users,
  CheckCircle: LucideIcons.CheckCircle,
};

const getIcon = (iconName?: string, defaultIcon: any = Building2) => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
};

export function Licenses() {
  const slides = useMemo(
    () => [
      '/hero-left.jpg',
      '/Structure.jpg',
      // Using first image again as a placeholder until new assets are provided
      '/hero-left.jpg',
    ],
    []
  );

  const [current, setCurrent] = useState(0);
  const [licenses, setLicenses] = useState<Array<{ id: string; title: string; file_url?: string; file_name?: string }>>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    loadLicenses();
    loadSupervisingAuthorities();
  }, []);

  const loadLicenses = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getLicenses();
      setLicenses(data);
    } catch (error) {
      console.error('Error loading licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSupervisingAuthorities = async () => {
    try {
      const authorities = await publicApi.getSupervisingAuthorities();
      setSupervisors(authorities);
    } catch (error) {
      console.error('Error loading supervising authorities:', error);
      setSupervisors([]);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Slider */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[520px] overflow-hidden bg-gray-100">
        {slides.map((src, idx) => (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            key={idx}
            src={src}
            alt={`صورة السلايدر ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              current === idx ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                current === idx ? 'bg-white/90 w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* شهادة التسجيل */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-right">
            التراخيص والاعتمادات
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
          ) : licenses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {licenses.map((item) => (
                <a
                  key={item.id}
                  href={item.file_url || '#'}
                  target={item.file_url ? '_blank' : undefined}
                  rel={item.file_url ? 'noreferrer' : undefined}
                  className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div className="text-gray-800 font-medium">
                      {item.title}
                    </div>
                    {item.file_name && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.file_name}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">لا توجد تراخيص متاحة حالياً</div>
          )}
        </section>

        <PartnersCarousel partners={supervisors} title="الجهات المشرفة والداعمة" />
      </div>
    </div>
  );
}
