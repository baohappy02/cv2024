import "./app.scss";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import LinkedinLogo from "./assets/LinkedinLogo";
import HomeLogo from "./assets/HomeLogo";
import EmailLogo from "./assets/EmailLogo";
import { useCallback, useRef, useState, memo } from "react";
import { email, highlightedSkills, linkIn, name, role, skills } from "./const";
import { cleanLinkedInUrl } from "./utils";

const Resume = () => {
  const resumeContentRef = useRef<HTMLDivElement | null>(null);
  const [showLoader, setLoader] = useState<boolean>(false);

  const convertSectionToImage = async (
    section: HTMLElement,
    pdfWidth: number
  ) => {
    try {
      const sectionImage = await toPng(section, { cacheBust: true });
      const imgProps = new jsPDF().getImageProperties(sectionImage);
      const sectionHeight = (imgProps.height * pdfWidth) / imgProps.width;
      return { sectionImage, sectionHeight };
    } catch (error) {
      console.error("Error converting section to image:", error);
      return null;
    }
  };

  const addSectionToPDF = (
    pdf: jsPDF,
    sectionImage: string,
    sectionHeight: number,
    position: number,
    pdfWidth: number,
    pageHeight: number
  ) => {
    if (position + sectionHeight > pageHeight) {
      pdf.addPage();
      position = 0;
    }
    pdf.addImage(sectionImage, "PNG", 0, position, pdfWidth, sectionHeight);
    return position + sectionHeight;
  };

  const generatePDF = async (
    sections: NodeListOf<HTMLElement>,
    pdf: jsPDF,
    pdfWidth: number,
    pageHeight: number
  ) => {
    let position = 0;
    for (const section of sections) {
      const result = await convertSectionToImage(section, pdfWidth);
      if (result) {
        const { sectionImage, sectionHeight } = result;
        position = addSectionToPDF(
          pdf,
          sectionImage,
          sectionHeight,
          position,
          pdfWidth,
          pageHeight
        );
      }
    }
  };

  const downloadPDF = useCallback(async () => {
    const resumeContent = resumeContentRef.current;
    if (!resumeContent) return;

    setLoader(true);

    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const sections = resumeContent.querySelectorAll(
        "section, header"
      ) as NodeListOf<HTMLElement>;

      await generatePDF(sections, pdf, pdfWidth, pageHeight);
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
