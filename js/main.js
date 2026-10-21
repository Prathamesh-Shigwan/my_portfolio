/*
 * Site behaviour: contact details from js/config.js, mobile menu, routing matrix,
 * project filters and the contact form. No libraries; works in all current browsers.
 */
(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var script = document.currentScript;
  // The folder that holds index.html, worked out from this file's own address (js/main.js).
  var ROOT = script ? new URL('..', script.src) : new URL('./', location.href);

  var ICONS = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5" />',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" />',
    chat: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.5Z" />',
    alert: '<path d="M12 3.75 21.5 20h-19L12 3.75Z" /><path d="M12 10v4.25M12 17.25v.01" />',
  };

  function svgIcon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  function setting(key) {
    var value = config[key];
    return typeof value === 'string' ? value.trim() : '';
  }

  function isLocal() {
    return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  }

  var SHOW_TODO = config.showPlaceholders === true || (config.showPlaceholders === 'local' && isLocal());

  /* ---------- Contact links built from config.js ---------- */

  function whatsappHref(message) {
    var number = setting('whatsappNumber').replace(/\D/g, '');
    if (!number) return '';
    var text = message === undefined ? setting('whatsappMessage') : message;
    return 'https://wa.me/' + number + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  function mailtoHref(subject, body) {
    var email = setting('email');
    if (!email) return '';
    var query = [];
    if (subject) query.push('subject=' + encodeURIComponent(subject));
    if (body) query.push('body=' + encodeURIComponent(body));
    return 'mailto:' + email + (query.length ? '?' + query.join('&') : '');
  }

  function linkFor(key) {
    if (key === 'email') return mailtoHref();
    if (key === 'whatsapp') return whatsappHref();
    if (key === 'phone') {
      var digits = setting('phone').replace(/[^\d+]/g, '');
      return digits ? 'tel:' + digits : '';
    }
    var value = setting(key);
    if (!value) return '';
    // Relative paths (such as 'resume.pdf') are taken from the site's root folder.
    return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : new URL(value, ROOT).href;
  }

  function markExternal(a) {
    if (!/^https?:/i.test(a.getAttribute('href') || '')) return;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (!a.querySelector('.new-tab-note')) {
      var note = document.createElement('span');
      note.className = 'sr-only new-tab-note';
      note.textContent = ' (opens in a new tab)';
      a.appendChild(note);
    }
  }

  function wireConfig() {
    var available = {};
    document.querySelectorAll('[data-config-link]').forEach(function (a) {
      var key = a.getAttribute('data-config-link');
      var href = linkFor(key);
      available[key] = Boolean(href);
      if (!href) return;
      a.href = href;
      if (a.hasAttribute('data-download')) a.setAttribute('download', '');
      a.hidden = false;
      markExternal(a);
    });
    document.querySelectorAll('[data-config-item]').forEach(function (item) {
      item.hidden = !available[item.getAttribute('data-config-item')];
    });
    document.querySelectorAll('[data-config-missing]').forEach(function (item) {
      item.hidden = !SHOW_TODO || Boolean(available[item.getAttribute('data-config-missing')]);
    });
    document.querySelectorAll('[data-config-text]').forEach(function (el) {
      el.textContent = setting(el.getAttribute('data-config-text'));
    });
    var none = document.querySelector('[data-no-contact]');
    if (none) {
      var any = document.querySelector('[data-config-item]:not([hidden])');
      none.hidden = Boolean(any) || SHOW_TODO;
    }
    if (SHOW_TODO) {
      document.querySelectorAll('[data-todo]').forEach(function (el) {
        el.hidden = false;
      });
    }
  }

  /* ---------- Header and mobile menu ---------- */

  function initHeader() {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('mobile-menu');
    var backdrop = document.querySelector('[data-menu-backdrop]');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!toggle || !menu) return;
    var label = toggle.querySelector('[data-menu-label]');

    function setOpen(open, returnFocus) {
      menu.hidden = !open;
      if (backdrop) backdrop.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close menu' : 'Open menu';
      header.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(menu.hidden);
    });
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setOpen(false);
      });
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) setOpen(false, true);
    });
    // Close when keyboard focus moves out of the header.
    header.addEventListener('focusout', function (event) {
      if (!menu.hidden && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        setOpen(false);
      });
    });
    var desktop = window.matchMedia('(min-width: 64rem)');
    desktop.addEventListener('change', function () {
      if (desktop.matches) setOpen(false);
    });
    // Coming back with the browser's Back button can restore an open menu; close it.
    window.addEventListener('pageshow', function () {
      if (!menu.hidden) setOpen(false);
    });
  }

  /* ---------- Routing matrix (home page) ---------- */

  function initMatrix() {
    var panel = document.querySelector('[data-matrix]');
    if (!panel) return;
    var points = panel.querySelectorAll('.matrix-point');
    var q = function (selector) {
      return panel.querySelector(selector);
    };

    function select(point) {
      var row = point.getAttribute('data-source');
      var col = point.getAttribute('data-dest');
      points.forEach(function (p) {
        var on = p === point;
        p.classList.toggle('is-selected', on);
        p.setAttribute('aria-pressed', String(on));
      });
      panel.querySelectorAll('.matrix-cell').forEach(function (cell) {
        cell.classList.toggle('on-path', cell.getAttribute('data-row') === row || cell.getAttribute('data-col') === col);
      });
      panel.querySelectorAll('.matrix-row-label').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-row') === row);
      });
      panel.querySelectorAll('.matrix-col-label').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-col') === col);
      });
      q('[data-matrix-source]').textContent = q('.matrix-row-label[data-row="' + row + '"]').textContent;
      q('[data-matrix-dest]').textContent = q('.matrix-col-label[data-col="' + col + '"]').textContent;
      q('[data-matrix-kind]').textContent = point.getAttribute('data-kind');
      q('[data-matrix-title]').textContent = point.getAttribute('data-title');
      q('[data-matrix-summary]').textContent = point.getAttribute('data-summary');
      q('[data-matrix-link]').href = point.getAttribute('data-href');
      q('[data-matrix-link-title]').textContent = ': ' + point.getAttribute('data-title');
    }

    points.forEach(function (point) {
      ['click', 'mouseenter', 'focus'].forEach(function (type) {
        point.addEventListener(type, function () {
          select(point);
        });
      });
    });
  }

  /* ---------- Project filters (projects page) ---------- */

  function initFilters() {
    var group = document.querySelector('.filter-group');
    var list = document.querySelector('[data-project-list]');
    if (!group || !list) return;
    var chips = group.querySelectorAll('[data-filter]');
    var rows = list.querySelectorAll(':scope > li');
    var status = document.querySelector('[data-filter-status]');
    var empty = document.querySelector('[data-filter-empty]');
    var valid = Array.prototype.map.call(chips, function (chip) {
      return chip.getAttribute('data-filter');
    });

    function apply(id, updateUrl, announce) {
      if (valid.indexOf(id) === -1) id = 'all';
      chips.forEach(function (chip) {
        var on = chip.getAttribute('data-filter') === id;
        chip.classList.toggle('is-active', on);
        chip.setAttribute('aria-pressed', String(on));
      });
      var shown = 0;
      rows.forEach(function (row) {
        var show = id === 'all' || row.getAttribute('data-filters').split(' ').indexOf(id) !== -1;
        row.hidden = !show;
        if (show) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
      if (announce && status) status.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects');
      if (updateUrl) {
        try {
          var url = new URL(location.href);
          if (id === 'all') url.searchParams.delete('filter');
          else url.searchParams.set('filter', id);
          history.replaceState(null, '', url);
        } catch (error) {
          /* Some browsers block address changes for local files; filtering still works. */
        }
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        apply(chip.getAttribute('data-filter'), true, true);
      });
    });
    // A shared link such as projects.html?filter=python opens with that filter applied.
    var requested = new URLSearchParams(location.search).get('filter');
    if (requested) apply(requested, false, false);
  }

  /* ---------- Contact form ---------- */

  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var FIELDS = ['name', 'business', 'email', 'whatsapp', 'type', 'description'];
    var LABELS = {
      name: 'Name',
      business: 'Business name',
      email: 'Email',
      whatsapp: 'WhatsApp number',
      type: 'Project type',
      description: 'Project description',
    };
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var MIN = 20;
    var MAX = 3000;
    var endpoint = setting('formEndpoint');
    var errors = {};
    var attempted = false;
    var sending = false;

    var input = function (field) {
      return document.getElementById('cf-' + field);
    };
    var value = function (field) {
      return input(field).value.trim();
    };
    var select = input('type');
    var typeIds = Array.prototype.map.call(select.options, function (o) {
      return o.value;
    }).filter(Boolean);
    var summary = form.querySelector('[data-error-summary]');
    var result = form.querySelector('[data-form-result]');
    var submit = form.querySelector('[data-submit]');
    var counter = form.querySelector('[data-char-count]');

    function validate(field) {
      var v = value(field);
      switch (field) {
        case 'name':
          if (!v) return 'Enter your name.';
          if (v.length > 100) return 'Use 100 characters or fewer.';
          return '';
        case 'business':
          return v.length > 120 ? 'Use 120 characters or fewer.' : '';
        case 'email':
          if (!v) return 'Enter your email address.';
          if (!EMAIL_PATTERN.test(v)) return 'Enter an email address like name@example.com.';
          return '';
        case 'whatsapp': {
          if (!v) return '';
          var digits = v.replace(/\D/g, '').length;
          if (!/^\+?[\d\s()-]+$/.test(v) || digits < 8 || digits > 15)
            return 'Enter a number with country code, like +91 followed by your number.';
          return '';
        }
        case 'type':
          return typeIds.indexOf(v) === -1 ? 'Choose a project type.' : '';
        case 'description':
          if (!v) return 'Describe what you want to build or automate.';
          if (v.length < MIN) return 'Add a little more detail: at least ' + MIN + ' characters.';
          if (v.length > MAX) return 'Keep it under ' + MAX.toLocaleString('en-IN') + ' characters.';
          return '';
      }
      return '';
    }

    function showError(field, message) {
      errors[field] = message;
      var el = input(field);
      var box = document.getElementById('cf-' + field + '-error');
      var hint = document.getElementById('cf-' + field + '-hint');
      box.querySelector('[data-error-text]').textContent = message;
      box.hidden = !message;
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
      var described = [];
      if (hint) described.push(hint.id);
      if (message) described.push(box.id);
      if (described.length) el.setAttribute('aria-describedby', described.join(' '));
      else el.removeAttribute('aria-describedby');
    }

    function renderSummary() {
      var invalid = FIELDS.filter(function (f) {
        return errors[f];
      });
      if (!attempted || !invalid.length) {
        summary.hidden = true;
        return;
      }
      summary.querySelector('[data-error-summary-title]').textContent =
        invalid.length === 1 ? 'One field needs attention:' : invalid.length + ' fields need attention:';
      var list = summary.querySelector('[data-error-summary-list]');
      list.textContent = '';
      invalid.forEach(function (field) {
        var li = document.createElement('li');
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = LABELS[field] + ': ' + errors[field];
        button.addEventListener('click', function () {
          input(field).focus();
        });
        li.appendChild(button);
        list.appendChild(li);
      });
      summary.hidden = false;
    }

    function updateCounter() {
      var length = input('description').value.length;
      counter.textContent = length.toLocaleString('en-IN') + ' / ' + MAX.toLocaleString('en-IN');
      counter.classList.toggle('is-over', length > MAX);
    }

    FIELDS.forEach(function (field) {
      var el = input(field);
      var onChange = function () {
        if (attempted || errors[field]) {
          showError(field, validate(field));
          renderSummary();
        }
        if (field === 'description') updateCounter();
      };
      el.addEventListener('input', onChange);
      el.addEventListener('change', onChange);
      // Check a field when leaving it, once something has been typed (or after a submit attempt).
      el.addEventListener('blur', function () {
        if (attempted || value(field)) {
          showError(field, validate(field));
          renderSummary();
        }
      });
    });

    // Service and case-study links pre-select a project type: contact.html?type=whatsapp
    var requestedType = new URLSearchParams(location.search).get('type');
    if (requestedType && typeIds.indexOf(requestedType) !== -1) select.value = requestedType;

    function typeLabel() {
      var option = select.options[select.selectedIndex];
      return option && option.value ? option.textContent : '';
    }

    function fallbackLinks() {
      var name = value('name');
      var business = value('business');
      var lines = ['Name: ' + name];
      if (business) lines.push('Business: ' + business);
      lines.push('Email: ' + value('email'));
      if (value('whatsapp')) lines.push('WhatsApp: ' + value('whatsapp'));
      lines.push('Project type: ' + typeLabel(), '', value('description'));
      var links = [];
      var mail = mailtoHref('Project enquiry: ' + typeLabel(), lines.join('\n'));
      if (mail) links.push({ href: mail, icon: 'mail', text: 'Send it by email' });
      var whatsapp = whatsappHref(
        'Hi Prathamesh, I’m ' + name + (business ? ' from ' + business : '') + '. Project type: ' + typeLabel() +
          '.\n\n' + value('description'),
      );
      if (whatsapp) links.push({ href: whatsapp, icon: 'chat', text: 'Send it on WhatsApp' });
      return links;
    }

    var canFallBack = Boolean(setting('email') || setting('whatsappNumber').replace(/\D/g, ''));

    // Explain up front when the form can't deliver messages yet.
    var notice = form.querySelector('[data-form-not-connected]');
    if (!endpoint && notice) {
      notice.querySelector('[data-fallback-hint]').textContent = canFallBack
        ? ' After you submit, you’ll get buttons to send the same message by email or WhatsApp.'
        : ' Your message will not be sent.';
      notice.hidden = false;
    }

    function showResult(kind) {
      var content = {
        sent: {
          role: 'status',
          title: svgIcon('check') + 'Message sent',
          text: 'Thanks. Your message has been delivered, and I’ll reply by email.',
        },
        failed: {
          role: 'alert',
          title: 'Message not sent',
          text: 'The form service didn’t accept the message. Your text is still in the form, so you can try again' +
            (canFallBack ? ' or send it directly instead.' : '.'),
        },
        'not-connected': {
          role: 'alert',
          title: 'Message not sent: this form isn’t connected yet',
          text: canFallBack
            ? 'Your details are valid. Use one of these buttons to send the same message directly.'
            : 'Your details are valid, but there is no way to deliver them from this site yet.',
        },
      }[kind];
      result.textContent = '';
      var box = document.createElement('div');
      box.className = 'result result--' + kind;
      box.setAttribute('role', content.role);
      var title = document.createElement('p');
      title.className = 'result-title';
      title.innerHTML = content.title;
      var text = document.createElement('p');
      text.className = 'result-text';
      text.textContent = content.text;
      box.appendChild(title);
      box.appendChild(text);
      if (kind !== 'sent') {
        var links = fallbackLinks();
        if (links.length) {
          var row = document.createElement('div');
          row.className = 'button-row';
          links.forEach(function (link) {
            var a = document.createElement('a');
            a.className = 'btn btn-secondary btn-sm';
            a.href = link.href;
            a.innerHTML = svgIcon(link.icon);
            a.appendChild(document.createTextNode(link.text));
            markExternal(a);
            row.appendChild(a);
          });
          box.appendChild(row);
        }
      }
      result.appendChild(box);
      requestAnimationFrame(function () {
        result.focus();
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (sending) return;

      FIELDS.forEach(function (field) {
        showError(field, validate(field));
      });
      attempted = true;
      renderSummary();
      if (FIELDS.some(function (f) { return errors[f]; })) {
        result.textContent = '';
        requestAnimationFrame(function () {
          summary.focus();
        });
        return;
      }

      // Hidden field that only bots fill in: drop the submission quietly.
      if (document.getElementById('cf-gotcha').value) {
        showResult('sent');
        return;
      }

      if (!endpoint) {
        showResult('not-connected');
        return;
      }

      sending = true;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      var controller = new AbortController();
      var timeout = setTimeout(function () {
        controller.abort();
      }, 15000);

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: value('name'),
          business: value('business'),
          email: value('email'),
          whatsapp: value('whatsapp'),
          projectType: typeLabel(),
          message: value('description'),
          _subject: 'New project enquiry: ' + typeLabel(),
          _template: 'table',
        }),
        signal: controller.signal,
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Form endpoint responded with ' + response.status);
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          // FormSubmit answers 200 with success "false" until the form is activated.
          if (data && (data.success === false || data.success === 'false')) {
            throw new Error(data.message || 'Form service did not accept the message');
          }
          showResult('sent');
          form.reset();
          attempted = false;
          FIELDS.forEach(function (field) {
            showError(field, '');
          });
          renderSummary();
          updateCounter();
        })
        .catch(function () {
          showResult('failed');
        })
        .finally(function () {
          clearTimeout(timeout);
          sending = false;
          submit.disabled = false;
          submit.textContent = 'Send message';
        });
    });
  }

  /* ---------- Small things ---------- */

  function initMisc() {
    // Skip link: move focus to the content without changing the address (also correct on 404.html,
    // where a <base> tag would otherwise send "#main" to the home page).
    var skip = document.querySelector('.skip-link');
    var main = document.getElementById('main');
    if (skip && main) {
      skip.addEventListener('click', function (event) {
        event.preventDefault();
        main.focus({ preventScroll: true });
        main.scrollIntoView();
      });
    }

    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
    var missing = document.querySelector('[data-missing-path]');
    if (missing) {
      missing.textContent = 'No page at ' + location.pathname;
      missing.hidden = false;
    }
  }

  wireConfig();
  initHeader();
  initMatrix();
  initFilters();
  initContactForm();
  initMisc();
})();
