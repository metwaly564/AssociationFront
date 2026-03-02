import { FileText, Download, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';

export function AnnualReports() {
  const [heroTitle, setHeroTitle] = useState('التقارير السنوية');
  const [heroSubtitle, setHeroSubtitle] = useState('نستعرض إنجازاتنا وإسهاماتنا على مدار السنوات');
  const [introText, setIntroText] = useState('نقدم لكم تقاريرنا السنوية التي توثق إنجازاتنا وبرامجنا ومشاريعنا على مدار السنوات الماضية.');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnualReportsData();
  }, []);

  const loadAnnualReportsData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getAnnualReports();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'التقارير السنوية');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
      }
      
      // Set reports
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error loading annual reports data:', error);
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl lg:text-5xl font-bold">{heroTitle}</h1>
          </div>
          {heroSubtitle && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro Text */}
      {introText && (
        <section className="container mx-auto px-4 py-8">
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            {introText}
          </p>
        </section>
      )}

      {/* Reports List */}
      {reports.length > 0 ? (
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200"
              >
                {report.cover_image_url ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={report.cover_image_url}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-emerald-600" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">{report.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                  {report.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {report.description}
                    </p>
                  )}
                  {report.file_url && (
                    <a
                      href={report.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل التقرير</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد تقارير سنوية متاحة حالياً</p>
          </div>
        </section>
      )}
    </div>
  );
}
