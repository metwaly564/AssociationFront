import { Users, Award, Star, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';
import * as LucideIcons from 'lucide-react';

export function Membership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    membershipType: '',
    occupation: '',
    address: '',
    reason: '',
  });

  // Page content state
  const [heroTitle, setHeroTitle] = useState('العضوية');
  const [heroSubtitle, setHeroSubtitle] = useState('انضم إلى عائلة الجمعية وكن شريكًا في رحلة العطاء');
  const [whyTitle, setWhyTitle] = useState('لماذا تصبح عضوًا؟');
  const [whyDescription, setWhyDescription] = useState('');
  const [typesTitle, setTypesTitle] = useState('أنواع العضويات');
  const [membershipTypes, setMembershipTypes] = useState<any[]>([]);
  const [formTitle, setFormTitle] = useState('قدّم طلب عضوية');
  const [formSubtitle, setFormSubtitle] = useState('املأ النموذج أدناه للانضمام إلى عائلة الجمعية');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getMembershipPageContent();
      
      // Set hero content
      const heroSection = data.content?.find((c: any) => c.section_key === 'hero_title');
      if (heroSection) {
        setHeroTitle(heroSection.title || 'العضوية');
        setHeroSubtitle(heroSection.subtitle || '');
      }
      
      // Set why section
      const whySection = data.content?.find((c: any) => c.section_key === 'why_title');
      if (whySection) {
        setWhyTitle(whySection.title || 'لماذا تصبح عضوًا؟');
        setWhyDescription(whySection.description || '');
      }
      
      // Set types title
      const typesTitleSection = data.content?.find((c: any) => c.section_key === 'types_title');
      if (typesTitleSection) {
        setTypesTitle(typesTitleSection.title || 'أنواع العضويات');
      }
      
      // Set form section
      const formSection = data.content?.find((c: any) => c.section_key === 'form_title');
      if (formSection) {
        setFormTitle(formSection.title || 'قدّم طلب عضوية');
        setFormSubtitle(formSection.subtitle || '');
      }
      
      // Process membership types
      const processedTypes = (data.types || []).map((type: any) => {
        let features = [];
        if (Array.isArray(type.features)) {
          features = type.features;
        } else if (typeof type.features === 'string') {
          try {
            features = JSON.parse(type.features);
          } catch {
            features = [];
          }
        }
        
        return {
          ...type,
          features: features,
          icon: getIcon(type.icon_name, Users),
        };
      });
      
      setMembershipTypes(processedTypes);
    } catch (error) {
      console.error('Error loading membership data:', error);
      // Fallback to default types
      setMembershipTypes([
        {
          icon: Users,
          title: 'العضوية العادية',
          color: 'emerald',
          features: ['حضور الجمعية العمومية', 'التصويت على القرارات', 'المشاركة في الفعاليات', 'تلقي النشرات الدورية', 'الاستفادة من الخدمات'],
          requirements: 'مفتوحة لجميع المواطنين والمقيمين',
        },
        {
          icon: Star,
          title: 'العضوية الشرفية',
          color: 'amber',
          features: ['جميع مزايا العضوية العادية', 'التكريم في الفعاليات', 'الأولوية في المشاركة', 'شهادة عضوية مميزة', 'دعوة خاصة للفعاليات الكبرى'],
          requirements: 'لمن قدم خدمات جليلة للجمعية',
        },
        {
          icon: Award,
          title: 'العضوية الفخرية',
          color: 'purple',
          features: ['جميع مزايا العضوية الشرفية', 'عضوية مدى الحياة', 'المشاركة في صنع القرار الاستراتيجي', 'تكريم سنوي خاص', 'لقاءات دورية مع القيادة'],
          requirements: 'تمنح للشخصيات البارزة والداعمة',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await publicApi.submitMembershipApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        idNumber: formData.idNumber,
        membershipType: formData.membershipType,
        occupation: formData.occupation,
        address: formData.address,
        reason: formData.reason,
      });

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        idNumber: '',
        membershipType: '',
        occupation: '',
        address: '',
        reason: '',
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
  const getIcon = (iconName?: string, defaultIcon: any = Users) => {
    if (!iconName) return defaultIcon;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || defaultIcon;
  };

  // Color mapping for Tailwind CSS
  const getColorClasses = (color?: string) => {
    const colorMap: { [key: string]: string } = {
      emerald: 'bg-emerald-600',
      amber: 'bg-amber-600',
      purple: 'bg-purple-600',
      blue: 'bg-blue-600',
      red: 'bg-red-600',
      indigo: 'bg-indigo-600',
      teal: 'bg-teal-600',
      cyan: 'bg-cyan-600',
      pink: 'bg-pink-600',
    };
    return colorMap[color || 'emerald'] || 'bg-emerald-600';
  };

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
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Users className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{whyTitle}</h2>
          {whyDescription && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {whyDescription}
            </p>
          )}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{typesTitle}</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {membershipTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className={`${getColorClasses(type.color)} text-white p-6 text-center`}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">المزايا:</h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-emerald-600 font-bold mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3">الشروط:</h4>
                    {Array.isArray(type.requirements) ? (
                      <ul className="space-y-2">
                        {type.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="font-bold mt-1">•</span>
                            <span >{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : typeof type.requirements === 'string' && type.requirements.startsWith('[') ? (
                      (() => {
                        try {
                          const parsed = JSON.parse(type.requirements);
                          return (
                            <ul className="space-y-2">
                              {parsed.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                  <span className="font-bold mt-1">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        } catch {
                          return <p className="text-gray-600">{type.requirements}</p>;
                        }
                      })()
                    ) : (
                      <p className="text-gray-600 break-words">{type.requirements}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
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
                  <label className="block text-gray-700 font-semibold mb-2">رقم الهوية *</label>
                  <input
                    type="text"
                    required
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="رقم الهوية الوطنية أو الإقامة"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">نوع العضوية المطلوبة *</label>
                <select
                  required
                  value={formData.membershipType}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                >
                  <option value="">اختر نوع العضوية</option>
                  <option value="عادية">العضوية العادية</option>
                  <option value="شرفية">العضوية الداعمة</option>
                  {/* <option value="فخرية">العضوية الفخرية</option> */}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">المهنة *</label>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="المهنة أو مجال العمل"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">العنوان *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="المدينة والحي"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  لماذا ترغب في الانضمام للجمعية؟ *
                </label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="أخبرنا عن دوافعك للانضمام وكيف تخطط للمساهمة"
                ></textarea>
              </div>

              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                  تم إرسال طلب العضوية بنجاح! سنتواصل معك قريبًا.
                </div>
              )}
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'جاري الإرسال...' : 'إرسال طلب العضوية'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
