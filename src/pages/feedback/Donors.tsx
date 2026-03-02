import React from 'react';
import { SurveyForm } from '../../components/SurveyForm';

export function Donors() {
  return (
    <SurveyForm 
      title="استبيان قياس رضا المتبرعين" 
      audienceLabel="نوع/قيمة التبرع"
      surveyType="donors"
    />
  );
}

