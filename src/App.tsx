import "./app.scss";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LinkedinLogo from "./assets/LinkedinLogo";
import HomeLogo from "./assets/HomeLogo";
import EmailLogo from "./assets/EmailLogo";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

const name: string = "Le Quoc Bao";
const role: string = "Frontend Developer";
const email: string = "baole07701@gmail.com";
const linkIn: string =
  "https://www.linkedin.com/in/b%E1%BA%A3o-l%C3%AA-1131021a5/";

const Resume = () => {
  const cleanLinkedInUrl = (url: string): string => {
    return url.replace(/https:\/\/www\.linkedin\.com\/in\/[^\s]*/, `${name}`);
  };

  // Change the type to HTMLDivElement
  const resumeContentRef = useRef<HTMLDivElement | null>(null);
  const [resumeContentHeight, setResumeContentHeight] = useState<number>(0);

  useEffect(() => {
    if (resumeContentRef.current) {
      setResumeContentHeight(resumeContentRef.current.scrollHeight);
    }
  }, []);

  const [showLoader, setLoader] = useState<boolean>(false);

  const skills = useMemo<string[]>(
    () => [
      "React",
      "TypeScript",
      "HTML5",
      "JavaScript",
      "CSS3",
      "SASS",
      "Vue",
      "AWS",
      "Firebase",
      "Redux",
      "Vuetify",
      "Material UI",
      "REST API",
      "Tailwind CSS",
      "Bootstrap",
      "Node.js",
      "Docker",
      "Vite",
      "LocalStorage",
      "Axios",
      "Cookies",
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Jira",
      "i18next",
      "SCRUM",
      "Slack",
      "Figma",
      "Windows",
      "macOS",
      "WebSockets",
      "Socket io",
      "Web Development",
      "User Experience (UX)",
      "Collaboration",
    ],
    []
  );

  const highlightedSkills = useMemo<string[]>(
    () => [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "AWS",
      "SASS",
      "Firebase",
      "GitLab",
      "Git",
      "Collaboration",
      "REST API",
      "Jira",
      "i18next",
      "Figma",
      "Vite",
      "Axios",
      "WebSockets",
    ],
    []
  );

  const downloadPDF = useCallback(async () => {
    const resumeContent = resumeContentRef.current;
    if (!resumeContent) return;
    window.scrollTo(0, 0);
    setLoader(true);
    try {
      const canvas = await html2canvas(resumeContent, { scale: 2 }).catch(
        (err) => {
          throw new Error(`html2canvas error: ${err.message}`);
        }
      );
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = (pdfWidth - 2 * margin) / canvasWidth;
      const pdfPageHeightPx = (pdfHeight - 2 * margin) / ratio;
      const totalPages = Math.ceil(canvasHeight / pdfPageHeightPx);

      const paginatePDF = (
        canvas: HTMLCanvasElement,
        pdf: jsPDF,
        totalPages: number,
        pdfPageHeightPx: number,
        canvasWidth: number,
        canvasHeight: number,
        margin: number,
        ratio: number
      ): void => {
        for (let page = 0; page < totalPages; page++) {
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          if (!pageCtx) {
            console.error("Failed to get canvas context.");
            throw new Error("Canvas context error");
          }

          pageCanvas.width = canvasWidth;
          pageCanvas.height = Math.min(
            pdfPageHeightPx,
            canvasHeight - page * pdfPageHeightPx
          );

          // Draw the portion of the canvas corresponding to the current page
          pageCtx.drawImage(
            canvas,
            0,
            page * pdfPageHeightPx,
            canvasWidth,
            pageCanvas.height,
            0,
            0,
            canvasWidth,
            pageCanvas.height
          );

          if (page > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            pageCanvas.toDataURL("image/png"),
            "PNG",
            margin,
            margin,
            pdf.internal.pageSize.getWidth() - 2 * margin,
            pageCanvas.height * ratio
          );
        }
      };

      paginatePDF(
        canvas,
        pdf,
        totalPages,
        pdfPageHeightPx,
        canvasWidth,
        canvasHeight,
        margin,
        ratio
      );

      pdf.save("ResumeLeQuocBao.pdf");
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setLoader(false);
    }
  }, []);

  return (
    <div className="container">
      <div
        className="resume-container"
        id="resume-content"
        ref={resumeContentRef}
        style={{ height: resumeContentHeight }}>
        <header className="resume-header">
          <div className="resume-name-container">
            <h1 className="name">{name}</h1>
            <button onClick={downloadPDF} className="download-button">
              Download as PDF
            </button>
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
                students with varying levels), and another for parents to manage
                their students, which also including bookings, absences, and
                payments. And additionally, a landing page.
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
                Enabled multilingual support, allowing the addition of multiple
                languages beyond English and Vietnamese.
              </li>
              <li>
                Created a dynamic dashboard(calendar) displaying real-time data
                on class schedules and user activities.
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
  );
};

export default memo(Resume);
