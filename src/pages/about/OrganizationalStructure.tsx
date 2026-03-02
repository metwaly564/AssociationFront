import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';
import { Users, Building2, ChevronLeft } from 'lucide-react';

export function OrganizationalStructure() {
  const [heroTitle, setHeroTitle] = useState('الهيكل التنظيمي');
  const [heroSubtitle, setHeroSubtitle] = useState('نظام إداري متكامل لتحقيق أهدافنا');
  const [introText, setIntroText] = useState('');
  const [structureImage, setStructureImage] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrgStructureData();
  }, []);

  const loadOrgStructureData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getOrgStructure();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الهيكل التنظيمي');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
        
        const imageSection = data.content.find((c: any) => c.section_key === 'structure_image');
        if (imageSection?.image_url) {
          setStructureImage(imageSection.image_url);
        }
      }
      
      // Set structure items
      setItems(data.items || []);
    } catch (error) {
      console.error('Error loading org structure data:', error);
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

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          {heroSubtitle && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro */}
      {introText && (
        <section className="container mx-auto px-4 py-10">
          <p className="text-gray-700 leading-8 text-right max-w-4xl mx-auto">
            {introText}
          </p>
        </section>
      )}

      {/* Structure Image */}
      {structureImage && (
        <section className="container mx-auto px-4 py-10">
          <div className="rounded-xl overflow-hidden border bg-gray-50 max-w-5xl mx-auto">
            <img
              src={structureImage}
              alt="الهيكل التنظيمي"
              className="w-full max-h-[70vh] object-contain mx-auto"
            />
          </div>
        </section>
      )}

      {/* Structure Items */}
      {items.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">مستويات الهيكل التنظيمي</h2>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id || index} className="border-r-4 border-emerald-600 pr-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Navigation Button */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => (window as any)?.navigateTo?.("about-team")}
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 shadow-sm transition-colors"
            aria-label="الانتقال إلى فريق العمل"
            title="فريق العمل"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">فريق العمل</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
