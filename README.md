# UAlbany LibraryDesk (Static UI)

UAlbany LibraryDesk is an Equipment and Resource Management System designed for University at Albany library circulation staff to streamline the tracking, preparation, sanitization, assignment, circulation, and reporting of university equipment. The system addresses challenges identified during stakeholder interviews related to equipment readiness, borrower accountability, historical usage reporting, and workflow visibility.

This project provides page layouts for authentication, circulation management, borrower directories, multi-step equipment preparation workflows, administrative reporting, and shared web component modules. It is intended as a front-end template and does not include a back-end or database integration in this phase.

## Features & Interactivity

The project interactivity includes:

- **Equipment Checkouts:** Issuing equipment loans to borrowers with NetID verification, due date assignment, and accessory check.
- **Equipment Returns:** Processing returns, recording device condition, verifying accessories, and routing to readiness queues.
- **Preparation Workflow:** Multi-step equipment readiness pipeline (Details, Task Assignment, Sanitization/Wipe Checklist, Supervisor Review).
- **Interactive Checklists:** Real-time completion progress tracking ("X of Y steps complete") with dynamic state updates.
- **Live Search & Filtering:** Client-side filtering across equipment, active loans, borrowers, and preparation queues with empty-state feedback.
- **Catalog Category Filtering:** Combined search keyword and category dropdown filtering for the equipment collection.
- **Post-Checkout Reports:** Timeframe/semester filtering with automated CSV report generation and single-item/full-semester download.
- **Alerts & Notifications:** Priority alerts for overdue loans, items due today, and equipment awaiting readiness review with quick filter tabs.
- **Library Status Toggle:** Interactive open/closed library indicator in the top header.
- **Smooth Page Navigation:** Client-side PJAX page swapping and scrollbar gutter stabilization to eliminate white flashes and screen jumping on navigation.
- **Responsive Layout:** Adaptive layouts optimized for desktop, tablet, and mobile devices.

Static Site Deployed via [GitHub Pages](https://lindakovacs.github.io/UAlbany_LibraryDesk/)

## Project Team

- Linda Kovacs
- Veronica Dindial
- Rym Mahiddine
- Wendy Ouedraogo
- Amari Scott

## Pages & Functionality

### Overview & Dashboard
- **`index.html`** — Staff overview dashboard featuring real-time KPI metrics (total equipment, active loans, due today, overdue), quick checkout/return action triggers, preparation queue summary, and recent circulation activity.

### Authentication & Staff Portal
- **`login.html`** — Authorized staff sign-in portal featuring UAlbany purple and gold split branding, NetID credentials authentication, and team credits.
- **`profile.html`** — Staff member profile displaying user's credentials, NetID, circulation division, assigned desk station, active permissions, and session status.
- **`notifications.html`** — Centralized staff notification center with category filtering (*All alerts*, *Overdue*, *Due today*, *Preparation*) and direct action links.
- **`help.html`** — Circulation desk operating guidelines, standard operating procedures, damaged item quarantine protocols, and quick contact directory.

### Loans & Circulation
- **`loans.html`** — Active equipment loans management table with live search, borrower avatars, due dates, loan status tags, and return triggers.
- **`loans-overdue.html`** — Dedicated filtered view isolating overdue equipment loans requiring borrower follow-up.
- **`loan-details.html`** — Comprehensive loan record view with borrower standing, loan timeline, included kit accessory manifest, and return actions.
- **`new-loan.html`** — Equipment checkout form with borrower NetID input, 13-item collection selector with query pre-selection, loan duration, and accessory verification.
- **`return-item.html`** — Equipment check-in form with loan selector, condition assessment, accessory checklist, and destination routing.

### Equipment & Borrowers
- **`equipment.html`** — Complete 13-item University Library equipment catalog with live text search, category dropdown filter, availability counters, and checkout actions.
- **`borrowers.html`** — Library borrower roster displaying student IDs, active loan counts, account standing badges, and search filtering.
- **`reports.html`** — Post-checkout administrative reporting view with semester presets (Fall 2026, Summer 2026, Spring 2026, Custom), utilization statistics, and instant CSV export.

### Equipment Preparation Workflow
- **`preparation-progress.html`** — Queue view for equipment awaiting staff task assignment.
- **`preparation.html`** — Queue view for equipment actively undergoing preparation and sanitization.
- **`preparation-review.html`** — Queue view for completed equipment awaiting supervisor readiness review.
- **`preparation-ready.html`** — Queue view for equipment verified and ready for lending.
- **`preparation-all.html`** — Master preparation queue showing all 11 equipment items across every stage.
- **`preparation-details.html`** — Step 1: Equipment overview, required steps checklist, and preparation notes.
- **`preparation-assignment.html`** — Step 2: Staff assignment form, target completion date, and task checklist selection.
- **`preparation-checklist.html`** — Step 3: Interactive sanitization, user data wipe, inventory check, and repackaging checklist.
- **`preparation-review-details.html`** — Step 4: Final supervisor review, issue notes inspection, and readiness sign-off for lending.

## Shared UI Components

Custom Web Components implemented in `components.js`:

- **`<app-sidebar>`** — Navigation sidebar with automatic route detection, active state indicators, UAlbany crest, and persistent footer links.
- **`<app-header>`** — Global page header featuring dynamic breadcrumb navigation, interactive library open/closed toggle, notification bell, profile summary, and sign-out link.
- **`<app-footer>`** — Standard team copyright footer and institutional credits.
- **`<loan-tabs>`** — Tab navigation bar switching between all loans and overdue loans with real-time count badges.
- **`<preparation-tabs>`** — 5-status queue navigation tabs with live item counts across preparation stages.
- **`<preparation-steps>`** — 4-step preparation workflow progress navigation (1 Details, 2 Assignment, 3 Checklist, 4 Review).

## Styles & Assets

- **`styles.css`** — Core stylesheet defining UAlbany brand colors (`#46166b` Purple, `#eeb211` / `#fdbb30` Gold, `#f1ebf6` Background), typography, CSS Grid/Flexbox layouts, card components, form controls, and responsive media queries.
- **`components.js`** — Web Components definitions, PJAX seamless navigation, live search filters, and interactive checklist behavior.
- **`assets/`** — Static SVG graphics, including `UAlbany_logo.svg`, `favicon.svg`, and `library-equipment.jpg`.

## Getting Started

### 1. Download or Clone the Repository

Clone the project to your local machine using Git:

```bash
git clone https://github.com/lindakovacs/UAlbany_LibraryDesk.git
cd UAlbany_LibraryDesk
```

Alternatively, download the ZIP archive by clicking the green **Code** button on GitHub and selecting **Download ZIP**, then extract the folder on your computer.

### 2. View in Your Browser

Open any HTML file in your browser (for example, in VS Code, right-click on `index.html` or `login.html` and select **"Open with Live Server"**, or use the keyboard shortcut `Alt + L` then `Alt + O`). 

Alternatively, open `index.html` directly in any modern web browser. No build step, bundler, or local server is required for this Static UI phase.

## Project Structure

```
.
├── assets/
│   ├── UAlbany_logo.svg
│   ├── favicon.svg
│   └── library-equipment.jpg
├── instructions/
│   └── README.md
├── borrowers.html
├── components.js
├── equipment.html
├── help.html
├── index.html
├── loan-details.html
├── loans.html
├── loans-overdue.html
├── login.html
├── new-loan.html
├── notifications.html
├── preparation.html
├── preparation-all.html
├── preparation-assignment.html
├── preparation-checklist.html
├── preparation-details.html
├── preparation-progress.html
├── preparation-ready.html
├── preparation-review.html
├── preparation-review-details.html
├── profile.html
├── reports.html
├── return-item.html
├── styles.css
├── LICENSE
└── README.md
```

## Development Approach

The project implementation milestones:

1. Repository boilerplate
2. HTML pages and components
3. CSS styling
4. JavaScript, Python-rendered frontend
5. Node.js and Express backend
6. MySQL persistence
7. Render deployment

See [`instructions/`](./instructions/) for the complete implementation sequence.

## Technologies

Stack: HTML5, CSS3, JavaScript, Web Components, DOM, Python, Git, GitHub, Form validation, Database, and GitHub Pages.

## Project Links

- [Figma Prototype](https://www.figma.com/proto/hOLNuCHjmtsA7JDbaTkGuS/UAlbany-LibraryDesk?node-id=81-259&p=f&t=FXax9FUBmLrjkIsb-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=81%3A259)
- [GitHub Pages – Static Website Deployment](https://lindakovacs.github.io/UAlbany_LibraryDesk/)
- [GitHub Repository](https://github.com/lindakovacs/UAlbany_LibraryDesk)
