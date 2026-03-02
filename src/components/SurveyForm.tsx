import React, { useState } from 'react';
import { publicApi } from '../lib/api';

interface SurveyFormProps {
  title: string;
  audienceLabel: string;
  surveyType: 'employees' | 'volunteers' | 'donors' | 'beneficiaries' | 'stakeholders';
}

export function SurveyForm({ title, audienceLabel, surveyType }: SurveyFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [satisfaction, setSatisfaction] = useState(3);
  const [notes, setNotes] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agree) {
      setError('يجب الموافقة على معالجة البيانات');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await publicApi.submitFeedback({
        survey_type: surveyType,
        name,
        email,
        relation,
        satisfaction,
        notes,
      });
      
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-right">
          <h1 className="text-2xl font-bold text-emerald-700 mb-2">شكراً لمشاركتك</h1>
          <p className="text-emerald-700">تم استلام استبيانك بنجاح.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-right">{title}</h1>
        <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 space-y-5 text-right">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">القسم / العلاقة</label>
            <input placeholder={audienceLabel} value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى الرضا</label>
            <input type="range" min={1} max={5} value={satisfaction} onChange={(e) => setSatisfaction(parseInt(e.target.value))} className="w-full" />
            <div className="text-sm text-gray-600">{satisfaction} / 5</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <label className="flex items-center gap-2 justify-end">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="text-sm text-gray-700">أوافق على معالجة بياناتي لأغراض تحسين الخدمات</span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={!agree || loading} 
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

