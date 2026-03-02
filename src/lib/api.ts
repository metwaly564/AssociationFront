// API Client للموقع العام
// يتصل بـ CMS API لقراءة البيانات

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/public';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  category?: 'events' | 'programs' | 'achievements' | 'all';
  status: string;
  published_at?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  body?: string;
  status: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  show_on_home?: boolean;
  priority?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'board' | 'staff';
  bio?: string;
  image_url?: string;
  order_index?: number;
}

export interface AssociationMember {
  id: string;
  name: string;
  position: string;
  category: 'chairman' | 'member';
  email?: string;
  join_date?: string;
  membership_number?: string;
}

export interface DonationProduct {
  id: string;
  title: string;
  description: string;
  donation_type: string;
  suggested_amount?: number;
  min_amount?: number;
  is_active: boolean;
  order_index?: number;
  image_url?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order_index?: number;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  metadata?: any;
}

export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  icon_name?: string;
}

export interface HomepageValue {
  id: string;
  title: string;
  description?: string;
  icon_name?: string;
}

export interface HomepagePartner {
  id: string;
  name: string;
  image_url?: string;
  website_url?: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  type: string;
  summary?: string;
  body?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface AboutSection {
  id: string;
  section_key: string;
  title?: string;
  content?: string;
  icon_name?: string;
}

export interface AboutGoal {
  id: string;
  title: string;
  order_index?: number;
}

export interface AboutContent {
  sections: AboutSection[];
  goals: AboutGoal[];
}

export interface HomepageContent {
  sections: HomepageSection[];
  stats: HomepageStat[];
  values: HomepageValue[];
  partners: HomepagePartner[];
}

export const publicApi = {
  async getNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE}/news`);
      if (!response.ok) throw new Error('فشل جلب الأخبار');
      return response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    try {
      const response = await fetch(`${API_BASE}/news/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('فشل جلب الخبر');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching news item:', error);
      return null;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) throw new Error('فشل جلب المشاريع');
      return response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getTeam(): Promise<TeamMember[]> {
    try {
      const response = await fetch(`${API_BASE}/team`);
      if (!response.ok) throw new Error('فشل جلب فريق العمل');
      return response.json();
    } catch (error) {
      console.error('Error fetching team:', error);
      return [];
    }
  },

  async getAssociationMembers(): Promise<AssociationMember[]> {
    try {
      const response = await fetch(`${API_BASE}/members`);
      if (!response.ok) throw new Error('فشل جلب أعضاء الجمعية');
      return response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  },

  async getDonationProducts(): Promise<DonationProduct[]> {
    try {
      const response = await fetch(`${API_BASE}/donations/products`);
      if (!response.ok) throw new Error('فشل جلب منتجات التبرع');
      return response.json();
    } catch (error) {
      console.error('Error fetching donation products:', error);
      return [];
    }
  },

  async submitDonation(donationData: {
    donation_type: string;
    product_id?: string;
    donor_name: string;
    donor_email?: string;
    donor_phone?: string;
    amount: number;
    donation_method_id: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; donation?: any }> {
    try {
      const response = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل إرسال التبرع');
      }
      return response.json();
    } catch (error: any) {
      console.error('Error submitting donation:', error);
      throw error;
    }
  },

  async getCategories(): Promise<NewsCategory[]> {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) throw new Error('فشل جلب التصنيفات');
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return default categories if API fails
      return [
        { id: 'events', name: 'الفعاليات', slug: 'events', order_index: 1 },
        { id: 'programs', name: 'البرامج', slug: 'programs', order_index: 2 },
        { id: 'achievements', name: 'الإنجازات', slug: 'achievements', order_index: 3 },
      ];
    }
  },

  async getHomepageContent(): Promise<HomepageContent> {
    try {
      const response = await fetch(`${API_BASE}/homepage`);
      if (!response.ok) throw new Error('فشل جلب محتوى الصفحة الرئيسية');
      return response.json();
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      // Return empty structure if API fails
      return {
        sections: [],
        stats: [],
        values: [],
        partners: [],
      };
    }
  },

  async getPageBySlug(slug: string): Promise<StaticPage | null> {
    try {
      const response = await fetch(`${API_BASE}/pages/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('فشل جلب الصفحة');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  },

  async getAboutContent(): Promise<AboutContent> {
    try {
      const response = await fetch(`${API_BASE}/about`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة "من نحن"');
      return response.json();
    } catch (error) {
      console.error('Error fetching about content:', error);
      return {
        sections: [],
        goals: [],
      };
    }
  },

  async getProgramsPageContent(): Promise<{ content: any[]; categories: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/programs-page`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة البرامج والمشاريع');
      return response.json();
    } catch (error) {
      console.error('Error fetching programs page content:', error);
      return {
        content: [],
        categories: [],
      };
    }
  },

  async getHomepageFeatured(): Promise<{ news: NewsItem[]; projects: Project[] }> {
    try {
      const response = await fetch(`${API_BASE}/homepage-featured`);
      if (!response.ok) throw new Error('فشل جلب المحتوى المميز');
      return response.json();
    } catch (error) {
      console.error('Error fetching featured content:', error);
      return {
        news: [],
        projects: [],
      };
    }
  },

  async getTeamPageContent(): Promise<{ content: any[]; heroImages: any[]; executiveDirector: any }> {
    try {
      const response = await fetch(`${API_BASE}/team-page`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة فريق العمل');
      return response.json();
    } catch (error) {
      console.error('Error fetching team page content:', error);
      return {
        content: [],
        heroImages: [],
        executiveDirector: null,
      };
    }
  },

  async getLicenses(): Promise<Array<{ id: string; title: string; description?: string; file_url?: string; file_name?: string }>> {
    try {
      const response = await fetch(`${API_BASE}/licenses`);
      if (!response.ok) throw new Error('فشل جلب التراخيص');
      return response.json();
    } catch (error) {
      console.error('Error fetching licenses:', error);
      return [];
    }
  },

  async getContactPageContent(): Promise<{ content: any[]; contactInfo: any[]; workingHours: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/contact-page`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة التواصل');
      return response.json();
    } catch (error) {
      console.error('Error fetching contact page content:', error);
      return {
        content: [],
        contactInfo: [],
        workingHours: [],
      };
    }
  },

  async getVolunteeringPageContent(): Promise<{ content: any[]; benefits: any[]; opportunities: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/volunteering-page`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة التطوع');
      return response.json();
    } catch (error) {
      console.error('Error fetching volunteering page content:', error);
      return {
        content: [],
        benefits: [],
        opportunities: [],
      };
    }
  },

  async getMembershipPageContent(): Promise<{ content: any[]; types: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/membership-page`);
      if (!response.ok) throw new Error('فشل جلب محتوى صفحة العضوية');
      return response.json();
    } catch (error) {
      console.error('Error fetching membership page content:', error);
      return {
        content: [],
        types: [],
      };
    }
  },

  async getPolicies(): Promise<{ policies: any[]; content: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/policies`);
      if (!response.ok) throw new Error('فشل جلب السياسات');
      return response.json();
    } catch (error) {
      console.error('Error fetching policies:', error);
      return {
        policies: [],
        content: [],
      };
    }
  },

  async getFinancialStatements(): Promise<{ statements: any[]; content: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/financial-statements`);
      if (!response.ok) throw new Error('فشل جلب القوائم المالية');
      return response.json();
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      return {
        statements: [],
        content: [],
      };
    }
  },

  async getReports(): Promise<{ reports: any[]; content: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/reports`);
      if (!response.ok) throw new Error('فشل جلب التقارير');
      return response.json();
    } catch (error) {
      console.error('Error fetching reports:', error);
      return {
        reports: [],
        content: [],
      };
    }
  },

  async getOperationalBudget(): Promise<{ content: any[]; budgets: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/operational-budget`);
      if (!response.ok) throw new Error('فشل جلب الخطة التشغيلية والموازنة');
      return response.json();
    } catch (error) {
      console.error('Error fetching operational budget:', error);
      return {
        content: [],
        budgets: [],
      };
    }
  },

  async getSiteSettings(): Promise<{ settings: Record<string, { value: string; type: string }> }> {
    try {
      const response = await fetch(`${API_BASE}/settings`);
      if (!response.ok) throw new Error('فشل جلب إعدادات الموقع');
      return response.json();
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return {
        settings: {},
      };
    }
  },

  async getStrategicFramework(): Promise<{ sections: any[]; goals: any[]; values: any[]; content: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/strategic-framework`);
      if (!response.ok) throw new Error('فشل جلب محتوى الإطار الاستراتيجي');
      return response.json();
    } catch (error) {
      console.error('Error fetching strategic framework:', error);
      return {
        sections: [],
        goals: [],
        values: [],
        content: [],
      };
    }
  },

  async getGeneralAssembly(): Promise<{ content: any[]; meetings: any[]; members: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/general-assembly`);
      if (!response.ok) throw new Error('فشل جلب محتوى الجمعية العمومية');
      return response.json();
    } catch (error) {
      console.error('Error fetching general assembly:', error);
      return {
        content: [],
        meetings: [],
        members: [],
      };
    }
  },

  async getManagementBoard(): Promise<{ content: any[]; members: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/management-board`);
      if (!response.ok) throw new Error('فشل جلب محتوى مجلس الإدارة');
      return response.json();
    } catch (error) {
      console.error('Error fetching management board:', error);
      return {
        content: [],
        members: [],
      };
    }
  },

  async getOrgStructure(): Promise<{ content: any[]; items: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/org-structure`);
      if (!response.ok) throw new Error('فشل جلب محتوى الهيكل التنظيمي');
      return response.json();
    } catch (error) {
      console.error('Error fetching org structure:', error);
      return {
        content: [],
        items: [],
      };
    }
  },

  async getCommittees(): Promise<{ content: any[]; committees: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/committees`);
      if (!response.ok) throw new Error('فشل جلب محتوى اللجان');
      return response.json();
    } catch (error) {
      console.error('Error fetching committees:', error);
      return {
        content: [],
        committees: [],
      };
    }
  },

  async getSupervisingAuthorities(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/supervising-authorities`);
      if (!response.ok) throw new Error('فشل جلب الجهات المشرفة');
      return response.json();
    } catch (error) {
      console.error('Error fetching supervising authorities:', error);
      return [];
    }
  },

  async submitFeedback(data: {
    survey_type: 'employees' | 'volunteers' | 'donors' | 'beneficiaries' | 'stakeholders';
    name: string;
    email?: string;
    relation?: string;
    satisfaction: number;
    notes?: string;
  }): Promise<{ success: boolean; id: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل إرسال الاستبيان');
      }

      return response.json();
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  async getFeedbackStats(): Promise<{
    total: number;
    byType: Array<{
      type: string;
      count: number;
      avgSatisfaction: string;
      minSatisfaction: number;
      maxSatisfaction: number;
    }>;
    satisfactionDistribution: Array<{
      level: number;
      count: number;
    }>;
  }> {
    try {
      const response = await fetch(`${API_BASE}/feedback/stats`);
      if (!response.ok) throw new Error('فشل جلب إحصائيات الاستبيانات');
      return response.json();
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      return {
        total: 0,
        byType: [],
        satisfactionDistribution: [],
      };
    }
  },

  async getOfficesBranches(): Promise<{ content: any[]; offices: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/offices-branches`);
      if (!response.ok) throw new Error('فشل جلب محتوى المكاتب والفروع');
      return response.json();
    } catch (error) {
      console.error('Error fetching offices/branches:', error);
      return {
        content: [],
        offices: [],
      };
    }
  },

  async getAnnualReports(): Promise<{ content: any[]; reports: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/annual-reports`);
      if (!response.ok) throw new Error('فشل جلب محتوى التقارير السنوية');
      return response.json();
    } catch (error) {
      console.error('Error fetching annual reports:', error);
      return {
        content: [],
        reports: [],
      };
    }
  },

  async getJobs(): Promise<{ content: any[]; jobs: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/jobs`);
      if (!response.ok) throw new Error('فشل جلب محتوى الوظائف');
      return response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        content: [],
        jobs: [],
      };
    }
  },

  async submitJobApplication(payload: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/job-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON, but handle HTML error pages gracefully
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('فشل إرسال طلب التوظيف: استجابة غير صحيحة من الخادم');
      }

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال طلب التوظيف');
      }

      return data;
    } catch (error: any) {
      console.error('Error submitting job application:', error);
      throw error;
    }
  },

  async getPartnership(): Promise<{ content: any[]; types: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/partnership`);
      if (!response.ok) throw new Error('فشل جلب محتوى الشراكة');
      return response.json();
    } catch (error) {
      console.error('Error fetching partnership:', error);
      return {
        content: [],
        types: [],
      };
    }
  },

  async submitPartnershipRequest(payload: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/partnership-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Try to parse error as JSON, but handle HTML errors
        let errorMessage = 'فشل إرسال طلب الشراكة';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `فشل إرسال الطلب: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      console.error('Error submitting partnership request:', error);
      throw error;
    }
  },

  async getDonate(): Promise<{ content: any[]; methods: any[] }> {
    try {
      const response = await fetch(`${API_BASE}/donate`);
      if (!response.ok) throw new Error('فشل جلب محتوى التبرع');
      return response.json();
    } catch (error) {
      console.error('Error fetching donate:', error);
      return {
        content: [],
        methods: [],
      };
    }
  },

  async submitVolunteeringApplication(payload: {
    name: string;
    email: string;
    phone: string;
    age?: string;
    education?: string;
    experience?: string;
    interest?: string;
    availability?: string;
    message?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/volunteering-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل إرسال طلب التطوع');
      }
      return response.json();
    } catch (error: any) {
      console.error('Error submitting volunteering application:', error);
      throw error;
    }
  },

  async submitMembershipApplication(payload: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
    membershipType: string;
    occupation?: string;
    address?: string;
    reason?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/membership-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل إرسال طلب العضوية');
      }
      return response.json();
    } catch (error: any) {
      console.error('Error submitting membership application:', error);
      throw error;
    }
  },
};
