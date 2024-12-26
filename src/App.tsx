import "./app.scss";

import jsPDF from "jspdf";
import { toCanvas } from "html-to-image";
import LinkedinLogo from "./assets/LinkedinLogo";
import HomeLogo from "./assets/HomeLogo";
import EmailLogo from "./assets/EmailLogo";
import { useCallback, useRef, useState, memo } from "react";
import {
  email,
  highlightedSkills,
  jobData,
  linkIn,
  name,
  role,
  skills,
} from "./const";
import { cleanLinkedInUrl } from "./utils";

const Resume = () => {
  const resumeContentRef = useRef<HTMLDivElement | null>(null);
  const [showLoader, setLoader] = useState<boolean>(false);

  const downloadPDF = useCallback(async () => {
    const resumeContent = resumeContentRef.current;
    if (!resumeContent) return;

    setLoader(true);

    try {
      const pdf = new jsPDF();
      const margin = 10; // Define margin size (adjust as needed)
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const availablePageHeight = pageHeight - 2 * margin;
      const availablePageWidth = pageWidth - 2 * margin;
      let cumulativeHeight = margin;

      // Get all sections
      const sections = resumeContent.querySelectorAll("header, section");

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;

        // Get all child elements within the section
        const elements = section.children;

        for (let j = 0; j < elements.length; j++) {
          const element = elements[j] as HTMLElement;

          // Convert element to canvas
          const canvas = await toCanvas(element, { cacheBust: true });
          const imgData = canvas.toDataURL("image/png");
          const imgProps = pdf.getImageProperties(imgData);
          const imgHeight =
            (imgProps.height * availablePageWidth) / imgProps.width;

          // Check if adding the element exceeds the available page height
          if (cumulativeHeight + imgHeight > pageHeight - margin) {
            // If the element is larger than the available page height, scale it down
            if (imgHeight > availablePageHeight) {
              const scale = availablePageHeight / imgHeight;
              const scaledWidth = availablePageWidth * scale;
              const scaledHeight = imgHeight * scale;

              pdf.addPage();
              cumulativeHeight = margin;

              pdf.addImage(
                imgData,
                "PNG",
                margin,
                cumulativeHeight,
                scaledWidth,
                scaledHeight
              );
              cumulativeHeight += scaledHeight;
            } else {
              pdf.addPage();
              cumulativeHeight = margin;

              pdf.addImage(
                imgData,
                "PNG",
                margin,
                cumulativeHeight,
                availablePageWidth,
                imgHeight
              );
              cumulativeHeight += imgHeight;
            }
          } else {
            // Add image to PDF
            pdf.addImage(
              imgData,
              "PNG",
              margin,
              cumulativeHeight,
              availablePageWidth,
              imgHeight
            );
            cumulativeHeight += imgHeight;
          }
        }
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoader(false);
    }
  }, []);

  return (
    <div className="container">
      <div className="resume-container">
        <button onClick={downloadPDF} className="download-button">
          {showLoader ? "Loading" : "Download as PDF"}
        </button>

        <div ref={resumeContentRef}>
          <header className="resume-header">
            <div className="resume-name-container">
              <h1 className="name">{name}</h1>
            </div>
            <p className="title">{role}</p>
            <div className="contact">
              <a href={`mailto:${email}`}>
                <EmailLogo />
                <p>{email}</p>
              </a>
              |
              <a
                href="https://doriandevelops.com"
                target="_blank"
                rel="noreferrer">
                <HomeLogo />
                <p>lequocbao.com</p>
              </a>
              |
              <a href={linkIn} target="_blank" rel="noreferrer">
                <LinkedinLogo />
                <p>{cleanLinkedInUrl(linkIn)}</p>
              </a>
            </div>
          </header>

          <section className="skills">
            <h2>Skills</h2>
            <div className="skills-container">
              <p>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className={
                      highlightedSkills.includes(skill) ? "highlight" : ""
                    }>
                    {skill}
                    {index < skills.length - 1 && " • "}
                  </span>
                ))}
              </p>
            </div>
          </section>

          <section className="experience">
            <h2>Experience</h2>
            {jobData?.map((jobDt, key) => (
              <div className="job" key={key}>
                <div className="headWrap">
                  <h3>{jobDt.title}</h3>
                  <p className="location-date">{jobDt.date}</p>
                </div>
                <ul>
                  {jobDt.accomplishments.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="projects">
            <h2>Personal Projects</h2>
            <div className="project">
              <h3>Portfolio Site</h3>
              <ul>
                <li>
                  Converted an HTML portfolio to ReactJS using Styled Components
                  and Flexbox.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default memo(Resume);
