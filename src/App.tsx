import "./app.scss";

import jsPDF from "jspdf";
import { toCanvas, toPng } from "html-to-image";
import LinkedinLogo from "./assets/LinkedinLogo";
import HomeLogo from "./assets/HomeLogo";
import EmailLogo from "./assets/EmailLogo";
import { useCallback, useRef, useState, memo } from "react";
import { email, highlightedSkills, linkIn, name, role, skills } from "./const";
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
            <div className="job">
              <h3>Comprehensive Management Center</h3>
              <p className="location-date">
                Thu Duc, HCM | April. 2021 - Present
              </p>
              <ul>
                <li>
                  Developed two web applications for super admins: one to manage
                  multiple centres, each overseeing classes, permissions, and
                  users with different roles (staff, instructors, parents, and
                  students with varying levels), and another for parents to
                  manage their students, which also including bookings,
                  absences, and payments. And additionally, a landing page.
                </li>
                <li>
                  Implemented custom reusable components for a responsive user
                  interface.
                </li>
                <li>
                  Integrated payment processing and discount features for class
                  bookings.
                </li>
                <li>
                  Enabled multilingual support, allowing the addition of
                  multiple languages beyond English and Vietnamese.
                </li>
                <li>
                  Created a dynamic dashboard(calendar) displaying real-time
                  data on class schedules and user activities.
                </li>
                <li>
                  Developed advanced reporting features to track metrics such as
                  attendance and revenue.
                </li>
              </ul>
            </div>
          </section>

          <section className="projects">
            <h2>Personal Projects</h2>
            <div className="project">
              <h3>The Grappling Network</h3>
              <ul>
                <li>Built with GatsbyJS and Styled Components for ReactJS.</li>
                <li>
                  Utilized the Reddit API and Google Places API to display
                  content.
                </li>
              </ul>
            </div>
            <div className="project">
              <h3>Jiu Jitsu Tournament Scraper</h3>
              <ul>
                <li>Built with NodeJS, Express, MongoDB, and CheerioJS.</li>
                <li>
                  Scraped and served multiple Jiu Jitsu tournament results via
                  API.
                </li>
              </ul>
            </div>
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
