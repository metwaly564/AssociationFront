import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';
import { FileText, Calendar, Download } from 'lucide-react';

export function GeneralAssembly() {
  const [heroTitle, setHeroTitle] = useState('الجمعية العمومية');
  const [heroSubtitle, setHeroSubtitle] = useState('أعضاء الجمعية العمومية');
  const [introText, setIntroText] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeneralAssemblyData();
  }, []);

  const loadGeneralAssemblyData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getGeneralAssembly();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الجمعية العمومية');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
      }
      
      // Set members
      setMembers(data.members || []);
      
      // Set meetings
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Error loading general assembly data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get chairman (first member or member with category 'chairman')
  const chairman = members.find(m => m.category === 'chairman') || members[0];
  const otherMembers = members.filter(m => m.id !== chairman?.id);

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

      {/* Featured vertical card - Chairman */}
      {chairman && (
        <section className="container mx-auto px-4 pb-6">
          <div className="max-w-sm mx-auto">
            <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  {chairman.name?.charAt(0) || 'ع'}
                </span>
              </div>
              <div className="mt-4 leading-7">
                <h3 className="text-xl font-bold text-gray-900">{chairman.name}</h3>
                <div className="text-emerald-700 text-sm">{chairman.position || 'رئيس مجلس الإدارة'}</div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-gray-700">
                {chairman.email && (
                  <div>
                    <span className="text-gray-500">البريد الإلكتروني:</span>
                    <a href={`mailto:${chairman.email}`} className="mr-2 text-emerald-700" dir="ltr">
                      {chairman.email}
                    </a>
                  </div>
                )}
                {chairman.join_date && (
                  <div>
                    <span className="text-gray-500">تاريخ الانضمام:</span>
                    <span className="mr-2">
                      {new Date(chairman.join_date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                )}
                {chairman.membership_number && (
                  <div>
                    <span className="text-gray-500">رقم العضوية:</span>
                    <span className="mr-2">{chairman.membership_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Members grid */}
      {otherMembers.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">أعضاء الجمعية</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherMembers.map((member) => (
              <div key={member.id} className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-emerald-600">
                      {member.name?.charAt(0) || 'ع'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900">{member.name}</div>
                    <div className="text-sm text-emerald-700">{member.position || 'عضو'}</div>
                  </div>
                </div>
                {member.email && (
                  <div className="mt-4 text-sm text-gray-700">
                    <span className="text-gray-500">البريد:</span>
                    <a href={`mailto:${member.email}`} className="mr-2 text-emerald-700" dir="ltr">
                      {member.email}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assembly Meetings */}
      {meetings.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">محاضر الاجتماعات</h2>
              </div>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {meeting.title}
                        </h3>
                        {meeting.description && (
                          <p className="text-gray-600 mb-3">{meeting.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {meeting.meeting_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(meeting.meeting_date).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}
                          {meeting.meeting_number && (
                            <div>
                              <span>رقم الاجتماع: </span>
                              <span className="font-semibold">{meeting.meeting_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {meeting.file_url && (
                        <a
                          href={meeting.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

