import React from 'react';
import { SurveyForm } from '../../components/SurveyForm';

export function Beneficiaries() {
  return (
    <SurveyForm 
      title="استبيان قياس رضا المستفيدين" 
      audienceLabel="نوع الخدمة/البرنامج"
      surveyType="beneficiaries"
    />
  );
}

