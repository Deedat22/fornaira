(function() {
  const correctPin = "100226";
  let isUnlocked = false;
  let currentModalIndex = 0;
  let memories = [];

  const lockScreen = document.getElementById('lockScreen');
  const mainContent = document.getElementById('mainContent');
  const pinInput = document.getElementById('pinInput');
  const submitBtn = document.getElementById('submitPin');
  const wrongPinDiv = document.getElementById('wrongPin');
  const countdownEl = document.getElementById('countdown');

  const photoData = [
    { src: "photos/foto1.jpg", caption: "awkward photo ❤️", note: "jujur gabisa gaya 😭" },
    { src: "photos/foto2.jpg", caption: "our first photobooth ❤️", note: "you looked so happy here ✨" },
    { src: "photos/foto3.jpg", caption: "your fav photobooth moment 🌷", note: "you looked so cute here 🌷" },
    { src: "photos/foto4.jpg", caption: "favorite place = beside you ✨ 💌", note: "hi pretty girl" },
    { src: "photos/foto5.jpg", caption: "my safe place ✨", note: "still one of my favorite pictures ever ❤️" },
    { src: "photos/foto6.jpg", caption: "my fav smile", note: "you make everything brighter 🌸" },
    { src: "photos/foto7.jpg", caption: "our first photo 🌷", note: "i still remember how happy i was that day" },
    { src: "photos/foto8.jpg", caption: "si yapping 24/7 ✨", note: "still can't get over this photo ❤️" },
    { src: "photos/foto9.jpg", caption: "still replaying this memory 🌸 🌸", note: "thank you for existing 💌" },
    { src: "photos/foto10.jpg", caption: "best day of my life 🌷", note: "still my favorite memory ever" },
    { src: "photos/foto11.jpg", caption: "ordinary days felt special ❤️", note: "i wish we could relive this day ✨" },
    { src: "photos/foto12.jpg", caption: "special moments 🌸", note: "thank you for making life prettier 💌" },
    { src: "photos/foto13.jpg", caption: "special moments with you 🌸💖", note: "i love every memory with you naira." }
  ];

  let countdownValue = 3;
  countdownEl.innerText = '⏳ opening in 3 ...';
  const countInterval = setInterval(function() {
    if (countdownValue > 1) {
      countdownValue--;
      countdownEl.innerText = '⏳ opening in ' + countdownValue + ' ...';
    } else {
      clearInterval(countInterval);
      countdownEl.innerText = '✨ enter the code ✨';
    }
  }, 800);

  // MUSIC + VOLUME CONTROL
  let audio = null;
  let isMusicPlaying = false;
  const musicBtn = document.getElementById('musicToggleBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  
  function initMusic() {
    audio = new Audio();
    audio.src = 'music/lagu.mp3';
    audio.loop = true;
    audio.volume = 0.20;
    audio.load();
    if (musicBtn) musicBtn.innerHTML = '🔇';
    if (volumeSlider) volumeSlider.value = 20;
  }
  
  function toggleMusic() {
    if (!audio) {
      initMusic();
    }
    
    if (isMusicPlaying) {
      audio.pause();
      if (musicBtn) musicBtn.innerHTML = '🔇';
      isMusicPlaying = false;
    } else {
      audio.play().catch(function(err) {
        console.log('error playing music:', err);
      });
      if (musicBtn) musicBtn.innerHTML = '🎵';
      isMusicPlaying = true;
    }
  }
  
  function updateVolume() {
    if (!audio) return;
    var vol = volumeSlider.value / 100;
    audio.volume = vol;
  }
  
  if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
  if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
  
  // BACK TO TOP
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      if (backToTopBtn) backToTopBtn.style.display = 'flex';
    } else {
      if (backToTopBtn) backToTopBtn.style.display = 'none';
    }
  });
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function unlockApp() {
    if (isUnlocked) return;
    isUnlocked = true;
    lockScreen.style.display = 'none';
    mainContent.style.display = 'flex';
    startHeartRain();
    startFlowerFall();
    startTypingText();
    loadGallery();
    observeScroll();
    initEnvelope();
    
    initMusic();
    
    var secretFlower = document.getElementById('secretFlowerTrigger');
    if (secretFlower) {
      secretFlower.addEventListener('click', function() {
        var secretMsgDiv = document.getElementById('secretMessage');
        if (secretMsgDiv.style.display === 'none' || !secretMsgDiv.style.display) {
          secretMsgDiv.style.display = 'block';
          for (var i = 0; i < 12; i++) createFlowerPetal();
        } else {
          secretMsgDiv.style.display = 'none';
        }
      });
    }
  }

  submitBtn.addEventListener('click', function() {
    if (pinInput.value.trim() === correctPin) {
      unlockApp();
    } else {
      wrongPinDiv.innerText = '❌ wrong code! try again ❌';
      pinInput.value = '';
      pinInput.style.border = '2px solid #ff6f61';
      setTimeout(function() {
        pinInput.style.border = 'none';
        setTimeout(function() {
          if (wrongPinDiv.innerText !== '') wrongPinDiv.innerText = '';
        }, 2000);
      }, 1500);
    }
  });
  
  pinInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') submitBtn.click();
  });

  function loadGallery() {
    var galleryDiv = document.getElementById('galleryContainer');
    galleryDiv.innerHTML = '';
    memories = [];
    
    for (var idx = 0; idx < photoData.length; idx++) {
      var data = photoData[idx];
      var polaroid = document.createElement('div');
      polaroid.className = 'polaroid hidden';
      polaroid.setAttribute('data-index', idx);
      polaroid.innerHTML = '<img src="' + data.src + '" alt="memory" onerror="this.src=\'https://picsum.photos/id/20/400/400\'"> <p>' + data.caption + '</p>';
      
      polaroid.addEventListener('click', (function(i) {
        return function() {
          openModal(i);
        };
      })(idx));
      
      galleryDiv.appendChild(polaroid);
      
      memories.push({
        img: data.src,
        note: data.note
      });
    }
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    var hiddenElements = document.querySelectorAll('.hidden');
    for (var i = 0; i < hiddenElements.length; i++) {
      observer.observe(hiddenElements[i]);
    }
  }

  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('modalImage');
  var modalNote = document.getElementById('modalNote');
  var closeModalBtn = document.getElementById('closeModal');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  function openModal(index) {
    currentModalIndex = index;
    var mem = memories[currentModalIndex];
    modalImg.src = mem.img;
    modalNote.innerText = mem.note;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  function nextImage() {
    currentModalIndex = (currentModalIndex + 1) % memories.length;
    var mem = memories[currentModalIndex];
    modalImg.src = mem.img;
    modalNote.innerText = mem.note;
  }
  
  function prevImage() {
    currentModalIndex = (currentModalIndex - 1 + memories.length) % memories.length;
    var mem = memories[currentModalIndex];
    modalImg.src = mem.img;
    modalNote.innerText = mem.note;
  }
  
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModalFunc);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModalFunc();
    });
  }

  // TYPING TEXT
  var typingEl = document.getElementById('typing');
  var fullText = 'Heyyy Naira, honestly aku juga bingung harus mulai dari mana. Mungkin ini agak random, tapi aku cuma pengen bilang kalau aku masih menghargai semua hal yang pernah kita lewatin bareng.\n\nHal-hal kecil, obrolan random, ketawa-ketawa ga jelas, sampai momen yang sebenernya biasa aja tapi entah kenapa jadi berkesan kalau sama kamu.\n\nDan kalau dipikir-pikir, kamu emang pernah jadi bagian penting di hidup aku. Mungkin sekarang semuanya udah beda, tapi itu ga bikin semua kenangannya jadi hilang gitu aja.\n\nSo yeah... thank you ya, buat semuanya. Dan makasih juga karena pernah hadir di hidup aku, walaupun cuma untuk satu bagian cerita aja. 💕';
  var charIndex = 0;
  
  function startTypingText() {
    typingEl.innerHTML = '';
    charIndex = 0;
    function typeNext() {
      if (charIndex < fullText.length) {
        var char = fullText.charAt(charIndex);
        if (char === '\n') {
          typingEl.innerHTML += '<br>';
        } else {
          typingEl.innerHTML += char;
        }
        charIndex++;
        setTimeout(typeNext, 40);
      } else {
        setInterval(function() { createHeartRandom(); }, 500);
      }
    }
    typeNext();
  }

  function createHeartRandom() {
    if (!isUnlocked) return;
    var heart = document.createElement('div');
    heart.classList.add('heart');
    var hearts = ['❤️', '💖', '💗', '🌸', '🌹', '💕', '💘'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 18 + 18) + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.body.appendChild(heart);
    setTimeout(function() { heart.remove(); }, 5000);
  }
  
  function startHeartRain() {
    for (var s = 0; s < 12; s++) {
      setTimeout(function() { createHeartRandom(); }, s * 300);
    }
    setInterval(function() { if (isUnlocked) createHeartRandom(); }, 1200);
  }

  function createFlowerPetal() {
    if (!isUnlocked) return;
    var flower = document.createElement('div');
    flower.classList.add('flower');
    var flowers = ['🌸', '🌼', '🌺', '🌸', '✨', '💮', '🌻'];
    flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + '%';
    flower.style.fontSize = (Math.random() * 18 + 22) + 'px';
    flower.style.animationDuration = (Math.random() * 5 + 4) + 's';
    document.body.appendChild(flower);
    setTimeout(function() { flower.remove(); }, 7000);
  }
  
  function startFlowerFall() {
    setInterval(function() { if (isUnlocked) createFlowerPetal(); }, 1800);
    for (var f = 0; f < 8; f++) {
      setTimeout(function() { createFlowerPetal(); }, f * 400);
    }
  }

  function initEnvelope() {
    var envelopeContainer = document.getElementById('envelopeContainer');
    var envelopeDiv = document.getElementById('envelope');
    if (envelopeDiv) {
      envelopeDiv.addEventListener('click', function() {
        envelopeContainer.classList.toggle('open');
        if (envelopeContainer.classList.contains('open')) {
          for (var i = 0; i < 10; i++) {
            setTimeout(function() { createHeartRandom(); }, i * 60);
          }
        }
      });
    }
  }

  function observeScroll() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.25 });
    var hiddenElements = document.querySelectorAll('.hidden');
    for (var i = 0; i < hiddenElements.length; i++) {
      observer.observe(hiddenElements[i]);
    }
  }

  var memCounter = document.getElementById('memoryCounter');
  var counterMsg = ['📸 a few photos', '📸 that\'s it', '📸 nothing special', '📸 just because'];
  var msgIndex = 0;
  
  setInterval(function() {
    if (isUnlocked && memCounter) {
      memCounter.innerHTML = counterMsg[msgIndex % counterMsg.length];
      msgIndex++;
    }
  }, 3000);
})();