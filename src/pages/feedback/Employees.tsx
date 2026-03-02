import React from 'react';
import { SurveyForm } from '../../components/SurveyForm';

export function Employees() {
  return (
    <SurveyForm 
      title="استبيان قياس رضا الموظفين" 
      audienceLabel="القسم/المسمى الوظيفي"
      surveyType="employees"
    />
  );
}

