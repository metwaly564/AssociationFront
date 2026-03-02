import React from 'react';
import { SurveyForm } from '../../components/SurveyForm';

export function Volunteers() {
  return (
    <SurveyForm 
      title="استبيان قياس رضا المتطوعين" 
      audienceLabel="مجال/نوع التطوع"
      surveyType="volunteers"
    />
  );
}

