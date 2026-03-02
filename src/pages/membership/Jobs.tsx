import { Briefcase, MapPin, Clock, DollarSign, Send, Calendar, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';

export function Jobs() {
  const [heroTitle, setHeroTitle] = useState('الوظائف المتاحة');
  const [heroSubtitle, setHeroSubtitle] = useState('انضم إلى فريقنا وكن جزءاً من رحلة التغيير');
  const [introText, setIntroText] = useState('نبحث عن موظفين مبدعين ومتحمسين للانضمام إلى فريقنا. نقدم بيئة عمل محفزة وفرصاً للنمو والتطوير المهني.');
  const [formTitle, setFormTitle] = useState('قدّم طلب توظيف');
  const [formSubtitle, setFormSubtitle] = useState('املأ النموذج أدناه وسنتواصل معك قريباً');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume_url: '',
    cover_letter: '',
  });

  useEffect(() => {
    loadJobsData();
  }, []);

  const loadJobsData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getJobs();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الوظائف المتاحة');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
        
        const formTitleSection = data.content.find((c: any) => c.section_key === 'form_title');
        if (formTitleSection) {
          setFormTitle(formTitleSection.title || 'قدّم طلب توظيف');
        }
        
        const formSubtitleSection = data.content.find((c: any) => c.section_key === 'form_subtitle');
        if (formSubtitleSection) {
          setFormSubtitle(formSubtitleSection.description || '');
        }
      }
      
      // Set jobs
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error loading jobs data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) {
      alert('الرجاء اختيار وظيفة');
      return;
    }
    
    try {
      setSubmitting(true);
      await publicApi.submitJobApplication({
        job_id: selectedJob.id,
        ...formData,
      });
      alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        resume_url: '',
        cover_letter: '',
      });
      setSelectedJob(null);
    } catch (error: any) {
      alert('فشل إرسال الطلب: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full-time': 'دوام كامل',
      'part-time': 'دوام جزئي',
      'contract': 'عقد',
      'internship': 'تدريب',
    };
    return labels[type] || type;
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
            <Briefcase className="w-10 h-10" />
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

      {/* Jobs List */}
      {jobs.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">الوظائف المتاحة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 ${
                  selectedJob?.id === job.id ? 'border-emerald-600' : 'border-gray-200'
                } cursor-pointer`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{job.title}</h3>
                  <div className="space-y-2 mb-4">
                    {job.department && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{getEmploymentTypeLabel(job.employment_type)}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                    {job.application_deadline && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>آخر موعد: {new Date(job.application_deadline).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}
                  <button
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      selectedJob?.id === job.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedJob?.id === job.id ? 'محدد' : 'اختر هذه الوظيفة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {selectedJob.department && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700"><strong>القسم:</strong> {selectedJob.department}</span>
                </div>
              )}
              {selectedJob.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700"><strong>الموقع:</strong> {selectedJob.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700"><strong>نوع التوظيف:</strong> {getEmploymentTypeLabel(selectedJob.employment_type)}</span>
              </div>
              {selectedJob.salary_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="text-gray-700"><strong>الراتب:</strong> {selectedJob.salary_range}</span>
                </div>
              )}
            </div>

            {selectedJob.description && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">الوصف الوظيفي</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            )}

            {selectedJob.requirements && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">المتطلبات</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.requirements}</p>
              </div>
            )}

            {selectedJob.responsibilities && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">المسؤوليات</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.responsibilities}</p>
              </div>
            )}

            {selectedJob.benefits && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">المزايا</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedJob.benefits}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Application Form */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Send className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{formTitle}</h2>
              {formSubtitle && (
                <p className="text-gray-600">{formSubtitle}</p>
              )}
            </div>

            {selectedJob && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-emerald-800">
                  <strong>الوظيفة المحددة:</strong> {selectedJob.title}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="+966 5XX XXX XXX"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">رابط السيرة الذاتية (CV)</label>
                <input
                  type="url"
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="https://..."
                />
                <p className="text-sm text-gray-500 mt-2">يمكنك رفع السيرة الذاتية على Google Drive أو Dropbox وإدخال الرابط هنا</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">رسالة التقديم</label>
                <textarea
                  rows={6}
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="اكتب رسالة تقديم مختصرة..."
                />
              </div>

              {!selectedJob && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">الرجاء اختيار وظيفة من القائمة أعلاه قبل إرسال الطلب</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedJob || submitting}
                className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
                  selectedJob && !submitting
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
