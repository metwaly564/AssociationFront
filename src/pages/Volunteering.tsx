import { Heart, Users, Clock, CheckCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';
import * as LucideIcons from 'lucide-react';

export function Volunteering() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    education: '',
    experience: '',
    interest: '',
    availability: '',
    message: '',
  });

  // Page content state
  const [heroTitle, setHeroTitle] = useState('التطوع معنا');
  const [heroSubtitle, setHeroSubtitle] = useState('كن جزءًا من فريقنا وساهم في صنع التغيير الإيجابي');
  const [whyTitle, setWhyTitle] = useState('لماذا التطوع معنا؟');
  const [whyDescription, setWhyDescription] = useState('');
  const [benefits, setBenefits] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [formTitle, setFormTitle] = useState('قدّم طلب تطوع');
  const [formSubtitle, setFormSubtitle] = useState('املأ النموذج أدناه وسنتواصل معك لمناقشة فرص التطوع المناسبة');
  const [opportunitiesTitle, setOpportunitiesTitle] = useState('فرص التطوع المتاحة');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolunteeringData();
  }, []);

  const loadVolunteeringData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getVolunteeringPageContent();
      
      // Set hero content
      const heroSection = data.content?.find((c: any) => c.section_key === 'hero_title');
      if (heroSection) {
        setHeroTitle(heroSection.title || 'التطوع معنا');
        setHeroSubtitle(heroSection.subtitle || '');
      }
      
      // Set why section
      const whySection = data.content?.find((c: any) => c.section_key === 'why_title');
      if (whySection) {
        setWhyTitle(whySection.title || 'لماذا التطوع معنا؟');
        setWhyDescription(whySection.description || '');
      }
      
      // Set opportunities title
      const oppTitleSection = data.content?.find((c: any) => c.section_key === 'opportunities_title');
      if (oppTitleSection) {
        setOpportunitiesTitle(oppTitleSection.title || 'فرص التطوع المتاحة');
      }
      
      // Set form section
      const formSection = data.content?.find((c: any) => c.section_key === 'form_title');
      if (formSection) {
        setFormTitle(formSection.title || 'قدّم طلب تطوع');
        setFormSubtitle(formSection.subtitle || '');
      }
      
      // Set benefits and opportunities
      setBenefits(data.benefits || []);
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('Error loading volunteering data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await publicApi.submitVolunteeringApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        education: formData.education,
        experience: formData.experience,
        interest: formData.interest,
        availability: formData.availability,
        message: formData.message,
      });

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        education: '',
        experience: '',
        interest: '',
        availability: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      setSubmitError(error.message || 'حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  // Icon mapping
  const getIcon = (iconName?: string, defaultIcon: any = Heart) => {
    if (!iconName) return defaultIcon;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || defaultIcon;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحتوى...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
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

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{whyTitle}</h2>
            {whyDescription && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {whyDescription}
              </p>
            )}
          </div>

          {benefits.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {benefits.map((benefit: any, index: number) => {
                const BenefitIcon = getIcon(benefit.icon_name, Heart);
                return (
                  <div key={benefit.id || index} className="text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BenefitIcon className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    {benefit.description && (
                      <p className="text-gray-600">{benefit.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {opportunities.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{opportunitiesTitle}</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {opportunities.map((opp: any, index: number) => {
                const OppIcon = getIcon(opp.icon_name, Clock);
                return (
                  <div
                    key={opp.id || index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <OppIcon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{opp.title}</h3>
                    {opp.description && (
                      <p className="text-gray-600 mb-4 leading-relaxed">{opp.description}</p>
                    )}
                    {opp.duration && (
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                        <Clock className="w-5 h-5" />
                        <span>{opp.duration}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Send className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{formTitle}</h2>
            {formSubtitle && (
              <p className="text-gray-600">
                {formSubtitle}
              </p>
            )}
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              <CheckCircle className="w-6 h-6 inline-block mr-2" />
              تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
              {submitError}
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

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="05XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">العمر *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="العمر"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">المؤهل التعليمي *</label>
              <select
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
              >
                <option value="">اختر المؤهل</option>
                <option value="ثانوي">ثانوي</option>
                <option value="دبلوم">دبلوم</option>
                <option value="بكالوريوس">بكالوريوس</option>
                <option value="ماجستير">ماجستير</option>
                <option value="دكتوراه">دكتوراه</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">الخبرات السابقة</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="اذكر خبراتك في العمل التطوعي أو المجالات ذات العلاقة"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">مجال الاهتمام *</label>
              <select
                required
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
              >
                <option value="">اختر المجال</option>
                <option value="تنظيم الفعاليات">تنظيم الفعاليات</option>
                <option value="الزيارات الميدانية">الزيارات الميدانية</option>
                <option value="التدريب">التدريب والتأهيل</option>
                <option value="التسويق">التسويق والإعلام</option>
                <option value="آخر">مجال آخر</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">الوقت المتاح *</label>
              <select
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
              >
                <option value="">اختر الوقت المتاح</option>
                <option value="صباحي">صباحي</option>
                <option value="مسائي">مسائي</option>
                <option value="عطلة أسبوعية">عطلة أسبوعية</option>
                <option value="مرن">مرن</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">رسالة إضافية</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                rows={4}
                placeholder="أخبرنا المزيد عن دوافعك للتطوع معنا"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال الطلب
                </>
              )}
            </button>
          </form>
        </div>
      </section>
        )
    </div>
  );
}
