import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ClassicTemplate from './resumeTemplates/ClassicTemplate';
import ModernTemplate from './resumeTemplates/ModernTemplate';
import TechnicalTemplate from './resumeTemplates/TechnicalTemplate';

export default function ResumePreview({ resume, userProfile }) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resume.name || 'Resume'}.pdf`,
  });

  const renderTemplate = () => {
    switch (resume.template) {
      case 'modern':
        return <ModernTemplate resume={resume} userProfile={userProfile} />;
      case 'technical':
        return <TechnicalTemplate resume={resume} userProfile={userProfile} />;
      case 'classic':
      default:
        return <ClassicTemplate resume={resume} userProfile={userProfile} />;
    }
  };

  return (
    <div className="resume-preview">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <button className="btn-primary" onClick={handlePrint}>
          Download PDF
        </button>
      </div>
      <div className="preview-content" ref={componentRef}>
        {renderTemplate()}
      </div>
    </div>
  );
}
