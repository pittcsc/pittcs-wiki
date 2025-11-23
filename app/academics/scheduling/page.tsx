"use client"

import { useState } from "react"
import InteractiveCourseGraph from "@/components/Courses/InteractiveCourseGraph"
import CourseDetailsModal from "@/components/Courses/CourseDetailsModal"
import { CoreCoursesData, CoreCourseData } from "@/data/CoreCoursesData"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const schedulingContent = `
## Overview

The core courses can be broken up into different tracks.

**Core Programming Intensive**

These classes teach the most fundamental CS concepts. **Bolded classes** are considered very demanding.

- CMP 401
- CS 445
- **CS 1501**

**Mathy**

These are more theory based classes that involve proofs and math.

- CS 441
- CS 1502
- CS 1503

**Systems**

Do you actually know how a computer works? These classes will teach you!

- CS 447
- **CS 449**

## Potential Schedules

We recommend taking CS445, CS441, and CS1501 as soon as possible. These courses form the foundation of your CS education and will unlock a lot of upper electives. CS445 and CS1501 are also an absolute necessity for technical interviews.

**Making a Good CS Plan**

1. Take 401, 441, 445, and 1501 early on
2. Decide which semester you will take 1501.
3. Throw away the plan (in college, things change!)

Below are some potential schedules. Your schedule will look different depending on your other classes!

Whenever you schedule a class make sure to **pay close attention to the professor**. It's better to optimize your schedule to have better professors. Check the respective pages for each course on the wiki and use Rate My Professor.

**Note:** These **are just example schedules**. Everyone's situation is different and yours will likely look different.

### A - Common

| Semester 1 | Semester 2 | Semester 3 | Semester 4  | Semester 5  |
| ---------- | ---------- | ---------- | ----------- | ----------- |
| 401        | 447        | 1501       | 449         | CS Elective |
| 441        | 445        | 1502       | 1503        | CS Elective |

### B - Common

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5  |
| ---------- | ---------- | ---------- | ---------- | ----------- |
| 401        | 441        | 447        | 449        | CS Elective |
|            | 445        | 1501       | 1502       | 1503        |

### C - Common

| Semester 1 | Semester 2 | Semester 3 | Semester 4 |
| ---------- | ---------- | ---------- | ---------- |
| 401        | 447        | 449        | 1502       |
| 441        | 445        | 1501       | 1503       |

### D - Common

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5  |
| ---------- | ---------- | ---------- | ---------- | ----------- |
| 007/ 010   | 401        | 445        | 1501       | 449         |
|            | 441        | 447        | 1502       | CS Elective |

### E - Common

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5  |
| ---------- | ---------- | ---------- | ---------- | ----------- |
| 401        | 441        | 447        | 1501       | CS Elective |
|            | 445        | 449        | 1502       | 1503        |

### F - Slowish Start

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| 007/ 010   | 401        | 445        | 1501       | 449        |
|            |            | 441        | 447        | 1502       |

### G - Slowish Start (Faster)

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5  |
| ---------- | ---------- | ---------- | ---------- | ----------- |
| 007/ 010   | 401        | 445        | 1501       | 449         |
|            |            | 441        | 1502       | CS Elective |
|            |            | 447        |            |             |

### H - Slowish Start (Fastest)

| Semester 1 | Semester 2 | Semester 3 | Semester 4 | Semester 5  |
| ---------- | ---------- | ---------- | ---------- | ----------- |
| 007/ 010   | 401        | 445        | 1501       | 1503        |
|            |            | 441        | 1502       | CS Elective |
|            |            | 447        | 449        |             |

### I - AP Credit required

| Semester 1 | Semester 2 | Semester 3 | Semester 4  |
| ---------- | ---------- | ---------- | ----------- |
| 445        | 447        | 1501       | 1503        |
| 441        | 449        | 1502       | CS Elective |

### J - Tryhard

| Semester 1 | Semester 2 | Semester 3 | Semester 4     |
| ---------- | ---------- | ---------- | -------------- |
| 401        | 447        | 1501       | 1503           |
| 441        | 445        | 449        | CS Elective(s) |
|            |            | 1502       |                |

## What should I take with these CS classes?

It depends on the rigor of the CS course, and the professor. Notably, if we are talking about CS 1501, we would not want a heavy course load. We recommend not taking Calculus II with CS1501 as it is very demanding. Instead, take Calc with a lower level required course like 401 or 449 or take it with your upper electives!

We would likely take some light gen-eds with CS 1501. As noted, it is demanding and you wouldn't want other tough classes from interfering with it.

## CS Electives

You discover your interests in CS as you take some electives. You're not limited to take classes in a certain domain, but try to take classes that you'll enjoy. Electives are meant to cover topics you want to explore, not classes you suffer in. For example, if you didn't enjoy CS 447 or 449, you probably don't want to take Computer Architecture (CS 1541) or Operating Systems (CS 1550). On the other hand, if you enjoy certain parts of CS 1501, such as the introduction to cryptography section, CS 1653 would probably be a good elective to take.

Check out the [course explorer](/courses) to look at the different electives that are offered. Pick the ones that pique your interest.

## FAQ

### CS 0007 or CS 401?

Should you start with **Intro to Programming** or **Intermediate Programming?** Cases by experience levels:

- **You have never written a single line of code:** Take 0007.
  - _Caveat:_ If you have enough time before the semester starts, watch online tutorials to learn Java and start with 401! If you can learn variables, assignments, if-statements, logical operators, functions, Strings, lists, input/output, and loops before the semester, you can probably take 401.
- **You took a high school-level programming course:** Take 401, _unless_ the programming course was in a language like HTML/CSS.
  - _Caveat:_ If the course wasn't in Java, you'll have to learn the syntax. Learning syntax doesn't take long, just look at code examples from the textbook.
- **You took a college-level for-credit programming course:** Take 445.
  - _Caveat:_ You'll definitely want to review OOP and algorithm analysis, which are the core concepts of DS&A 1.

### Should I Graduate Early?

If you have enough credits, you can graduate early! It is a great way to save some tuition money. But, there are also some more classes that can help you as a CS major.

It really depends on what your interests are. For example, if you are interested in Data Science, we would recommend taking some Statistics classes. In particular, STAT 1261, and STAT 1201 would be excellent options.

If you are interested in Cryptography, we would recommend taking some Math classes. In particular, Introduction to Mathematical Cryptography, Elementary Number Theory, Combinatorial Mathematics, would be great options.`

export default function SchedulingPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMathPrereqs, setShowMathPrereqs] = useState(false)

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCourse(null)
  }

  const toggleMathPrereqs = () => {
    setShowMathPrereqs(!showMathPrereqs)
  }

  const selectedCourseData = selectedCourse
    ? CoreCoursesData[selectedCourse]
    : null

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm font-medium text-gray-600">
            <a href="/guides" className="text-blue-600 hover:text-blue-700">
              GUIDES
            </a>
            <span className="mx-2 text-gray-400">›</span>
            <a href="/academics" className="text-blue-600 hover:text-blue-700">
              ACADEMICS
            </a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">SCHEDULING</span>
          </nav>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900">
            Scheduling Classes
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Plan your CS courses efficiently using our interactive course graph
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Text */}
          <div className="mb-12 bg-white p-8 rounded-lg border border-gray-200">
            <p className="text-gray-700 text-base leading-relaxed">
              Let's look at the core CS classes required for the major. It might
              look intimidating at first, but it just shows the requirements of
              classes. For example, to take CS 1501, you must take CS 441 and CS
              445.
            </p>
            <p className="text-gray-700 text-base leading-relaxed mt-4">
              The dashed lines mean those classes are "coreqs". For example, you
              can take CS 449 if you are taking CS 447 in the semester. But, you
              cannot take CS 449 before CS 447.
            </p>
          </div>

          {/* Toggle and Graph Section */}
          <div className="mb-16">
            {/* Toggle Button */}
            <div className="mb-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMathPrereqs}
                  onChange={toggleMathPrereqs}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Math Prerequisites
                </span>
              </label>
            </div>

            {/* Graph Section - Full Width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: "750px" }}>
              <InteractiveCourseGraph
                onCourseClick={handleCourseClick}
                selectedCourse={selectedCourse}
                showMathPrereqs={showMathPrereqs}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-16 prose prose-lg max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{schedulingContent}</Markdown>
          </div>

          {/* Related Links */}
          <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Related Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://www.sci.pitt.edu/academics/undergraduate-majors/computer-science"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="font-bold text-sm">Full Requirements</div>
                <div className="text-xs text-gray-600 mt-1">Pitt CS Department</div>
              </a>
              <a
                href="/courses"
                className="block p-4 border border-gray-200 rounded-lg text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="font-bold text-sm">Course Explorer</div>
                <div className="text-xs text-gray-600 mt-1">Browse all CS courses</div>
              </a>
              <a
                href="/academics/registration/capstone"
                className="block p-4 border border-gray-200 rounded-lg text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="font-bold text-sm">CS Capstone Guide</div>
                <div className="text-xs text-gray-600 mt-1">Planning your capstone</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourseData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}