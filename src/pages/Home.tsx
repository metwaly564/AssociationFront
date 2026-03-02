import { Heart, Shield, Users, TrendingUp, Target, Award, Building2, ChevronLeft, Calendar } from 'lucide-react';
import { PartnerLogo } from '../components/PartnerLogo';
import { useEffect, useState } from 'react';
import { publicApi, type Project, type HomepageContent, type HomepageSection, type HomepageStat, type HomepageValue, type HomepagePartner, type NewsItem } from '../lib/api';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
// Icon mapping
const iconMap: Record<string, any> = {
  Heart,
  Shield,
  Users,
  Target,
  Award,
  Building2,
  TrendingUp,
};

const getIcon = (iconName?: string) => {
  if (!iconName) return Heart;
  return iconMap[iconName] || Heart;
};

export function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [homepageLoading, setHomepageLoading] = useState(true);

  useEffect(() => {
    loadProjects();
    loadFeaturedContent();
    loadHomepageContent();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await publicApi.getProjects();
      const homeProjects = data.filter(p => p.show_on_home).sort((a, b) => (b.priority || 0) - (a.priority || 0)).slice(0, 3);
      setProjects(homeProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedContent = async () => {
    try {
      setNewsLoading(true);
      const data = await publicApi.getHomepageFeatured();
      setProjects(data.projects.slice(0, 3));
      setFeaturedNews(data.news.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured content:', error);
    } finally {
      setNewsLoading(false);
    }
  };

  const loadHomepageContent = async () => {
    try {
      const data = await publicApi.getHomepageContent();
      setHomepageContent(data);
    } catch (error) {
      console.error('Error loading homepage content:', error);
    } finally {
      setHomepageLoading(false);
    }
  };

  // Helper functions to get section content
  const getSection = (key: string): HomepageSection | null => {
    if (!homepageContent) return null;
    return homepageContent.sections.find(s => s.section_key === key) || null;
  };

  const heroSection = getSection('hero');
  const aboutSection = getSection('about');
  const valuesTitleSection = getSection('values_title');
  const projectsTitleSection = getSection('projects_title');
  const statsTitleSection = getSection('stats_title');
  const partnersTitleSection = getSection('partners_title');
  const ctaSection = getSection('cta');

  // Default values fallback
  const defaultStats: HomepageStat[] = [
    { id: '1', label: 'المستفيدين', value: '15,000+', icon_name: 'Users' },
    { id: '2', label: 'الزيارات الميدانية', value: '3,500+', icon_name: 'Target' },
    { id: '3', label: 'المتطوعين', value: '450+', icon_name: 'Heart' },
    { id: '4', label: 'الأجهزة المقدمة', value: '2,800+', icon_name: 'Award' },
  ];

  const defaultValues: HomepageValue[] = [
    {
      id: '1',
      title: 'السرية التامة',
      description: 'نحافظ على خصوصية بيانات جميع المستفيدين والمتبرعين بأعلى معايير الأمان',
      icon_name: 'Shield',
    },
    {
      id: '2',
      title: 'الأمانة والشفافية',
      description: 'نلتزم بالشفافية الكاملة في إدارة التبرعات وتوزيعها على المستحقين',
      icon_name: 'Heart',
    },
    {
      id: '3',
      title: 'الاهتمام والرعاية',
      description: 'نقدم خدماتنا بكل اهتمام ورعاية لضمان وصول الدعم لمستحقيه',
      icon_name: 'Users',
    },
  ];

  const defaultPartners: HomepagePartner[] = [
    { id: '1', name: 'وزارة الموارد البشرية', image_url: '/partners/hr.svg' },
    { id: '2', name: 'هيئة تنمية المجتمع', image_url: '/partners/community.svg' },
    { id: '3', name: 'الهلال الأحمر', image_url: '/partners/red-crescent.svg' },
    { id: '4', name: 'مؤسسة الملك عبدالله', image_url: '/partners/kaaf.svg' },
    { id: '5', name: 'وزارة الموارد البشرية', image_url: '/partners/hr.svg' },
    { id: '6', name: 'هيئة تنمية المجتمع', image_url: '/partners/community.svg' },
    { id: '7', name: 'الهلال الأحمر', image_url: '/partners/red-crescent.svg' },
    { id: '8', name: 'مؤسسة الملك عبدالله', image_url: '/partners/kaaf.svg' },
  ];

  const stats = homepageContent?.stats && homepageContent.stats.length > 0
    ? homepageContent.stats
    : defaultStats;

  const values = homepageContent?.values && homepageContent.values.length > 0
    ? homepageContent.values
    : defaultValues;

  const partners = homepageContent?.partners && homepageContent.partners.length > 0
    ? homepageContent.partners
    : defaultPartners;

  // Default projects fallback
  const defaultProjects = [
    {
      title: 'برنامج كفالة الأسر',
      description: 'دعم شهري مستمر للأسر المحتاجة لتوفير احتياجاتهم الأساسية',
      beneficiaries: '500 أسرة',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'مشروع التأهيل المهني',
      description: 'تدريب وتأهيل الشباب على مهارات سوق العمل لتحقيق الاستقلال المالي',
      beneficiaries: '300 شاب',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'برنامج الرعاية الصحية',
      description: 'توفير العلاجات والأجهزة الطبية للمرضى المحتاجين',
      beneficiaries: '800 مستفيد',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-800/20 text-white overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/2 lg:w-2/5 bg-no-repeat bg-left bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-left.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-24 lg:py-16 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-12 h-12" fill="currentColor" />
              <span className="text-lg font-semibold">
                {heroSection?.subtitle || 'بمنطقة المدينة المنورة'}
              </span>
            </div>
            <h1 className="text-emerald-600 text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              {heroSection?.title || 'نعمل من أجل مجتمع\nأفضل وحياة كريمة'}
            </h1>
            <p className="text-black text-xl mb-8 leading-relaxed">
              {heroSection?.description || 'جمعية خيرية تهدف إلى تقديم الرعاية والدعم للأسر المحتاجة وتحسين جودة حياتهم من خلال برامج متنوعة ومستدامة'}
            </p>
            <div className="flex flex-wrap gap-4">
              {heroSection?.button_text && (
                <button
                  onClick={() => {
                    if ((window as any).navigateTo) {
                      (window as any).navigateTo('membership-donate');
                    }
                  }}
                  className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
                >
                  {heroSection.button_text}
                </button>
              )}
              <button
                onClick={() => {
                  if ((window as any).navigateTo) {
                    (window as any).navigateTo('contact');
                  }
                }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
              >
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {aboutSection?.subtitle && (
                <span className="text-emerald-600 font-semibold text-sm mb-2 block">
                  {aboutSection.subtitle}
                </span>
              )}
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {aboutSection?.title || 'رسالتنا تقديم العون والرعاية المستدامة'}
              </h2>
              {aboutSection?.description && (
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {aboutSection.description}
                </p>
              )}
              {aboutSection?.content && (
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {aboutSection.content}
                </p>
              )}
              {aboutSection?.button_text && (
                <button
                  onClick={() => {
                    if ((window as any).navigateTo) {
                      (window as any).navigateTo('about');
                    }
                  }}
                  className="flex items-center gap-2 text-emerald-600 font-bold text-lg hover:gap-3 transition-all"
                >
                  {aboutSection.button_text}
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="relative">
              <img
                src={'/image.png'}

                //  src={aboutSection?.image_url || 'https://images.pexels.com/photos/6647034/pexels-photo-6647034.jpeg?auto=compress&cs=tinysrgb&w=800' || '/image.png'}
                alt="عملنا الخيري"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              {aboutSection?.metadata?.years && (
                <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold">+{aboutSection.metadata.years}</p>
                  <p className="text-sm">سنة من العطاء</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {valuesTitleSection?.subtitle && (
              <span className="text-emerald-600 font-semibold text-sm mb-2 block">
                {valuesTitleSection.subtitle}
              </span>
            )}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {valuesTitleSection?.title || 'نلتزم بأعلى المعايير'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => {
              const IconComponent = getIcon(value.icon_name);
              return (
                <div
                  key={value.id}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  {value.description && (
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          {projectsTitleSection?.subtitle && (
            <span className="text-emerald-600 font-semibold text-sm mb-2 block">
              {projectsTitleSection.subtitle}
            </span>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {projectsTitleSection?.title || 'برامجنا الرائدة'}
          </h2>
          {projectsTitleSection?.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {projectsTitleSection.description}
            </p>
          )}
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المشاريع...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <div
                key={project.id || index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={'image' in project ? project.image : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 bg-white text-emerald-600 px-4 py-2 rounded-full font-bold text-sm">
                    {'beneficiaries' in project ? project.beneficiaries : project.category || 'مشروع'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {'description' in project ? project.description : project.short_description || ''}
                  </p>
                  <button
                    onClick={() => {
                      if ((window as any).navigateTo) {
                        (window as any).navigateTo('programs');
                      }
                    }}
                    className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    اعرف المزيد
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-emerald-600 font-semibold text-sm mb-2 block">
                آخر الأخبار
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                أخبارنا المميزة
              </h2>
            </div>
            {newsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">جاري تحميل الأخبار...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {featuredNews.map((newsItem) => (
                  <article
                    key={newsItem.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                    onClick={() => {
                      if ((window as any).navigateToNewsDetail) {
                        (window as any).navigateToNewsDetail(newsItem.slug);
                      }
                    }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
                        alt={newsItem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {newsItem.published_at
                            ? new Date(newsItem.published_at).toLocaleDateString('ar-SA')
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {newsItem.title}
                      </h3>
                      {newsItem.excerpt && (
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {newsItem.excerpt}
                        </p>
                      )}
                      <button className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all">
                        اقرأ المزيد
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {statsTitleSection?.title || 'إنجازاتنا بالأرقام'}
            </h2>
            {statsTitleSection?.description && (
              <p className="text-emerald-100 max-w-2xl mx-auto">
                {statsTitleSection.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const IconComponent = getIcon(stat.icon_name);
              return (
                <div key={stat.id} className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-10 h-10" />
                  </div>
                  <p className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-emerald-100 text-lg">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* Partners Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          {partnersTitleSection?.subtitle && (
            <span className="text-emerald-600 font-semibold text-sm mb-3 block tracking-wide">
              {partnersTitleSection.subtitle}
            </span>
          )}

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {partnersTitleSection?.title || 'الجهات المشرفة والداعمة'}
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
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex flex-col items-center justify-center h-64 group">
                  <div>
                    <img
                      src={partner.image_url || '/partners/default.svg'}
                      alt={partner.name}
                      className="h-28 object-contain transition duration-500"
                    />
                  </div>

                  {/* اسم الجهة */}
                  <p className="mt-4 text-sm font-medium text-gray-600 text-center group-hover:text-emerald-600 transition duration-300">
                    {partner.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6" fill="currentColor" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {ctaSection?.title || 'كن جزءًا من التغيير'}
          </h2>
          {ctaSection?.description && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-8">
              {ctaSection.description}
            </p>
          )}
          {ctaSection?.button_text && (
            <button
              onClick={() => {
                if ((window as any).navigateTo) {
                  // Check if button_link is a page route or external URL
                  const link = ctaSection.button_link || 'membership-donate';
                  if (link.startsWith('http://') || link.startsWith('https://')) {
                    window.open(link, '_blank');
                  } else {
                    (window as any).navigateTo(link);
                  }
                }
              }}
              className="bg-white text-emerald-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl inline-block"
            >
              {ctaSection.button_text}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
