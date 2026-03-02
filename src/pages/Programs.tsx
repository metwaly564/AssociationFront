import { Heart, GraduationCap, Briefcase, Home, Users, Stethoscope, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi, type Project } from '../lib/api';

export function Programs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [programs, setPrograms] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState({ title: 'البرامج والمشاريع', subtitle: 'برامجنا ومشاريعنا لخدمة المجتمع' });

  useEffect(() => {
    loadPrograms();
    loadPageContent();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await publicApi.getProjects();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async () => {
    try {
      const data = await publicApi.getProgramsPageContent();
      if (data.content && data.content.length > 0) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setPageContent({
            title: heroSection.title || 'البرامج والمشاريع',
            subtitle: heroSection.subtitle || 'برامجنا ومشاريعنا لخدمة المجتمع',
          });
        }
      }
    } catch (error) {
      console.error('Error loading page content:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'جميع البرامج' },
    { id: 'social', label: 'الرعاية الاجتماعية' },
    { id: 'health', label: 'الرعاية الصحية' },
    { id: 'education', label: 'التعليم' },
    { id: 'employment', label: 'التوظيف والتأهيل' },
  ];

  // بيانات افتراضية
  const defaultPrograms = [
    {
      id: 1,
      category: 'social',
      icon: Heart,
      title: 'برنامج كفالة الأسر',
      description: 'توفير دعم مالي شهري منتظم للأسر المحتاجة لتغطية احتياجاتهم الأساسية من مأكل ومشرب وسكن.',
      beneficiaries: '500 أسرة',
      goals: 'تحسين مستوى المعيشة للأسر المحتاجة وضمان استقرارهم المالي',
      howToHelp: 'التبرع الشهري أو السنوي لكفالة أسرة',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      category: 'health',
      icon: Stethoscope,
      title: 'برنامج الرعاية الصحية',
      description: 'تقديم الدعم الصحي والعلاجي للمرضى المحتاجين، وتوفير الأجهزة الطبية والأدوية الضرورية.',
      beneficiaries: '800 مستفيد',
      goals: 'ضمان حصول المرضى على العلاج المناسب دون عوائق مالية',
      howToHelp: 'التبرع لصندوق العلاج أو التبرع بأجهزة طبية',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      category: 'employment',
      icon: Briefcase,
      title: 'مشروع التأهيل المهني',
      description: 'تدريب وتأهيل الشباب على المهارات المطلوبة في سوق العمل لمساعدتهم في الحصول على فرص وظيفية.',
      beneficiaries: '300 شاب وشابة',
      goals: 'تمكين الشباب من الاستقلال المالي وتقليل البطالة',
      howToHelp: 'دعم برامج التدريب أو توفير فرص توظيف',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 4,
      category: 'education',
      icon: GraduationCap,
      title: 'برنامج الدعم التعليمي',
      description: 'توفير المستلزمات الدراسية والرسوم الدراسية لأبناء الأسر المحتاجة لضمان استمرارهم في التعليم.',
      beneficiaries: '600 طالب',
      goals: 'ضمان حصول جميع الأطفال على فرصة التعليم الجيد',
      howToHelp: 'كفالة طالب أو التبرع للحقائب المدرسية',
      image: 'https://images.pexels.com/photos/8500344/pexels-photo-8500344.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 5,
      category: 'social',
      icon: Home,
      title: 'مشروع الإسكان التنموي',
      description: 'ترميم وصيانة منازل الأسر المحتاجة لتوفير بيئة سكنية آمنة وصحية.',
      beneficiaries: '150 أسرة',
      goals: 'توفير مسكن لائق وآمن للأسر المستحقة',
      howToHelp: 'التبرع لصندوق الإسكان',
      image: 'https://images.pexels.com/photos/7031591/pexels-photo-7031591.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 6,
      category: 'social',
      icon: Users,
      title: 'برنامج الأيتام',
      description: 'رعاية شاملة للأيتام تشمل الدعم المالي والتعليمي والنفسي لضمان مستقبل أفضل لهم.',
      beneficiaries: '200 يتيم',
      goals: 'توفير رعاية متكاملة للأيتام وضمان حقوقهم',
      howToHelp: 'كفالة يتيم أو دعم البرامج الترفيهية',
      image: 'https://images.pexels.com/photos/8422087/pexels-photo-8422087.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  // تحويل البيانات من API إلى التنسيق المطلوب
  const formattedPrograms = programs.map((p) => {
    // تحديد الأيقونة حسب الفئة
    let icon = Heart;
    if (p.category?.includes('صحي') || p.category?.includes('health')) icon = Stethoscope;
    else if (p.category?.includes('تعليم') || p.category?.includes('education')) icon = GraduationCap;
    else if (p.category?.includes('توظيف') || p.category?.includes('employment')) icon = Briefcase;
    else if (p.category?.includes('إسكان') || p.category?.includes('housing')) icon = Home;
    
    return {
      ...p,
      icon,
      beneficiaries: p.category || 'مستفيدون',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
  });

  const filteredPrograms = activeFilter === 'all'
    ? formattedPrograms
    : formattedPrograms.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        if (activeFilter === 'social') return cat.includes('اجتماعي');
        if (activeFilter === 'health') return cat.includes('صحي');
        if (activeFilter === 'education') return cat.includes('تعليم');
        if (activeFilter === 'employment') return cat.includes('توظيف');
        return true;
      });

  const [selectedProgram, setSelectedProgram] = useState<typeof formattedPrograms[0] | null>(null);

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{pageContent.title}</h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
            {pageContent.subtitle}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeFilter === category.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البرامج...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد برامج متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                onClick={() => setSelectedProgram(program)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.image || 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-full">
                    <program.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                    {program.beneficiaries}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {program.description || program.short_description || ''}
                  </p>
                  <button className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all">
                    اعرف المزيد
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedProgram && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 left-4 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <selectedProgram.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProgram.title}</h2>
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
                    {selectedProgram.beneficiaries}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">نبذة عن البرنامج</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProgram.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">الأهداف</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProgram.goals}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">كيف تساهم</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProgram.howToHelp}</p>
                </div>

                <button className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors">
                  ساهم في هذا البرنامج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
