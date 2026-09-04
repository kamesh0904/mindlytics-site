/* ============================================================
   Mindlytics — ALL SITE COPY LIVES HERE
   ------------------------------------------------------------
   To change any text on the website, edit this file only,
   then run:  npm run build
   You never need to touch the HTML.
   ============================================================ */

module.exports = {

  /* ---------- Company details, used across every page ---------- */
  site: {
    name:        'Mindlytics',
    tagline:     'Engineering The Future of Insight',
    footerLine:  'Raw Data. Real Business Value.',
    url:         'https://mindlytics.co.in',
    email:       'info@mindlytics.co.in',
    phone:       '+91 707 555 9665',
    phoneHref:   '+917075559665',
    location:    'Hyderabad, India',
    /* Where job applications land. Point this at careers@ once that inbox
       exists; until then applications go to the main address. */
    careersEmail: 'info@mindlytics.co.in',
    linkedin:    'https://www.linkedin.com/company/mindlyticstech/',
    linkedinLabel: 'linkedin.com/company/mindlyticstech',
    year:        2026,

    /* Where the contact form posts. Get a free endpoint at
       https://formspree.io or https://web3forms.com and paste it here.
       Leave empty and the form falls back to opening the visitor's mail app
       with the message prefilled to site.email. */
    formEndpoint: ''
  },

  /* ---------- The six services. Set page:true to generate a subpage ---------- */
  services: [
    { num:'01', slug:'data-engineering',   nav:'Data Engineering',   navDesc:'Pipelines, orchestration, testing',
      title:'Data Engineering &amp; ETL Pipelines', page:true,
      blurb:'Reliable, automated pipelines that ingest, transform and load your data with full observability. No more broken exports or manual refreshes.',
      tools:['Apache Spark','dbt','Airflow','Kafka'] },

    { num:'02', slug:'cloud-platforms',    nav:'Cloud Platforms',    navDesc:'Warehouse, lakehouse, migration',
      title:'Cloud Data Platforms', page:true,
      blurb:'Modern data warehouse and lakehouse architectures on Snowflake, BigQuery or Redshift, scalable from your first 10GB to multiple terabytes.',
      tools:['Snowflake','BigQuery','Redshift','Azure'] },

    { num:'03', slug:'bi-dashboards',      nav:'BI &amp; Dashboards',    navDesc:'Metrics, reporting, adoption',
      title:'Business Intelligence &amp; Dashboards', page:true,
      blurb:'From C-suite KPI boards to operational drill-downs. Live, self-refreshing dashboards tailored to how your team actually makes decisions.',
      tools:['Power BI','Tableau','Looker','Metabase'] },

    { num:'04', slug:'advanced-analytics', nav:'Advanced Analytics', navDesc:'Segmentation, forecasting, churn',
      title:'Advanced Analytics &amp; Predictive Models', page:true,
      blurb:'Customer segmentation, churn prediction, demand forecasting and ML-powered insights embedded directly into your reporting workflows.',
      tools:['Python','ML Models','Forecasting'] },

    { num:'05', slug:'data-integration',   nav:'Data Integration',   navDesc:'Sources unified into one layer',
      title:'Data Integration &amp; Unification', page:false, highlight:true,
      blurb:'Connect every source, CRMs, ERPs, marketing tools and APIs, into a single governed, trustworthy data layer your entire organization can rely on.',
      tools:['Fivetran','Airbyte','APIs','SQL'] },

    { num:'06', slug:'data-governance',    nav:'Data Governance',    navDesc:'Catalog, lineage, access control',
      title:'Data Strategy &amp; Governance', page:false,
      blurb:'Data cataloguing, lineage tracking, quality frameworks and access control that scale with your team and satisfy compliance requirements.',
      tools:['Data Catalog','Lineage','Governance'] }
  ],

  /* ---------- HOME ---------- */
  home: {
    title: 'Mindlytics — Data Engineering &amp; Analytics Consultancy, Hyderabad',
    description: 'Mindlytics builds data pipelines, cloud warehouses and BI dashboards that turn scattered data into decisions. Sprint-based delivery, documented handover. Hyderabad, India.',
    eyebrow: 'Next-Generation Data &amp; Analytics',
    h1a: 'Engineering',
    h1b: 'The Future of Insight',
    lede: 'Mindlytics transforms raw, scattered data into actionable business intelligence, empowering organizations to move faster and decide smarter.',
    ctaPrimary: 'Explore Services',
    ctaSecondary: 'Book a Discovery Call',

    servicesEyebrow: 'What We Do',
    servicesH2: 'Every layer of the modern data stack',
    servicesLede: 'We work with your existing stack or recommend the best tools for your scale and budget. No vendor lock-in.',

    quote: 'Every organization, regardless of size, deserves access to the kind of intelligence that used to require an army of data scientists.',
    quoteAttrib: 'The Mindlytics Mission',

    engageEyebrow: 'How We Engage',
    engageH2: 'Sprint-based delivery, working output in weeks',
    engageLede: 'Three ways clients typically start with us. Each is scoped up front, delivered in sprints, and handed over documented.',
    engagements: [
      { n:'Engagement 01', title:'Data Platform Build', viz:'lines',
        body:'A warehouse, the pipelines feeding it, and the models on top. We start with your sources and finish with a governed layer your whole organization can query.' },
      { n:'Engagement 02', title:'Analytics Sprint', viz:'bars',
        body:'A fixed-scope block aimed at one decision your team keeps making blind. Segmentation, forecasting or churn, delivered as a working model rather than a slide deck.' },
      { n:'Engagement 03', title:'BI Migration &amp; Handover', viz:'rings',
        body:'Move off brittle spreadsheets and legacy reports onto live dashboards, then train your team to own them. Full documentation, no ongoing dependency.' }
    ],

    careersEyebrow: 'Careers',
    careersH2: 'Come build the data layer other companies run on',
    careersLede: 'We are a small team in Hyderabad doing consultancy work with an unusual amount of ownership per person. You will not spend a year on one ticket queue.',
    careersPoints: [
      { n:'01', title:'Real scope, early',
        body:'Engagements run in sprints, so you own a pipeline or a dashboard end to end within weeks of joining rather than waiting for a hand-me-down.' },
      { n:'02', title:'Breadth on purpose',
        body:'Across a year you will touch ingestion, warehousing, modelling and BI on several client stacks. That is a lot of range to build early in a career.' },
      { n:'03', title:'We hand work over',
        body:'Every engagement ends with the client team trained and documented. Explaining your work clearly is part of the job, not an afterthought.' }
    ],
    careersCta: 'See open roles',
    careersCtaSecondary: 'Read about the team',

    /* ---------- AWS competencies ---------- */
    aws: {
      eyebrow: 'Our Competencies',
      headingA: 'AWS',
      headingB: 'Competencies',
      /* No figures here on purpose: nothing can go stale and nothing is left
         to fill in. To go numeric later, rewrite a line in full. A line still
         carrying a {token} is dropped at build time rather than printed. */
      stats: [
        'AWS Certified across the full team',
        'Solutions Architect and Data Engineer certified',
        'Built on S3, Glue, Redshift, Lambda and Athena',
        'Infrastructure as code on every engagement',
        'Documented handover, no ongoing dependency'
      ],

      /* Badge images issued to Mindlytics directly, as
         { src, alt, w, h } with src relative to dist/ (put files in src/img/).

         Empty: the badge card is omitted and the section becomes two columns.
         One entry: the card renders with no arrows.
         Two or more: the arrows appear and fade between them.

         Only add a badge that AWS issued to this company. A partner tier,
         competency or certification mark the company has not been awarded is
         a trademark misuse, not a design choice.

         w and h are the file's real pixel dimensions, not the display size:
         the browser uses them to reserve the right space before the image
         loads. Display width is capped in the markup. */
      badges: [
        { src: 'assets/img/aws-partner.jpg', alt: 'AWS Partner', w: 515, h: 388 }
      ]
    }
  },

  /* ---------- SERVICES INDEX ---------- */
  servicesPage: {
    title: 'Services — Data Engineering, Cloud, BI and Analytics | Mindlytics',
    description: 'Six services covering the modern data stack: ETL pipelines, cloud warehouses, BI dashboards, predictive models, data integration and governance.',
    eyebrow: 'Our Services',
    h1: 'Analytics &amp; data-driven solutions, end to end',
    lede: 'From your first data pipeline to a fully automated intelligence platform, we cover every layer of the modern data stack, tailored to your business.',
    deliverEyebrow: 'What We Deliver',
    deliverH2: 'Solutions built around your decisions',
    deliverLede: 'Every service we offer is designed to solve a real business problem. We work with your existing stack or recommend the best tools for your scale and budget. No vendor lock-in.',
    processEyebrow: 'How It Works',
    processH2: 'From raw data to live intelligence',
    processLede: 'Our sprint-based process delivers working outputs in weeks, not months.',
    process: [
      { n:'1', title:'Discovery',        body:'We audit your sources, gaps and decision workflows.' },
      { n:'2', title:'Architecture',     body:'We design your cloud platform and data model.' },
      { n:'3', title:'Build &amp; Automate', body:'ETL pipelines go live, monitored and documented.' },
      { n:'4', title:'Visualize',        body:'Dashboards built on clean data from day one.' },
      { n:'5', title:'Handover &amp; Scale', body:'Full docs, training and ongoing support.' }
    ]
  },

  /* ---------- ABOUT ---------- */
  about: {
    title: 'About Mindlytics — Data &amp; Analytics Company in Hyderabad',
    description: 'Mindlytics is a data and analytics company in Hyderabad building scalable infrastructure, analytics and visualization platforms for businesses at every stage.',
    eyebrow: 'About Mindlytics',
    h1: 'A company built to make data work for everyone',
    lede: 'We are a next-generation data and analytics company helping businesses at every stage transform raw information into a genuine competitive edge.',
    missionH2: 'We believe every organization deserves world-class data intelligence',
    missionBody: [
      'Mindlytics was founded on a straightforward conviction: the tools and expertise needed to make data-driven decisions shouldn\'t be reserved for large corporations with massive data teams. From early-stage startups to growing enterprises, every organization generates data, and every organization deserves to understand it.',
      'We specialize in building scalable data infrastructure, advanced analytics solutions and modern visualization platforms. Our end-to-end approach covers everything from raw data ingestion and ETL pipeline development to cloud-based warehousing, business intelligence dashboards and predictive analytics, all aligned to the business decisions your team actually needs to make.'
    ],
    missionEmphasis: 'Our mission is simple: turn Raw Data into Real Business Value. We do this not by delivering reports, but by embedding intelligence into your operations, building data pipelines that run reliably, dashboards that get used daily, and architectures that scale as you do.',

    valuesEyebrow: 'Our Values',
    values: [
      { title:'Outcome-First Thinking',   body:'Every pipeline and dashboard we build exists to drive a specific, measurable business outcome. We start with the decision, then build backward.' },
      { title:'Trust Through Reliability',body:'Data your team doesn\'t trust is data that doesn\'t get used. Quality, lineage and governance are embedded into everything we touch.' },
      { title:'Enable, Don\'t Depend',    body:'We transfer knowledge in every engagement. Our goal is to leave your team more capable than when we arrived.' },
      { title:'Speed to Value',           body:'Sprint-based delivery means you see working outputs in weeks. No year-long engagements, no black boxes.' }
    ],

    teamEyebrow: 'Our Team',
    teamH2: 'The minds behind Mindlytics',
    teamLede: 'A focused team of data engineers, analytics architects and BI specialists, united by one goal: turning your data into decisions.',
    /* Add "photo: 'assets/img/name.jpg'" to any member to use a real headshot
       instead of the initials placeholder. */
    team: [
      { initials:'VVR', name:'Vishnu Vardhan Reddy', role:'Founder &amp; CEO' },
      { initials:'CM',  name:'Chandra Mahesh',       role:'Managing Director' },
      { initials:'MR',  name:'Mayur Reddy',          role:'Lead Analytics Architect' }
    ],
    teamNote: 'Placeholder portraits. Add a photo path in src/content.js to replace them.'
  },

  /* ---------- CAREERS ----------
     The roles below are drafts. Confirm or replace every one before this page
     goes live: a listing nobody is actually hiring for wastes a real person's
     time. Emptying the `roles` array is fine, the page falls back to
     `rolesEmpty` and keeps the open-application route. */
  careers: {
    title: 'Careers at Mindlytics — Data &amp; Analytics Jobs in Hyderabad',
    description: 'Join Mindlytics in Hyderabad. Open roles in data engineering, analytics engineering, BI development and cloud data platforms, plus internships.',
    eyebrow: 'Careers',
    h1: 'Work on data that actually reaches a decision',
    lede: 'We build pipelines, warehouses and dashboards for companies that need them to work on a Monday morning. If you would rather ship something used every week than polish a proof of concept, we should talk.',
    ctaPrimary: 'See open roles',
    ctaSecondary: 'Send an open application',

    whyEyebrow: 'Why Mindlytics',
    whyH2: 'A small team, deliberately',
    whyLede: 'Consultancy gives you range that a single in-house stack cannot. Being small means that range lands on you early.',
    why: [
      { title:'Ownership from week one',  body:'You take a pipeline, a model or a dashboard from the client conversation through to handover. Nobody here only writes the middle third of a task.' },
      { title:'Range across the stack',   body:'Ingestion, transformation, warehousing, modelling, BI. Most people here touch all of it inside a year, on more than one cloud.' },
      { title:'Reviewed, not rubber-stamped', body:'Every pipeline gets read by someone else before it runs in production. Reviews are how the team levels up, so they are thorough and they are kind.' },
      { title:'Documented as we go',      body:'We hand work over for a living, so writing things down is part of the definition of done rather than a scramble at the end of an engagement.' }
    ],

    lifeH2: 'What the work is honestly like',
    lifeBody: [
      'Client work means real deadlines and other people\'s messy data. You will meet undocumented schemas, exports that changed shape without warning, and stakeholders who describe the report they want rather than the decision behind it. Getting from that to something dependable is the actual craft here.',
      'Sprint-based delivery keeps the loop short. Scope is agreed up front, you demo working output every couple of weeks, and you find out quickly whether what you built helped. That is a fast feedback signal, and it is the main reason people grow quickly here.'
    ],
    lifeEmphasis: 'We are based in Hyderabad and work in person for most of the week. We think an early-career data engineer learns far more sitting next to someone reviewing their pipeline than on a call.',

    rolesEyebrow: 'Open Roles',
    rolesH2: 'Where we are hiring right now',
    rolesLede: 'Apply even if you match most of a listing rather than all of it. Tell us what you have built and we will work out the rest in conversation.',
    rolesEmpty: 'No roles are open at the moment. We still read every open application, so send one and we will come back to you when something opens up.',
    rolesNote: 'All roles are based in Hyderabad, India. We review applications weekly and reply either way.',
    /* Emptied before launch: the drafted listings were written from the
       services list, not a real hiring plan. The page falls back to
       rolesEmpty and keeps the open-application route. Add real openings
       here when there are some. */
    roles: [],

    processEyebrow: 'Hiring Process',
    processH2: 'Four steps, about two weeks',
    processLede: 'No take-home that eats your weekend and no panel of eight. We tell you where you stand after every stage.',
    process: [
      { n:'01', title:'Application',      body:'Send your CV and a few lines on something you built. Links to real work, a repository or a dashboard you are proud of count for more than a cover letter.' },
      { n:'02', title:'Intro call',       body:'Thirty minutes on what you have worked on and what you want next, plus a straight answer to whatever you want to ask about the role.' },
      { n:'03', title:'Technical round',  body:'A working session on a realistic problem, roughly ninety minutes. You will use your own editor and you may look things up, because that is how the job works.' },
      { n:'04', title:'Team conversation',body:'Meet the people you would work beside, talk through how we run engagements, and get an offer or a clear no within a few days.' }
    ],

    openH2: 'Nothing above fits?',
    openBody: 'We would still like to hear from you. Tell us what you want to work on and what you have built, and we will tell you honestly whether we can offer it now or later.',
    openCta: 'Send an open application',
    applyCta: 'Apply for this role'
  },

  /* ---------- CONTACT ---------- */
  contact: {
    title: 'Contact Mindlytics — Book a Free Data Discovery Call',
    description: 'Book a free 45-minute discovery call with Mindlytics. We map your data landscape and show where value is being left untapped. Hyderabad, India.',
    eyebrow: 'Get in Touch',
    h1: 'Let\'s talk about your data',
    lede: 'Book a free 45-minute discovery call. We\'ll map your current data landscape and show exactly where value is being left untapped.',
    introH2: 'We\'d love to hear from you',
    introBody: 'Whether you\'re a startup setting up your first data pipeline or an enterprise modernizing your analytics stack, we\'re here to help. Reach out and we\'ll respond within 24 hours.',
    formH3: 'Send us a message',
    formLede: 'Fill out the form and we\'ll get back to you within one business day.',
    formNote: 'We typically respond within 24 hours on business days.',
    formSuccess: 'Thanks. We\'ve received your message and will reply within one business day.',
    formError: 'Something went wrong. Please email us directly at info@mindlytics.co.in.',
    formMailtoNote: 'Your email app is opening with this message ready to send. If nothing happened, write to info@mindlytics.co.in or call +91 707 555 9665.',
    serviceOptions: [
      'Data Engineering &amp; ETL Pipelines',
      'Cloud Data Platform',
      'Business Intelligence &amp; Dashboards',
      'Advanced Analytics',
      'Data Strategy &amp; Governance',
      'Something else'
    ]
  },

  /* ---------- 404 ---------- */
  notFound: {
    title: 'Page Not Found | Mindlytics',
    description: 'That page does not exist. Head back to the Mindlytics home page or browse our data engineering, cloud, BI and analytics services.',
    eyebrow: 'Error 404',
    h1: 'This page moved, or never existed',
    lede: 'The link you followed does not lead anywhere on this site. Nothing is broken on your end &mdash; start again from the home page, or go straight to what we do.',
    ctaPrimary: 'Back to home',
    ctaSecondary: 'Browse services'
  },

  /* ---------- SERVICE SUBPAGES ---------- */
  servicePages: {

    'data-engineering': {
      title: 'Data Engineering &amp; ETL Pipelines | Mindlytics',
      description: 'Automated data pipelines with orchestration, dbt models, quality tests and alerting. Built on Airflow, dbt, Spark and Kafka. Delivered in 8 weeks.',
      crumb: 'Data Engineering',
      h1: 'Pipelines that run without anyone watching them',
      lede: 'Automated ingestion, transformation and delivery, with tests and alerting built in. If something breaks at 3am you find out before your CFO does.',
      formService: 'Data Engineering &amp; ETL Pipelines',
      signs: [
        { q:'"Someone exports a CSV every Monday"',       a:'Reporting depends on a person remembering a manual step, and it stops the week they\'re on leave.' },
        { q:'"The numbers don\'t match"',                  a:'Two teams pull what should be the same metric from different places and get different answers.' },
        { q:'"We found out the data was stale last week"', a:'Failures are silent. They surface days later, when someone notices a chart looks wrong.' },
        { q:'"Adding a new source takes a month"',         a:'Every integration is bespoke, so nothing built for the last one gets reused for the next.' }
      ],
      buildH2: 'The full pipeline, not just the extract',
      build: [
        { title:'Source ingestion',          body:'Connectors for your databases, SaaS tools and APIs, with incremental loads and schema-change handling.' },
        { title:'Orchestration',             body:'Dependency-aware scheduling with retries, backfills and a clear owner for every failure.' },
        { title:'Transformation layer',      body:'Modelled in dbt under version control, so every metric has one definition and a documented lineage.' },
        { title:'Data quality tests',        body:'Freshness, row count, uniqueness and referential checks that fail the run rather than pass bad data downstream.' },
        { title:'Observability and alerting',body:'Pipeline health surfaced where your team already works, with alerts that name the model that broke.' },
        { title:'CI/CD for data',            body:'Changes reviewed and tested before they reach production, the same way application code is.' }
      ],
      stackLede: 'We work with what you already run where that makes sense. Where it doesn\'t, these are our defaults.',
      stack: ['Apache Airflow','dbt','Apache Spark','Kafka','Python','Fivetran','Airbyte','Great Expectations'],
      timeline: [
        { when:'Weeks 1&ndash;2', title:'Audit and design',    body:'Source inventory, volume and freshness requirements, target architecture agreed in writing.' },
        { when:'Weeks 3&ndash;6', title:'Build',               body:'Pipelines built source by source. Each one live and tested before the next begins.' },
        { when:'Weeks 7&ndash;8', title:'Harden and hand over',body:'Alerting, runbooks, documentation and training so your team owns it after we leave.' }
      ]
    },

    'cloud-platforms': {
      title: 'Cloud Data Platforms — Snowflake, BigQuery, Redshift | Mindlytics',
      description: 'Warehouse and lakehouse architecture on Snowflake, BigQuery or Redshift. Layered storage, migration, access control, cost management and infrastructure as code.',
      crumb: 'Cloud Platforms',
      h1: 'A warehouse that scales with you, not ahead of you',
      lede: 'Warehouse and lakehouse architecture on Snowflake, BigQuery or Redshift. Sized for the volume you have now, structured so it doesn\'t need rebuilding at ten times that.',
      formService: 'Cloud Data Platform',
      signs: [
        { q:'"Our production database is also our reporting database"', a:'Analytics queries compete with live traffic, and both get slower at exactly the wrong moment.' },
        { q:'"Cloud spend went up and nobody knows why"',               a:'No warehouse sizing, no query monitoring, no way to attribute cost to a team or a workload.' },
        { q:'"Everyone has admin"',                                    a:'Access is all-or-nothing, which becomes a real problem the first time you handle customer data.' },
        { q:'"We\'re on spreadsheets and it\'s breaking"',              a:'Volume has outgrown the tooling, and every month-end close is a manual reconciliation.' }
      ],
      buildH2: 'A platform, not just a database',
      build: [
        { title:'Warehouse or lakehouse setup', body:'Sized, configured and cost-controlled on the platform that fits your workload and budget.' },
        { title:'Layered storage design',       body:'Raw, staging and curated layers, so reprocessing history never means re-ingesting it.' },
        { title:'Migration',                    body:'Moving off legacy databases, spreadsheets or an older warehouse, running both in parallel until the numbers reconcile.' },
        { title:'Access control and governance',body:'Role-based access, row-level security where it\'s needed, and an audit trail that satisfies a reviewer.' },
        { title:'Cost management',              body:'Auto-suspend, query monitoring and spend attribution, so the monthly bill is explainable line by line.' },
        { title:'Infrastructure as code',       body:'The whole platform reproducible from a repository, rather than clicked together in a console nobody documented.' }
      ],
      stackLede: 'Platform choice depends on your volume, your team\'s existing skills and where the rest of your infrastructure already lives.',
      stack: ['Snowflake','BigQuery','Amazon Redshift','Azure Synapse','Amazon S3','Terraform','dbt'],
      timeline: [
        { when:'Weeks 1&ndash;2',  title:'Architecture', body:'Platform selection, data model and cost modelling, with the tradeoffs written down.' },
        { when:'Weeks 3&ndash;5',  title:'Build',        body:'Environments, storage layers, access control and infrastructure as code.' },
        { when:'Weeks 6&ndash;10', title:'Migrate',      body:'Source by source, with a parallel run and full reconciliation before anything is switched off.' }
      ]
    },

    'bi-dashboards': {
      title: 'Business Intelligence &amp; Dashboards — Power BI, Tableau | Mindlytics',
      description: 'Dashboards your team actually opens. Metric definitions in a semantic layer, KPI boards, drill-downs, row-level security and adoption training.',
      crumb: 'BI &amp; Dashboards',
      h1: 'Dashboards people actually open',
      lede: 'Most dashboards are built once, checked twice, then quietly abandoned. We build the ones your team returns to, because each one answers a question somebody genuinely has every week.',
      formService: 'Business Intelligence &amp; Dashboards',
      signs: [
        { q:'"We built dashboards and nobody uses them"', a:'They answer questions nobody was asking, or they take thirty seconds to load and people give up.' },
        { q:'"Everyone exports to Excel anyway"',         a:'The report can\'t do what people actually need, so it\'s a starting point rather than an answer.' },
        { q:'"Two reports, two revenue numbers"',         a:'Metrics are defined inside each individual report instead of once, in one place everyone draws from.' },
        { q:'"Only one person can change it"',            a:'The report is a black box, and the person who built it has moved on.' }
      ],
      buildH2: 'Reporting that survives contact with the team',
      build: [
        { title:'Metric definitions',      body:'One agreed definition per metric, held in the semantic layer rather than rewritten inside each chart.' },
        { title:'Executive KPI boards',    body:'The handful of numbers leadership checks, with trend and comparison, readable on one screen.' },
        { title:'Operational drill-downs', body:'Views built for the person doing the work, filtered to the accounts or region they actually own.' },
        { title:'Self-serve models',       body:'Curated datasets your analysts can query on their own without breaking anything downstream.' },
        { title:'Row-level security',      body:'One report where each person sees their own team, region or accounts, and nothing else.' },
        { title:'Adoption and training',   body:'Sessions with the real users. A dashboard nobody was taught to read is a dashboard nobody uses.' }
      ],
      stackLede: 'If you already have a BI licence, we build in that. Switching tools is rarely the fix for an adoption problem.',
      stack: ['Power BI','Tableau','Looker','Metabase','dbt semantic layer','SQL'],
      timeline: [
        { when:'Week 1',          title:'Decision mapping', body:'Interviews with the people who will actually use it, to find the questions worth building for.' },
        { when:'Weeks 2&ndash;4', title:'Build',            body:'Models first, then reports, reviewed with those same users at the end of every week.' },
        { when:'Weeks 5&ndash;6', title:'Rollout',          body:'Training, access setup, then a feedback round and the fixes it produces.' }
      ]
    },

    'advanced-analytics': {
      title: 'Advanced Analytics &amp; Predictive Models | Mindlytics',
      description: 'Customer segmentation, churn prediction, demand forecasting and anomaly detection, deployed into your workflow with drift monitoring and scheduled retraining.',
      crumb: 'Advanced Analytics',
      h1: 'Models that ship into the workflow, not into a slide deck',
      lede: 'Segmentation, forecasting and churn prediction delivered as something your team uses on a Tuesday. Monitored for drift and retrained on a schedule, not left to rot in a notebook.',
      formService: 'Advanced Analytics',
      signs: [
        { q:'"We know churn is a problem but not who\'s churning"', a:'You have the outcome in your data but no signal on it early enough to act.' },
        { q:'"Forecasting is a spreadsheet someone updates"',       a:'Planning runs on a manual model whose assumptions nobody has revisited in two years.' },
        { q:'"Every customer gets the same treatment"',             a:'No segmentation, so effort and budget spread evenly across accounts with very different value.' },
        { q:'"We ran a model once, in a notebook"',                 a:'It worked, nobody productionised it, and it has been quietly going stale ever since.' }
      ],
      buildH2: 'From question to running model',
      build: [
        { title:'Customer segmentation',        body:'Behavioural cohorts derived from how people actually use your product, not just who they are on paper.' },
        { title:'Churn and propensity',         body:'Scored accounts with the drivers exposed, so the output tells someone what to do rather than just how worried to be.' },
        { title:'Demand and revenue forecasting',body:'Seasonality-aware forecasts with confidence intervals, backtested against your own history before anyone relies on them.' },
        { title:'Anomaly detection',            body:'Automated flags when a metric moves outside its expected range, so you find out on the day rather than at month end.' },
        { title:'Feature pipelines',            body:'Model inputs computed on schedule in the warehouse, so scoring never depends on someone opening a notebook.' },
        { title:'Monitoring and retraining',    body:'Drift tracking and an agreed retraining cadence, because an unwatched model degrades quietly and expensively.' }
      ],
      stackLede: 'We start with the simplest thing that could work. A well-chosen heuristic often beats a model, and it is cheaper to run.',
      stack: ['Python','scikit-learn','statsmodels','Prophet','MLflow','dbt','SQL'],
      timeline: [
        { when:'Weeks 1&ndash;2', title:'Feasibility',        body:'Data availability and label quality, and an honest answer on whether a model will actually help here.' },
        { when:'Weeks 3&ndash;6', title:'Build',              body:'Baseline first, then iterate. Every model measured against the simple rule it would replace.' },
        { when:'Weeks 7&ndash;8', title:'Deploy and monitor', body:'Scoring pipeline, delivery into the tools your team already opens, and drift dashboards.' }
      ]
    }
  }
};
