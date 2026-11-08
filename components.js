/**
 * UAlbany LibraryDesk - Web Components & Interactive Features
 * Team KofN1: Linda Kovacs, Veronica Dindial, Rym Mahiddine, Wendy Ouedraogo, Amari Scott
 *
 * Provides reusable components:
 * - <app-sidebar [current="overview|equipment|loans|borrowers|preparation"]></app-sidebar>
 * - <app-header [breadcrumbs="..."] [user-name="..."] [user-role="..."] [user-initials="..."]></app-header>
 * - <app-footer></app-footer>
 * - <preparation-tabs [active="awaiting|in-prep|review|ready|all"]></preparation-tabs>
 * - <preparation-steps [active="1|2|3|4|details|assignment|checklist|review"]></preparation-steps>
 * - <loan-tabs [active="all|overdue"]></loan-tabs>
 */

(function () {
  'use strict';

  // Ensure custom elements have display: contents so they don't disrupt flex/grid layouts
  if (!document.getElementById('app-components-style')) {
    const style = document.createElement('style');
    style.id = 'app-components-style';
    style.textContent = `
      app-sidebar,
      app-header,
      app-footer,
      preparation-tabs,
      preparation-steps,
      loan-tabs {
        display: contents;
      }
      .library-status {
        cursor: pointer;
        user-select: none;
      }
      .library-status.status-closed .status-dot {
        background: #d9383a;
      }
      .library-status.status-closed {
        color: #8c1d1e;
        background: #fdf2f2;
      }
      .table-empty-message {
        text-align: center;
        padding: 2rem !important;
        color: #6b6474;
        font-style: italic;
      }
    `;
    document.head.appendChild(style);
  }

  /* ==========================================================================
     Component: <app-sidebar>
     ========================================================================== */
  class AppSidebar extends HTMLElement {
    static get observedAttributes() {
      return ['current'];
    }

    connectedCallback() {
      const current = (this.getAttribute('current') || this.detectCurrentPage()).toLowerCase();

      this.innerHTML = `
        <aside class="sidebar" aria-label="Primary">
          <div class="brand">
            <a href="index.html" aria-label="LibraryDesk home">
              <span class="brand-symbol" aria-hidden="true">
                <img src="assets/favicon.svg" alt="" />
              </span>
              <span class="brand-copy">
                <span class="brand-name">LibraryDesk</span>
                <small>UAlbany University Libraries</small>
              </span>
            </a>
          </div>
          <nav aria-label="Workspace navigation">
            <p class="nav-label">Workspace</p>
            <ul>
              <li>
                <a class="nav-item" href="preparation-progress.html"${current === 'preparation' ? ' aria-current="page"' : ''}>Preparation</a>
              </li>
              <li>
                <a class="nav-item" href="index.html"${current === 'overview' ? ' aria-current="page"' : ''}>Overview</a>
              </li>
              <li>
                <a class="nav-item" href="equipment.html"${current === 'equipment' ? ' aria-current="page"' : ''}>Equipment</a>
              </li>
              <li>
                <a class="nav-item" href="loans.html"${current === 'loans' ? ' aria-current="page"' : ''}>Loans &amp; returns</a>
              </li>
              <li>
                <a class="nav-item" href="borrowers.html"${current === 'borrowers' ? ' aria-current="page"' : ''}>Borrowers</a>
              </li>
            </ul>
          </nav>
          <div class="sidebar-footer">
            <img class="ualbany-logo" src="assets/UAlbany_logo.svg" alt="University at Albany" />
            <a class="nav-item" href="help.html">Help &amp; support</a>
            <address>
              <strong>University Library</strong><br />Uptown Campus · Albany, NY
            </address>
          </div>
        </aside>
      `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.connectedCallback();
      }
    }

    detectCurrentPage() {
      const path = (window.location.pathname || '').toLowerCase();
      if (path.includes('borrower')) return 'borrowers';
      if (path.includes('equipment')) return 'equipment';
      if (path.includes('loan')) return 'loans';
      if (path.includes('prep')) return 'preparation';
      return 'overview';
    }
  }

  /* ==========================================================================
     Component: <app-header>
     ========================================================================== */
  class AppHeader extends HTMLElement {
    static get observedAttributes() {
      return ['breadcrumbs', 'current'];
    }

    connectedCallback() {
      const rawBreadcrumbs = this.getAttribute('breadcrumbs') || this.getAttribute('current') || '';
      const breadcrumbHtml = this.renderBreadcrumbs(rawBreadcrumbs);
      const userName = this.getAttribute('user-name') || 'Linda Kovacs';
      const userRole = this.getAttribute('user-role') || 'Library staff';
      const userInitials = this.getAttribute('user-initials') || 'LK';

      this.innerHTML = `
        <header class="page-header">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            ${breadcrumbHtml}
          </nav>
          <div class="header-actions">
            <span class="library-status" role="button" tabindex="0" title="Click to toggle library open/closed status">
              <span class="status-dot" aria-hidden="true"></span><span class="status-label">Library open</span>
            </span>
            <a class="notification-link" href="notifications.html" aria-label="Notifications">&#128276;</a>
            <a href="login.html">Sign out</a>
            <span class="profile-divider" aria-hidden="true"></span>
            <a class="profile-summary" href="profile.html">
              <span class="profile-initials" aria-hidden="true">${userInitials}</span>
              <span><strong>${userName}</strong><small>${userRole}</small></span>
              <span aria-hidden="true">⌄</span>
            </a>
          </div>
        </header>
      `;

      // Status toggle handler
      const statusBtn = this.querySelector('.library-status');
      if (statusBtn) {
        const toggleStatus = () => {
          const isClosed = statusBtn.classList.toggle('status-closed');
          const label = statusBtn.querySelector('.status-label');
          if (label) {
            label.textContent = isClosed ? 'Library closed' : 'Library open';
          }
        };
        statusBtn.addEventListener('click', toggleStatus);
        statusBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleStatus();
          }
        });
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.connectedCallback();
      }
    }

    renderBreadcrumbs(raw) {
      if (!raw) {
        return `<span>Staff workspace</span><span aria-hidden="true">›</span><strong>Overview</strong>`;
      }

      // Check for JSON array format
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .map((item, index) => {
              const isLast = index === parsed.length - 1;
              const separator = isLast ? '' : '<span aria-hidden="true">›</span>';
              if (isLast) {
                return `<strong>${item.label}</strong>`;
              }
              if (item.href) {
                return `<a href="${item.href}">${item.label}</a>${separator}`;
              }
              return `<span>${item.label}</span>${separator}`;
            })
            .join('');
        }
      } catch (e) {
        // Not JSON, continue to string parsing
      }

      // Check for arrow or chevron separated string: "Section > Subsection > Current"
      if (raw.includes('>') || raw.includes('›')) {
        const parts = raw.split(/[>›]/).map((s) => s.trim());
        return parts
          .map((part, index) => {
            const isLast = index === parts.length - 1;
            const separator = isLast ? '' : '<span aria-hidden="true">›</span>';
            return isLast ? `<strong>${part}</strong>` : `<span>${part}</span>${separator}`;
          })
          .join('');
      }

      // Default string: "Staff workspace › [raw]"
      return `<span>Staff workspace</span><span aria-hidden="true">›</span><strong>${raw}</strong>`;
    }
  }

  /* ==========================================================================
     Component: <app-footer>
     ========================================================================== */
  class AppFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="page-footer">
          <p class="footer-brand">LibraryDesk · UAlbany University Libraries</p>
          <p class="copyright">
            &copy; 2026 UAlbany Library | Team KofN1: Linda Kovacs, Veronica
            Dindial, Rym Mahiddine, Wendy Ouedraogo, Amari Scott
          </p>
        </footer>
      `;
    }
  }

  /* ==========================================================================
     Component: <preparation-tabs>
     ========================================================================== */
  class PreparationTabs extends HTMLElement {
    static get observedAttributes() {
      return ['active'];
    }

    connectedCallback() {
      const active = (this.getAttribute('active') || 'awaiting').toLowerCase();
      this.innerHTML = `
        <div class="tabs" role="tablist" aria-label="Preparation status">
          <a class="tab-link${active === 'awaiting' ? ' active-tab' : ''}" href="preparation-progress.html"${active === 'awaiting' ? ' aria-current="page"' : ''}>Awaiting assignment <span>4</span></a>
          <a class="tab-link${active === 'in-prep' || active === 'in preparation' ? ' active-tab' : ''}" href="preparation.html"${active === 'in-prep' || active === 'in preparation' ? ' aria-current="page"' : ''}>In preparation <span>3</span></a>
          <a class="tab-link${active === 'review' ? ' active-tab' : ''}" href="preparation-review.html"${active === 'review' ? ' aria-current="page"' : ''}>Review <span>2</span></a>
          <a class="tab-link${active === 'ready' ? ' active-tab' : ''}" href="preparation-ready.html"${active === 'ready' ? ' aria-current="page"' : ''}>Ready <span>2</span></a>
          <a class="tab-link${active === 'all' ? ' active-tab' : ''}" href="preparation-all.html"${active === 'all' ? ' aria-current="page"' : ''}>All equipment <span>11</span></a>
        </div>
      `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.connectedCallback();
      }
    }
  }

  /* ==========================================================================
     Component: <preparation-steps>
     ========================================================================== */
  class PreparationSteps extends HTMLElement {
    static get observedAttributes() {
      return ['active'];
    }

    connectedCallback() {
      const active = (this.getAttribute('active') || '1').toLowerCase();
      this.innerHTML = `
        <nav class="detail-steps" aria-label="Equipment preparation steps">
          <a class="${active === '1' || active === 'details' ? 'current' : ''}" href="preparation-details.html"><span>1</span>Details</a>
          <a class="${active === '2' || active === 'assignment' ? 'current' : ''}" href="preparation-assignment.html"><span>2</span>Assignment</a>
          <a class="${active === '3' || active === 'checklist' ? 'current' : ''}" href="preparation-checklist.html"><span>3</span>Checklist</a>
          <a class="${active === '4' || active === 'review' ? 'current' : ''}" href="preparation-review-details.html"><span>4</span>Review</a>
        </nav>
      `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.connectedCallback();
      }
    }
  }

  /* ==========================================================================
     Component: <loan-tabs>
     ========================================================================== */
  class LoanTabs extends HTMLElement {
    static get observedAttributes() {
      return ['active'];
    }

    connectedCallback() {
      const active = (this.getAttribute('active') || 'all').toLowerCase();
      this.innerHTML = `
        <div class="loan-tabs" role="tablist" aria-label="Loan status">
          <a class="${active === 'all' ? 'active' : ''}" href="loans.html"${active === 'all' ? ' aria-current="page"' : ''}>All loans <span>5</span></a>
          <a class="${active === 'overdue' ? 'active' : ''}" href="loans-overdue.html"${active === 'overdue' ? ' aria-current="page"' : ''}>Overdue <span>1</span></a>
        </div>
      `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue && this.isConnected) {
        this.connectedCallback();
      }
    }
  }

  // Register custom elements immediately
  customElements.define('app-sidebar', AppSidebar);
  customElements.define('app-header', AppHeader);
  customElements.define('app-footer', AppFooter);
  customElements.define('preparation-tabs', PreparationTabs);
  customElements.define('preparation-steps', PreparationSteps);
  customElements.define('loan-tabs', LoanTabs);

  /* ==========================================================================
     Interactive Behaviors: Search Filtering, Checklist Progress
     ========================================================================== */
  function initInteractiveBehaviors() {
    // 1. Preparation queue search filter
    const prepSearch = document.getElementById('preparation-search');
    if (prepSearch && !prepSearch.dataset.bound) {
      prepSearch.dataset.bound = 'true';
      const table = prepSearch.closest('.preparation-panel')?.querySelector('table');
      const countBadge = prepSearch.closest('.table-tools')?.querySelector('span');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tbody tr:not(.table-empty-row)'));
        prepSearch.addEventListener('input', () => {
          const query = prepSearch.value.trim().toLowerCase();
          let visibleCount = 0;

          rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const matches = !query || text.includes(query);
            row.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });

          if (countBadge) {
            countBadge.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
          }

          let emptyRow = table.querySelector('.table-empty-row');
          if (visibleCount === 0) {
            if (!emptyRow) {
              emptyRow = document.createElement('tr');
              emptyRow.className = 'table-empty-row';
              const colCount = table.querySelectorAll('thead th').length || 4;
              emptyRow.innerHTML = `<td colspan="${colCount}" class="table-empty-message">No matching equipment found for "${query}"</td>`;
              table.querySelector('tbody')?.appendChild(emptyRow);
            } else {
              emptyRow.style.display = '';
              emptyRow.querySelector('td').textContent = `No matching equipment found for "${query}"`;
            }
          } else if (emptyRow) {
            emptyRow.style.display = 'none';
          }
        });
      }
    }

    // 2. Loans table search filter
    const loanSearch = document.getElementById('loan-search');
    if (loanSearch && !loanSearch.dataset.bound) {
      loanSearch.dataset.bound = 'true';
      const loanContainer = loanSearch.closest('.loan-panel');
      const table = loanContainer?.querySelector('table');
      const footerCount = loanContainer?.querySelector('.loan-footer span:first-child');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tbody tr:not(.table-empty-row)'));
        const totalCount = rows.length;

        loanSearch.addEventListener('input', () => {
          const query = loanSearch.value.trim().toLowerCase();
          let visibleCount = 0;

          rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const matches = !query || text.includes(query);
            row.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });

          if (footerCount) {
            footerCount.textContent = `Showing ${visibleCount} of ${totalCount} loans`;
          }

          let emptyRow = table.querySelector('.table-empty-row');
          if (visibleCount === 0) {
            if (!emptyRow) {
              emptyRow = document.createElement('tr');
              emptyRow.className = 'table-empty-row';
              const colCount = table.querySelectorAll('thead th').length || 6;
              emptyRow.innerHTML = `<td colspan="${colCount}" class="table-empty-message">No loans matching "${query}"</td>`;
              table.querySelector('tbody')?.appendChild(emptyRow);
            } else {
              emptyRow.style.display = '';
              emptyRow.querySelector('td').textContent = `No loans matching "${query}"`;
            }
          } else if (emptyRow) {
            emptyRow.style.display = 'none';
          }
        });
      }
    }

    // 3. Equipment cards search & category filter
    const equipmentSearch = document.getElementById('equipment-search');
    const categorySelect = document.querySelector('.equipment-toolbar select') || document.querySelector('select[aria-label="Filter by category"]');
    const grid = document.querySelector('.equipment-grid');
    if (grid && !grid.dataset.bound) {
      grid.dataset.bound = 'true';
      const cards = Array.from(grid.querySelectorAll('article'));
      const countEl = document.querySelector('.equipment-search-count') || document.querySelector('.equipment-toolbar span');

      const filterEquipment = () => {
        const query = (equipmentSearch ? equipmentSearch.value : '').trim().toLowerCase();
        const selectedCat = categorySelect ? categorySelect.value : 'All categories';
        let visibleCount = 0;

        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          const matchesQuery = !query || text.includes(query);
          const matchesCat = selectedCat === 'All categories' || card.textContent.includes(selectedCat);
          const show = matchesQuery && matchesCat;
          card.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });

        if (countEl) {
          countEl.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
        }

        let emptyEl = grid.querySelector('.equipment-empty-card');
        if (visibleCount === 0) {
          if (!emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.className = 'equipment-empty-card';
            emptyEl.style.cssText = 'grid-column: 1 / -1; padding: 3rem; text-align: center; color: #6b6474; font-style: italic; background: #fff; border: 1px dashed #cfc5d6; border-radius: 0.6rem;';
            emptyEl.textContent = query ? `No equipment matches "${query}"` : 'No equipment available in this category.';
            grid.appendChild(emptyEl);
          } else {
            emptyEl.style.display = '';
            emptyEl.textContent = query ? `No equipment matches "${query}"` : 'No equipment available in this category.';
          }
        } else if (emptyEl) {
          emptyEl.style.display = 'none';
        }
      };

      if (equipmentSearch && !equipmentSearch.dataset.bound) {
        equipmentSearch.dataset.bound = 'true';
        equipmentSearch.addEventListener('input', filterEquipment);
      }
      if (categorySelect && !categorySelect.dataset.bound) {
        categorySelect.dataset.bound = 'true';
        categorySelect.addEventListener('change', filterEquipment);
      }
    }

    // 4. Borrower search filter
    const borrowerSearch = document.getElementById('borrower-search');
    if (borrowerSearch && !borrowerSearch.dataset.bound) {
      borrowerSearch.dataset.bound = 'true';
      const table = document.querySelector('.borrower-table') || document.querySelector('.borrower-panel table');
      const footerCount = document.querySelector('.borrower-footer span:first-child');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tbody tr:not(.table-empty-row)'));
        const totalCount = rows.length;

        borrowerSearch.addEventListener('input', () => {
          const query = borrowerSearch.value.trim().toLowerCase();
          let visibleCount = 0;

          rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const matches = !query || text.includes(query);
            row.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });

          if (footerCount) {
            footerCount.textContent = `Showing ${visibleCount} of ${totalCount} borrowers`;
          }

          let emptyRow = table.querySelector('.table-empty-row');
          if (visibleCount === 0) {
            if (!emptyRow) {
              emptyRow = document.createElement('tr');
              emptyRow.className = 'table-empty-row';
              const colCount = table.querySelectorAll('thead th').length || 5;
              emptyRow.innerHTML = `<td colspan="${colCount}" class="table-empty-message">No borrowers matching "${query}"</td>`;
              table.querySelector('tbody')?.appendChild(emptyRow);
            } else {
              emptyRow.style.display = '';
              emptyRow.querySelector('td').textContent = `No borrowers matching "${query}"`;
            }
          } else if (emptyRow) {
            emptyRow.style.display = 'none';
          }
        });
      }
    }

    // 5. Preparation checklist progress updater
    const checklistItems = document.querySelectorAll('.checklist-group input[type="checkbox"]');
    if (checklistItems.length > 0) {
      const progressDd = Array.from(document.querySelectorAll('.detail-list div')).find((div) => {
        const dt = div.querySelector('dt');
        return dt && dt.textContent.includes('Progress');
      })?.querySelector('dd');

      const updateProgress = () => {
        const total = checklistItems.length;
        const checked = Array.from(checklistItems).filter((cb) => cb.checked).length;
        if (progressDd) {
          progressDd.textContent = `${checked} of ${total} steps complete`;
        }
      };

      checklistItems.forEach((cb) => {
        if (!cb.dataset.bound) {
          cb.dataset.bound = 'true';
          cb.addEventListener('change', updateProgress);
        }
      });
    }
  }

  /* ==========================================================================
     Smooth In-Page Navigation (Eliminates Screen Jump / White Flash on Click)
     ========================================================================== */
  function initSmoothNavigation() {
    document.addEventListener('click', async (e) => {
      // Ignore right clicks or modifier keys
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      // Ensure internal link
      let targetUrl;
      try {
        targetUrl = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;

      // Exclude login.html from client-side SPA routing (login is standalone, outside workspace shell)
      if (targetUrl.pathname.includes('login') || window.location.pathname.includes('login')) {
        return;
      }

      // Check for .html page
      const isHtml = targetUrl.pathname.endsWith('.html') || targetUrl.pathname === '/' || targetUrl.pathname.endsWith('/');
      if (!isHtml) return;

      // If linking to current exact URL, do nothing
      if (targetUrl.href === window.location.href) {
        e.preventDefault();
        return;
      }

      // Try smooth client-side transition
      try {
        e.preventDefault();
        const response = await fetch(targetUrl.href);
        if (!response.ok) {
          window.location.href = targetUrl.href;
          return;
        }

        const htmlText = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        // Update title and body class
        document.title = newDoc.title;
        document.body.className = newDoc.body.className;

        // Update <app-sidebar>
        const oldSidebar = document.querySelector('app-sidebar');
        const newSidebar = newDoc.querySelector('app-sidebar');
        if (oldSidebar && newSidebar) {
          const currentAttr = newSidebar.getAttribute('current') || '';
          oldSidebar.setAttribute('current', currentAttr);
        }

        // Update <app-header>
        const oldHeader = document.querySelector('app-header');
        const newHeader = newDoc.querySelector('app-header');
        if (oldHeader && newHeader) {
          const breadcrumbsAttr = newHeader.getAttribute('breadcrumbs') || '';
          oldHeader.setAttribute('breadcrumbs', breadcrumbsAttr);
        }

        // Update <main id="main-content"> or .login-page
        const oldMain = document.getElementById('main-content') || document.querySelector('main');
        const newMain = newDoc.getElementById('main-content') || newDoc.querySelector('main');
        if (oldMain && newMain) {
          oldMain.replaceWith(newMain);
        }

        // Re-initialize interactive behaviors for the new content
        initInteractiveBehaviors();

        // Push new URL to history
        history.pushState(null, '', targetUrl.href);
        window.scrollTo(0, 0);
      } catch (err) {
        // Fallback to normal navigation if fetch fails (e.g. CORS on local file:// protocol)
        window.location.href = targetUrl.href;
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', async () => {
      if (window.location.pathname.includes('login')) {
        window.location.reload();
        return;
      }
      try {
        const response = await fetch(window.location.href);
        if (!response.ok) {
          window.location.reload();
          return;
        }
        const htmlText = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        document.title = newDoc.title;
        document.body.className = newDoc.body.className;

        const oldSidebar = document.querySelector('app-sidebar');
        const newSidebar = newDoc.querySelector('app-sidebar');
        if (oldSidebar && newSidebar) {
          oldSidebar.setAttribute('current', newSidebar.getAttribute('current') || '');
        }

        const oldHeader = document.querySelector('app-header');
        const newHeader = newDoc.querySelector('app-header');
        if (oldHeader && newHeader) {
          oldHeader.setAttribute('breadcrumbs', newHeader.getAttribute('breadcrumbs') || '');
        }

        const oldMain = document.getElementById('main-content') || document.querySelector('main');
        const newMain = newDoc.getElementById('main-content') || newDoc.querySelector('main');
        if (oldMain && newMain) {
          oldMain.replaceWith(newMain);
        }

        initInteractiveBehaviors();
        window.scrollTo(0, 0);
      } catch (err) {
        window.location.reload();
      }
    });
  }

  // Initialize interactive behaviors and smooth navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initInteractiveBehaviors();
      initSmoothNavigation();
    });
  } else {
    initInteractiveBehaviors();
    initSmoothNavigation();
  }
})();
