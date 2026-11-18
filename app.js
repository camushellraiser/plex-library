'use strict';

const cfg = window.PLEX_LIBRARY_CONFIG || {};
const $ = (id) => document.getElementById(id);
const localeFor = (lang) => lang === 'en' ? 'en-US' : 'es-MX';
const normalizeText = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const validImage = (url) => { try { return new URL(url).protocol === 'https:'; } catch { return false; } };

const messages = {
  es: {
    pageTitle: 'Plex Library · Tu cine, a un clic', syncPending: 'Esperando sincronización', syncAvailable: '{count} películas en Plex', syncError: 'Catálogo no disponible',
    eyebrow: 'TU CATÁLOGO FAMILIAR DE PELÍCULAS', heroLine1: 'Encuentra tu', heroLine2: 'próxima película.',
    heroDescription: 'Explora las películas disponibles en Plex o solicita esa que llevas tiempo queriendo ver. Fácil, rápido y desde cualquier lugar.',
    searchPlaceholder: 'Busca por título, año o nombre original...', searchLabel: 'Buscar películas en Plex',
    searchCaption: 'Comienza a escribir y te mostramos las coincidencias.', heroRequest: '¿No encuentras lo que buscas? Pídela aquí',
    visualStamp: 'Cine para todos', metricMovies: 'Películas en Plex', metricHourlyValue: 'Cada hora', metricHourly: 'Actualización automática',
    metricRequestValue: 'Solicitudes', metricRequest: 'Pide las que faltan', tabLibrary: 'Explorar biblioteca', tabRequest: 'Solicitar película',
    workspaceCaption: 'Solo películas, sin series', libraryOverline: 'EXPLORA TU CINE', libraryTitle: 'Todas las películas',
    libraryResults: 'Resultados de búsqueda', libraryDescription: 'Todo lo que puedes encontrar hoy en nuestra biblioteca.',
    libraryResultsDescription: 'Las películas que coinciden con tu búsqueda.', sortLabel: 'Ordenar películas',
    sortRecent: 'Agregadas recientemente', sortTitle: 'Título A–Z', sortYear: 'Año de estreno',
    resultsCount: '{count} {count,plural}', resultsSingle: 'resultado', resultsPlural: 'resultados',
    cardAvailable: 'En Plex', suggestionTitle: 'COINCIDENCIAS EN PLEX', loadMore: 'Ver más películas',
    emptyCTA: 'Solicitar esta película', noSyncTitle: 'Tu colección está por estrenarse',
    noSyncDescription: 'Este sitio ya está listo. En cuanto conectemos la sincronización con Plex, todas tus películas aparecerán aquí automáticamente.',
    syncErrorTitle: 'No pudimos cargar el catálogo', syncErrorDescription: 'Comprueba que catalog.json esté disponible e inténtalo de nuevo más tarde.',
    noResultsTitle: 'No encontramos esa película', noResultsDescription: 'Aún no aparece en la biblioteca. Puedes solicitarla en unos clics.',
    requestOverline: 'TU PRÓXIMA PELÍCULA', requestTitle: '¿Qué película te gustaría ver?',
    requestDescription: 'Encuentra el título correcto, confirma la portada y envíanos tu solicitud.',
    requestSearchLabel: 'Nombre de la película', requestPlaceholder: 'Ej. Ace Ventura, Titanic, Avatar...',
    requestIdle: 'Busca una película para ver las coincidencias y elegir la correcta.',
    requestSearchShort: 'Escribe al menos dos caracteres para buscar.',
    requestNeedsConfig: 'La búsqueda de TMDB todavía no está conectada. La activaremos cuando configuremos el servicio.',
    requestLoading: 'Buscando películas...', requestNoResults: 'No encontramos coincidencias. Prueba otro nombre.',
    requestChoose: 'Elige la película correcta de la lista.',
    requestError: 'No pudimos consultar el buscador. Intenta nuevamente.',
    requestSelected: 'Película seleccionada. Completa tu solicitud.',
    requestDuplicate: '¡Buenas noticias! Esta película ya está en Plex. No necesitas solicitarla.',
    requestAlreadyPending: 'Esta película ya fue solicitada. No hace falta pedirla otra vez.', requestAlreadyProcessing: 'Esta película ya fue solicitada y está en proceso.',
    adminTitle: 'Administrar solicitudes', adminPassword: 'Clave privada de administrador', adminOpen: 'Administración', adminLoad: 'Consultar solicitudes', adminPending: 'Solicitada', adminProcessing: 'En proceso', adminDismissed: 'Descartada', adminAvailable: 'Disponible en Plex', adminError: 'No pudimos consultar o actualizar las solicitudes.', adminEmpty: 'Todavía no hay solicitudes.', adminNoKey: 'Escribe tu clave de administrador.', requestEmailWarning: 'Solicitud guardada, pero el correo no pudo enviarse. Revísala en administración.',
    chosenFilmLabel: 'Película seleccionada', nameLabel: 'Tu nombre', namePlaceholder: '¿Quién solicita la película?',
    noteLabel: 'Comentario <small>(opcional)</small>', notePlaceholder: '¿Algo que debamos saber?',
    submitRequest: 'Enviar solicitud', submitSending: 'Enviando solicitud...',
    formNeedsConfig: 'El envío por correo todavía no está configurado. Lo activaremos en el siguiente paso.',
    formInvalidName: 'Escribe tu nombre antes de enviar.', formSent: '¡Solicitud enviada correctamente!',
    formError: 'No pudimos enviar la solicitud. Intenta nuevamente.',
    asideTitle: 'Así de sencillo', step1Title: 'Busca tu película', step1Body: 'Te ayudamos a encontrar el título y la portada correctos.',
    step2Title: 'Confirma cuál es', step2Body: 'Revisamos si ya está disponible en Plex.',
    step3Title: 'Envía la solicitud', step3Body: 'Nos llega una notificación para agregarla después.',
    asideFoot: 'No necesitas crear una cuenta.', footerNote: 'Tu catálogo familiar · Solo consulta, sin reproducción',
    lastSync: 'Última actualización: {date}', dialogOverline: 'DETALLES DE LA PELÍCULA', dialogAvailable: 'Disponible en Plex',
    noSummary: 'No hay una sinopsis disponible para esta película.', unknownYear: 'Año no disponible',
    closeDetails: 'Cerrar detalles', posterAlt: 'Póster de {title}'
  },
  en: {
    pageTitle: 'Plex Library · Your movies, one search away', syncPending: 'Waiting for first sync', syncAvailable: '{count} movies in Plex', syncError: 'Catalog unavailable',
    eyebrow: 'YOUR FAMILY MOVIE COLLECTION', heroLine1: 'Find your', heroLine2: 'next favorite movie.',
    heroDescription: 'Explore the movies available on Plex, or request one you have been wanting to watch. Simple, quick, and from anywhere.',
    searchPlaceholder: 'Search by title, year, or original name...', searchLabel: 'Search movies in Plex',
    searchCaption: 'Start typing to see matching movies instantly.', heroRequest: "Can't find it? Request a movie here",
    visualStamp: 'Movies for everyone', metricMovies: 'Movies in Plex', metricHourlyValue: 'Every hour', metricHourly: 'Automatic updates',
    metricRequestValue: 'Requests', metricRequest: 'Ask for missing movies', tabLibrary: 'Explore library', tabRequest: 'Request a movie',
    workspaceCaption: 'Movies only, no TV shows', libraryOverline: 'EXPLORE YOUR MOVIES', libraryTitle: 'All movies',
    libraryResults: 'Search results', libraryDescription: 'Everything available today in your movie library.',
    libraryResultsDescription: 'Movies matching your search.', sortLabel: 'Sort movies',
    sortRecent: 'Recently added', sortTitle: 'Title A–Z', sortYear: 'Release year',
    resultsCount: '{count} {count,plural}', resultsSingle: 'result', resultsPlural: 'results',
    cardAvailable: 'In Plex', suggestionTitle: 'MATCHES IN PLEX', loadMore: 'Show more movies',
    emptyCTA: 'Request this movie', noSyncTitle: 'Your collection is coming soon',
    noSyncDescription: 'The site is ready. As soon as we connect Plex syncing, all your movies will appear here automatically.',
    syncErrorTitle: 'Could not load the catalog', syncErrorDescription: 'Check that catalog.json is available and try again later.',
    noResultsTitle: 'We could not find that movie', noResultsDescription: 'It is not in the library yet. You can request it in a few clicks.',
    requestOverline: 'YOUR NEXT MOVIE', requestTitle: 'What movie would you like to watch?',
    requestDescription: 'Find the correct title, confirm the poster, and send us your request.',
    requestSearchLabel: 'Movie title', requestPlaceholder: 'E.g., Ace Ventura, Titanic, Avatar...',
    requestIdle: 'Search for a movie to see suggestions and pick the right one.',
    requestSearchShort: 'Type at least two characters to search.',
    requestNeedsConfig: 'TMDB search is not connected yet. We will activate it when the service is configured.',
    requestLoading: 'Searching movies...', requestNoResults: 'No matches found. Try a different title.',
    requestChoose: 'Choose the right movie from the list.',
    requestError: 'Could not reach movie search. Please try again.',
    requestSelected: 'Movie selected. Complete your request.',
    requestDuplicate: 'Good news! This movie is already in Plex. No need to request it.',
    requestAlreadyPending: 'This movie has already been requested. No need to request it again.', requestAlreadyProcessing: 'This movie has already been requested and is in progress.',
    adminTitle: 'Manage requests', adminPassword: 'Private admin key', adminOpen: 'Administration', adminLoad: 'Load requests', adminPending: 'Requested', adminProcessing: 'In progress', adminDismissed: 'Dismissed', adminAvailable: 'Available in Plex', adminError: 'Could not load or update requests.', adminEmpty: 'No requests yet.', adminNoKey: 'Enter your admin key.', requestEmailWarning: 'Request saved, but email failed. Check the admin panel.',
    chosenFilmLabel: 'Selected movie', nameLabel: 'Your name', namePlaceholder: 'Who is requesting the movie?',
    noteLabel: 'Comment <small>(optional)</small>', notePlaceholder: 'Anything else we should know?',
    submitRequest: 'Send request', submitSending: 'Sending request...',
    formNeedsConfig: 'Email delivery has not been configured yet. We will activate it in the next step.',
    formInvalidName: 'Please enter your name before submitting.', formSent: 'Your request was sent successfully!',
    formError: 'We could not send your request. Please try again.',
    asideTitle: 'How it works', step1Title: 'Find your movie', step1Body: 'We help you match the correct title and movie poster.',
    step2Title: 'Confirm the movie', step2Body: 'We check whether it is already available in Plex.',
    step3Title: 'Send your request', step3Body: 'We get a notification so it can be added later.',
    asideFoot: 'No account needed.', footerNote: 'Your family movie catalog · Browse only, no streaming',
    lastSync: 'Last updated: {date}', dialogOverline: 'MOVIE DETAILS', dialogAvailable: 'Available in Plex',
    noSummary: 'No synopsis available for this movie.', unknownYear: 'Year unavailable',
    closeDetails: 'Close movie details', posterAlt: 'Poster for {title}'
  }
};

function getInitialLanguage() {
  try { const stored = localStorage.getItem('plex-library-lang'); if (stored === 'en' || stored === 'es') return stored; }
  catch { /* Private browsing can disable storage. */ }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
}
let language = getInitialLanguage();
let catalog = [];
let catalogUpdated = null;
let catalogState = 'pending';
let activeTab = 'library';
let limit = 18;
let requestResults = [];
let selected = null;
let requestIsDuplicate = false;
let selectedRequestStatus = null;
let requestStatus = 'requestIdle';
let formStatus = null;
let requestTimer = null;
let currentLookup = null;
let activeDialogMovie = null;
let toastTimer = null;

function t(key, vars = {}) {
  const dict = messages[language];
  let value = dict[key] ?? key;
  value = value.replaceAll('{count,plural}', Number(vars.count) === 1 ? dict.resultsSingle : dict.resultsPlural);
  for (const [k, v] of Object.entries(vars)) value = value.replaceAll('{' + k + '}', String(v));
  return value;
}
function el(tag, className, content) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (content !== undefined) result.textContent = content;
  return result;
}
function icon(symbol, className = 'icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#' + symbol);
  svg.append(use);
  return svg;
}
function createPoster(movie, className) {
  const wrap = el('div', className);
  const title = movie?.title || '';
  if (validImage(movie?.poster)) {
    const img = el('img');
    img.src = movie.poster;
    img.alt = t('posterAlt', { title });
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => { wrap.replaceChildren(fallbackPoster()); });
    wrap.append(img);
  } else wrap.append(fallbackPoster());
  return wrap;
}
function fallbackPoster() { const box = el('div', 'poster-fallback'); box.append(icon('icon-film')); return box; }
function asMovie(raw) {
  return {
    title: String(raw?.title || raw?.name || '').trim(),
    originalTitle: String(raw?.originalTitle || raw?.original_title || '').trim(),
    year: raw?.year || (raw?.release_date ? String(raw.release_date).slice(0, 4) : ''),
    poster: String(raw?.poster || raw?.posterUrl || '').trim(),
    tmdbId: raw?.tmdbId || raw?.tmdb_id || null,
    overview: String(raw?.overview || raw?.summary || raw?.description || '').trim(),
    addedAt: raw?.addedAt || raw?.added_at || null,
    actors: Array.isArray(raw?.actors) ? raw.actors.join(' ') : String(raw?.actors || '')
  };
}
function isDuplicate(movie) {
  const refTitle = normalizeText(movie.title);
  return catalog.some((existing) =>
    (movie.tmdbId && existing.tmdbId && String(existing.tmdbId) === String(movie.tmdbId)) ||
    (normalizeText(existing.title) === refTitle && String(existing.year) === String(movie.year)) ||
    (!!movie.originalTitle && normalizeText(existing.originalTitle) === normalizeText(movie.originalTitle) && String(existing.year) === String(movie.year))
  );
}
function renderLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  for (const node of document.querySelectorAll('[data-i18n]')) {
    const key = node.dataset.i18n;
    if (key === 'noteLabel') {
      node.replaceChildren(document.createTextNode(language === 'en' ? 'Comment ' : 'Comentario '));
      const small = el('small', '', language === 'en' ? '(optional)' : '(opcional)');
      node.append(small);
    } else node.textContent = t(key);
  }
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) node.placeholder = t(node.dataset.i18nPlaceholder);
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', t(node.dataset.i18nAria));
  for (const button of document.querySelectorAll('[data-lang]')) {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }
  renderConnection();
  renderLibrary();
  renderSuggestions();
  renderRequestResults();
  renderSelectedMovie();
  renderRequestStatus();
  renderFormStatus();
  if (activeDialogMovie) renderDialog(activeDialogMovie);
  renderAdminLabels();
}
function setLanguage(lang) {
  if (!messages[lang] || lang === language) return;
  language = lang;
  try { localStorage.setItem('plex-library-lang', lang); } catch { /* optional persistence */ }
  renderLanguage();
}
function renderConnection() {
  $('syncStatus').classList.toggle('live', catalogState === 'ok');
  $('syncLabel').textContent = t(catalogState === 'ok' ? 'syncAvailable' : catalogState === 'error' ? 'syncError' : 'syncPending', { count: catalog.length });
  $('movieTotal').textContent = catalogState === 'ok' ? new Intl.NumberFormat(localeFor(language)).format(catalog.length) : '—';
  if (catalogUpdated && !Number.isNaN(new Date(catalogUpdated).getTime())) {
    const text = new Date(catalogUpdated).toLocaleString(localeFor(language), { dateStyle: 'medium', timeStyle: 'short' });
    $('updated').textContent = t('lastSync', { date: text });
  } else $('updated').textContent = '';
}
function renderHeroPosters() {
  const samples = catalog.filter((m) => validImage(m.poster)).slice(0, 3);
  for (let i = 0; i < 3; i++) {
    const target = $('heroPoster' + i);
    if (!target) continue;
    target.classList.toggle('has-image', Boolean(samples[i]));
    target.style.backgroundImage = samples[i] ? `linear-gradient(to bottom, transparent 70%, rgba(0,0,0,.25)), url(${JSON.stringify(samples[i].poster)})` : '';
  }
}
function getFiltered() {
  const searchText = normalizeText($('search').value.trim());
  const filtered = catalog.filter((m) => normalizeText([m.title, m.originalTitle, m.year, m.actors].join(' ')).includes(searchText));
  const sortValue = $('sort').value;
  const collator = new Intl.Collator(localeFor(language), { sensitivity: 'base' });
  filtered.sort((a, b) => {
    if (sortValue === 'title') return collator.compare(a.title, b.title);
    if (sortValue === 'year') return (Number(b.year) || 0) - (Number(a.year) || 0) || collator.compare(a.title, b.title);
    return (Date.parse(b.addedAt) || 0) - (Date.parse(a.addedAt) || 0);
  });
  return filtered;
}
function renderLibrary() {
  const q = $('search').value.trim();
  const filtered = getFiltered();
  $('listTitle').textContent = t(q ? 'libraryResults' : 'libraryTitle');
  $('listDescription').textContent = t(q ? 'libraryResultsDescription' : 'libraryDescription');
  $('count').textContent = catalogState === 'ok' ? t('resultsCount', { count: filtered.length }) : '';
  const parent = $('movies');
  parent.replaceChildren();
  for (const movie of filtered.slice(0, limit)) {
    const card = el('button', 'movie-card');
    card.type = 'button';
    card.setAttribute('aria-label', `${movie.title} (${movie.year || t('unknownYear')})`);
    const art = createPoster(movie, 'card-art');
    const pill = el('span', 'card-available'); pill.append(icon('icon-check'), el('span', '', t('cardAvailable')));
    art.append(pill);
    card.append(art, el('h3', '', movie.title), el('p', '', movie.year ? String(movie.year) : ''));
    card.addEventListener('click', () => openDialog(movie));
    parent.append(card);
  }
  const isEmpty = filtered.length === 0;
  $('empty').hidden = !isEmpty;
  if (isEmpty) {
    const missingData = !q && catalogState === 'pending';
    const fetchError = !q && catalogState === 'error';
    $('emptyTitle').textContent = t(missingData ? 'noSyncTitle' : fetchError ? 'syncErrorTitle' : q ? 'noResultsTitle' : 'noSyncTitle');
    $('emptyDescription').textContent = t(missingData ? 'noSyncDescription' : fetchError ? 'syncErrorDescription' : q ? 'noResultsDescription' : 'noSyncDescription');
    $('goRequest').hidden = !q;
  }
  $('loadMore').hidden = filtered.length <= limit;
}
function showSuggestions(visible) {
  $('suggestions').hidden = !visible;
  $('search').setAttribute('aria-expanded', String(visible));
}
function renderSuggestions() {
  const q = normalizeText($('search').value.trim());
  const list = $('suggestions');
  list.replaceChildren();
  if (q.length < 2 || activeTab !== 'library') { showSuggestions(false); return; }
  const found = getFiltered().slice(0, 6);
  if (!found.length) { showSuggestions(false); return; }
  list.append(el('div', 'suggestions-caption', t('suggestionTitle')));
  found.forEach((movie) => {
    const button = el('button', 'suggestion');
    button.type = 'button'; button.setAttribute('role', 'option');
    button.append(createPoster(movie, 'mini-poster'));
    const info = el('div', 'suggestion-info');
    info.append(el('strong', '', movie.title), el('small', '', movie.year ? String(movie.year) : t('unknownYear')));
    button.append(info, icon('icon-arrow'));
    button.addEventListener('click', () => {
      $('search').value = movie.title;
      showSuggestions(false); renderLibrary();
      $('workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    list.append(button);
  });
  showSuggestions(true);
}
function setTab(tab, scroll = false) {
  activeTab = tab;
  for (const button of document.querySelectorAll('[data-tab]')) {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  }
  $('libraryView').hidden = tab !== 'library';
  $('requestView').hidden = tab !== 'request';
  showSuggestions(false);
  if (scroll) $('workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderRequestStatus() { $('requestHint').textContent = t(requestStatus); }
function renderFormStatus() {
  const msg = $('formMessage');
  msg.textContent = formStatus ? t(formStatus) : '';
  msg.className = 'form-message' + (formStatus === 'formSent' ? ' success' : formStatus && formStatus !== 'submitSending' ? ' error' : '');
  $('submitRequest').querySelector('span').textContent = t(formStatus === 'submitSending' ? 'submitSending' : 'submitRequest');
}
function renderRequestResults() {
  const parent = $('results'); parent.replaceChildren();
  requestResults.forEach((movie) => {
    const button = el('button', 'request-result'); button.type = 'button';
    button.append(createPoster(movie, 'result-art'));
    const info = el('div', 'result-text');
    info.append(el('strong', '', movie.title), el('small', '', movie.year ? String(movie.year) : t('unknownYear')));
    if (isDuplicate(movie)) info.append(el('small','film-state in-plex',t('cardAvailable')));
    else if (movie.requestStatus) info.append(el('small','film-state',t(movie.requestStatus==='processing'?'adminProcessing':'adminPending')));
    button.append(info, icon('icon-arrow'));
    button.addEventListener('click', () => chooseRequest(movie));
    parent.append(button);
  });
}
function renderSelectedMovie() {
  $('requestForm').hidden = !selected || requestIsDuplicate || !!selectedRequestStatus;
  if (!selected || requestIsDuplicate || selectedRequestStatus) return;
  const parent = $('selectedMovie'); parent.replaceChildren();
  parent.append(createPoster(selected, 'chosen-art'));
  const info = el('div');
  info.append(el('strong', '', selected.title), el('small', '', selected.year ? String(selected.year) : t('unknownYear')));
  parent.append(info);
}
function chooseRequest(movie) {
  selected = movie;
  requestIsDuplicate = isDuplicate(movie);
  selectedRequestStatus = movie.requestStatus || null;
  requestResults = [];
  formStatus = null;
  requestStatus = requestIsDuplicate ? 'requestDuplicate' : selectedRequestStatus ? (selectedRequestStatus==='processing'?'requestAlreadyProcessing':'requestAlreadyPending') : 'requestSelected';
  renderRequestResults(); renderRequestStatus(); renderSelectedMovie(); renderFormStatus();
}
async function lookupMovies() {
  const q = $('requestSearch').value.trim();
  if (currentLookup) currentLookup.abort();
  requestResults = []; selected = null; requestIsDuplicate = false; selectedRequestStatus = null; formStatus = null;
  renderRequestResults(); renderSelectedMovie(); renderFormStatus();
  if (q.length < 2) { requestStatus = 'requestSearchShort'; renderRequestStatus(); return; }
  if (!cfg.tmdbSearchEndpoint) { requestStatus = 'requestNeedsConfig'; renderRequestStatus(); return; }
  requestStatus = 'requestLoading'; renderRequestStatus();
  const abortController = new AbortController(); currentLookup = abortController;
  try {
    const uri = cfg.tmdbSearchEndpoint + encodeURIComponent(q) + '&language=en-US';
    const response = await fetch(uri, { signal: abortController.signal });
    if (!response.ok) throw new Error('Movie search unavailable');
    const data = await response.json();
    if (abortController.signal.aborted) return;
    requestResults = (Array.isArray(data.results) ? data.results : []).map(asMovie).filter((m) => m.title).slice(0, 10);
    requestStatus = requestResults.length ? 'requestChoose' : 'requestNoResults';
  } catch (err) {
    if (err.name === 'AbortError') return;
    requestStatus = 'requestError';
  } finally {
    if (currentLookup === abortController) currentLookup = null;
  }
  renderRequestStatus(); renderRequestResults();
}
function startRequestFromSearch() {
  const q = $('search').value.trim();
  setTab('request', true);
  if (q) { $('requestSearch').value = q; lookupMovies(); }
  else { $('requestSearch').focus({ preventScroll: true }); }
}
function renderDialog(movie) {
  const parent = $('dialogContent'); parent.replaceChildren();
  const body = el('div', 'dialog-body');
  body.append(createPoster(movie, 'dialog-art'));
  const info = el('div', 'dialog-info');
  info.append(el('div', 'small-heading', t('dialogOverline')));
  const heading = el('h2', '', movie.title); heading.id = 'dialogTitle'; info.append(heading);
  info.append(el('div', 'dialog-year', movie.year ? String(movie.year) : t('unknownYear')));
  const available = el('span', 'dialog-available'); available.append(icon('icon-check'), el('span', '', t('dialogAvailable')));
  info.append(available);
  info.append(el('p', 'dialog-summary', movie.overview || t('noSummary')));
  body.append(info); parent.append(body);
}
function openDialog(movie) {
  activeDialogMovie = movie;
  renderDialog(movie);
  if (!$('movieDialog').open) $('movieDialog').showModal();
}
function closeDialog() { $('movieDialog').close(); activeDialogMovie = null; }
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message; toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
}
async function loadCatalog() {
  try {
    const response = await fetch('catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Cannot read catalog');
    const data = await response.json();
    catalog = (Array.isArray(data.movies) ? data.movies : []).map(asMovie).filter((m) => m.title);
    catalogUpdated = data.updatedAt || null;
    catalogState = catalogUpdated ? 'ok' : 'pending';
  } catch {
    catalog = []; catalogState = 'error'; catalogUpdated = null;
  }
  renderConnection(); renderLibrary(); renderHeroPosters();
}

for (const button of document.querySelectorAll('[data-lang]')) button.addEventListener('click', () => setLanguage(button.dataset.lang));
for (const button of document.querySelectorAll('[data-tab]')) button.addEventListener('click', () => setTab(button.dataset.tab));
$('search').addEventListener('input', () => { limit = 18; renderLibrary(); renderSuggestions(); });
$('search').addEventListener('focus', renderSuggestions);
$('search').addEventListener('keydown', (event) => {
  if (event.key === 'Escape') showSuggestions(false);
  if (event.key === 'Enter') { showSuggestions(false); $('workspace').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  if (event.key === 'ArrowDown' && !$('suggestions').hidden) { const first = $('suggestions').querySelector('button'); if (first) { event.preventDefault(); first.focus(); } }
});
$('suggestions').addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { showSuggestions(false); $('search').focus(); }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const items = [...$('suggestions').querySelectorAll('button')]; const idx = items.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? Math.min(items.length - 1, idx + 1) : Math.max(0, idx - 1);
    if (items[next]) { event.preventDefault(); items[next].focus(); }
  }
});
document.addEventListener('pointerdown', (event) => { if (!$('mainSearchWrap').contains(event.target)) showSuggestions(false); });
document.addEventListener('keydown', (event) => {
  const focused = document.activeElement;
  const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(focused?.tagName) || focused?.isContentEditable;
  if (event.key === '/' && !editing && !$('movieDialog').open) {
    event.preventDefault(); setTab('library'); $('search').focus(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
$('heroRequest').addEventListener('click', startRequestFromSearch);
$('goRequest').addEventListener('click', startRequestFromSearch);
$('sort').addEventListener('change', () => { limit = 18; renderLibrary(); });
$('loadMore').addEventListener('click', () => { limit += 18; renderLibrary(); });
$('requestSearch').addEventListener('input', () => { clearTimeout(requestTimer); requestTimer = setTimeout(lookupMovies, 380); });
$('requestForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!selected || requestIsDuplicate || selectedRequestStatus) return;
  const requester = $('requester').value.trim();
  if (!requester) { formStatus = 'formInvalidName'; renderFormStatus(); return; }
  if (!cfg.requestEndpoint) { formStatus = 'formNeedsConfig'; renderFormStatus(); return; }
  formStatus = 'submitSending'; renderFormStatus(); $('submitRequest').disabled = true;
  try {
    const response = await fetch(cfg.requestEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie: selected, requester, note: $('note').value.trim(), language, website: $('website').value })
    });
    if (response.status === 409) {
      const data = await response.json().catch(()=>({}));
      if (data.code === 'already_requested') selectedRequestStatus = data.status || 'pending';
      else requestIsDuplicate = true;
      requestStatus = requestIsDuplicate ? 'requestDuplicate' : selectedRequestStatus==='processing'?'requestAlreadyProcessing':'requestAlreadyPending';
      renderRequestStatus(); renderSelectedMovie();
      throw Object.assign(new Error('Already in Plex'), { duplicate: true });
    }
    if (!response.ok) throw new Error('Request failed');
    const result=await response.json();
    formStatus = result.emailWarning ? 'requestEmailWarning' : 'formSent'; $('requester').value = ''; $('note').value = '';
    showToast(t(formStatus));
    selected = null; renderSelectedMovie();
  } catch (error) { formStatus = error.duplicate ? null : 'formError'; }
  finally { $('submitRequest').disabled = false; renderFormStatus(); }
});
$('closeDialog').addEventListener('click', closeDialog);
$('movieDialog').addEventListener('click', (event) => { if (event.target === $('movieDialog')) closeDialog(); });
$('movieDialog').addEventListener('close', () => { activeDialogMovie = null; });

renderLanguage();
loadCatalog();


// Private admin key is kept only in the input; never in localStorage, URL or public config.
function renderAdminLabels() {
  for (const n of document.querySelectorAll('[data-admin-i18n]')) n.textContent=t(n.dataset.adminI18n);
  if ($('adminList').dataset.loaded==='true') renderAdminList();
}
let adminRequests=[];
function renderAdminList() {
  const area=$('adminList');area.replaceChildren();
  if (!adminRequests.length) {area.append(el('p','admin-muted',t('adminEmpty')));return;}
  for(const req of adminRequests) {
    const row=el('div','admin-item');
    row.append(createPoster(req,'admin-poster'));
    const details=el('div','admin-details');
    details.append(el('strong','',`${req.title} (${req.year||'—'})`),el('small','',`${req.requester} · ${req.createdAt||''}`));
    if (req.note) details.append(el('small','',req.note));
    const available=isDuplicate(req);
    if(available) details.append(el('span','film-state in-plex',t('adminAvailable')));
    row.append(details);
    if(!available){
      const select=el('select','admin-select');
      for(const status of ['pending','processing','dismissed']){
        const opt=el('option','',t(status==='pending'?'adminPending':status==='processing'?'adminProcessing':'adminDismissed'));
        opt.value=status;opt.selected=req.status===status;select.append(opt);
      }
      select.addEventListener('change',async()=>{
        select.disabled=true;
        try{
          const resp=await fetch(cfg.requestEndpoint.replace(/\/request\/?$/,'/admin/status'),{
            method:'POST',headers:{'Content-Type':'application/json','X-Admin-Key':$('adminKey').value},
            body:JSON.stringify({tmdbId:req.tmdbId,status:select.value})
          });
          if(!resp.ok)throw Error('Failed');
          req.status=select.value;
        }catch{$('adminMessage').textContent=t('adminError');select.value=req.status;}
        finally{select.disabled=false;}
      });
      row.append(select);
    }
    area.append(row);
  }
}
$('openAdmin').addEventListener('click',()=>{$('adminDialog').showModal();});
$('closeAdmin').addEventListener('click',()=>{$('adminKey').value='';$('adminDialog').close();});
$('adminDialog').addEventListener('close',()=>{$('adminKey').value='';});
$('adminDialog').addEventListener('click',ev=>{if(ev.target===$('adminDialog'))$('adminDialog').close();});
$('loadAdmin').addEventListener('click',async()=>{
  const key=$('adminKey').value;
  if(!key){$('adminMessage').textContent=t('adminNoKey');return;}
  $('adminMessage').textContent='';$('loadAdmin').disabled=true;
  try {
    const r=await fetch(cfg.requestEndpoint.replace(/\/request\/?$/,'/admin/requests'),{headers:{'X-Admin-Key':key},cache:'no-store'});
    if(!r.ok)throw Error('Unauthorized');
    const data=await r.json();adminRequests=data.requests||[];
    $('adminList').dataset.loaded='true';renderAdminList();
  }catch{$('adminMessage').textContent=t('adminError');}
  finally{$('loadAdmin').disabled=false;}
});
