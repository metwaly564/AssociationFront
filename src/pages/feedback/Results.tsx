import React, { useEffect, useState } from 'react';
import { publicApi } from '../../lib/api';

const surveyTypeLabels: Record<string, string> = {
  employees: 'استبيان قياس رضا الموظفين',
  volunteers: 'استبيان قياس رضا المتطوعين',
  donors: 'استبيان قياس رضا المتبرعين',
  beneficiaries: 'استبيان قياس رضا المستفيدين',
  stakeholders: 'استبيان قياس رضا أصحاب العلاقة',
};

const satisfactionLabels: Record<number, string> = {
  1: 'غير راضٍ جداً',
  2: 'غير راضٍ',
  3: 'محايد',
  4: 'راضٍ',
  5: 'راضٍ جداً',
};

export function Results() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getFeedbackStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading feedback stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSatisfactionColor = (avg: string) => {
    const num = parseFloat(avg);
    if (num >= 4) return 'text-emerald-600';
    if (num >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSatisfactionBgColor = (avg: string) => {
    const num = parseFloat(avg);
    if (num >= 4) return 'bg-emerald-50 border-emerald-200';
    if (num >= 3) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-right mb-6">نتائج الاستبيانات</h1>
        <div className="text-center py-12 text-gray-500">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-right mb-6">نتائج الاستبيانات</h1>
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg mb-2">لا توجد بيانات متاحة حالياً</p>
          <p className="text-sm">لم يتم إرسال أي استبيانات بعد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-right mb-6">نتائج الاستبيانات</h1>

      {/* Overall Statistics */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-right mb-4">إجمالي الاستبيانات</h2>
        <div className="text-4xl font-bold text-emerald-600 text-right">{stats.total}</div>
        <p className="text-sm text-gray-600 text-right mt-2">استبيان تم إرساله</p>
      </div>

      {/* Statistics by Type */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
        {stats.byType.map((item: any) => (
          <div
            key={item.type}
            className={`border rounded-xl p-6 text-right ${getSatisfactionBgColor(item.avgSatisfaction)}`}
          >
            <div className="font-semibold text-gray-900 mb-3">
              {surveyTypeLabels[item.type] || item.type}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">عدد الاستبيانات:</span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">متوسط الرضا:</span>
                <span className={`font-bold text-lg ${getSatisfactionColor(item.avgSatisfaction)}`}>
                  {item.avgSatisfaction} / 5
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>النطاق:</span>
                <span>{item.minSatisfaction} - {item.maxSatisfaction}</span>
              </div>
            </div>
            
            {/* Satisfaction Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    parseFloat(item.avgSatisfaction) >= 4
                      ? 'bg-emerald-600'
                      : parseFloat(item.avgSatisfaction) >= 3
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${(parseFloat(item.avgSatisfaction) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Satisfaction Distribution */}
      {stats.satisfactionDistribution && stats.satisfactionDistribution.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-bold text-right mb-4">توزيع مستويات الرضا</h2>
          <div className="space-y-3">
            {stats.satisfactionDistribution.map((item: any) => {
              const percentage = ((item.count / stats.total) * 100).toFixed(1);
              return (
                <div key={item.level} className="text-right">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.level} - {satisfactionLabels[item.level]}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.level >= 4
                          ? 'bg-emerald-600'
                          : item.level >= 3
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

