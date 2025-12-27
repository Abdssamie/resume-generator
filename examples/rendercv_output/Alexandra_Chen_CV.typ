// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.1.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Alexandra Chen",
  footer: context { [#emph[Alexandra Chen -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Dec 2025] ],
  locale-catalog-language: "en",
  page-size: "us-letter",
  page-top-margin: 0.7in,
  page-bottom-margin: 0.7in,
  page-left-margin: 0.7in,
  page-right-margin: 0.7in,
  page-show-footer: true,
  page-show-top-note: true,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 79, 144),
  colors-headline: rgb(0, 79, 144),
  colors-connections: rgb(0, 79, 144),
  colors-section-titles: rgb(0, 79, 144),
  colors-links: rgb(0, 79, 144),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "Source Sans 3",
  typography-font-family-name: "Source Sans 3",
  typography-font-family-headline: "Source Sans 3",
  typography-font-family-connections: "Source Sans 3",
  typography-font-family-section-titles: "Source Sans 3",
  typography-font-size-body: 10pt,
  typography-font-size-name: 30pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.4em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: true,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: false,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.7cm,
  header-space-below-headline: 0.7cm,
  header-space-below-connections: 0.7cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: true,
  header-connections-display-urls-instead-of-usernames: false,
  header-connections-separator: "",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_partial_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.3cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.3em,
  sections-space-between-regular-entries: 1.2em,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0.2cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: true,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0cm,
  entries-highlights-bullet:  "•" ,
  entries-highlights-nested-bullet:  "•" ,
  entries-highlights-space-left: 0.15cm,
  entries-highlights-space-above: 0cm,
  entries-highlights-space-between-items: 0cm,
  entries-highlights-space-between-bullet-and-text: 0.5em,
  date: datetime(
    year: 2025,
    month: 12,
    day: 27,
  ),
)


= Alexandra Chen

  #headline([Senior Full Stack Engineer | Cloud Architecture | Team Leadership])

#connections(
  [#link("mailto:alexandra.chen@example.com", icon: false, if-underline: false, if-color: false)[#connection-with-icon("envelope")[alexandra.chen\@example.com]]],
  [#link("tel:+1-415-555-1234", icon: false, if-underline: false, if-color: false)[#connection-with-icon("phone")[(415) 555-1234]]],
  [#connection-with-icon("location-dot")[San Francisco, CA, USA]],
  [#link("https://alexandrachen.dev/", icon: false, if-underline: false, if-color: false)[#connection-with-icon("link")[alexandrachen.dev]]],
  [#link("https://linkedin.com/in/alexandrachen", icon: false, if-underline: false, if-color: false)[#connection-with-icon("linkedin")[alexandrachen]]],
  [#link("https://github.com/alexchen-dev", icon: false, if-underline: false, if-color: false)[#connection-with-icon("github")[alexchen-dev]]],
  [#link("https://x.com/alex_codes", icon: false, if-underline: false, if-color: false)[#connection-with-icon("x-twitter")[alex\_codes]]],
  [#link("https://stackoverflow.com/users/12345678/alexandra-chen", icon: false, if-underline: false, if-color: false)[#connection-with-icon("stack-overflow")[12345678\/alexandra-chen]]],
)


== Summary

Results-driven Senior Full Stack Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expert in #strong[React], #strong[Node.js], #strong[Python], and cloud infrastructure. Passionate about mentoring developers and implementing best practices.

== Experience

#regular-entry(
  [
    #strong[TechGiant Inc.], Senior Software Engineer

    - Led a team of #strong[8 engineers] to rebuild the customer-facing dashboard, improving load times by #strong[65\%]

    - Architected microservices migration, reducing deployment time from 4 hours to #strong[15 minutes]

    - Designed real-time notification system handling #strong[10M+ daily events] using Kafka

    - Mentored #strong[5 junior developers] with weekly code reviews

  ],
  [
    San Francisco, CA

    Mar 2021 – present

    4 years 11 months

  ],
)

#regular-entry(
  [
    #strong[StartupXYZ], Full Stack Developer

    - Built frontend with #strong[React] and #strong[TypeScript] serving #strong[100K+ monthly users]

    - Developed RESTful APIs with #strong[Node.js\/Express] handling #strong[1M+ daily requests]

    - Implemented CI\/CD pipelines enabling #strong[daily deployments]

  ],
  [
    Palo Alto, CA

    June 2018 – Feb 2021

    2 years 9 months

  ],
)

#regular-entry(
  [
    #strong[Digital Agency Co.], Junior Web Developer

    - Developed responsive websites for #strong[20+ clients]

    - Built custom WordPress themes increasing satisfaction by #strong[25\%]

  ],
  [
    Los Angeles, CA

    Jan 2016 – May 2018

    2 years 5 months

  ],
)

== Education

#education-entry(
  [
    #strong[Stanford University], Computer Science

    - GPA: #strong[3.9\/4.0]

      - Dean's Honor List

    - Thesis: #emph[Distributed Systems for Real-Time Data Processing]

  ],
  [
    Stanford, CA

    Sept 2014 – June 2016

  ],
  degree-column: [
    #strong[M.S.]
  ],
)

#education-entry(
  [
    #strong[University of California, Berkeley], Electrical Engineering & Computer Science

    - GPA: #strong[3.7\/4.0]

      - Magna Cum Laude

    - President of ACM Student Chapter

  ],
  [
    Berkeley, CA

    Sept 2010 – May 2014

  ],
  degree-column: [
    #strong[B.S.]
  ],
)

== Skills

#strong[Programming Languages:] TypeScript, JavaScript, Python, Go, Rust, Java, SQL

#strong[Frontend:] React, Next.js, Vue.js, Tailwind CSS, HTML5, CSS3

#strong[Backend:] Node.js, Express, FastAPI, Django, GraphQL, REST APIs

#strong[Databases:] PostgreSQL, MongoDB, Redis, Elasticsearch, DynamoDB

#strong[Cloud & DevOps:] AWS, GCP, Docker, Kubernetes, Terraform, CI\/CD

== Projects

#regular-entry(
  [
    #strong[DevDashboard - Developer Productivity Tool]

    #summary[Open source developer productivity dashboard]

    - Built with React, Node.js, PostgreSQL

      - #strong[500+ GitHub stars]

    - Integrates with GitHub, Jira, and Slack

  ],
  [
    June 2021 – Dec 2022

  ],
)

#regular-entry(
  [
    #strong[FastAPI Core Contributor]

    - #strong[15+ merged PRs] to #link("https://github.com/tiangolo/fastapi")[FastAPI framework]

    - Implemented validation features used by thousands

  ],
  [
    Jan 2022 – present

  ],
)

== Publications

#regular-entry(
  [
    #strong[Scaling Real-Time Applications with Event-Driven Architecture]

    #strong[#emph[A. Chen]], J. Smith, M. Johnson

    #link("https://doi.org/10.1109/SEC.2023.12345")[10.1109\/SEC.2023.12345] (IEEE Software Engineering Conference)

  ],
  [
    Sept 2023

  ],
)

== Certifications

- #strong[AWS Solutions Architect – Professional] (2023)

- #strong[Google Cloud Professional Cloud Architect] (2022)

- #strong[Certified Kubernetes Administrator (CKA)] (2022)

== Languages

#strong[English:] Native

#strong[Mandarin Chinese:] Native

#strong[Spanish:] Conversational
