import "./app.scss";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LinkedinLogo from "./assets/LinkedinLogo";
import HomeLogo from "./assets/HomeLogo";
import EmailLogo from "./assets/EmailLogo";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { email, highlightedSkills, linkIn, name, role, skills } from "./const";
import { cleanLinkedInUrl } from "./utils";

const Resume = () => {
  // Change the type to HTMLDivElement
  const resumeContentRef = useRef<HTMLDivElement | null>(null);

  const [showLoader, setLoader] = useState<boolean>(false);

  const downloadPDF = useCallback(async () => {
    const resumeContent = resumeContentRef.current;
    if (!resumeContent) return;

    window.scrollTo(0, 0);
    setLoader(true);

    try {
      const canvas = await html2canvas(resumeContent, { scale: 1 });
      const canvasHeight = canvas.height;
      const canvasWidth = canvas.width;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const margin = 10;
      const ratio = (pdfWidth - 2 * margin) / canvasWidth; // Ratio for scaling
      const pdfPageHeightPx = (pdfHeight - 2 * margin) / ratio; // Height in pixels for a PDF page
      const totalImages = Math.ceil(canvasHeight / pdfPageHeightPx); // Number of images required

      const images = [];

      for (let page = 0; page < totalImages; page++) {
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");

        if (!pageCtx) {
          console.error("Failed to get canvas context.");
          throw new Error("Canvas context error");
        }

        // Set the width and height for the page canvas
        pageCanvas.width = canvasWidth;
        const currentPageHeight = Math.min(
          pdfPageHeightPx,
          canvasHeight - page * pdfPageHeightPx
        );
        pageCanvas.height = currentPageHeight;

        // Draw the relevant portion of the original canvas
        pageCtx.drawImage(
          canvas,
          0,
          page * pdfPageHeightPx,
          canvasWidth,
          currentPageHeight,
          0,
          0,
          canvasWidth,
          currentPageHeight
        );

        // Store the image data URL for later use
        images.push(pageCanvas.toDataURL("image/png"));
      }

      // Now `images` contains all the image data URLs
      // You can handle the images as needed (e.g., download, display, etc.)
      images.forEach((imageData, index) => {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = `ResumePage${index + 1}.png`;
        link.click(); // This will trigger the download
      });
    } catch (error) {
      console.error("Error generating images:", error);
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

        <div ref={resumeContentRef} className="resume-padding">
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
