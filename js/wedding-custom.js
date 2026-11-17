/**
 * Muhammadali & Hayotxon - Visol Oqshomi
 * Maxsus interaktiv va animatsiyali skriptlar
 */

(function () {
  "use strict";

  // --- 1. O'zgaruvchilar va Ma'lumotlar ---
  var TARGET_DATE_STRING = "2026/11/21 18:00:00"; // 21-Noyabr 18:00
  var YT_VIDEO_ID = "AFRrBAMtJe0"; // Ziyoda - Kelibdi
  var isAudioPlaying = false;
  var currentVolume = 0.35; // Foydalanuvchi so'raganidek musiqani sal pastroq, yoqimli fonda o'rnatamiz (35%)
  var audioContext = null;
  var musicTimer = null;
  var petalsRunning = true;
  var ytPlayer = null;
  var ytPlayerReady = false;
  var shouldPlayWhenReady = false;

  // --- 2. YouTube IFrame API Integratsiyasi (Ziyoda - Kelibdi) ---
  window.onYouTubeIframeAPIReady = function () {
    try {
      ytPlayer = new YT.Player('ytMusicPlayer', {
        height: '100%',
        width: '100%',
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 1,
          loop: 1,
          playlist: YT_VIDEO_ID,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          enablejsapi: 1
        },
        events: {
          onReady: function (event) {
            ytPlayerReady = true;
            try {
              event.target.setVolume(Math.round(currentVolume * 100));
            } catch (e) {}
            if (shouldPlayWhenReady) {
              event.target.playVideo();
            }
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.PLAYING) {
              setMusicUIState(true);
            } else if (event.data === YT.PlayerState.PAUSED) {
              setMusicUIState(false);
            } else if (event.data === YT.PlayerState.ENDED) {
              event.target.playVideo(); // loop
            }
          },
          onError: function (err) {
            console.log("YouTube pleeri xatoligi:", err);
          }
        }
      });
    } catch (e) {
      console.log("YouTube API xatoligi:", e);
    }
  };

  function setMusicUIState(playing) {
    isAudioPlaying = playing;
    var musicBtn = document.getElementById("musicToggleBtn");
    var musicIcon = document.getElementById("musicIcon");
    var musicPill = document.getElementById("musicPill");
    var musicTrackTitle = document.getElementById("musicTrackTitle");

    if (playing) {
      if (musicBtn) musicBtn.classList.add("playing");
      if (musicIcon) musicIcon.className = "fas fa-compact-disc fa-spin";
      if (musicPill) musicPill.classList.add("playing");
      if (musicTrackTitle) musicTrackTitle.innerText = "Ziyoda — Kelibdi 🎵";
    } else {
      if (musicBtn) musicBtn.classList.remove("playing");
      if (musicIcon) musicIcon.className = "fas fa-music";
      if (musicPill) musicPill.classList.remove("playing");
      if (musicTrackTitle) musicTrackTitle.innerText = "Ziyoda — Kelibdi (Pauza)";
    }
  }

  window.toggleYtPreview = function () {
    var container = document.getElementById("ytPlayerContainer");
    if (container) {
      container.classList.toggle("show");
    }
  };

  // --- 3. Taklifnomani Ochish (Envelope Animation) ---
  window.openInvitation = function () {
    var cover = document.getElementById("invitationCover");
    if (cover) {
      cover.classList.add("opened");
      setTimeout(function () {
        cover.style.display = "none";
      }, 1000);
    }

    // Musiqani sal pastroq va yoqimli hajmda boshlash (Ziyoda - Kelibdi)
    toggleMusic(true);

    // Qaynoq qutlovlar va yuraklar otilishi (Confetti)
    burstHearts(window.innerWidth / 2, window.innerHeight / 2);

    // Sahifani asosiy qismiga silliq olib o'tish
    var homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- 4. Musiqani Boshqarish (Ziyoda — Kelibdi) ---
  window.changeVolume = function (vol) {
    currentVolume = parseFloat(vol);
    var audioTag = document.getElementById("weddingAudio");
    if (audioTag) {
      audioTag.volume = currentVolume;
    }
    if (ytPlayer && ytPlayerReady && typeof ytPlayer.setVolume === "function") {
      try {
        ytPlayer.setVolume(Math.round(currentVolume * 100));
      } catch (e) {}
    }
  };

  window.toggleMusic = function (forcePlay) {
    var audioTag = document.getElementById("weddingAudio");

    if (forcePlay === true) {
      isAudioPlaying = true;
    } else if (forcePlay === false) {
      isAudioPlaying = false;
    } else {
      isAudioPlaying = !isAudioPlaying;
    }

    if (isAudioPlaying) {
      // 1. Asosiy va kafolatlangan audio: mahalliy Ziyoda - Kelibdi fayli (sal pastroq sokin hajmda)
      if (audioTag) {
        audioTag.volume = currentVolume;
        var playPromise = audioTag.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            setMusicUIState(true);
          }).catch(function (err) {
            console.log("Audio autoplay cheklovi yoki xatolik:", err);
            showToast("Musiqani yoqish uchun pastdagi musiqa tugmasini bosing 🎵");
          });
        }
      }

      // 2. Agar YouTube mini pleeri ochilgan bo'lsa
      if (ytPlayer && ytPlayerReady && typeof ytPlayer.playVideo === "function") {
        try {
          ytPlayer.setVolume(Math.round(currentVolume * 100));
          ytPlayer.playVideo();
        } catch (e) {}
      }

      setMusicUIState(true);
    } else {
      if (audioTag) {
        try {
          audioTag.pause();
        } catch (e) {}
      }
      if (ytPlayer && typeof ytPlayer.pauseVideo === "function") {
        try {
          ytPlayer.pauseVideo();
        } catch (e) {}
      }
      setMusicUIState(false);
    }
  };

  // --- 5. Jonli Hisoblagich (Countdown Timer) ---
  function initCountdown() {
    var targetDate = new Date(TARGET_DATE_STRING).getTime();

    function update() {
      var now = new Date().getTime();
      var diff = targetDate - now;

      var daysEl = document.getElementById("cdDays");
      var hoursEl = document.getElementById("cdHours");
      var minutesEl = document.getElementById("cdMinutes");
      var secondsEl = document.getElementById("cdSeconds");

      if (diff <= 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minutesEl) minutesEl.innerText = "00";
        if (secondsEl) secondsEl.innerText = "00";
        var statusEl = document.getElementById("countdownStatus");
        if (statusEl) {
          statusEl.innerText = "🎉 Visol Oqshomi Boshlandi! Muborak bo'lsin!";
        }
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);

      var ds = d < 10 ? "0" + d : d;
      var hs = h < 10 ? "0" + h : h;
      var ms = m < 10 ? "0" + m : m;
      var ss = s < 10 ? "0" + s : s;

      if (daysEl && daysEl.innerText !== String(ds)) daysEl.innerText = ds;
      if (hoursEl && hoursEl.innerText !== String(hs)) hoursEl.innerText = hs;
      if (minutesEl && minutesEl.innerText !== String(ms)) minutesEl.innerText = ms;
      if (secondsEl) secondsEl.innerText = ss;
    }

    update();
    setInterval(update, 1000);
  }

  // --- 6. Tushayotgan Gul Barglari Animatsiyasi (Falling Petals Canvas) ---
  function initPetalsCanvas() {
    var canvas = document.getElementById("petalsCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    var petalCount = window.innerWidth < 600 ? 25 : 45;
    var petals = [];

    var colors = [
      "rgba(255, 183, 197, 0.75)",
      "rgba(244, 202, 211, 0.7)",
      "rgba(216, 169, 168, 0.75)",
      "rgba(255, 230, 235, 0.8)",
      "rgba(218, 165, 32, 0.6)"
    ];

    for (var i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 6,
        d: Math.random() * petalCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.03,
        tiltAngle: 0,
        speed: Math.random() * 1.5 + 0.8
      });
    }

    function draw() {
      if (!petalsRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < petalCount; i++) {
        var p = petals[i];
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 1 + p.r / 8) * p.speed * 0.5;
        p.x += Math.sin(p.tiltAngle) * 1.5;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.floor(Math.random() * 10) - 10;
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  // --- 7. Yuraklar Otilishi (Heart Confetti Burst) ---
  function burstHearts(originX, originY) {
    var count = 30;
    var container = document.body;

    for (var i = 0; i < count; i++) {
      var heart = document.createElement("div");
      heart.className = "floating-heart-burst";
      heart.innerHTML = ["❤️", "💖", "💐", "✨", "🌸", "💍"][Math.floor(Math.random() * 6)];
      heart.style.left = (originX || window.innerWidth / 2) + "px";
      heart.style.top = (originY || window.innerHeight / 2) + "px";
      heart.style.position = "fixed";
      heart.style.zIndex = "999999";
      heart.style.pointerEvents = "none";
      heart.style.fontSize = Math.floor(Math.random() * 20 + 16) + "px";

      var angle = Math.random() * Math.PI * 2;
      var dist = Math.random() * 220 + 60;
      var destX = Math.cos(angle) * dist;
      var destY = Math.sin(angle) * dist - 80;

      heart.style.transition = "all 1.6s cubic-bezier(0.25, 1, 0.5, 1)";
      container.appendChild(heart);

      (function (el, dx, dy) {
        setTimeout(function () {
          el.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.4)";
          el.style.opacity = "0";
        }, 20);
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 1700);
      })(heart, destX, destY);
    }
  }

  // --- 8. Taqvimga Saqlash (.ics fayl yuklash) ---
  window.downloadICS = function () {
    var icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Muhammadali & Hayotxon//Visol Oqshomi//UZ",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "SUMMARY:Muhammadali va Hayotxonning Visol Oqshomi",
      "DESCRIPTION:Ikki qalb, bir taqdir, bir umrga tutashgan muhabbat... Sizni visol oqshomimizda kutamiz!",
      "LOCATION:Xolmurod to\\'yxonasi\\, G62X+HJ2\\, Unnamed Road\\, Khayravat\\, Oʻzbekiston",
      "DTSTART:20261121T130000Z",
      "DTEND:20261121T180000Z",
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    var blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Muhammadali_Hayotxon_Visol_Oqshomi.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Taqvim fayli (.ics) yuklab olindi! Telefoningiz taqvimiga qo'shishingiz mumkin.");
  };

  // --- 9. Manzilni Nusxalash ---
  window.copyAddress = function () {
    var address = "Xolmurod to'yxonasi, G62X+HJ2, Unnamed Road, Khayravat, Oʻzbekiston";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(function () {
        showToast("Manzil nusxalandi: G62X+HJ2, Khayravat");
      });
    } else {
      var input = document.createElement("input");
      input.value = address;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      showToast("Manzil nusxalandi: G62X+HJ2, Khayravat");
    }
  };

  // --- 10. Toast Xabarnoma ---
  function showToast(msg) {
    var existing = document.getElementById("weddingToast");
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    var toast = document.createElement("div");
    toast.id = "weddingToast";
    toast.className = "wedding-toast";
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("show");
    }, 50);

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }, 3500);
  }

  // --- 11. Taklifnomani Yaqinlarga Ulashish ---
  window.shareInvitation = function (platform) {
    var url = window.location.href;
    var title = "Muhammadali & Hayotxon — Visol Oqshomi To'y Taklifnomasi";
    var text = "Ikki qalb, bir taqdir, bir umrga tutashgan muhabbat...\n" +
      "Muhammadali & Hayotxonning visol oqshomi to'y taklifnomasi.\n" +
      "📅 Sana: 21-22 noyabr, 18:00\n" +
      "📍 Manzil: Xolmurod to'yxonasi (G62X+HJ2, Khayravat)\n\n" +
      "Taklifnomani ko'rish uchun havola:\n" + url;

    if (platform === "telegram") {
      window.open("https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text), "_blank");
    } else if (platform === "whatsapp") {
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), "_blank");
    } else {
      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(function () {});
      } else {
        copyAddress();
      }
    }
  };

  // --- 12. Sahifa Yuklanganda Ishga Tushirish ---
  document.addEventListener("DOMContentLoaded", function () {
    initCountdown();
    initPetalsCanvas();

    // AOS animatsiyalarini faollashtirish
    if (window.AOS) {
      window.AOS.init({
        easing: "ease-out-cubic",
        duration: 900,
        once: false,
        offset: 50
      });
    }

    // Preloaderni yumshoq yashirish
    var preloader = document.querySelector(".preloader-wrapper");
    if (preloader) {
      setTimeout(function () {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 0.6s ease";
        setTimeout(function () {
          preloader.style.display = "none";
        }, 600);
      }, 500);
    }
  });

})();
