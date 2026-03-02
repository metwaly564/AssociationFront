import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { publicApi } from '../../lib/api';

export function OperationalBudget() {
  const [heroTitle, setHeroTitle] = useState('الخطة التشغيلية والموازنة');
  const [heroSubtitle, setHeroSubtitle] = useState('نعرض خططنا التشغيلية والموازنات المعتمدة');
  const [introText, setIntroText] = useState('نعرض خططنا التشغيلية والموازنات المعتمدة للسنوات المختلفة');
  const [budgets, setBudgets] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    file_url?: string;
    file_name?: string;
    year?: number;
    created_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    loadOperationalBudgetData();
  }, []);

  const loadOperationalBudgetData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getOperationalBudget();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الخطة التشغيلية والموازنة');
          setHeroSubtitle(heroSection.subtitle || '');
          setIntroText(heroSection.description || '');
        }
      }
      
      // Set budgets
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error loading operational budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years
  const years = Array.from(new Set(budgets.map(b => b.year).filter(Boolean))).sort((a, b) => (b || 0) - (a || 0));

  // Filter budgets
  const filteredBudgets = budgets.filter(budget => {
    if (selectedYear !== 'all' && budget.year?.toString() !== selectedYear) return false;
    return true;
  });

  // Group by year
  const groupedByYear = filteredBudgets.reduce((acc: any, budget) => {
    const year = budget.year || 'غير محدد';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(budget);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
    if (a === 'غير محدد') return 1;
    if (b === 'غير محدد') return -1;
    return parseInt(b) - parseInt(a);
  });

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
      {budgets.length > 0 && (
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
          </div>
        </section>
      )}

      {/* Budgets List */}
      <section className="container mx-auto px-4 py-16">
        {filteredBudgets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد خطط تشغيلية أو موازنات متاحة حالياً</p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
                  <span className="text-gray-500">({groupedByYear[year].length} ملف)</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedByYear[year].map((budget: any) => (
                    <div
                      key={budget.id}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{budget.title}</h3>
                      {budget.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {budget.description}
                        </p>
                      )}
                      {budget.file_url && (
                        <a
                          href={budget.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          {budget.file_name || 'تحميل الملف'}
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

