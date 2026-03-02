import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export interface PartnerItem {
  id: string | number;
  name: string;
  image_url?: string | null;
  website_url?: string | null;
}

interface PartnersCarouselProps {
  partners: PartnerItem[];
  title?: string;
  subtitle?: string;
}

export function PartnersCarousel({ partners, title = 'الجهات المشرفة والداعمة', subtitle }: PartnersCarouselProps) {
  if (!partners.length) return null;

  // تكرار القائمة لحركة مستمرة مثل الصفحة الرئيسية (نفس عدد الشرائح تقريباً)
  const minSlides = 12;
  const repeatedPartners: PartnerItem[] = [];
  let slideIndex = 0;
  while (repeatedPartners.length < minSlides) {
    for (const p of partners) {
      repeatedPartners.push({ ...p, id: `slide-${slideIndex++}` });
    }
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-14">
        {subtitle && (
          <span className="text-emerald-600 font-semibold text-sm mb-3 block tracking-wide">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="relative">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {repeatedPartners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className="flex flex-col items-center justify-center h-64 group">
                <div>
                  <img
                    src={partner.image_url || '/partners/default.svg'}
                    alt={partner.name}
                    className="h-28 object-contain transition duration-500"
                  />
                </div>
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-medium text-gray-600 text-center group-hover:text-emerald-600 transition duration-300"
                  >
                    {partner.name}
                  </a>
                ) : (
                  <p className="mt-4 text-sm font-medium text-gray-600 text-center group-hover:text-emerald-600 transition duration-300">
                    {partner.name}
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
