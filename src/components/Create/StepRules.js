"use client";
import CompetitionRules from "@/components/rules/CompetitionRules"; "./Create.module.css"; 

export default function StepRules({ form, setForm, onBack, onSubmit }) {

  console.log(form);
  return (
    <CompetitionRules
      form={form}
      setForm={setForm}
      onBack={onBack}
      onSubmit={onSubmit}
    />
  );
}
