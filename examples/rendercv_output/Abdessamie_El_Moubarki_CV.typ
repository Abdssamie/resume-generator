// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.1.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Abdessamie El Moubarki",
  footer: context { [#emph[Abdessamie El Moubarki -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Dec 2025] ],
  locale-catalog-language: "en",
  page-size: "us-letter",
  page-top-margin: 0.7in,
  page-bottom-margin: 0.7in,
  page-left-margin: 0.7in,
  page-right-margin: 0.7in,
  page-show-footer: false,
  page-show-top-note: true,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 0, 0),
  colors-headline: rgb(0, 0, 0),
  colors-connections: rgb(0, 0, 0),
  colors-section-titles: rgb(0, 0, 0),
  colors-links: rgb(0, 0, 0),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "XCharter",
  typography-font-family-name: "XCharter",
  typography-font-family-headline: "XCharter",
  typography-font-family-connections: "XCharter",
  typography-font-family-section-titles: "XCharter",
  typography-font-size-body: 10pt,
  typography-font-size-name: 25pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.2em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: false,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: true,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.7cm,
  header-space-below-headline: 0.7cm,
  header-space-below-connections: 0.7cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: false,
  header-connections-display-urls-instead-of-usernames: true,
  header-connections-separator: "|",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_full_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.3cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.15cm,
  sections-space-between-regular-entries: 0.42cm,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: false,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0.08cm,
  entries-highlights-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-nested-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-space-left: 0cm,
  entries-highlights-space-above: 0.08cm,
  entries-highlights-space-between-items: 0.08cm,
  entries-highlights-space-between-bullet-and-text: 0.3em,
  date: datetime(
    year: 2025,
    month: 12,
    day: 27,
  ),
)


= Abdessamie El Moubarki

  #headline([Senior Full-Stack Developer | Node.js & Python Specialist])

#connections(
  [#link("mailto:abdessamie.elmoubarki@email.com", icon: false, if-underline: false, if-color: false)[abdessamie.elmoubarki\@email.com]],
  [#link("tel:+212-600-000000", icon: false, if-underline: false, if-color: false)[0600-000000]],
  [Casablanca, Morocco],
  [#link("https://abdessamie.dev/", icon: false, if-underline: false, if-color: false)[abdessamie.dev]],
  [#link("https://linkedin.com/in/abdessamie-el-moubarki", icon: false, if-underline: false, if-color: false)[linkedin.com\/in\/abdessamie-el-moubarki]],
  [#link("https://github.com/aelmoubarki", icon: false, if-underline: false, if-color: false)[github.com\/aelmoubarki]],
)


== Summary

Innovative Full-Stack Developer with over 5 years of experience specializing in high-performance Node.js microservices and scalable Python applications. Proven track record of optimizing system architecture to reduce latency and implementing robust CI\/CD pipelines to accelerate deployment cycles.

== Experience

#regular-entry(
  [
    #strong[Senior Full-Stack Developer], TechFlow Solutions -- Remote

  ],
  [
    June 2021 – present

  ],
  main-column-second-row: [
    - Architected a real-time analytics dashboard using Node.js and Socket.io, improving data refresh rates by 40\% for over 10,000 concurrent users.

    - Developed a Python-based automated testing suite that reduced manual QA time by 60\% and caught 25\% more edge-case bugs before production.

    - Led the migration of a monolithic Express application to a microservices architecture, resulting in a 30\% reduction in server costs.

    - Mentored a team of 4 junior developers, conducting code reviews and implementing best practices for TypeScript and PEP 8 standards.

  ],
)

#regular-entry(
  [
    #strong[Full-Stack Developer], DataStream Systems -- Rabat, Morocco

  ],
  [
    Sept 2018 – May 2021

  ],
  main-column-second-row: [
    - Built and maintained RESTful APIs using Django and FastAPI, integrating complex third-party payment gateways and CRM systems.

    - Optimized PostgreSQL database queries and indexing strategies, decreasing average API response times from 500ms to 120ms.

    - Designed responsive frontend components using React and Redux, achieving a 95+ score on Google Lighthouse for performance and SEO.

  ],
)

== Education

#education-entry(
  [
    #strong[Mohammed V University], M.S. in Computer Science and Software Engineering -- Rabat, Morocco

  ],
  [
    Sept 2016 – June 2018

  ],
  main-column-second-row: [
  ],
)

#education-entry(
  [
    #strong[Al Akhawayn University], B.S. in Computer Science -- Ifrane, Morocco

  ],
  [
    Sept 2012 – June 2016

  ],
  main-column-second-row: [
  ],
)

== Skills

#strong[Backend:] Node.js, Python, TypeScript, Express, FastAPI, Django, NestJS

#strong[Frontend:] React, Next.js, Tailwind CSS, Redux, Webpack

#strong[Cloud & DevOps:] Docker, Kubernetes, AWS (S3, EC2, Lambda), CI\/CD (GitHub Actions), Terraform

#strong[Databases:] PostgreSQL, MongoDB, Redis, Elasticsearch
