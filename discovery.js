'use strict';
/* Plex Library 5.0 - discovery filters. Does not modify requests or administration. */
(() => {
  const genreNames = {
    28:['Acción','Action'],12:['Aventura','Adventure'],16:['Animación','Animation'],35:['Comedia','Comedy'],
    80:['Crimen','Crime'],99:['Documental','Documentary'],18:['Drama','Drama'],10751:['Familia','Family'],
    14:['Fantasía','Fantasy'],36:['Historia','History'],27:['Terror','Horror'],10402:['Música','Music'],
    9648:['Misterio','Mystery'],10749:['Romance','Romance'],878:['Ciencia ficción','Science Fiction'],
    10770:['Película para TV','TV Movie'],53:['Suspenso','Thriller'],10752:['Bélica','War'],37:['Western','Western']
  };
  const labels = {
    es:{recent:'Agregadas en 30 días',year:'Películas de {year}',all:'Todas las películas',
      recentTitle:'Agregadas recientemente',yearTitle:'Películas estrenadas en {year}',genreLabel:'Filtrar por género',
      allGenres:'Todos los géneros',actorTitle:'Películas con {actor}',clear:'Quitar filtros',cast:'Reparto principal',
      filtering:'Explorando {filters}',none:'No hay películas que coincidan con estos filtros.',genreTitle:'Películas de {genre}'},
    en:{recent:'Added in 30 days',year:'Movies from {year}',all:'All movies',
      recentTitle:'Recently added',yearTitle:'Movies released in {year}',genreLabel:'Filter by genre',
      allGenres:'All genres',actorTitle:'Movies starring {actor}',clear:'Clear filters',cast:'Starring',
      filtering:'Exploring {filters}',none:'No movies match these filters.',genreTitle:'{genre} movies'}
  };
  const currentYear = () => new Date().getFullYear();
  const word = (key, args={}) => Object.entries(args).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',String(v)),labels[language][key]);
  const genreLabel = id => (genreNames[id] || [String(id),String(id)])[language === 'en' ? 1 : 0];
  let metric = 'all';
  let genre = '';
  let actor = null;
  const oldAsMovie = asMovie;
  asMovie = function(raw) {
    const movie = oldAsMovie(raw);
    movie.genres = Array.isArray(raw?.genres) ? raw.genres.map(g => Number(typeof g === 'object' ? g.id : g)).filter(Number.isFinite) : [];
    movie.cast = Array.isArray(raw?.cast) ? raw.cast.map(a => ({id:Number(a?.id) || null,name:String(a?.name || '').trim()})).filter(a=>a.name) : [];
    return movie;
  };
  const thirtyDaysAgo = () => Date.now() - 30 * 86400000;
  function inMetric(movie) {
    if(metric === 'year') return Number(movie.year) === currentYear();
    if(metric === 'recent') { const d=Date.parse(movie.addedAt); return Number.isFinite(d) && d >= thirtyDaysAgo() && d <= Date.now(); }
    return true;
  }
  function hasActor(movie) {
    return !actor || movie.cast.some(p => (actor.id && p.id === actor.id) || (!actor.id && normalizeText(p.name) === normalizeText(actor.name)));
  }
  getFiltered = function() {
    const q = normalizeText($('search').value.trim());
    const filtered = catalog.filter(m => inMetric(m) && (!genre || m.genres.includes(Number(genre))) && hasActor(m) && normalizeText([m.title,m.originalTitle,m.year].join(' ')).includes(q));
    const order = $('sort').value;
    const collator = new Intl.Collator(localeFor(language),{sensitivity:'base'});
    filtered.sort((a,b) => {
      if(order === 'title') return collator.compare(a.title,b.title);
      if(order === 'year') return (Number(b.year)||0)-(Number(a.year)||0) || collator.compare(a.title,b.title);
      return (Date.parse(b.addedAt)||0)-(Date.parse(a.addedAt)||0);
    });
    return filtered;
  };
  function renderGenreOptions() {
    const select = $('genreFilter');
    const available = [...new Set(catalog.flatMap(m=>m.genres))].filter(id => genreNames[id]);
    $('genreWrap').hidden = !available.length;
    if(genre && !available.includes(Number(genre))) genre = '';
    const options = [new Option(word('allGenres'),'')];
    available.sort((a,b)=>genreLabel(a).localeCompare(genreLabel(b),localeFor(language))).forEach(id => options.push(new Option(genreLabel(id),String(id))));
    select.replaceChildren(...options);
    select.value = genre;
    select.setAttribute('aria-label',word('genreLabel'));
  }
  function renderMetrics() {
    const format = new Intl.NumberFormat(localeFor(language));
    $('recentTotal').textContent = catalogState === 'ok' ? format.format(catalog.filter(m=>{
      const n=Date.parse(m.addedAt);return Number.isFinite(n) && n>=thirtyDaysAgo() && n<=Date.now();
    }).length) : '—';
    $('releaseTotal').textContent = catalogState === 'ok' ? format.format(catalog.filter(m=>Number(m.year)===currentYear()).length) : '—';
    $('releaseLabel').textContent = word('year',{year:currentYear()});
    $('recentLabel').textContent = word('recent');
    for(const btn of document.querySelectorAll('[data-stat]')) {
      const active=btn.dataset.stat===metric;
      btn.classList.toggle('is-selected',active);
      btn.setAttribute('aria-pressed',String(active));
    }
  }
  const oldConnection = renderConnection;
  renderConnection = function(){oldConnection();renderMetrics();renderGenreOptions();};
  const oldLibrary = renderLibrary;
  renderLibrary = function() {
    oldLibrary();
    const pieces=[];
    if(actor) pieces.push(word('actorTitle',{actor:actor.name}));
    if(metric==='recent') pieces.push(word('recentTitle'));
    if(metric==='year') pieces.push(word('yearTitle',{year:currentYear()}));
    if(genre) pieces.push(genreLabel(Number(genre)));
    if(actor) $('listTitle').textContent=word('actorTitle',{actor:actor.name});
    else if(metric==='recent') $('listTitle').textContent=word('recentTitle');
    else if(metric==='year') $('listTitle').textContent=word('yearTitle',{year:currentYear()});
    else if(genre && !$('search').value.trim()) $('listTitle').textContent=word('genreTitle',{genre:genreLabel(Number(genre))});
    const applied=pieces.length>0;
    $('activeFilter').hidden=!applied;
    $('activeFilterText').textContent=applied?word('filtering',{filters:pieces.join(' · ')}):'';
    $('clearFilters').textContent=word('clear');
    if(applied && $('empty').hidden===false) {
      $('emptyTitle').textContent = language === 'en'?'No matches for these filters':'Sin resultados con estos filtros';
      $('emptyDescription').textContent=word('none');
      $('goRequest').hidden=true;
    }
    renderMetrics();
  };
  function openList(){setTab('library',true);limit=18;renderLibrary();renderSuggestions();}
  for (const btn of document.querySelectorAll('[data-stat]')) {
    btn.addEventListener('click',()=>{
      metric=btn.dataset.stat;
      actor=null;
      $('search').value='';
      showSuggestions(false);
      openList();
    });
  }
  $('genreFilter').addEventListener('change',e=>{
    genre=e.target.value;
    actor=null;
    $('search').value='';
    openList();
  });
  $('clearFilters').addEventListener('click',()=>{
    metric='all';genre='';actor=null;$('search').value='';
    renderGenreOptions();openList();
  });
  const oldDialog = renderDialog;
  renderDialog = function(movie) {
    oldDialog(movie);
    const info=$('dialogContent').querySelector('.dialog-info');
    if(!info) return;
    if(movie.genres?.length) {
      const pills=el('div','dialog-genres');
      for(const id of movie.genres.slice(0,5)) {
        if(genreNames[id]) pills.append(el('span','dialog-genre',genreLabel(id)));
      }
      const yearLine=info.querySelector('.dialog-year');
      if(pills.childElementCount) yearLine.after(pills);
    }
    if(movie.cast?.length) {
      const wrap=el('section','dialog-cast');
      wrap.append(el('div','dialog-cast-label',word('cast')));
      const list=el('div','dialog-cast-list');
      for(const person of movie.cast.slice(0,5)) {
        const b=el('button','dialog-actor',person.name); b.type='button';
        b.setAttribute('aria-label',word('actorTitle',{actor:person.name}));
        b.addEventListener('click',()=>{
          closeDialog();metric='all';genre='';actor=person;
          $('search').value='';renderGenreOptions();openList();
        });
        list.append(b);
      }
      wrap.append(list);
      $('dialogContent').append(wrap);
    }
  };
  renderConnection();
  renderLibrary();
})();
