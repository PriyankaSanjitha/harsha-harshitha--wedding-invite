"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  Languages,
  Heart,
  ChevronDown,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";

const emptySubscribe = () => () => {};

export default function Home() {
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const weddingDate = new Date("2026-12-06T08:25:00+05:30");
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft((prev) => ({ ...prev, isFinished: true }));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLang = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLang((prev) => (prev === "en" ? "kn" : "en"));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openInvitation = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    scrollToSection("invitation");
  };

  const content = {
    en: {
      nav: {
        cover: "Home",
        invite: "Invitation",
        events: "Events",
        journey: "Our Journey",
        gallery: "Gallery",
        venue: "Venue",
      },
      hero: {
        taglineBadge: "A Love Story Begins...",
        quote1: "This is start of something beautiful...!",
        quote2: "Join us as we celebrate a journey written by destiny.",
        cta: "Open Our Invitation",
        stepInto: "Step into their forever ↓",
        date: "06 • December • 2026",
        city: "Bengaluru, Karnataka",
      },
      invitation: {
        badge: "The Sacred Union",
        auspicious: "|| ಶ್ರೀ ||",
        blessing:
          "With the divine blessings of Sri Giripura Anjaneya Swamy & Sri Jinnagaradamma Devi",
        inviteText:
          "Together with their families, cordially invite you to celebrate the joyous wedding ceremony of",
        groom: "Harsha",
        bride: "Harshitha",
        weddingDay: "Sunday, 06 December 2026",
        muhurthamTime: "Muhurtham: 8:25 AM – 9:25 AM (Dhanur Lagna)",
        countdownTitle: "Counting Down to Forever",
        days: "Days",
        hours: "Hours",
        mins: "Mins",
        secs: "Secs",
      },
      events: {
        title: "Wedding Celebrations",
        subtitle: "Join us for the auspicious events filled with joy & blessings",
        receptionTitle: "Grand Reception",
        receptionDate: "Saturday, 05 December 2026",
        receptionTime: "6:30 PM onwards",
        receptionDesc:
          "An evening of music, celebration, photography, and a lavish dinner.",
        muhurthamTitle: "Wedding Muhurtham",
        muhurthamDate: "Sunday, 06 December 2026",
        muhurthamTime: "8:25 AM – 9:25 AM (Dhanur Lagna)",
        muhurthamDesc:
          "Traditional Vedic wedding rites followed by breakfast and lunch.",
      },
      journey: {
        title: "Our Journey",
        subtitle: "From a chance meeting to a forever promise",
        quote:
          "“Two hearts that beat as one, guided by faith, embraced by family, and bound by destiny.”",
        story1Title: "A Serendipitous Beginning",
        story1Desc:
          "What began as a quiet smile soon became conversations that felt effortless and deep. With every shared dream and laughter, they realized they had found their home in each other.",
        story2Title: "Stepping Into Forever",
        story2Desc:
          "With the warm blessings of parents and loved ones, Harsha and Harshitha take this sacred step hand in hand, ready to begin the greatest adventure of their lives.",
      },
      gallery: {
        title: "Captured Moments",
        subtitle: "Glimpses of love, laughter, and timeless memories",
        tapHint: "Tap on any photo to view in full screen",
      },
      venue: {
        title: "Wedding Venue & Directions",
        subtitle: "We look forward to welcoming you with warm hearts",
        venueName: "S.V. Convention Centre",
        addressLine1: "No. 37/1, NICE Road Junction, Kanakapura Main Road,",
        addressLine2: "Behind KSSRDI, Talaghattapura, Bengaluru - 560109",
        mapsBtn: "Open in Google Maps",
        familyClosing:
          "With best compliments from near and dear ones & Relatives.",
      },
      footer: {
        couple: "Harsha ♥ Harshitha",
        subtext: "We eagerly look forward to celebrating with you!",
      },
    },
    kn: {
      nav: {
        cover: "ಮುಖಪುಟ",
        invite: "ಆಹ್ವಾನ",
        events: "ಕಾರ್ಯಕ್ರಮ",
        journey: "ಪಯಣ",
        gallery: "ಗ್ಯಾಲರಿ",
        venue: "ಸ್ಥಳ",
      },
      hero: {
        taglineBadge: "ಒಂದು ಸುಂದರ ಪ್ರೇಮಕಥೆಯ ಆರಂಭ...",
        quote1: "ಇದು ಒಂದು ಸುಂದರ ಬಂಧದ ಆರಂಭ...!",
        quote2:
          "ವಿಧಿಯಿಂದ ಬರೆಯಲ್ಪಟ್ಟ ಈ ಸುಂದರ ಪಯಣದ ಸಂಭ್ರಮದಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ.",
        cta: "ಆಹ್ವಾನ ಪತ್ರಿಕೆ ತೆರೆಯಿರಿ",
        stepInto: "ಅವರ ಪ್ರೇಮ ಪಯಣಕ್ಕೆ ಸ್ವಾಗತ ↓",
        date: "06 • ಡಿಸೆಂಬರ್ • 2026",
        city: "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ",
      },
      invitation: {
        badge: "ಪವಿತ್ರ ವಿವಾಹ ಮಹೋತ್ಸವ",
        auspicious: "|| ಶ್ರೀ ||",
        blessing:
          "ಶ್ರೀ ಗಿರಿಪುರ ಆಂಜನೇಯ ಸ್ವಾಮಿ ಹಾಗೂ ಶ್ರೀ ಜಿನ್ನಗರದಮ್ಮ ದೇವಿಯ ಕೃಪೆಯಿಂದ",
        inviteText:
          "ನಮ್ಮ ಕುಟುಂಬದವರೊಂದಿಗೆ ನಮ್ಮ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮ್ಮನ್ನು ಪ್ರೀತಿಪೂರ್ವಕವಾಗಿ ಆಹ್ವಾನಿಸುತ್ತೇವೆ",
        groom: "ಹರ್ಷ",
        bride: "ಹರ್ಷಿತಾ",
        weddingDay: "ಭಾನುವಾರ, 06 ಡಿಸೆಂಬರ್ 2026",
        muhurthamTime: "ಮದುವೆ ಮುಹೂರ್ತ: ಬೆಳಗ್ಗೆ 8:25 ರಿಂದ 9:25 ರವರೆಗೆ (ಧನುರ್ ಲಗ್ನ)",
        countdownTitle: "ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ಇನ್ನು",
        days: "ದಿನಗಳು",
        hours: "ಗಂಟೆಗಳು",
        mins: "ನಿಮಿಷಗಳು",
        secs: "ಸೆಕೆಂಡುಗಳು",
      },
      events: {
        title: "ವಿವಾಹ ಕಾರ್ಯಕ್ರಮಗಳು",
        subtitle: "ಮಂಗಳಕರ ಸಮಾರಂಭಗಳಲ್ಲಿ ಪಾಲ್ಗೊಂಡು ವಧು-ವರರನ್ನು ಆಶೀರ್ವದಿಸಿ",
        receptionTitle: "ಆರತಕ್ಷತೆ (Reception)",
        receptionDate: "ಶನಿವಾರ, 05 ಡಿಸೆಂಬರ್ 2026",
        receptionTime: "ಸಂಜೆ 6:30 ರಿಂದ",
        receptionDesc: "ಸಂಗೀತ ಸಂಭ್ರಮ, ಛಾಯಾಗ್ರಹಣ ಹಾಗೂ ಪ್ರೀತಿಯ ಪ್ರೀತಿಭೋಜನ.",
        muhurthamTitle: "ಮಾಂಗಲ್ಯ ಧಾರಣ ಮುಹೂರ್ತ",
        muhurthamDate: "ಭಾನುವಾರ, 06 ಡಿಸೆಂಬರ್ 2026",
        muhurthamTime: "ಬೆಳಗ್ಗೆ 8:25 ರಿಂದ 9:25 ರ ಶುಭ ಧನುರ್ ಲಗ್ನದಲ್ಲಿ",
        muhurthamDesc: "ಶಾಸ್ತ್ರೋಕ್ತ ಕಲ್ಯಾಣ ಮಹೋತ್ಸವ ಹಾಗೂ ಮಧ್ಯಾಹ್ನದ ಶುಭ ಭೋಜನ.",
      },
      journey: {
        title: "ನಮ್ಮ ಪ್ರೇಮ ಪಯಣ",
        subtitle: "ಒಂದು ಸುಂದರ ಭೇಟಿಯಿಂದ ಶಾಶ್ವತ ಬಾಂಧವ್ಯದ ಕಡೆಗೆ",
        quote:
          "“ಮನಸ್ಸುಗಳು ಒಂದಾಗಿ, ಸಂಪ್ರದಾಯದ ಬಂಧನದಲ್ಲಿ, ಪ್ರೀತಿಯ ಆಸರೆಯಲ್ಲಿ ಸಾಗುವ ಸುಂದರ ಪಯಣ.”",
        story1Title: "ಸುಂದರ ಆರಂಭ",
        story1Desc:
          "ಒಂದು ಸಣ್ಣ ಪರಿಚಯ, ಸುಂದರ ಸಂಭಾಷಣೆಗಳಾಗಿ ಮಾರ್ಪಟ್ಟು, ಒಬ್ಬರನ್ನೊಬ್ಬರು ಅರ್ಥಮಾಡಿಕೊಂಡಾಗ ಜೀವನದ ಸಂಗಾತಿಯಾಗಿ ಮುನ್ನಡೆಯುವ ಸಂಕಲ್ಪವಾಯಿತು.",
        story2Title: "ಸಪ್ತಪದಿಯ ಸಂಭ್ರಮ",
        story2Desc:
          "ತಂದೆ-ತಾಯಿ ಹಾಗೂ ಕುಟುಂಬದವರ ಹಾರೈಕೆಯೊಂದಿಗೆ ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ನೂತನ ಜೀವನದ ಹೊಸ್ತಿಲಿಗೆ ಹೆಜ್ಜೆ ಇಡುತ್ತಿದ್ದಾರೆ.",
      },
      gallery: {
        title: "ಮಧುರ ಕ್ಷಣಗಳು",
        subtitle: "ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ ಸುಂದರ ಚಿತ್ರಗಳು",
        tapHint: "ದೊಡ್ಡದಾಗಿ ವೀಕ್ಷಿಸಲು ಯಾವುದೇ ಚಿತ್ರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      },
      venue: {
        title: "ಕಲ್ಯಾಣ ಮಂಟಪ & ಮಾರ್ಗಸೂಚಿ",
        subtitle: "ತಮ್ಮ ಆಗಮನವನ್ನು ಪ್ರೀತಿಯಿಂದ ನಿರೀಕ್ಷಿಸುತ್ತೇವೆ",
        venueName: "ಎಸ್.ವಿ. ಕನ್ವೆನ್ಷನ್ ಸೆಂಟರ್",
        addressLine1: "ನಂ. 37/1, ನೈಸ್ ರೋಡ್ ಜಂಕ್ಷನ್, ಕನಕಪುರ ಮುಖ್ಯ ರಸ್ತೆ,",
        addressLine2: "ಕೆಎಸ್ಎಸ್ಆರ್‌ಡಿಐ ಹಿಂಭಾಗ, ತಲಘಟ್ಟಪುರ, ಬೆಂಗಳೂರು - 560109",
        mapsBtn: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
        familyClosing: "ಇಂತಿ ತಮ್ಮ ಆಗಮನ ನಿರೀಕ್ಷೆಯಲ್ಲಿ: ವಧು-ವರರು ಮತ್ತು ಕುಟುಂಬಸ್ಥರು.",
      },
      footer: {
        couple: "ಹರ್ಷ ♥ ಹರ್ಷಿತಾ",
        subtext: "ತಮ್ಮ ಪ್ರೀತಿಯ ಆಗಮನವನ್ನು ಹಾರ್ದಿಕವಾಗಿ ನಿರೀಕ್ಷಿಸುತ್ತೇವೆ!",
      },
    },
  };

  const t = content[lang];

  const galleryImages = [
    { src: "reflection.jpg", title: "Reflections of Love" },
    { src: "lotus-boat.jpg", title: "Serene Together" },
    { src: "splash-boat.jpg", title: "Joy & Splashes" },
    { src: "beach-story.jpg", title: "Sunset Stroll" },
    { src: "beach-run.jpg", title: "Laughter by the Waves" },
    { src: "flower-boat.jpg", title: "Floral Romance" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#331818]">
      {/* ─── TOP NAVIGATION BAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#250E0E]/90 backdrop-blur-md text-white border-b border-amber-300/20 py-3 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / Top Scroll Link */}
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-85 transition cursor-pointer text-left"
          >
            <span className="font-serif text-lg sm:text-xl font-bold text-[#FCE08B] tracking-wide">
              Harsha &amp; Harshitha
            </span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLang}
            className="bg-[#E2B755] hover:bg-[#FCE08B] text-[#250E0E] font-semibold px-4 py-1.5 rounded-full shadow-md text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer active:scale-95"
            aria-label="Switch Language"
          >
            <Languages size={15} />
            <span>{lang === "en" ? "ಕನ್ನಡ" : "English"}</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN SCROLLABLE CONTENT ─── */}
      <main className="w-full">
        {/* ══════════════════════════════════════════════════
            1. HERO / COVER LANDING SCREEN
        ══════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative min-h-screen w-full flex flex-col justify-between items-center text-center text-white px-6 pt-24 pb-12 overflow-hidden"
        >
          {/* Sacred Temple Kalyani / Lake Background with Royal Wedding Velvet Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/kalyani-stepwell.jpg"
              alt="Sacred Temple Kalyani"
              fill
              priority
              className="object-cover object-center transform scale-105 filter brightness-70 contrast-105"
            />
            {/* Rich Wedding Velvet & Gold Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#250808]/88 via-[#1C0505]/75 to-[#120202]/92" />
            <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-black/60" />
            
            {/* Corner subtle ornamental borders */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-amber-300/30 rounded-tl-xl hidden sm:block" />
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-amber-300/30 rounded-tr-xl hidden sm:block" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-amber-300/30 rounded-bl-xl hidden sm:block" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-amber-300/30 rounded-br-xl hidden sm:block" />
          </div>

          {/* Top Badge */}
          <div className="relative z-10 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/30 text-xs md:text-sm tracking-widest uppercase text-amber-200 shadow-lg">
              <Sparkles size={14} className="text-amber-300" />
              <span>{t.hero.taglineBadge}</span>
            </div>
          </div>

          {/* Center Titles, Quote & Open Invitation Button */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center my-auto py-6">
            <div className="space-y-2 mb-6">
              <p className="font-script text-3xl sm:text-4xl md:text-5xl text-amber-100/95 font-normal tracking-wide max-w-2xl leading-relaxed drop-shadow">
                {t.hero.quote1}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light tracking-wider">
                {t.hero.quote2}
              </p>
            </div>

            {/* ROYAL WEDDING WAX SEAL (Custom Symbol) */}
            <div className="my-6 relative flex flex-col items-center">
              <button
                type="button"
                onClick={openInvitation}
                className="group relative cursor-pointer focus:outline-none"
                aria-label="Royal Wedding Seal - Tap to open invitation"
              >
                {/* Outer Glow Halo */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] opacity-30 blur-md group-hover:opacity-65 transition duration-500" />

                {/* Small Wax Seal Medallion */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#3D1414] via-[#250909] to-[#140303] backdrop-blur-md border-2 border-[#E2B755] shadow-[0_0_20px_rgba(226,183,85,0.4)] group-hover:shadow-[0_0_30px_rgba(226,183,85,0.7)] flex flex-col items-center justify-center p-2 transition-all duration-300 transform group-hover:scale-108 active:scale-95">
                  {/* Outer Dotted Ornamental Ring */}
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-[#FCE08B]/45 pointer-events-none" />
                  {/* Inner Fine Ring */}
                  <div className="absolute inset-3 rounded-full border border-[#E2B755]/25 pointer-events-none" />

                  {/* Custom Wedding Monogram Symbol (Prominently Enlarged) */}
                  <div className="relative w-[78px] h-[60px] sm:w-[92px] sm:h-[72px] flex items-center justify-center">
                    <Image
                      src="/images/wedding-symbol.png"
                      alt="Wedding Monogram"
                      width={100}
                      height={76}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(252,224,139,0.9)] group-hover:scale-105 transition-transform"
                      priority
                    />
                  </div>
                </div>
              </button>
            </div>

            {/* OPEN INVITATION BUTTON */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={openInvitation}
                className="cursor-pointer group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-lg sm:text-xl font-semibold text-[#250E0E] bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] shadow-[0_4px_30px_rgba(226,183,85,0.55)] hover:shadow-[0_6px_40px_rgba(226,183,85,0.85)] transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-2 border-amber-200"
              >
                <Heart
                  size={20}
                  className="fill-[#7A1F1F] text-[#7A1F1F] group-hover:scale-125 transition-transform"
                />
                <span>{t.hero.cta}</span>
              </button>

              <button
                type="button"
                onClick={openInvitation}
                className="text-xs sm:text-sm text-amber-200/90 hover:text-white flex items-center gap-1.5 transition-colors pt-2 animate-bounce cursor-pointer"
              >
                <span>{t.hero.stepInto}</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Bottom City / Location tag */}
          <div className="relative z-10 text-xs text-gray-300/80">
            <span>{t.hero.city}</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            2. THE SACRED INVITATION & LIVE COUNTDOWN
        ══════════════════════════════════════════════════ */}
        <section
          id="invitation"
          className="relative py-24 px-6 flex flex-col justify-center items-center"
        >
          <div className="max-w-4xl w-full bg-white/95 rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-900/15 relative overflow-hidden text-center">
            {/* Auspicious Invocation */}
            <div className="inline-block px-4 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold tracking-widest uppercase mb-4">
              {t.invitation.badge}
            </div>

            <div className="text-amber-900 font-serif text-3xl font-bold my-2">
              {t.invitation.auspicious}
            </div>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#6B3E3E] font-medium leading-relaxed mt-2">
              {t.invitation.blessing}
            </p>

            <div className="my-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-20 bg-amber-700/30" />
              <Heart size={18} className="text-amber-700 fill-amber-700/20" />
              <div className="h-[1px] w-20 bg-amber-700/30" />
            </div>

            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto font-light leading-relaxed">
              {t.invitation.inviteText}
            </p>

            <div className="my-6">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#7A1F1F]">
                {t.invitation.groom} &amp; {t.invitation.bride}
              </h2>
              <p className="mt-3 font-serif text-xl sm:text-2xl text-amber-900 font-semibold">
                {t.invitation.weddingDay}
              </p>
              <p className="mt-1 text-sm sm:text-base text-gray-600 font-medium">
                {t.invitation.muhurthamTime}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="mt-8 pt-8 border-t border-amber-900/10">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#7A1F1F] mb-4">
                {t.invitation.countdownTitle}
              </h3>

              {isMounted && timeLeft.isFinished ? (
                <div className="text-2xl font-serif text-rose-700 font-bold">
                  Today is the Wedding Day! ❤️
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-md mx-auto">
                  {[
                    { label: t.invitation.days, val: isMounted ? timeLeft.days : 0 },
                    { label: t.invitation.hours, val: isMounted ? timeLeft.hours : 0 },
                    { label: t.invitation.mins, val: isMounted ? timeLeft.minutes : 0 },
                    { label: t.invitation.secs, val: isMounted ? timeLeft.seconds : 0 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50/70 rounded-2xl p-3 sm:p-4 border border-amber-200/80 shadow-sm flex flex-col items-center"
                    >
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F1F]">
                        {String(item.val).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gray-600 mt-1">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            3. WEDDING CELEBRATIONS & ITINERARY
        ══════════════════════════════════════════════════ */}
        <section
          id="events"
          className="relative py-20 px-6 flex flex-col justify-center items-center bg-[#F9F5EE]"
        >
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <span className="text-amber-800 text-xs font-semibold tracking-widest uppercase">
                {t.nav.events}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#7A1F1F] mt-1">
                {t.events.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                {t.events.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Reception Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-amber-900/10 hover:shadow-2xl transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-[#7A1F1F] flex items-center justify-center mb-5">
                    <Calendar size={24} />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F1F]">
                    {t.events.receptionTitle}
                  </h3>
                  <p className="text-gray-900 text-lg font-semibold mt-2">
                    {t.events.receptionDate}
                  </p>
                  <p className="flex items-center gap-2 text-amber-800 font-medium mt-2">
                    <Clock size={16} />
                    <span>{t.events.receptionTime}</span>
                  </p>
                  <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                    {t.events.receptionDesc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs text-gray-500">
                  <span>Traditional &amp; Festive</span>
                  <span className="text-[#7A1F1F] font-semibold">Dinner Included</span>
                </div>
              </div>

              {/* Muhurtham Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-900/15 hover:shadow-2xl transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-[#7A1F1F] flex items-center justify-center mb-5">
                    <Calendar size={24} />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F1F]">
                    {t.events.muhurthamTitle}
                  </h3>
                  <p className="text-gray-900 text-lg font-semibold mt-2">
                    {t.events.muhurthamDate}
                  </p>
                  <p className="flex items-center gap-2 text-rose-800 font-medium mt-2">
                    <Clock size={16} />
                    <span>{t.events.muhurthamTime}</span>
                  </p>
                  <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                    {t.events.muhurthamDesc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-rose-900/10 flex items-center justify-between text-xs text-gray-500">
                  <span>Auspicious Dhanur Lagna</span>
                  <span className="text-[#7A1F1F] font-semibold">Breakfast &amp; Lunch</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            4. OUR JOURNEY (Story with Photos)
        ══════════════════════════════════════════════════ */}
        <section
          id="journey"
          className="relative py-24 px-6 flex flex-col justify-center items-center"
        >
          <div className="max-w-5xl w-full">
            <div className="text-center mb-12">
              <span className="text-amber-800 text-xs font-semibold tracking-widest uppercase">
                {t.nav.journey}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#7A1F1F] mt-1">
                {t.journey.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto italic font-serif">
                {t.journey.quote}
              </p>
            </div>

            <div className="space-y-10">
              {/* Story Item 1: Lotus Boat */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 sm:h-84 w-full rounded-2xl overflow-hidden shadow-inner">
                  <Image
                    src="/images/lotus-boat.jpg"
                    alt="By the Lotus Pond"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-3 sm:px-4">
                  <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
                    Chapter I
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F1F]">
                    {t.journey.story1Title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {t.journey.story1Desc}
                  </p>
                </div>
              </div>

              {/* Story Item 2: Reflection */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3 sm:px-4 order-2 md:order-1">
                  <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
                    Chapter II
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F1F]">
                    {t.journey.story2Title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {t.journey.story2Desc}
                  </p>
                </div>
                <div className="relative h-64 sm:h-84 w-full rounded-2xl overflow-hidden shadow-inner order-1 md:order-2">
                  <Image
                    src="/images/reflection.jpg"
                    alt="Reflections of Togetherness"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            5. CAPTURED MOMENTS (Photo Gallery)
        ══════════════════════════════════════════════════ */}
        <section
          id="gallery"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#F9F5EE]"
        >
          <div className="max-w-5xl w-full">
            <div className="text-center mb-10">
              <span className="text-amber-800 text-xs font-semibold tracking-widest uppercase">
                {t.nav.gallery}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#7A1F1F] mt-1">
                {t.gallery.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2">
                {t.gallery.subtitle}
              </p>
              <p className="text-xs text-amber-800/80 mt-1 font-medium">
                {t.gallery.tapHint}
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(img.src)}
                  className="group relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 cursor-pointer bg-gray-200"
                >
                  <Image
                    src={`/images/${img.src}`}
                    alt={img.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="font-serif text-white text-sm sm:text-base tracking-wide drop-shadow">
                      {img.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            6. WEDDING VENUE & DIRECTIONS
        ══════════════════════════════════════════════════ */}
        <section
          id="venue"
          className="relative py-24 px-6 flex flex-col justify-center items-center"
        >
          <div className="max-w-4xl w-full bg-white/95 rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-900/15 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 text-[#7A1F1F] mb-4">
              <MapPin size={28} />
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#7A1F1F]">
              {t.venue.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              {t.venue.subtitle}
            </p>

            <div className="my-6 py-6 border-y border-amber-900/10">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                {t.venue.venueName}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
                {t.venue.addressLine1}
                <br />
                {t.venue.addressLine2}
              </p>

              {/* Direct Google Maps Action Button */}
              <div className="mt-6">
                <a
                  href="https://maps.app.goo.gl/JkBY1LKde4m9sWLs7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#7A1F1F] hover:bg-[#5C1616] text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                >
                  <MapPin size={18} />
                  <span>{t.venue.mapsBtn}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="my-6 rounded-2xl overflow-hidden shadow-inner border border-gray-200 h-64 sm:h-80 w-full bg-gray-100">
              <iframe
                title="S.V. Convention Centre Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.378772093414!2d77.5372337750749!3d12.883350987424195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f7ec1f39be9%3A0x6b403d6d035414f!2sS.V.%20Convention%20Centre!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Family Closing Greetings */}
            <p className="font-serif italic text-[#7A1F1F] text-base sm:text-lg mt-6">
              {t.venue.familyClosing}
            </p>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-[#250E0E] text-white border-t border-amber-300/20 text-center px-6">
        <p className="font-serif italic text-2xl text-[#FCE08B]">
          {t.footer.couple}
        </p>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          {t.footer.subtext}
        </p>
      </footer>

      {/* ─── FULLSCREEN PHOTO LIGHTBOX MODAL ─── */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            aria-label="Close photo"
          >
            <X size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={`/images/${selectedPhoto}`}
              alt="Enlarged wedding photograph"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}