import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, FileCheck } from 'lucide-react';
import { publicApi } from '../../lib/api';

export function FinancialStatements() {
  const [heroTitle, setHeroTitle] = useState('القوائم والتقارير المالية');
  const [heroSubtitle, setHeroSubtitle] = useState('نؤمن بالشفافية والمساءلة في جميع أعمالنا المالية');
  const [statements, setStatements] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    file_url?: string;
    file_name?: string;
    year?: number;
    type: 'statement' | 'report';
    created_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialStatementsData();
  }, []);

  const loadFinancialStatementsData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getFinancialStatements();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'القوائم والتقارير المالية');
          setHeroSubtitle(heroSection.subtitle || '');
        }
      }
      
      // Set statements
      setStatements(data.statements || []);
    } catch (error) {
      console.error('Error loading financial statements data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group statements by year
  const groupedByYear = statements.reduce((acc: any, statement) => {
    const year = statement.year || 'غير محدد';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(statement);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
    if (a === 'غير محدد') return 1;
    if (b === 'غير محدد') return -1;
    return parseInt(b) - parseInt(a);
  });

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

      {/* Financial Statements List */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : statements.length > 0 ? (
          <div className="space-y-12">
            {sortedYears.map((year) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {year}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedByYear[year].map((statement: any) => (
                    <div
                      key={statement.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            statement.type === 'statement' 
                              ? 'bg-emerald-100' 
                              : 'bg-blue-100'
                          }`}>
                            {statement.type === 'statement' ? (
                              <FileText className={`w-6 h-6 ${
                                statement.type === 'statement' 
                                  ? 'text-emerald-600' 
                                  : 'text-blue-600'
                              }`} />
                            ) : (
                              <FileCheck className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {statement.title}
                            </h3>
                            {statement.description && (
                              <p className="text-gray-600 text-sm mb-3">
                                {statement.description}
                              </p>
                            )}
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              statement.type === 'statement'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {statement.type === 'statement' ? 'قائمة مالية' : 'تقرير مالي'}
                            </span>
                          </div>
                        </div>
                        {statement.file_url && (
                          <a
                            href={statement.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors mt-4"
                          >
                            <Download className="w-4 h-4" />
                            {statement.file_name || 'عرض / تحميل الملف'}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد قوائم مالية متاحة حالياً</p>
          </div>
        )}
      </section>
    </div>
  );
}
