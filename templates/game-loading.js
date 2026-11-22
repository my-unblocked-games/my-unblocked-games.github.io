
  <script>
  // Game load helpers: warm up the connection before Play is clicked, show a
  // spinner while the game loads, and offer a reload if it is slow.
  (function () {
    var GAME_URL = __GAME_URL__;
    var frame = document.getElementById('gameFrame');
    var box = document.getElementById('gameLoading');
    var slowTimer = null;
    var started = false;
    var wrapperPromise = null;
    var didConnect = false;
    var didScripts = false;

    function addLink(rel, href, as, cors) {
      var l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      if (as) l.as = as;
      if (cors) l.crossOrigin = 'anonymous';
      document.head.appendChild(l);
    }

    // Fetch the (tiny, same-origin) game wrapper once to see what it will load.
    function getWrapper() {
      if (!wrapperPromise) {
        wrapperPromise = fetch(GAME_URL).then(function (r) {
          return r.ok ? r.text() : '';
        }).catch(function () { return ''; });
      }
      return wrapperPromise;
    }

    function warmConnections() {
      if (didConnect) return;
      didConnect = true;
      getWrapper().then(function (html) {
        var re = /\ssrc\s*=\s*["'](https?:\/\/[^\/"']+)/gi;
        var m, seen = {}, n = 0;
        while ((m = re.exec(html)) && n < 4) {
          var origin = m[1];
          if (seen[origin] || origin.indexOf(location.host) !== -1) continue;
          seen[origin] = true;
          n++;
          addLink('preconnect', origin);
          addLink('preconnect', origin, '', true);
        }
      });
    }

    function warmScripts() {
      if (didScripts) return;
      didScripts = true;
      getWrapper().then(function (html) {
        var re = /<script[^>]+\ssrc\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
        var m, n = 0;
        while ((m = re.exec(html)) && n < 8) {
          n++;
          addLink('preload', m[1], 'script');
        }
      });
    }

    window.beginGameLoading = function () {
      started = true;
      if (!box) return;
      box.classList.add('show');
      box.classList.remove('slow');
      clearTimeout(slowTimer);
      slowTimer = setTimeout(function () { box.classList.add('slow'); }, 8000);
    };

    window.reloadGame = function () {
      window.beginGameLoading();
      frame.src = GAME_URL + (GAME_URL.indexOf('?') < 0 ? '?' : '&') + 'r=' + Date.now();
    };

    frame.addEventListener('load', function () {
      if (!started || !box) return;
      clearTimeout(slowTimer);
      box.classList.remove('show');
      box.classList.remove('slow');
    });

    // Start the network connection early: idle after page load, and fully on
    // hover / touch / keyboard focus of the Play button.
    var btn = document.querySelector('.play-btn');
    if (btn) {
      ['pointerenter', 'touchstart', 'focus'].forEach(function (ev) {
        btn.addEventListener(ev, function () { warmConnections(); warmScripts(); }, { passive: true, once: true });
      });
    }
    var idle = window.requestIdleCallback || function (f) { setTimeout(f, 1500); };
    window.addEventListener('load', function () {
      idle(function () {
        addLink('preconnect', 'https://cdn.jsdelivr.net');
        addLink('preconnect', 'https://cdn.jsdelivr.net', '', true);
        warmConnections();
      });
    });
  })();
  </script>
