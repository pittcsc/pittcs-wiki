---
title: "[Z2O] 3. Building Your Case"
order: 3
---

> This is a part of a series of guides called Zero to Offer aimed to help you navigate the internship process. We recommend you start [here](/guides/zero-to-offer/)!

## Building != Coding

Almost every Pitt CS student graduates knowing how to write code for `CS 0445` or `CS 1501` assignments. That doesn't separate you in a stack of 500 resumes. What gets you interviews (and gives you real stories for behavioral rounds) is **engineering**: picking a domain (Full Stack, Systems, ML/AI, Security, Data, Quant), scoping a messy problem, hitting bugs, and shipping something people can actually use.

### Learning Projects vs. Resume Projects

Not every project belongs on your resume:

- **Learning projects** (calculators, To-Do apps, tic-tac-toe, following a YouTube tutorial, or reproducing GPT-2 from a video) are great for spending a weekend learning syntax or a new framework. Build them, learn from them, and leave them on GitHub.
- **Resume projects** solve a real problem, have real users or measurable performance, or target the exact industry you want to break into. Think **[Whenly](https://pittcsc.org/meet)** (built by PittCSC's Jon Coulter as a better When2Meet) or a deployed service with real traffic and latency numbers (like a Discord bot serving 100K+ users or a custom Rust/C++ chemical database).

### How to Pick an Idea: Mine Job Descriptions

If you're stuck staring at a blank screen, stop guessing and read 2–3 job descriptions for roles you actually want:

1. **Highlight the domain problems and tools** they mention (for example, *"large-scale chemical databases"* and *"virtual screening"* for a scientific SWE role, or *"REST APIs"*, *"caching"*, and *"PostgreSQL"* for backend).
2. **Pick one concrete slice** of that problem and build a small, working version of it.
3. **Deploy it and measure something**, latency, throughput, users, or accuracy, so you have real numbers for your resume and behavioral stories.

If you don't know where to aim yet, follow the **Amazon Recruiter's Golden Rule** for project variety: build **(1) a backend with a public API**, **(2) a full-stack app with React**, or **(3) a project in the specific industry you want**.

> **A note on AI tools:** Tech companies are pouring hundreds of billions into AI infrastructure, so knowing how to work with AI coding tools is part of modern engineering. **But** if you haven't built your fundamentals yet, letting Cursor or Claude write code you can't explain is a trap: it creates *"brain rot"* where you can't tell right from wrong or defend your architecture in an interview. Read our full stance in **[When to Use AI](/guides/skills/csc-dev-lab/8-when-to-use-ai)**.

## 5-Minute Software Architecture Primer

If terms like *API*, *backend*, or *cloud* freeze you up, don't fall into analysis paralysis: act. Most modern apps follow the same four-piece loop:

- **Frontend (what users see):** Runs in the browser or on mobile (React, Next.js, TailwindCSS) and sends requests when a user clicks a button.
- **API (the waiter):** The HTTP contract (`/login`, `/items`) that carries requests from the frontend to the server and returns JSON responses.
- **Backend (the kitchen):** Business logic and auth running on a server (FastAPI, Flask, Express, Spring Boot).
- **Database (the vault):** Persistent storage on disk or in the cloud: relational SQL (PostgreSQL, MySQL) or NoSQL (MongoDB).

Around those four pieces, learn the basic developer toolkit early: **Git & GitHub** for version control, **UNIX/Linux** command-line comfort, and **Docker / cloud hosting** (Railway, Netlify, AWS) so your project actually lives on the internet instead of only on `localhost`.

## How Can I Become Better?

“Have a 4.0, do 1000 LeetCode problems, apply to every place” might be what you think you need to do to get a job. And there is some truth to it. But let's work backwards: companies want great software engineers, and great software engineers are good programmers, good communicators, and strong teammates.

Here is a list of things you can do at Pitt to build those fundamental skills:

- **Personal & Open-Source Projects:** Creating a project means solving a problem and practicing engineering. Open-source and team projects add collaboration, Git workflows, and code review. If you want structured team engineering with sprints, PRs, and senior mentors, apply for **[CSC Dev Lab](/guides/skills/csc-dev-lab/0-what-is-csc-dev-lab)**.
- **Compete in (or Organize) Hackathons:** Shipping a working prototype in 24 hours shows passion, teamwork, and the ability to cut scope under a strict deadline (freshmen regularly win!). Check out **[SteelHacks and SheInnovates](/guides/skills/getting-started-with-x/hackathons)**.
- **Organize and Lead Clubs:** Leading a **[campus club](/guides/skills/clubs)** shows you can organize people and communicate well. If people elected you to lead, your future teammates will probably enjoy working with you too.
- **Become a Teaching Assistant:** To qualify to be a **[UTA](/guides/academics/uta)**, you need strong grades; to be a good TA, you need to explain hard technical concepts clearly.
- **Research:** Research involves communicating with others and solving hard, open-ended problems, and the barrier to entry is often way lower than industry internships if you **cold-email Pitt professors** whose work interests you. Learn more in our **[Undergraduate Research](/guides/academics/research)** guide.
- **Get a Good GPA:** Doing well in your CS courses means actually understanding the material and finishing your course projects, which makes you a stronger programmer.
- **Personal Website (Optional):** Once you have real projects or research to showcase, a clean **[personal website](/guides/skills/personal-website)** is a nice bonus; just don't make it your *first* project before you have anything to put on it.

You obviously do not need to do all of these things. Pick what is important and interesting to you, and go for it. When you do these things, your resume will build itself. By focusing on becoming a better software engineer instead of merely focusing on your resume, you learn what matters to you and finish work you can actually defend.

## Networking, Warm Connections & Career Fair

Cold-applying online is your baseline, but warm connections move you to the front of the line. In general, outreach power follows this order:

**Hiring Manager > Recruiter > Engineers > Cold Applying**

A few rules so you don't burn bridges:

- **Don't only reach out when you need help:** People can see straight through transactional messages, and it reflects poorly on both you and PittCSC. Build genuine relationships with upperclassmen, alumni, and engineers first, and please do not beg strangers for referrals.
- **Work your existing network:** Friends' parents, former TAs, local Pittsburgh companies, and company-hosted events (like JPMorgan Code for Good, Capital One Summit, or Jane Street SEE) are all fair game.
- **Show up to the SCI Fall Career Fair:** It is one of the highest-leverage afternoons of the year to turn a PDF into a real human conversation. Read our full **[Conquering the Career Fair](/guides/career/career-fair)** guide for the 3-9-27 scouting strategy, elevator pitch checklist, and follow-up templates.

The biggest takeaway here is that **becoming a great software engineer is the easiest way to be hired as a software engineer**. Trust the process, this does not happen overnight, but the compounding payoff is worth it.

---

_Next: [Resumes & ATS](/guides/zero-to-offer/resume)_
