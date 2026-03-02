import { Target, Eye, Award, FileText, Users, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi, type StaticPage, type AboutContent, type AboutSection } from '../lib/api';

// Icon mapping
const iconMap: Record<string, any> = {
  Eye,
  Target,
  Award,
  FileText,
  Users,
  Heart,
};

const getIcon = (iconName?: string) => {
  if (!iconName) return Eye;
  return iconMap[iconName] || Eye;
};

export function About() {
  const [pageData, setPageData] = useState<StaticPage | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageData();
    loadAboutContent();
  }, []);

  const loadPageData = async () => {
    try {
      const data = await publicApi.getPageBySlug('about');
      setPageData(data);
    } catch (error) {
      console.error('Error loading about page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAboutContent = async () => {
    try {
      const data = await publicApi.getAboutContent();
      setAboutContent(data);
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  };

  // Helper functions
  const getSection = (key: string): AboutSection | null => {
    if (!aboutContent) return null;
    return aboutContent.sections.find(s => s.section_key === key) || null;
  };

  const visionSection = getSection('vision');
  const missionSection = getSection('mission');
  const goals = aboutContent?.goals && aboutContent.goals.length > 0 
    ? aboutContent.goals 
    : [
        { id: '1', title: 'المساهمة في تقديم العناية والرعاية الطبية المنزلية للمرضى المحتاجين والمجاورين .' },
        { id: '2', title: 'المساهمة في تقديم المساعدات المالية والعينية للمرضى المنزليين واسرهم المستحقين .' },
        { id: '3', title: 'رفع مستوى الوعي الصحي لدى المجتمع بأساليب الرعاية الطبية المنزلية بما يساعدهم في وقايتهم من المخاطر المتوقعة .' },
        { id: '4', title: 'عمل دراسات وابحاث ومؤتمرات وندوات علمية وتثقيفية في مجال الطب المنزلي .' },
        { id: '5', title: 'المساهمة في علاج المرضى المنزليين ذوي الاحتياج بالمجتمع بتخصيص ايام علاج مجاني لهم، ودعمهم في العلاج التخصصي والتلطيفي .' },
        { id: '6', title: 'اجراء البحث الميداني لحصر المرضى المنزليين ذوي الحاجة للرعاية الطبية المنزلية لتقديم المساعدة لهم .' },
        { id: '7', title: 'تدريب وتأهيل المرضى ومرافقيهم لاستخدام الاجهزة الطبية وغير الطبية .' },
      ];

  // Default content fallback
  const defaultHero = {
    subtitle: 'جمعية تعمل لخدمة الإنسان والمجتمع',
    title: 'من نحن\nرؤيتنا ورسالتنا وقيمنا',
    description: 'نسعى لتمكين الفئات الأكثر احتياجاً عبر مبادرات تنموية وبرامج نوعية تسهم في تحسين جودة الحياة وتعزيز روح التكافل.',
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
              <span className="text-lg font-semibold">{defaultHero.subtitle}</span>
            </div>
            <h1 className="text-emerald-600 text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              {pageData?.title || defaultHero.title}
            </h1>
            <p className="text-black text-xl mb-8 leading-relaxed">
              {pageData?.summary || defaultHero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  if ((window as any).navigateTo) {
                    (window as any).navigateTo('membership-donate');
                  }
                }}
                className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
              >
                تبرع الآن
              </button>
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

      {/* Page Content from CMS */}
      {pageData?.body ? (
        <div dangerouslySetInnerHTML={{ __html: pageData.body }} />
      ) : (
        <>
          {/* Default Content */}
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">نبذة عن الجمعية</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
              "جاءت فكرة إنشاء جمعية الطب المنزلي بالمدينة المنورة لتلبية ودعم احتياجات المرضى المسجلين في إدارة الرعاية الصحية المنزلية صحياً ونفسياً واجتماعياً في منازلهم، مع الالتزام بأعلى المعايير وضمان سلامة البيئة المحيطة بالمريض وذويه، وذلك بسبب ارتفاع الطلب على خدمات الرعاية الصحية المنزلية مع وجود نقص في الأجهزة والمستلزمات الطبية ووسائل المواصلات والاتصالات. وقد تم إنشاء جمعية الطب المنزلي بالمدينة المنورة بترخيص الموارد البشرية والتنمية الاجتماعية رقم 1077 بتاريخ 8 / 11 / 2018م، لتخدم مرضى الرعاية الصحية المنزلية بالمدينة المنورة."
                </p>
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    {(() => {
                      const IconComponent = getIcon(visionSection?.icon_name);
                      return <IconComponent className="w-8 h-8 text-emerald-600" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {visionSection?.title || 'رؤيتنا'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {visionSection?.content || ' دعم مرضى الرعاية الصحية المنزلية بالمدينة المنورة ماديا ومعنويا بأعلى المعايير ورفع الخدمات المقدمة لهم لبيئة صحية سليمة'}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    {(() => {
                      const IconComponent = getIcon(missionSection?.icon_name);
                      return <IconComponent className="w-8 h-8 text-emerald-600" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {missionSection?.title || 'رسالتنا'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {missionSection?.content || 'تقديم الدعم الشامل والمتكامل للأسر المحتاجة من خلال برامج مبتكرة ومستدامة، بما يحقق التنمية الاجتماعية والاقتصادية للمستفيدين ويعزز استقلاليتهم.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Strategic Goals */}
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">أهدافنا الاستراتيجية</h2>
              </div>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={goal.id || index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-lg pt-1">{goal.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Organizational Structure */}
        <section className="bg-gray-50 py-16">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">الهيكل التنظيمي</h2>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg flex justify-center">
        {/* الصورة هنا */}
        <img
          src="public/partners/023.png" // حطي مسار صورتك
          alt="الهيكل التنظيمي"
          className="max-w-full h-auto object-contain"
        />
      </div>
    </div>
  </div>
</section>
          {/* Policies */}
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">اللوائح والسياسات</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'النظام الأساسي للجمعية',
                  'اللائحة المالية',
                  'لائحة الموارد البشرية',
                  'سياسة الخصوصية',
                  'سياسة قبول التبرعات',
                  'دليل الحوكمة',
                ].map((doc, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-emerald-600 hover:shadow-md transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-gray-900 font-semibold">{doc}</span>
                    </div>
                    <span className="text-sm text-gray-500">PDF</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
