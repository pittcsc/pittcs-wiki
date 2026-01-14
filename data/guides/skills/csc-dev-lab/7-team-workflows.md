---
title: "[DevLab] 7. Team Workflows & Communication"
author: "Claude Sonnet 4.5"
date: "2025-01-14"
search_tags: ["team", "workflow", "meetings", "communication", "project management", "issues", "tickets", "standup", "devlab"]
---

The best code doesn't matter if your Dev Lab team can't coordinate effectively. **Team workflows** are the processes and tools that help your team stay organized, communicate efficiently, and ship working software. This includes how you track work (issues/tickets), how you meet (standups, weekly syncs), and how you communicate (Slack, Discord, GitHub).

This guide will walk you through setting up workflows that keep your Dev Lab project running smoothly without creating unnecessary overhead.

## Team Workflow Overview

### What are Team Workflows?

**Team workflows** are the systems and practices your team uses to coordinate work:
- **Issue tracking:** How you track what needs to be done
- **Meetings:** How you sync up and make decisions
- **Communication channels:** Where conversations happen (Discord, Slack, GitHub)
- **Documentation:** Where you write things down

These are different from **technical workflows** like Git branching or CI/CD—those are about code, workflows are about people.

### Why Workflows Matter in Dev Lab

**Without good workflows:**
- People duplicate work because they didn't know someone else was doing it
- Important tasks get forgotten
- Decisions are made in Discord DMs and no one remembers them
- New team members (or returning ones after break) are lost

**With good workflows:**
- Everyone knows what everyone else is working on
- Work is visible and trackable
- Decisions are documented
- The project doesn't fall apart when someone gets busy with exams

## Issue Tracking for Dev Lab

### What are Issues?

**Issues** (also called tickets) are a structured way to track work items. Each issue represents something that needs to be done: a feature, a bug fix, a chore, or even a question.

Instead of just talking about work ("Someone should fix the login bug"), you create an issue that:
- Describes what needs to be done
- Tracks its status (To Do / In Progress / Done)
- Assigns ownership (who's responsible?)
- Links to related PRs
- Creates a historical record

### Anatomy of a Good Issue

#### Title

The title should be **clear and descriptive**:

**Bad:**
- "Fix bug"
- "Update the thing"
- "Login"

**Good:**
- "Login button doesn't work on mobile"
- "Add password reset functionality"
- "Optimize database queries for search"

#### Description

**For features:**
```markdown
## What
Add a "Forgot Password" flow

## Why
Users who forget their password have to email us.
This was the #2 complaint in user testing.

## Acceptance Criteria
- [ ] "Forgot Password" link on login page
- [ ] User enters email and receives reset link
- [ ] Link expires after 24 hours
- [ ] User can set new password via link
- [ ] User is logged in after resetting
```

**For bugs:**
```markdown
## Description
Login button doesn't respond to clicks on mobile

## Steps to Reproduce
1. Open site on mobile browser
2. Go to /login
3. Tap the "Log In" button
4. Nothing happens

## Expected
Form should submit and user should be logged in

## Actual
Button does nothing. No console errors.

## Environment
- Device: iPhone 14
- Browser: Safari
```

#### Metadata

Use GitHub labels and features:
- **Labels:** `bug`, `feature`, `documentation`, `help-wanted`, `blocked`
- **Assignee:** Who's working on it?
- **Milestone:** What sprint or demo is it part of?
- **Projects:** Add to your Dev Lab project board

### Issue Lifecycle

Issues move through these states:

**To Do** → **In Progress** → **In Review** → **Done**

**Best practices:**
- Only assign issues you're actively working on
- Link PRs to issues: "Closes #42" in your PR description auto-closes the issue
- Comment on issues with updates if they're taking longer than expected

### Using GitHub Issues for Dev Lab

#### Set up labels

Create these labels for your project:
- `bug` (red) - Something is broken
- `feature` (green) - New functionality
- `enhancement` (blue) - Improvement to existing feature
- `documentation` (yellow) - Docs need updating
- `help-wanted` (purple) - Good for new team members
- `blocked` (orange) - Can't proceed without something else
- `priority-high` (red) - Need to do this ASAP

#### Create issue templates

In your repo, create `.github/ISSUE_TEMPLATE/`:

**bug_report.md:**
```markdown
---
name: Bug report
about: Something isn't working
---

## Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected behavior


## Screenshots


## Environment
- Browser:
- Device:
```

**feature_request.md:**
```markdown
---
name: Feature request
about: New functionality
---

## What
Brief description

## Why
Why we need this

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

#### Use GitHub Projects

Set up a project board for your Dev Lab project:
1. Go to your repo → Projects → New Project
2. Choose "Board" view
3. Add columns: To Do, In Progress, In Review, Done
4. Link issues to the board

This gives you a visual Kanban view of all work.

## Meetings for Dev Lab

### Types of Meetings

#### Weekly Team Sync (30-60 minutes)

**Purpose:** Coordinate work, demo progress, discuss blockers, plan next week

**Recommended schedule:** Once per week at a consistent time

**Example Agenda:**
```markdown
1. Quick wins / celebrations (5 min)
   - Shipped the user dashboard!
   - Got great feedback on the design

2. Demos (15 min)
   - Each person shows what they built this week

3. Blockers and challenges (10 min)
   - Anyone stuck on something?
   - What needs help?

4. Planning next week (15 min)
   - What issues is each person taking on?
   - Any dependencies or coordination needed?

5. Open discussion (10 min)
   - Any other topics?

6. Action items (5 min)
   - Recap what everyone committed to
```

**Best practices:**
- Share agenda in Discord/Slack the day before
- Someone takes notes (rotate this responsibility)
- Start and end on time
- Share notes after the meeting

#### Standups (Async Recommended)

**Purpose:** Quick status updates on what everyone's working on

**The format:**
1. What did I do since last update?
2. What am I doing next?
3. Any blockers?

**For Dev Lab:** Daily standups are overkill. Instead, do **async standups** 2-3 times per week:
- Create a Discord/Slack thread
- Everyone posts their update
- Takes 2 minutes to write, everyone can read when convenient

**Example async standup:**
```
Tuesday Update - Alex
- Yesterday: Finished user authentication API endpoints
- Today: Starting frontend login form
- Blockers: None, but will need Sarah's CSS once she's done with navbar
```

#### Project Mentor Check-ins

**Purpose:** Get guidance from your Dev Lab project mentor

**Recommended:** Every 1-2 weeks, 30 minutes

**Come prepared with:**
- Demo of recent progress
- Specific questions or decisions you need help with
- Blocker that mentor can help unblock

#### Design Reviews (As Needed)

**Purpose:** Review design docs for major features

See [DevLab 6: Writing Design Docs](/guides/skills/csc-dev-lab/6-design-docs) for more.

### Meeting Best Practices

#### Before

- **Share agenda:** Post it 24 hours before
- **Invite only necessary people:** Respect everyone's time
- **Set clear objective:** What should this meeting accomplish?

#### During

- **Start on time:** Even if not everyone is there
- **Timeboxdiscussions:** If a topic is taking too long, table it for later
- **Take notes:** Shared Google Doc everyone can see
- **End with action items:** Who's doing what by when?

#### After

- **Share notes:** Post in Discord/Slack within 24 hours
- **Update issues:** Create issues for action items if they don't exist
- **Follow up:** Check in on commitments

### Reducing Meeting Fatigue

**Ask: Could this be async?**
- Status updates → async standups
- Simple decisions → Discord poll or thread
- Information sharing → shared doc everyone reads

**Use meetings for:**
- Brainstorming and ideation
- Complex decisions requiring discussion
- Demos and feedback
- Team bonding

## Communication Channels for Dev Lab

### Synchronous vs. Asynchronous

**Synchronous (real-time):**
- Meetings, quick Discord/Slack messages when you need immediate response
- Good for: Quick questions, urgent issues, brainstorming
- Bad for: Deep work time, different schedules

**Asynchronous (delayed):**
- GitHub issues/comments, async standups, design docs
- Good for: Thoughtful responses, documentation, working across schedules
- Bad for: True emergencies

**General rule:** Default to async. Use sync sparingly.

### Communication Tools

#### Discord / Slack

**Use for:** Quick questions, casual chat, coordination

**Set up channels:**
- `#general` - General project discussion
- `#dev` - Technical discussions
- `#standup` - Async status updates
- `#random` - Off-topic, memes, etc.

**Best practices:**
- Use threads to keep discussions organized
- Tag people sparingly (`@` mentions)
- Set your status when busy or away
- Don't expect instant responses (async!)

#### GitHub

**Use for:** Code reviews, issue discussions, technical decisions

**Why it's important:**
- Creates a permanent record
- Searchable later
- Linked to code and PRs

#### Google Docs

**Use for:** Design docs, meeting notes, planning documents

**Why it's useful:**
- Easy collaborative editing
- Good for longer-form content
- Comments and suggestions

#### Video Calls (Zoom, Discord)

**Use for:** Weekly syncs, mentor check-ins, complex discussions

**Best practices:**
- Camera on for important meetings (mentor check-ins, demos)
- Mute when not speaking
- Share screen when demoing
- Record if someone can't attend (ask first!)

### Communication Best Practices

**1. Write things down**
Don't rely on verbal-only decisions. Document in GitHub issues or docs.

**2. Over-communicate when needed**
If something affects the team, share it. "I'll be unavailable this weekend" or "I changed the API response format"

**3. Be responsive (but set boundaries)**
Aim to respond within 24 hours. But also: it's okay to have focus time without checking messages.

**4. Use the right channel:**
- Quick question → Discord/Slack
- Bug report → GitHub issue
- Major decision → Design doc + meeting
- Status update → Async standup

**5. Be kind and assume good intent**
Text lacks tone. If something sounds harsh, assume the person meant well.

## Setting Up Your Dev Lab Workflow

### Week 1: Foundation

**1. Set up GitHub**
- Enable Issues on your repo
- Create labels (bug, feature, etc.)
- Set up a Project board
- Create issue templates

**2. Set up communication**
- Create Discord server or Slack workspace
- Set up channels (#general, #dev, #standup)
- Invite everyone

**3. Create initial issues**
- Break down your project into features
- Create issues for each feature
- Add to project board (To Do column)

**4. Schedule weekly meeting**
- Pick a time that works for everyone
- Set it up as recurring

### Week 2: Establish Rhythm

**1. First sprint planning**
- Review all issues
- Assign issues for this week
- Move to "In Progress" column

**2. Set async standup cadence**
- Monday/Wednesday/Friday updates in Discord?
- Pin the format

**3. First weekly meeting**
- Follow the agenda template
- Take notes
- End with action items

### Ongoing: Iterate and Improve

**Every 2-3 weeks: Mini retrospective**
- What's working?
- What's not?
- One thing to change

**Examples:**
- "Our meetings run too long → Let's timebox each section"
- "Issues don't have enough detail → Let's use templates"
- "We're not reviewing PRs quickly → Let's set a 24-hour SLA"

## Common Pitfalls in Dev Lab

**Pitfall 1: No issues, everything in Discord**
- Solution: Create issues for all work. Reference issues in Discord threads.

**Pitfall 2: Meetings without agendas**
- Solution: Require agenda 24 hours before, or cancel the meeting.

**Pitfall 3: One person does all the work**
- Solution: Explicitly assign issues during sprint planning. Check in during weekly meeting.

**Pitfall 4: Team member disappears for weeks**
- Solution: Set expectation: if you can't contribute for >1 week, let the team know.

**Pitfall 5: Decisions lost in Discord DMs**
- Solution: Document all decisions in GitHub issues or design docs.

## Quick Reference: Dev Lab Workflow Checklist

### Daily/As You Work
- [ ] Update issue status when you start/finish work
- [ ] Respond to PR reviews
- [ ] Post async standup (Mon/Wed/Fri)

### Weekly
- [ ] Attend team meeting (or review notes if you miss)
- [ ] Complete issues you committed to (or communicate blockers)
- [ ] Review at least one teammate's PR

### Every Sprint (1-2 weeks)
- [ ] Sprint planning: Pick issues for next sprint
- [ ] Sprint review: Demo what you built
- [ ] Sprint retro: What to improve?

### Monthly
- [ ] Meet with project mentor
- [ ] Update project documentation
- [ ] Evaluate workflows: What should change?

## Recommended Resources

- [Atlassian Team Playbook](https://www.atlassian.com/team-playbook) - Practical team exercises
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects) - How to use project boards
- [Shape Up](https://basecamp.com/shapeup) - Basecamp's product development methodology
- [Remote: Office Not Required](https://basecamp.com/books/remote) - Great book on async work

## Next Steps

- Set up GitHub Issues and Projects for your Dev Lab project
- Schedule your first weekly team meeting
- Create your first sprint plan (what will you complete this week?)
- Review [DevLab 4: Agile & Project Management](/guides/skills/csc-dev-lab/4-agile) for more on sprints and ceremonies
