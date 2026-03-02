import { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { publicApi } from '../../lib/api';

export function Policies() {
  const [heroTitle, setHeroTitle] = useState('الأنظمة واللوائح والسياسات');
  const [heroSubtitle, setHeroSubtitle] = useState('نؤمن بالشفافية والحوكمة الرشيدة في جميع أعمالنا');
  const [policies, setPolicies] = useState<Array<{ id: string; title: string; description?: string; file_url?: string; created_at?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPoliciesData();
  }, []);

  const loadPoliciesData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getPolicies();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الأنظمة واللوائح والسياسات');
          setHeroSubtitle(heroSection.subtitle || '');
        }
      }
      
      // Set policies
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Error loading policies data:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Policies List */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : policies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {policy.title}
                      </h3>
                      {policy.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {policy.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {policy.file_url && (
                    <a
                      href={policy.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      عرض / تحميل الملف
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد سياسات متاحة حالياً</p>
          </div>
        )}
      </section>
    </div>
  );
}

