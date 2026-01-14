---
title: "[DevLab] 8. When to Use AI"
author: "Shreyash Ranjan"
date: "2025-12-17"
order: 8
search_tags: ["ai", "copilot", "cursor", "ai-assisted engineering", "vibe coding", "chatgpt", "code generation", "devlab"]
---

You've probably used (or at least heard about) GitHub Copilot, Cursor, or ChatGPT for coding. These tools are becoming standard in our industry—many companies expect you to use them at your internship. They can help you ship code faster, catch bugs, and handle tedious boilerplate.

But here's the catch: they also make it incredibly easy to ship _bad_ code faster.

At CSC Dev Lab, we want you to become an **AI-Assisted Engineer**, not a "Vibe Coder." This guide will help you understand the difference and use AI tools effectively in your Dev Lab projects.

## The Speed vs. Maintenance Trade-off

Let's start with the good news: there's solid evidence that AI coding tools can genuinely speed you up. GitHub's research found that developers completing tasks with Copilot were up to **55% faster**⁽¹⁾, and McKinsey estimates 30-60% time savings on boilerplate and documentation⁽²⁾.

![GitHub Copilot Speed Study](/images/guides/skills/csc-dev-lab/copilot-study.png)

That sounds amazing, right? Write code in half the time! But here's what those studies don't measure: what happens to that code next week, or next month?

Speed matters, but it's not the only metric that keeps a codebase healthy. If you're generating code you don't actually understand, you're not really building software—you're just pushing work into the debugging and review phase, where it gets way more expensive to fix.

> **The golden rule:** Code that takes 5 seconds to generate but 5 hours to debug is a net loss.

In Dev Lab, someone else will read your code next week. Maybe your teammate needs to fix a bug, or your project mentor wants to understand your architecture. They won't have access to your prompt history or the conversation you had with the AI. Your code needs to make sense on its own.

## Vibe Coding vs. AI-Assisted Engineering

### What is Vibe Coding?

"Vibe coding" is what happens when you let the AI do your thinking for you. The workflow looks like this:

1. Type a vague prompt into Cursor or Copilot
2. Copy-paste the entire output
3. Run it
4. If it compiles and seems to work, commit it
5. Move on without actually understanding what it does

Sound familiar? You're not alone—this is really common, especially when you're under pressure to ship features quickly. But it creates some serious problems:

**1. Security Vulnerabilities**

AI tools often suggest outdated packages or insecure patterns. They might recommend a library that had a critical vulnerability patched last year, or use `eval()` when there's a safer alternative. If you're not reviewing the code, you won't catch these issues until they become incidents.

**2. Spaghetti Code**

LLMs are actually pretty good at writing individual functions. But they're terrible at system architecture. They don't know about the component you built last week, the utility function that already does this, or the design pattern your team agreed on. The result? Duplicate logic, inconsistent patterns, and code that's hard to maintain.

**3. Skill Atrophy**

Here's the uncomfortable truth: if you're always delegating implementation to AI, you're not building the skills you need to be an effective engineer. You can't debug what you don't understand. You can't design systems if you've never wrestled with the details.

### What is AI-Assisted Engineering?

**AI-Assisted Engineering** is different. You're still the architect and the decision-maker. The workflow looks more like this:

1. **You** decide what needs to be built and how data should flow
2. **You** design the API, choose the architecture, and plan the implementation
3. **You** use AI to handle tedious parts: syntax, boilerplate, repetitive patterns
4. **You** review every line it generates
5. **You** refactor to fit your team's patterns and standards
6. **You** can explain every line in a code review

The AI is your assistant, not your replacement. You're using it to move faster on the parts that don't require much thought, so you have more energy for the parts that do.

## How to Use AI Effectively in Dev Lab

### 1. Plan First, Prompt Second

AI tools are great at local edits and small, well-scoped functions. They struggle with repo-wide design unless you give them structure.

Here's what _doesn't_ work well:

> "Make me a user profile page"

You'll get a component that looks fine in isolation but ignores your existing types, doesn't use your server actions, and stores data in a completely different way than the rest of your app.

Here's what _does_ work:

> "Create a profile component that takes our `User` type from `@/types`, displays the user's name, email, and avatar, and calls our `updateProfile` server action when the Save button is clicked"

See the difference? The second prompt gives the AI context about your codebase. Before you open the chat, know your data flow. Understand what already exists. Make the architectural decisions yourself.

**For Dev Lab projects:**
- Read your team's existing code first
- Look at how similar features are already implemented
- Decide on your approach before you prompt
- Give the AI specific context about your types, patterns, and conventions

### 2. The "Why" Rule

**Never commit code you can't explain to your teammates.**

If Cursor suggests a complex one-liner using `.reduce()` and chained array methods, ask it to explain what it does. If it wants to install a library you've never heard of, look up what that library does and whether you actually need it.

Use the tool to learn the syntax, not to bypass understanding it. If a PR reviewer asks "Why did you use this approach?" and your answer is "That's what the AI wrote," you're not ready to merge.

> Think of AI like Stack Overflow on steroids: it's a great resource for learning and solving problems, but you need to understand the solutions you're using.

**Good signs you understand the code:**
- You can explain what each section does in plain English
- You could reproduce it from scratch if you had to
- You know why this approach was chosen over alternatives
- You can predict what would break if requirements changed

**Warning signs you're vibe coding:**
- "It works but I'm not sure how"
- "I think this does [X] but I'd have to ask the AI"
- "I just kept regenerating until it compiled"
- "The AI suggested it so I assumed it was right"

### 3. Refactor the Output

AI-generated code is rarely perfect on the first try. It tends to:
- Duplicate logic instead of extracting it into helpers
- Invent new patterns instead of using your existing ones
- Ignore utilities you already have
- Use generic names like `data`, `result`, `temp`

Don't treat the output as final. Treat it as a first draft that you need to polish:

**After getting AI-generated code:**
- [ ] Rename variables to match your team's style guide
- [ ] Check if you already have utilities for this logic
- [ ] Extract repeated code into helper functions
- [ ] Verify it matches your existing patterns
- [ ] Add error handling if the AI skipped it
- [ ] Review security implications

If you're just hitting "Accept" and moving on, you're probably introducing technical debt⁽³⁾.

### 4. Iterate, Don't Regenerate

When the generated code doesn't work, don't just hit "Regenerate" and hope for better luck. That's like rolling dice—you might get better output, or you might get worse.

Instead, tell the AI _why_ it failed and what you need:

❌ "That didn't work" → Regenerate → "Still broken" → Regenerate...

✅ "This breaks when the user object is undefined. Add a check at the start of the function to return early if user is null."

✅ "This uses a deprecated API. We need to use the new `getUserProfile()` function from `@/lib/api` instead."

✅ "This works but doesn't match our error handling pattern. Wrap the API call in a try-catch and use our `showErrorToast()` helper."

Talk to it like you would in a code review: point out the failure case, the constraint, and what "done" actually looks like. This helps you build better mental models and gets you to working code faster.

### 5. Use AI for Learning

One of the best uses of AI tools in Dev Lab? Learning unfamiliar technology faster.

**Great AI-assisted learning workflows:**
- "Explain how React's useEffect hook works and show me an example"
- "I'm getting this TypeScript error: [paste error]. What does it mean and how do I fix it?"
- "What's the difference between `map()` and `forEach()` in JavaScript?"
- "How do I structure this API route in Next.js to handle POST requests?"

This is way faster than reading through docs, but with a caveat: verify what it tells you. LLMs sometimes confidently state things that are outdated or just wrong. If the AI explains something you don't understand, cross-reference with official documentation or ask your project mentor.

## When AI is Most (and Least) Useful

### AI is Great For:

✅ **Boilerplate and repetitive code**
- Writing CRUD operations
- Creating type definitions
- Generating test scaffolding
- Building form validation

✅ **Syntax help in unfamiliar languages**
- "How do I read a file in Python?"
- "What's the Rust syntax for iterating over a vector?"

✅ **Code explanations**
- Understanding error messages
- Deciphering complex regex
- Learning new APIs

✅ **Refactoring tasks**
- Converting callbacks to async/await
- Renaming variables consistently
- Extracting duplicated logic

### AI is Weak At:

❌ **System architecture decisions**
- How should components communicate?
- Where should state live?
- What's the data flow?

❌ **Understanding your specific codebase**
- What utilities already exist?
- What patterns has your team chosen?
- What are your project's constraints?

❌ **Security and edge cases**
- What happens if this API fails?
- How do we prevent injection attacks?
- What if the user does [unexpected thing]?

❌ **Team coordination**
- Should we build this or use a library?
- Is this the right priority?
- How does this fit into our roadmap?

## Your Responsibility as a Dev Lab Engineer

Using AI tools comes with responsibility. In Dev Lab, we'd rather you struggle with a problem for a bit, ask your teammates for help, or work with your project mentor than blindly paste AI-generated code you don't understand.

Why? Because the goal of Dev Lab isn't just to ship features—it's to make you a better engineer. If you're outsourcing all your thinking to AI, you're missing the learning opportunity.

> **A good rule of thumb:** If you wouldn't feel confident explaining your code to your project mentor or defending it in a code review, you need to understand it better before committing.

That said, AI can be extremely helpful when used thoughtfully. The developers who will thrive in the AI era aren't the ones who refuse to use these tools—they're the ones who know when to use them, when not to, and how to verify the output.

## Recommended AI Tools for Dev Lab

Here are some popular options you might encounter (or want to try):

**Code Editors with AI:**
- [GitHub Copilot](https://github.com/features/copilot) - Integrated into VS Code, suggests code as you type
- [Cursor](https://cursor.sh/) - AI-first code editor, great for editing entire files
- [Codeium](https://codeium.com/) - Free alternative to Copilot

**Chat Interfaces:**
- [ChatGPT](https://chat.openai.com/) - General purpose, good for explaining concepts
- [Claude](https://claude.ai/) - Better at following complex instructions and long conversations
- [Phind](https://www.phind.com/) - Specialized for developer questions, includes sources

Each has trade-offs. Experiment and find what works for your workflow, but remember: the tool doesn't matter as much as how you use it.

## Next Steps

- Review [DevLab 5: Code Review Best Practices](/guides/skills/csc-dev-lab/5-code-review)—you should be able to explain AI-generated code just as well as code you wrote from scratch
- Check out [DevLab 3: Writing Clean Code](/guides/skills/csc-dev-lab/3-clean-code) to understand what makes code maintainable, whether it came from you or an AI
- Try the "explain it back" technique: after the AI generates code, write a comment explaining what it does before committing

---

*Attribution & Acknowledgements: We stand on the shoulders of giants. Thanks to the open source communities and insights from Claire Longo, Philip Mutua, and Aalap Davjekar that helped shape these practices.*

**References:**

⁽¹⁾ [GitHub Research: Quantifying Copilot's impact](https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)

⁽²⁾ [McKinsey: Developer Productivity with Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/unleashing-developer-productivity-with-generative-ai)

⁽³⁾ [Google Cloud DORA Report](https://cloud.google.com/devops/state-of-devops)
