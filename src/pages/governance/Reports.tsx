import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { publicApi } from '../../lib/api';

export function Reports() {
  const [heroTitle, setHeroTitle] = useState('التقارير');
  const [heroSubtitle, setHeroSubtitle] = useState('نقدم لكم تقاريرنا الدورية والسنوية');
  const [introText, setIntroText] = useState('نقدم لكم تقاريرنا الدورية والسنوية التي توثق إنجازاتنا وبرامجنا ومشاريعنا');
  const [reports, setReports] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    file_url?: string;
    year?: number;
    type?: string;
    created_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getReports();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'التقارير');
          setHeroSubtitle(heroSection.subtitle || '');
          setIntroText(heroSection.description || '');
        }
      }
      
      // Set reports
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years and types
  const years = Array.from(new Set(reports.map(r => r.year).filter(Boolean))).sort((a, b) => (b || 0) - (a || 0));
  const types = Array.from(new Set(reports.map(r => r.type).filter(Boolean)));

  // Filter reports
  const filteredReports = reports.filter(report => {
    if (selectedYear !== 'all' && report.year?.toString() !== selectedYear) return false;
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    return true;
  });

  // Group by year
  const groupedByYear = filteredReports.reduce((acc: any, report) => {
    const year = report.year || 'غير محدد';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(report);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
    if (a === 'غير محدد') return 1;
    if (b === 'غير محدد') return -1;
    return parseInt(b) - parseInt(a);
  });

  const getTypeLabel = (type?: string) => {
    const typeMap: Record<string, string> = {
      'annual': 'سنوي',
      'periodic': 'دوري',
      'special': 'تخصصي',
    };
    return type ? (typeMap[type] || type) : 'عام';
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
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto mb-4">
              {heroSubtitle}
            </p>
          )}
          {introText && (
            <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
              {introText}
            </p>
          )}
        </div>
      </section>

      {/* Filters */}
      {reports.length > 0 && (
        <section className="container mx-auto px-4 py-8 border-b">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-semibold">تصفية:</span>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">جميع السنوات</option>
              {years.map(year => (
                <option key={year} value={year?.toString()}>{year}</option>
              ))}
            </select>
            {types.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none"
              >
                <option value="all">جميع الأنواع</option>
                {types.map(type => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
            )}
          </div>
        </section>
      )}

      {/* Reports List */}
      <section className="container mx-auto px-4 py-16">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد تقارير متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
                  <span className="text-gray-500">({groupedByYear[year].length} تقرير)</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedByYear[year].map((report: any) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        {report.type && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                            {getTypeLabel(report.type)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                      {report.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {report.description}
                        </p>
                      )}
                      {report.file_url && (
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          تحميل التقرير
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

