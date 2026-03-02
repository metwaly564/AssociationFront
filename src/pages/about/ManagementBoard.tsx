import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';
import { Calendar, Users } from 'lucide-react';

export function ManagementBoard() {
  const [heroTitle, setHeroTitle] = useState('مجلس الإدارة');
  const [heroSubtitle, setHeroSubtitle] = useState('قيادة متميزة لرؤية طموحة');
  const [introText, setIntroText] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagementBoardData();
  }, []);

  const loadManagementBoardData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getManagementBoard();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'مجلس الإدارة');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
      }
      
      // Set members
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error loading management board data:', error);
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          {heroSubtitle && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro */}
      {introText && (
        <section className="container mx-auto px-4 py-10">
          <p className="text-gray-700 leading-8 text-right max-w-4xl mx-auto">
            {introText}
          </p>
        </section>
      )}

      {/* Board Members */}
      {members.length > 0 ? (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">أعضاء مجلس الإدارة</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-100">
                        <span className="text-6xl font-bold text-emerald-600">
                          {member.name?.charAt(0) || 'ع'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-emerald-600 font-semibold mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-gray-600">لا يوجد أعضاء مجلس إدارة متاحين حالياً.</p>
            <p className="text-sm text-gray-500 mt-2">
              يمكنك إضافة أعضاء مجلس الإدارة من صفحة "فريق العمل" في CMS مع تحديد type = 'board'
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

