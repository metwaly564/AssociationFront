import React from 'react';
import { SurveyForm } from '../../components/SurveyForm';

export function Stakeholders() {
  return (
    <SurveyForm 
      title="استبيان قياس رضا أصحاب العلاقة" 
      audienceLabel="جهة/صفة العلاقة"
      surveyType="stakeholders"
    />
  );
}

