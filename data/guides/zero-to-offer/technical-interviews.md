---
title: "[Z2O] 6. Technical Interviews & OAs"
order: 6
author: "PittCSC"
date: "2026-09-10"
---

> This is a part of a series of guides called Zero to Offer aimed to help you navigate the internship process. We recommend you start [here](/guides/zero-to-offer/)!

Coding Interviews are tough, but with practice you'll be able to pass them with ease. Before continuing, it is **required** to read the following Tech Interview Handbook pages:

- [Coding Round Overview](https://www.techinterviewhandbook.org/software-engineering-interview-guide/) (5 minute read)
- [Picking a Language](https://www.techinterviewhandbook.org/programming-languages-for-coding-interviews/) (5 minute read)
- [Study and Practice](https://www.techinterviewhandbook.org/coding-interview-study-plan/) (5 minute read)

Reading the TechInterviewHandbook guides should take no more than 20 minutes!

Additionally, it might be worth it to watch a real interview. [Here](https://www.youtube.com/watch?v=3Q_oYDQ2whs) is an example video.

## What Technical Interviews & OAs Actually Measure

A live coding interview is **not** a memory test, a language-trivia quiz, or a binary pass/fail on whether you hit optimal runtime on the first try. Engineers are evaluating three things: **Problem Solving, Communication, and Quick Thinking**.

Before you ever reach a live engineer, though, most companies send an asynchronous **Online Assessment (OA)**:

- **Auto OAs vs. Non-Auto (Screened) OAs:** If a company sends everyone an OA right after applying (for example, Roblox or Optiver-style portals), take it **ASAP**: speed matters and questions are usually more standard. If you only received an OA after a resume screen, take a few days to warm up first, as screened OAs tend to be harder.
- **CodeSignal General Coding Assessment (GCA):** You get **4 questions in 70 minutes** (Easy, Medium-Easy, Medium, Medium-Hard), scored **200–600** and reusable across companies. Most candidates score higher by solving in **`1 → 2 → 4 → 3`** order (Q3 is often implementation-heavy and eats clock). Watch the cooldown limits: you can only take the GCA **2 times in 30 days** and **3 times in 180 days**.
- **HackerRank:** Company-specific, typically 2 medium problems, black-box scoring, and no retake cooldown.
- **Beyond LeetCode:** Some companies mix in decision-making or math games (like Roblox decision assessments or Optiver Zap-N), while others focus on practical debugging or REST API rounds.

## Knowledge is Key

Everyone will be different, but you should aim to solve somewhere between 50–150 problems depending on your current skill level. However, it's more important to comprehensively understand the problems and their solutions. If you haven't taken Data Structures and Algorithms yet (at Pitt, `CS 0445` and `CS 1501`), you will first need a working understanding of:

- Big-O time and space complexity
- The runtime of every core data structure (arrays, hash maps, stacks, queues, trees, heaps, graphs)
- Why each data structure has those runtimes

Some companies might also ask questions that are less "LeetCode"-y and more practical, for example, asking you about REST APIs or to debug an existing program. Your knowledge in these areas will grow as you build projects and take upper-level courses.

## The T.A.C.O. Framework for Live Coding

LeetCode and NeetCode teach you how to solve problems alone. They do **not** teach you the part that actually passes live interviews: articulating your thought process. Use **T.A.C.O.** as both your priority order and your step-by-step execution order:

1. **T (Think):** Read the prompt twice and **take notes directly in the interview file** (companies review that file afterward). Explicitly write down **Input, Output, Directions/Constraints, and Edge Cases** before touching code. Mentioning a brute-force approach first is completely fine.
2. **A (Articulate):** *"A confused interviewer is worse than no solution."* Treat your interviewer like a teammate, check in with *"Does this direction look reasonable?"* or *"Is there anything you'd improve?"* before coding, and ask for a small hint rather than sitting silent for five minutes.
3. **C (Code):** Use a language you know cold, and strongly consider **Python** for interviews (`{}` beats typing `std::unordered_map<std::string, std::string>;` under a 45-minute clock). **Don't force memorized patterns**: fit the solution to the problem, not the other way around.
4. **O (Organize):** Block out your logic with brief comments or pseudocode if it helps, use clean variable names, dry-run a test case line by line, and state your **time and space complexity** at the end.

## Problem Solving Methodology

Our goal is for you to solve a lot of questions while also not burning out. To prevent burnout, limit yourself to **1–3 questions a day** with a goal of staying consistent rather than cramming 10 problems on a Sunday.

When doing these problems, spend **20–40 minutes** trying to solve it by yourself. If you can't solve it within that time frame, look at the solution and convince yourself you truly understand why it works, including its time and space complexity.

Also try not to become over-reliant on clicking the "Run Code" button in LeetCode. You should be able to walk through your code and catch edge cases in your head.

### What to Practice (NeetCode 150 & PittCSC's Study Plan)

Free LeetCode is more than enough, and you don't need LeetCode Premium (and PittCSC has historically subsidized Premium for the club when enough members want it). Focus on structured problem sets instead of random daily spins:

- **[NeetCode 150](https://neetcode.io/):** The cleanest dependency-ordered roadmap from Arrays & Hashing and Two Pointers up through Trees, Graphs, and Dynamic Programming.
- **[PittCSC 15-Week LeetCode Study Plan](/guides/career/study-plan):** Our own paced week-by-week breakdown if you want a semester-length schedule.
- **Tech Interview Handbook's [Grind 75 / Best Practice Questions](https://www.techinterviewhandbook.org/best-practice-questions/):** Great if you're on a tighter 1-month timeline.

Avoid the three most common traps: checking the solution after 5 minutes, practicing inconsistently, and memorizing code instead of learning the underlying approach.

### Practice Articulation in `#mock-interview`

Because solo LeetCode doesn't test communication, open a ticket in PittCSC Discord **`#mock-interview`** with your **[Whenly](https://pittcsc.org/meet)** availability, target company, and focus area. PittCSC members who do mock interviews before real rounds have an **over 90% pass rate**.

### A Note on AI in Prep & OAs

Using AI as a tutor to explain a tricky DP transition or check your Big-O analysis while studying is fine. **Never** use AI to cheat on OAs or live interviews: proctoring, keystroke tracking, and follow-up live verification rounds will get you blacklisted. Just as importantly, don't let AI write solutions for you before you've built DS&A fundamentals yourself; *"brain rot"* shows up fast the moment an interviewer asks you to modify your code live.

_Next: [Post-Interview, Offers & Rejection](/guides/zero-to-offer/post-interview)_
