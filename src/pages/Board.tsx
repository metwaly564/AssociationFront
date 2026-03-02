import { Users, Award, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';

export function Board() {
  const [heroTitle, setHeroTitle] = useState('مجلس الإدارة');
  const [heroSubtitle, setHeroSubtitle] = useState('قيادة متميزة تعمل على تحقيق رؤية الجمعية وأهدافها');
  const [aboutTitle, setAboutTitle] = useState('عن مجلس الإدارة');
  const [aboutDescription, setAboutDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [boardMembers, setBoardMembers] = useState<Array<{
    id: string;
    name: string;
    position: string;
    image_url?: string;
    bio?: string;
    term?: string;
  }>>([]);
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
        
        const aboutSection = data.content.find((c: any) => c.section_key === 'about');
        if (aboutSection) {
          setAboutTitle(aboutSection.title || 'عن مجلس الإدارة');
          setAboutDescription(aboutSection.description || '');
        }
        
        const responsibilitiesSection = data.content.find((c: any) => c.section_key === 'responsibilities');
        if (responsibilitiesSection && responsibilitiesSection.content) {
          try {
            const parsed = JSON.parse(responsibilitiesSection.content);
            if (Array.isArray(parsed)) {
              setResponsibilities(parsed);
            } else {
              setResponsibilities([responsibilitiesSection.content]);
            }
          } catch {
            // If not JSON, use as string
            setResponsibilities([responsibilitiesSection.content]);
          }
        } else {
          // Default responsibilities if not found
          setResponsibilities([
            'وضع الاستراتيجيات والخطط طويلة المدى للجمعية',
            'الإشراف على الأداء المالي والإداري للجمعية',
            'اعتماد البرامج والمشاريع الجديدة',
            'ضمان الالتزام بالمعايير والتشريعات ذات العلاقة',
            'تعزيز الشراكات مع القطاعين العام والخاص',
            'متابعة تنفيذ قرارات الجمعية العمومية',
          ]);
        }
      }
      
      // Set members - use board members from team_members table (type = 'board')
      // Map the data to match the expected format
      const members = (data.members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        position: m.role, // role from team_members
        image_url: m.image_url,
        bio: m.bio,
        term: undefined, // not available in team_members
      }));
      setBoardMembers(members);
    } catch (error) {
      console.error('Error loading management board data:', error);
      // Fallback to default data
      setBoardMembers([]);
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
        {(aboutTitle || aboutDescription) && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  {aboutTitle && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{aboutTitle}</h2>
                  )}
                  {aboutDescription && (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {aboutDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {boardMembers.length > 0 && (
          <>
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="w-8 h-8 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">أعضاء المجلس</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {boardMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    <img
                      src={member.image_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-emerald-600 font-semibold mb-3">{member.position}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{member.bio}</p>
                    )}
                    {member.term && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>فترة العمل: {member.term}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {boardMembers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد بيانات متاحة حالياً</p>
          </div>
        )}

        {responsibilities.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">مهام ومسؤوليات المجلس</h3>
              <div className="space-y-3">
                {responsibilities.map((task, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <p className="text-gray-700 pt-0.5">{task}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
