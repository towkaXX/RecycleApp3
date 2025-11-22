// Basic scanner + points logic (uses html5-qrcode library)
// This file expects html5-qrcode.min.js to be present locally or via CDN in index.html.
// If you prefer local offline, download html5-qrcode.min.js and include it before this script.

(function(){
  // helper to load external script if not already loaded
  function loadLibrary(url, cb){
    if(window.Html5Qrcode){ cb(); return; }
    var s = document.createElement('script');
    s.src = url;
    s.onload = cb;
    document.head.appendChild(s);
  }

  // initialize points UI
  function loadPoints(){
    var pts = localStorage.getItem('points');
    if(pts === null) { pts = 0; localStorage.setItem('points', 0); }
    document.getElementById('points').innerText = 'Points: ' + pts;
  }

  function addPoints(n){
    var pts = parseInt(localStorage.getItem('points')||0,10);
    pts += n;
    localStorage.setItem('points', pts);
    document.getElementById('points').innerText = 'Points: ' + pts;
  }

  // scanner logic
  function startScanner(){
    // ensure library loaded (CDN fallback)
    loadLibrary('https://unpkg.com/html5-qrcode', function(){
      var reader = new Html5Qrcode('qr-reader');
      document.getElementById('qr-reader').style.display = 'block';
      reader.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        function(decodedText){
          document.getElementById('result').innerText = 'Scanned Code: ' + decodedText;
          // sample logic:
          if(decodedText === '123' || decodedText === '456'){
            addPoints(10);
            alert('Product detected. +10 points added.');
          } else {
            alert('Unknown product: ' + decodedText);
          }
          // stop camera after success
          reader.stop().then(function(){ 
            document.getElementById('qr-reader').style.display = 'none';
          }).catch(function(){ document.getElementById('qr-reader').style.display = 'none'; });
        },
        function(err){
          // ignore decode errors
        }
      ).catch(function(err){
        console.error('cannot start camera', err);
        alert('Camera error: ' + (err.message || err));
      });
    });
  }

  // wire events
  document.addEventListener('DOMContentLoaded', function(){
    loadPoints();
    var btn = document.getElementById('scanButton');
    if(btn) btn.addEventListener('click', startScanner);
  });

  // expose for debugging if needed
  window.startScanner = startScanner;

})();
