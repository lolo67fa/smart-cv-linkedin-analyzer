import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getScoreStatus, getScoreIcon } from "../utils";

function IntakeResults({ result }) {
  const reportRef = useRef(null);

  const downloadReportPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("AI-Career-Agent-Report.pdf");
  };

  if (!result) {
    return (
      <section className="results" id="results">
        <div className="sectionHeader">
          <span>Analysis Result</span>
          <h2>Your Professional Profile Report</h2>
          <p>Your AI-powered report will appear here after analysis.</p>
        </div>

        <div className="emptyResult">
          <div className="emptyIcon">📊</div>
          <h3>No report yet</h3>
          <p>Upload your CV and click Analyze Profile to see your report.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="results" id="results">
      <div className="sectionHeader">
        <span>Analysis Result</span>
        <h2>Your Professional Profile Report</h2>
        <p>
          Your baseline score. Switch to the AI Career Agents below for
          detailed feedback and next steps.
        </p>
      </div>

      <div className="resultActions">
        <button className="downloadBtn" onClick={downloadReportPDF}>
          📥 Download Report PDF
        </button>
      </div>

      <div className="resultDashboard" ref={reportRef}>
        <div className={`scoreBox ${getScoreStatus(result.overall_score)}`}>
          <div className="scoreTop">
            <div className="scoreIcon">{getScoreIcon(result.overall_score)}</div>
            <h3>Overall Score</h3>
          </div>
          <strong>{result.overall_score}%</strong>
          <p>General profile matching level</p>
        </div>

        <div className={`scoreBox ${getScoreStatus(result.cv_score)}`}>
          <div className="scoreTop">
            <div className="scoreIcon">{getScoreIcon(result.cv_score)}</div>
            <h3>CV Score</h3>
          </div>
          <strong>{result.cv_score}%</strong>
          <p>CV keyword and role matching</p>
        </div>

        <div className={`scoreBox ${getScoreStatus(result.linkedin_score)}`}>
          <div className="scoreTop">
            <div className="scoreIcon">{getScoreIcon(result.linkedin_score)}</div>
            <h3>LinkedIn Score</h3>
          </div>
          <strong>{result.linkedin_score}%</strong>
          <p>LinkedIn About quality</p>
        </div>
      </div>
    </section>
  );
}

export default IntakeResults;
