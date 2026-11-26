"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Languages,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink,
  CalendarPlus,
  Volume2,
  VolumeX,
} from "lucide-react";

const emptySubscribe = () => () => {};

interface WishItem {
  id: string;
  name: string;
  relation: string;
  tag: string;
  message: string;
  likes: number;
  createdAt: string;
  isCustom?: boolean;
}

const VENUE_LOCATION =
  "S.V. Convention Centre, No. 37/1, NICE Road Junction, Kanakapura Main Road, Behind KSSRDI, Talaghattapura, Bengaluru - 560109";

const createUniqueId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}`;
};

const getGoogleCalendarUrl = (event: {
  title: string;
  details: string;
  location: string;
  start: string;
  end: string;
}) => {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("dates", `${event.start}/${event.end}`);
  url.searchParams.set("details", event.details);
  url.searchParams.set("location", event.location);
  url.searchParams.set("ctz", "Asia/Kolkata");
  return url.toString();
};

const initialWishes: WishItem[] = [
  {
    id: "wish-1",
    name: "Kiran & Priya",
    relation: "Family",
    tag: "🌸 Shubh Vivah",
    message:
      "Wishing Harsha and Harshitha a lifetime of boundless laughter, harmony, and togetherness! Cannot wait to celebrate with you both!",
    likes: 14,
    createdAt: "Yesterday",
  },
  {
    id: "wish-2",
    name: "ರಾಘವೇಂದ್ರ & ಕುಟುಂಬ",
    relation: "ಕುಟುಂಬಸ್ಥರು",
    tag: "✨ ದೈವಿಕ ಆಶೀರ್ವಾದ",
    message:
      "ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ಅವರಿಗೆ ಶ್ರೀ ಗಿರಿಪುರ ಆಂಜನೇಯ ಸ್ವಾಮಿ ಹಾಗೂ ಶ್ರೀ ಜಿನ್ನಗರದಮ್ಮ ದೇವಿಯ ಕೃಪೆಯಿರಲಿ. ನಿಮ್ಮ ದಾಂಪತ್ಯ ಜೀವನ ಸದಾ ಸುಖಮಯವಾಗಿರಲಿ!",
    likes: 21,
    createdAt: "2 days ago",
  },
  {
    id: "wish-3",
    name: "Sandeep & College Gang",
    relation: "Friends of Groom",
    tag: "🎉 Cheers & Celebrations",
    message:
      "From college hostel night-outs to the big wedding stage! So immensely proud and happy for you Harsha brother, and a warm welcome to Harshitha!",
    likes: 18,
    createdAt: "3 days ago",
  },
  {
    id: "wish-4",
    name: "ಅನಿತಾ & ತಂಡ",
    relation: "ವಧುವಿನ ಸ್ನೇಹಿತರು",
    tag: "💖 ಪ್ರೀತಿಯ ಹಾರೈಕೆ",
    message:
      "ನಮ್ಮ ಪ್ರೀತಿಯ ಹರ್ಷಿತಾಳಿಗೆ ಅತ್ಯಂತ ಸಂತೋಷದ ಶುಭ ಹಾರೈಕೆಗಳು! ನೀವು ಇಬ್ಬರೂ ಒಬ್ಬರಿಗೊಬ್ಬರು ಅತ್ಯಂತ ಹೊಂದಾಣಿಕೆಯ ಸುಂದರ ಜೋಡಿ.",
    likes: 16,
    createdAt: "4 days ago",
  },
];

function GoldTeardrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 C12 2, 3 14, 3 20 C3 25 7 29 12 29 C17 29 21 25 21 20 C21 14, 12 2, 12 2 Z"
        fill="url(#goldTearGrad)"
      />
      <defs>
        <linearGradient
          id="goldTearGrad"
          x1="5"
          y1="2"
          x2="19"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F5E3B3" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#AA771C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GoldScratchCard({
  title,
  date,
  time,
  bottomHint,
  isRevealedText,
  isKannada = false,
}: {
  title: string;
  date: string;
  time: string;
  bottomHint: string;
  isRevealedText: string;
  isKannada?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const isDrawingRef = useRef(false);
  const scratchCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Subtle, Classy Champagne Gold Foil Gradient (Muted luxury satin, not brassy yellow)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#C8B08A");
    gradient.addColorStop(0.25, "#EFE6D5");
    gradient.addColorStop(0.5, "#BFA175");
    gradient.addColorStop(0.75, "#D8C7AA");
    gradient.addColorStop(1, "#9C7E52");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle, gentle satin texture noise
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let i = 0; i < 160; i++) {
      const rx = (Math.sin(i * 71) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 37) * 0.5 + 0.5) * height;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Classy fine double border
    ctx.strokeStyle = "rgba(252, 245, 232, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = "rgba(130, 100, 65, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Helper to draw delicate diamond shape beside text
    const drawDiamond = (cx: number, cy: number, r: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.7, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.7, cy);
      ctx.closePath();
      ctx.fillStyle = "#5A3810";
      ctx.fill();
      ctx.restore();
    };

    // Card Text in Richer, Darker Antique Bronze Gold with Italic Script Style
    ctx.save();
    ctx.shadowColor = "rgba(255, 248, 230, 0.4)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = "#4A2F0F";
    ctx.font = isKannada
      ? "bold 16px 'Playfair Display', serif"
      : "italic 20px 'Great Vibes', cursive, 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      isKannada ? "ತಿಳಿಯಲು ಒತ್ತಿ" : "Scratch to Reveal",
      width / 2,
      height / 2 - 10
    );

    // Diamonds on left and right of "Scratch to Reveal"
    const diamondOffset = isKannada ? 74 : 88;
    drawDiamond(width / 2 - diamondOffset, height / 2 - 10, 5);
    drawDiamond(width / 2 + diamondOffset, height / 2 - 10, 5);

    ctx.fillStyle = "#5E3D15";
    ctx.font = "italic 13px 'Playfair Display', serif";
    ctx.fillText(title, width / 2, height / 2 + 16);
    ctx.restore();
  }, [title, isKannada]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchCountRef.current += 1;
    if (scratchCountRef.current > 24 && !isScratched) {
      setIsScratched(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[270px] sm:max-w-[300px] mx-auto">
      {/* The Interactive Scratch Card with Soft Gold Shadow & White/Beige Card */}
      <div
        className={`relative w-full h-52 sm:h-58 rounded-2xl sm:rounded-3xl overflow-hidden select-none transition-all duration-700 ease-out ${
          isScratched
            ? "shadow-[0_14px_40px_rgba(201,147,43,0.3)] border-2 border-[#D4AF37] scale-[1.02] bg-[#FCFAF6] text-[#2B1B17]"
            : "shadow-[0_10px_30px_rgba(201,147,43,0.2)] border-2 border-[#E2C799]/50 bg-[#FCFAF6] text-[#2B1B17]"
        }`}
      >
        {/* UNDERNEATH REVEALED CONTENT (White/Beige card, no calendar icon, no 'The Date', no venue) */}
        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-center text-center items-center z-0 space-y-2">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-wide">
              {title}
            </h4>
            <div className="h-[1px] w-12 bg-[#C9932B]/40 mx-auto my-2" />

            {/* Date in Gold Italic Script (similar to bride & groom names) */}
            <p
              className={`font-script text-2xl sm:text-3xl text-[#A6781D] font-normal leading-tight drop-shadow-sm ${
                isKannada
                  ? "font-serif italic font-bold text-lg sm:text-xl"
                  : ""
              }`}
            >
              {date}
            </p>

            <p className="text-[11px] sm:text-xs text-neutral-600 mt-1.5 flex items-center justify-center gap-1.5 font-medium">
              <Clock size={13} className="text-[#C9932B]" />
              <span>{time}</span>
            </p>
          </div>
        </div>

        {/* ELEGANT GOLDEN LIGHT SHEEN & AURA SWEEP ON REVEAL */}
        {isScratched && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden transition-opacity duration-1000">
            {/* Soft Ambient Golden Halo Bloom */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,224,139,0.25)_0%,transparent_70%)] animate-pulse" />
            {/* Diagonal Golden Light Sheen sweep across card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent -skew-x-12 animate-[shimmer_1.5s_ease-out_forwards]" />
            {/* Delicate Micro-Glimmers */}
            <span className="absolute top-3 right-5 text-[#C9932B] text-xs opacity-75 animate-pulse">✦</span>
            <span className="absolute bottom-4 left-5 text-[#C9932B] text-xs opacity-75 animate-pulse">✦</span>
            <span className="absolute top-1/2 left-3 text-[#D4AF37] text-[10px] opacity-60 animate-ping">✧</span>
            <span className="absolute top-1/3 right-4 text-[#D4AF37] text-[10px] opacity-60 animate-ping">✧</span>
          </div>
        )}

        {/* TOP CLASSY SUBTLE GOLD SCRATCH CANVAS LAYER */}
        <canvas
          ref={canvasRef}
          width={300}
          height={232}
          onPointerDown={(e) => {
            isDrawingRef.current = true;
            handlePointer(e);
          }}
          onPointerMove={(e) => {
            if (isDrawingRef.current) handlePointer(e);
          }}
          onPointerUp={() => {
            isDrawingRef.current = false;
          }}
          onPointerLeave={() => {
            isDrawingRef.current = false;
          }}
          className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 touch-none cursor-crosshair ${
            isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      </div>

      {/* BELOW THE CARD: "SWIPE YOUR FINGER ACROSS THE GOLD" / "SEE YOU THERE ✨" */}
      <div className="mt-3 flex flex-col items-center text-center">
        <p className="font-sans font-light tracking-[0.18em] text-[10px] sm:text-[11px] text-neutral-600 uppercase">
          {isScratched ? isRevealedText : bottomHint}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [isOpened, setIsOpened] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  // Wishes Wall State
  const [wishesList, setWishesList] = useState<WishItem[]>(initialWishes);
  const [newWishName, setNewWishName] = useState("");
  const [newWishRelation, setNewWishRelation] = useState("");
  const [newWishTag, setNewWishTag] = useState("");
  const [newWishMessage, setNewWishMessage] = useState("");
  const [likedWishIds, setLikedWishIds] = useState<string[]>([]);

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

  // Hydrate Wishes from Cloud Database with LocalStorage Fallback
  useEffect(() => {
    let isCancelled = false;

    // 1. Fetch real-time cloud wishes with no-store cache
    const loadCloudWishes = () => {
      fetch("/api/wishes", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled && data.isCloud && Array.isArray(data.wishes) && data.wishes.length > 0) {
            const cloudFormatted: WishItem[] = data.wishes.map((w: {
              id: string;
              name: string;
              relation: string;
              tag: string;
              message: string;
              likes?: number;
            }) => ({
              id: w.id,
              name: w.name,
              relation: w.relation,
              tag: w.tag,
              message: w.message,
              likes: w.likes ?? 1,
              createdAt: lang === "kn" ? "ಈಗಷ್ಟೇ" : "Recently",
              isCustom: true,
            }));

            setWishesList((prev) => {
              const cloudIds = new Set(cloudFormatted.map((f) => f.id));
              const nonDuplicatePresets = prev.filter((p) => !cloudIds.has(p.id) && !p.isCustom);
              return [...cloudFormatted, ...nonDuplicatePresets];
            });
          }
        })
        .catch(() => {
          // Fall back to localStorage below
        });
    };

    loadCloudWishes();
    const pollInterval = setInterval(loadCloudWishes, 12000);

    // 2. Hydrate from localStorage for offline / preset support
    const timer = setTimeout(() => {
      try {
        const savedWishes = localStorage.getItem("harsha_harshitha_wishes");
        if (savedWishes) {
          const parsedWishes = JSON.parse(savedWishes);
          if (Array.isArray(parsedWishes) && parsedWishes.length > 0) {
            setWishesList((prev) => {
              // Only overwrite if cloud hasn't populated yet
              if (prev.some((p) => p.isCustom)) return prev;
              return parsedWishes;
            });
          }
        }
        const savedLikes = localStorage.getItem("harsha_harshitha_liked_wishes");
        if (savedLikes) {
          setLikedWishIds(JSON.parse(savedLikes));
        }
      } catch {
        // Ignore localStorage errors
      }
    }, 0);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
      clearTimeout(timer);
    };
  }, [lang]);

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

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const openInvitation = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsRevealing(true);
    setIsOpened(true);

    // Auto-play Pesumale instrumental on user interaction gesture
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // Slow, cinematic reveal transition into the invitation
    setTimeout(() => {
      const element = document.getElementById("invitation");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => {
        setIsRevealing(false);
      }, 1200);
    }, 280);
  };

  const content = {
    en: {
      nav: {
        cover: "Home",
        invite: "Invitation",
        saveTheDate: "Save The Date",
        countdown: "Countdown",
        note: "A Note For You",
        gallery: "Gallery",
        venue: "Venue",
        wishes: "Wishes Wall",
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
        auspicious: "|| ಶ್ರೀ ||",
        blessing:
          "With the divine blessings of Sri Giripura Anjaneya Swamy & Sri Jinnagaradamma Devi",
        weddingOfHeading: "THE WEDDING OF",
        groom: "Harsha",
        bride: "Harshitha",
        invitationHeading: "THE INVITATION",
        togetherWithFamilies: "Together with their families,",
        groomsParents: "Smt. Gowramma T. & Sri. Rajanna H.T.",
        bridesParents: "Smt. Lalitha H.C. & Sri. Mohan Kumar D.",
        andSeparator: "and",
        cordiallyInvite:
          "Cordially invite you to celebrate the wedding of their children",
        weddingDay: "Sunday, 06 December 2026",
        muhurthamTime: "Muhurtham: 8:25 AM – 9:25 AM (Dhanur Lagna)",
      },
      saveTheDate: {
        badge: "The Date",
        title: "Save the Date",
        tagline: "Scratch the gold to unveil our special day",
        swipeBottomHint: "SWIPE YOUR FINGER ACROSS THE GOLD",
        revealedBadge: "✨ SEE YOU THERE ✨",
        receptionCardTitle: "Reception",
        receptionCardDate: "Saturday, 05 December 2026",
        receptionCardTime: "6:30 PM onwards",
        muhurthamCardTitle: "Muhurtham",
        muhurthamCardDate: "Sunday, 06 December 2026",
        muhurthamCardTime: "8:25 AM – 9:25 AM (Dhanur Lagna)",
      },
      countdown: {
        badge: "Counting Down",
        subline1: "A Lifetime of Togetherness",
        subline2: "Begins with one sacred step",
        days: "Days",
        hours: "Hours",
        mins: "Mins",
        secs: "Secs",
        addToCalendarBtn: "Add to Calendar",
      },
      note: {
        badge: "A LITTLE NOTE FOR YOU",
        title: "From our Hearts",
        hook1: "A forever worth celebrating",
        hook2: "And so, a beautiful journey begins…",
        p1: "There are milestones in life that deserve to be celebrated with all our hearts. Moments that bring families closer, friendships together and happiness beyond words.",
        p2: "Our wedding is one such moment — a celebration of love, trust, tradition and the promise of a lifetime.",
        p3: "As we take our vows and begin our journey together, we carry the blessings of our loved ones and the dreams of a beautiful future.",
        p4: "We would be honoured by your presence as we celebrate this unforgettable occasion.",
        signature: "Harsha R & Harshitha DM",
        closing: "One beautiful day. One sacred bond. One lifetime of memories.",
      },
      gallery: {
        title: "Captured Moments",
        subtitle: "Glimpses of love, laughter, and timeless memories",
        tapHint: "Tap on any photo to view in full screen",
      },
      venue: {
        badge: "THE VENUE",
        title: "Wedding Venue & Directions",
        subtitle: "We look forward to welcoming you with warm hearts",
        venueName: "S.V. Convention Centre",
        addressLine1: "No. 37/1, NICE Road Junction, Kanakapura Main Road,",
        addressLine2: "Behind KSSRDI, Talaghattapura, Bengaluru - 560109",
        mapsBtn: "Open in Google Maps",
        familyClosing:
          "With best compliments from near and dear ones & Relatives.",
      },
      wishes: {
        badge: "Guestbook",
        title: "Blessings & Wishes Wall",
        subtitle:
          "Share your love, memories, and warm blessings for Harsha & Harshitha.",
        formTitle: "Send Your Blessings to the Couple",
        nameLabel: "Your Name",
        namePlaceholder: "Your Name",
        relationLabel: "Relationship to Couple:",
        relations: [
          "Family",
          "Friend of Groom",
          "Friend of Bride",
          "Colleague",
          "Well Wisher",
        ],
        tagLabel: "Blessing Theme:",
        tags: [
          "🌸 Shubh Vivah",
          "✨ Divine Blessings",
          "💖 Endless Love",
          "🎉 Cheers & Joy",
        ],
        msgLabel: "Heartfelt Message",
        msgPlaceholder: "Write your heartfelt blessing or memory here...",
        postBtn: "Post Blessing",
        likeLabel: "Loves",
        justNow: "Just now",
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
        saveTheDate: "ದಿನಾಂಕ",
        countdown: "ದಿನಗಣನೆ",
        note: "ಪ್ರೀತಿಯ ಸಂದೇಶ",
        gallery: "ಗ್ಯಾಲರಿ",
        venue: "ಸ್ಥಳ",
        wishes: "ಹಾರೈಕೆಗಳು",
      },
      hero: {
        taglineBadge: "ಒಂದು ಸುಂದರ ಪ್ರೇಮಕಥೆಯ ಆರಂಭ...",
        quote1: "ಒಂದು ಸುಂದರ ಬಂಧದ ಆರಂಭ...!",
        quote2:
          "ವಿಧಿಯಿಂದ ಬರೆಯಲ್ಪಟ್ಟ ಈ ಸುಂದರ ಪಯಣದ ಸಂಭ್ರಮದಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ.",
        cta: "ಆಹ್ವಾನ ಪತ್ರಿಕೆ ತೆರೆಯಿರಿ",
        stepInto: "ಅವರ ಪ್ರೇಮ ಪಯಣಕ್ಕೆ ಸ್ವಾಗತ ↓",
        date: "06 • ಡಿಸೆಂಬರ್ • 2026",
        city: "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ",
      },
      invitation: {
        auspicious: "|| ಶ್ರೀ ||",
        blessing:
          "ಶ್ರೀ ಗಿರಿಪುರ ಆಂಜನೇಯ ಸ್ವಾಮಿ ಹಾಗೂ ಶ್ರೀ ಜಿನ್ನಗರದಮ್ಮ ದೇವಿಯ ಕೃಪೆಯಿಂದ",
        weddingOfHeading: "ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವ",
        groom: "ಹರ್ಷ",
        bride: "ಹರ್ಷಿತಾ",
        invitationHeading: "ಆಹ್ವಾನ ಪತ್ರಿಕೆ",
        togetherWithFamilies: "ತಮ್ಮ ಕುಟುಂಬದವರೊಂದಿಗೆ,",
        groomsParents: "ಶ್ರೀಮತಿ ಗೌರಮ್ಮ ಟಿ. & ಶ್ರೀ ರಾಜಣ್ಣ ಹೆಚ್.ಟಿ.",
        bridesParents: "ಶ್ರೀಮತಿ ಲಲಿತಾ ಹೆಚ್.ಸಿ. & ಶ್ರೀ ಮೋಹನ್ ಕುಮಾರ್ ಡಿ.",
        andSeparator: "ಹಾಗೂ",
        cordiallyInvite:
          "ತಮ್ಮ ಮಕ್ಕಳ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮ್ಮನ್ನು ಪ್ರೀತಿಪೂರ್ವಕವಾಗಿ ಆಹ್ವಾನಿಸುತ್ತಾರೆ",
        weddingDay: "ಭಾನುವಾರ, 06 ಡಿಸೆಂಬರ್ 2026",
        muhurthamTime: "ಮದುವೆ ಮುಹೂರ್ತ: ಬೆಳಗ್ಗೆ 8:25 ರಿಂದ 9:25 ರವರೆಗೆ (ಧನುರ್ ಲಗ್ನ)",
      },
      saveTheDate: {
        badge: "ದಿನಾಂಕ",
        title: "ಶುಭ ದಿನದ ಆಗಮನ",
        tagline: "ನಮ್ಮ ವಿಶೇಷ ದಿನಾಂಕವನ್ನು ತಿಳಿಯಲು ಚಿನ್ನದ ಹೊದಿಕೆಯನ್ನು ಒತ್ತಿ",
        swipeBottomHint: "ಚಿನ್ನದ ಹೊದಿಕೆಯನ್ನು ಒತ್ತಿ ಅಥವಾ ಸ್ಲೈಡ್ ಮಾಡಿ",
        revealedBadge: "✨ ಸಂಭ್ರಮದಲ್ಲಿ ಭೇಟಿಯಾಗೋಣ ✨",
        receptionCardTitle: "ಆರತಕ್ಷತೆ",
        receptionCardDate: "ಶನಿವಾರ, 05 ಡಿಸೆಂಬರ್ 2026",
        receptionCardTime: "ಸಂಜೆ 6:30 ರಿಂದ",
        muhurthamCardTitle: "ಮುಹೂರ್ತ",
        muhurthamCardDate: "ಭಾನುವಾರ, 06 ಡಿಸೆಂಬರ್ 2026",
        muhurthamCardTime: "ಬೆಳಗ್ಗೆ 8:25 ರಿಂದ 9:25 (ಧನುರ್ ಲಗ್ನ)",
      },
      countdown: {
        badge: "ದಿನಗಣನೆ",
        subline1: "ಶಾಶ್ವತ ಬಾಂಧವ್ಯದ ಸುಂದರ ಪಯಣ",
        subline2: "ಒಂದು ಪವಿತ್ರ ಹೆಜ್ಜೆಯೊಂದಿಗೆ ಆರಂಭವಾಗುತ್ತದೆ",
        days: "ದಿನಗಳು",
        hours: "ಗಂಟೆಗಳು",
        mins: "ನಿಮಿಷಗಳು",
        secs: "ಸೆಕೆಂಡುಗಳು",
        addToCalendarBtn: "ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ",
      },
      note: {
        badge: "ನಿಮಗಾಗಿ ಒಂದು ಪ್ರೀತಿಯ ಸಂದೇಶ",
        title: "ನಮ್ಮ ಹೃದಯದಾಳದಿಂದ",
        hook1: "ಜೀವಮಾನವಿಡೀ ಸಂಭ್ರಮಿಸುವ ಸುಂದರ ಬಂಧ",
        hook2: "ಹಾಗೂ ಒಂದು ಸುಂದರ ಪಯಣ ಆರಂಭವಾಗುತ್ತಿದೆ…",
        p1: "ಜೀವನದಲ್ಲಿ ಕೆಲವು ಮಹತ್ವದ ಕ್ಷಣಗಳು ನಮ್ಮ ಸಂಪೂರ್ಣ ಹೃದಯದಿಂದ ಆಚರಿಸಲು ಯೋಗ್ಯವಾಗಿರುತ್ತವೆ. ಕುಟುಂಬಗಳನ್ನು ಹತ್ತಿರ ತರುವ, ಸ್ನೇಹವನ್ನು ಒಂದುಗೂಡಿಸುವ ಮತ್ತು ಮಾತುಗಳಿಗೆ ಮೀರಿದ ಸಂತೋಷವನ್ನು ನೀಡುವ ಕ್ಷಣಗಳಿವು.",
        p2: "ನಮ್ಮ ವಿವಾಹವು ಅಂತಹ ಒಂದು ಪವಿತ್ರ ಕ್ಷಣ — ಪ್ರೀತಿ, ನಂಬಿಕೆ, ಸಂಪ್ರದಾಯ ಮತ್ತು ಜೀವಮಾನದ ಭರವಸೆಯ ಸಂಭ್ರಮ.",
        p3: "ನಾವು ಸಪ್ತಪದಿ ತುಳಿದು ಹೊಸ ಜೀವನದ ಪಯಣವನ್ನು ಆರಂಭಿಸುವಾಗ, ನಮ್ಮ ಹಿರಿಯರ, ಆಪ್ತರ ಆಶೀರ್ವಾದ ಹಾಗೂ ಸುಂದರ ಭವಿಷ್ಯದ ಕನಸುಗಳನ್ನು ನಮ್ಮೊಂದಿಗೆ ಕೊಂಡೊಯ್ಯುತ್ತಿದ್ದೇವೆ.",
        p4: "ಈ ಮರೆಯಲಾಗದ ಸಂಭ್ರಮದಲ್ಲಿ ತಮ್ಮ ಉಪಸ್ಥಿತಿಯು ನಮಗೆ ಅತ್ಯಂತ ಗೌರವ ಮತ್ತು ಸಂತೋಷವನ್ನು ತರುತ್ತದೆ.",
        signature: "ಹರ್ಷ ಆರ್ & ಹರ್ಷಿತಾ ಡಿ.ಎಂ.",
        closing: "ಒಂದು ಸುಂದರ ದಿನ. ಒಂದು ಪವಿತ್ರ ಬಂಧ. ಜೀವಮಾನದ ನೆನಪುಗಳು.",
      },
      gallery: {
        title: "ಮಧುರ ಕ್ಷಣಗಳು",
        subtitle: "ನೆನಪಿನಲ್ಲಿ ಉಳಿಯುವ ಸುಂದರ ಚಿತ್ರಗಳು",
        tapHint: "ದೊಡ್ಡದಾಗಿ ವೀಕ್ಷಿಸಲು ಯಾವುದೇ ಚಿತ್ರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
      },
      venue: {
        badge: "ಸ್ಥಳ & ಮಾರ್ಗಸೂಚಿ",
        title: "ಕಲ್ಯಾಣ ಮಂಟಪ & ಮಾರ್ಗಸೂಚಿ",
        subtitle: "ತಮ್ಮ ಆಗಮನವನ್ನು ಪ್ರೀತಿಯಿಂದ ನಿರೀಕ್ಷಿಸುತ್ತೇವೆ",
        venueName: "ಎಸ್.ವಿ. ಕನ್ವೆನ್ಷನ್ ಸೆಂಟರ್",
        addressLine1: "ನಂ. 37/1, ನೈಸ್ ರೋಡ್ ಜಂಕ್ಷನ್, ಕನಕಪುರ ಮುಖ್ಯ ರಸ್ತೆ,",
        addressLine2: "ಕೆಎಸ್ಎಸ್ಆರ್‌ಡಿಐ ಹಿಂಭಾಗ, ತಲಘಟ್ಟಪುರ, ಬೆಂಗಳೂರು - 560109",
        mapsBtn: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
        familyClosing: "ಇಂತಿ ತಮ್ಮ ಆಗಮನ ನಿರೀಕ್ಷೆಯಲ್ಲಿ: ವಧು-ವರರು ಮತ್ತು ಕುಟುಂಬಸ್ಥರು.",
      },
      wishes: {
        badge: "ಹಾರೈಕೆಗಳು & ಆಶೀರ್ವಾದ",
        title: "ಅತಿಥಿಗಳ ಹಾರೈಕೆಗಳ ವೇದಿಕೆ",
        subtitle:
          "ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ಅವರ ನೂತನ ದಾಂಪತ್ಯ ಜೀವನಕ್ಕೆ ನಿಮ್ಮ ಹೃತ್ಪೂರ್ವಕ ಹಾರೈಕೆಗಳನ್ನು ತಿಳಿಸಿ.",
        formTitle: "ನಿಮ್ಮ ಹಾರೈಕೆಯನ್ನು ಬರೆಯಿರಿ",
        nameLabel: "ನಿಮ್ಮ ಹೆಸರು",
        namePlaceholder: "ನಿಮ್ಮ ಹೆಸರು",
        relationLabel: "ಬಾಂಧವ್ಯ:",
        relations: [
          "ಕುಟುಂಬಸ್ಥರು",
          "ವರನ ಸ್ನೇಹಿತರು",
          "ವಧುವಿನ ಸ್ನೇಹಿತರು",
          "ಸಹೋದ್ಯೋಗಿಗಳು",
          "ಹಿತೈಷಿಗಳು",
        ],
        tagLabel: "ಹಾರೈಕೆಯ ವಿಧ:",
        tags: [
          "🌸 ಶುಭ ವಿವಾಹ",
          "✨ ದೈವಿಕ ಆಶೀರ್ವಾದ",
          "💖 ಪ್ರೀತಿಯ ಹಾರೈಕೆ",
          "🎉 ಸಂಭ್ರಮದ ಶುಭಾಶಯ",
        ],
        msgLabel: "ಹೃತ್ಪೂರ್ವಕ ಸಂದೇಶ",
        msgPlaceholder: "ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ಅವರಿಗೆ ನಿಮ್ಮ ಪ್ರೀತಿಯ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ...",
        postBtn: "ಹಾರೈಕೆ ಪ್ರಕಟಿಸಿ",
        likeLabel: "ಹಾರೈಕೆಗಳು",
        justNow: "ಈಗಷ್ಟೇ",
      },
      footer: {
        couple: "ಹರ್ಷ ♥ ಹರ್ಷಿತಾ",
        subtext: "ತಮ್ಮ ಪ್ರೀತಿಯ ಆಗಮನವನ್ನು ಹಾರ್ದಿಕವಾಗಿ ನಿರೀಕ್ಷಿಸುತ್ತೇವೆ!",
      },
    },
  };

  const t = content[lang];

  // Wishes Handlers
  const handlePostWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;

    const chosenRelation = newWishRelation || t.wishes.relations[0];
    const chosenTag = newWishTag || t.wishes.tags[0];

    const newWish: WishItem = {
      id: createUniqueId("wish"),
      name: newWishName.trim(),
      relation: chosenRelation,
      tag: chosenTag,
      message: newWishMessage.trim(),
      likes: 1,
      createdAt: lang === "kn" ? "ಈಗಷ್ಟೇ" : "Just now",
      isCustom: true,
    };

    const updated = [newWish, ...wishesList];
    setWishesList(updated);
    setLikedWishIds((prev) => [...prev, newWish.id]);
    setNewWishName("");
    setNewWishMessage("");
    setNewWishRelation("");
    setNewWishTag("");

    try {
      localStorage.setItem("harsha_harshitha_wishes", JSON.stringify(updated));
      localStorage.setItem(
        "harsha_harshitha_liked_wishes",
        JSON.stringify([...likedWishIds, newWish.id])
      );
    } catch {
      // Ignore
    }

    // Asynchronously sync new wish to Cloud Database
    fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newWish.name,
        relation: newWish.relation,
        tag: newWish.tag,
        message: newWish.message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.wish?.id) {
          setWishesList((current) =>
            current.map((w) =>
              w.id === newWish.id ? { ...w, id: data.wish.id } : w
            )
          );
        }
      })
      .catch(() => {});
  };

  const handleToggleLikeWish = (wishId: string) => {
    const isLiked = likedWishIds.includes(wishId);
    const newLiked = isLiked
      ? likedWishIds.filter((id) => id !== wishId)
      : [...likedWishIds, wishId];
    setLikedWishIds(newLiked);

    const updatedWishes = wishesList.map((w) => {
      if (w.id === wishId) {
        return { ...w, likes: isLiked ? Math.max(0, w.likes - 1) : w.likes + 1 };
      }
      return w;
    });
    setWishesList(updatedWishes);

    try {
      localStorage.setItem("harsha_harshitha_liked_wishes", JSON.stringify(newLiked));
      localStorage.setItem("harsha_harshitha_wishes", JSON.stringify(updatedWishes));
    } catch {
      // Ignore
    }

    // Asynchronously sync like update to Cloud Database
    fetch("/api/wishes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: wishId,
        increment: !isLiked,
      }),
    }).catch(() => {});
  };

  const galleryImages = [
    {
      src: "gallery-1.jpg",
      title: lang === "kn" ? "ಕೈಜೋಡಿಸಿ ಜೊತೆಯಾಗಿ" : "Hand in Hand",
      position: "object-center",
    },
    {
      src: "gallery-2.jpg",
      title: lang === "kn" ? "ಪ್ರೀತಿಯ ನೆಲೆವೀಡು" : "Where Love Resides",
      position: "object-center",
    },
    {
      src: "gallery-3.jpg",
      title: lang === "kn" ? "ಪ್ರಕೃತಿಯ ಮಡಿಲಲ್ಲಿ" : "Nature’s Embrace",
      position: "object-[center_85%]",
    },
    {
      src: "gallery-4.jpg",
      title: lang === "kn" ? "ಜಲಪಾತದ ತೀರದಲ್ಲಿ" : "By the Cascading Waters",
      position: "object-center",
    },
    {
      src: "gallery-5.jpg",
      title: lang === "kn" ? "ನಗುವಿನ ಮಧುರ ಕ್ಷಣಗಳು" : "Moments of Laughter",
      position: "object-center",
    },
    {
      src: "gallery-6.jpg",
      title: lang === "kn" ? "ಹೊಸ ಜೀವನದ ಹೊಸ್ತಿಲಲ್ಲಿ" : "Stepping Into Tomorrow",
      position: "object-center",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Event Calendar URLs
  const receptionGoogleUrl = getGoogleCalendarUrl({
    title:
      lang === "kn"
        ? "ಆರತಕ್ಷತೆ: ಹರ್ಷ & ಹರ್ಷಿತಾ (#HARSHSQUARED)"
        : "Reception: Harsha & Harshitha (#HARSHSQUARED)",
    details:
      lang === "kn"
        ? "ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ಅವರ ಆರತಕ್ಷತೆ ಸಮಾರಂಭ. ಸಂಗೀತ ಸಂಭ್ರಮ ಹಾಗೂ ಪ್ರೀತಿಯ ಸಮಾಗಮ. ಸ್ಥಳ: ಎಸ್.ವಿ. ಕನ್ವೆನ್ಷನ್ ಸೆಂಟರ್, ಬೆಂಗಳೂರು. #HARSHSQUARED"
        : "Reception of Harsha & Harshitha. Join us for music, celebration, and togetherness at S.V. Convention Centre, Bengaluru. #HARSHSQUARED",
    location: VENUE_LOCATION,
    start: "20261205T183000",
    end: "20261205T223000",
  });

  // Wedding Muhurtham Google Calendar URL
  const muhurthamGoogleUrl = getGoogleCalendarUrl({
    title:
      lang === "kn"
        ? "ಮುಹೂರ್ತ: ಹರ್ಷ & ಹರ್ಷಿತಾ (#HARSHSQUARED)"
        : "Muhurtham: Harsha & Harshitha (#HARSHSQUARED)",
    details:
      lang === "kn"
        ? "ಹರ್ಷ ಮತ್ತು ಹರ್ಷಿತಾ ಅವರ ಶಾಸ್ತ್ರೋಕ್ತ ಮಾಂಗಲ್ಯ ಧಾರಣ ಮುಹೂರ್ತ (ಧನುರ್ ಲಗ್ನ: ಬೆಳಗ್ಗೆ 8:25 ರಿಂದ 9:25). ಸ್ಥಳ: ಎಸ್.ವಿ. ಕನ್ವೆನ್ಷನ್ ಸೆಂಟರ್, ಬೆಂಗಳೂರು. #HARSHSQUARED"
        : "Sacred Muhurtham ceremony of Harsha & Harshitha in Dhanur Lagna (8:25 AM - 9:25 AM) at S.V. Convention Centre, Bengaluru. #HARSHSQUARED",
    location: VENUE_LOCATION,
    start: "20261206T082500",
    end: "20261206T140000",
  });

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FDFBF7] text-[#331818] ${
        !isOpened ? "h-screen overflow-hidden" : ""
      }`}
    >
      {/* ─── TOP NAVIGATION BAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#250E0E]/90 backdrop-blur-md text-white border-b border-amber-300/20 py-3 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / Top Scroll Link */}
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-85 transition cursor-pointer text-left shrink-0"
          >
            <span className="font-serif text-lg sm:text-xl font-bold text-[#FCE08B] tracking-wide">
              Harsha &amp; Harshitha
            </span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLang}
            className="bg-[#E2B755] hover:bg-[#FCE08B] text-[#250E0E] font-semibold px-4 py-1.5 rounded-full shadow-md text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
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
            1. HERO / COVER LANDING SCREEN (Mobile & Desktop Framing)
        ══════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative h-[100dvh] min-h-[100dvh] w-full flex flex-col justify-between items-center text-center text-white px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden"
        >
          {/* Responsive Background: Mobile Portrait (shows BOTH Harsha & Harshitha) vs Desktop Widescreen */}
          <div className="absolute inset-0 z-0">
            {/* Mobile Portrait (Width < 640px) */}
            <div className="block sm:hidden absolute inset-0">
              <Image
                src="/images/harsha-harshitha-mobile.png"
                alt="Harsha and Harshitha"
                fill
                priority
                className="object-cover object-[center_32%]"
              />
            </div>

            {/* Desktop / Tablet Widescreen (Width >= 640px) */}
            <div className="hidden sm:block absolute inset-0">
              <Image
                src="/images/harsha-harshitha-widescreen.png"
                alt="Harsha and Harshitha"
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {/* Luminous & Clean Wedding Veil */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

            {/* Corner subtle ornamental borders */}
            <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-amber-300/40 rounded-tl-xl hidden sm:block pointer-events-none" />
            <div className="absolute top-5 right-5 w-12 h-12 border-t-2 border-r-2 border-amber-300/40 rounded-tr-xl hidden sm:block pointer-events-none" />
            <div className="absolute bottom-5 left-5 w-12 h-12 border-b-2 border-l-2 border-amber-300/40 rounded-bl-xl hidden sm:block pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-12 h-12 border-b-2 border-r-2 border-amber-300/40 rounded-br-xl hidden sm:block pointer-events-none" />
          </div>

          {/* Top Header Group: Tagline Badge & Romantic Quotes on Mobile */}
          <div className="relative z-10 pt-1 flex flex-col items-center shrink-0 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs md:text-sm tracking-widest uppercase text-amber-200 shadow-xl mb-1 sm:mb-0">
              <Sparkles size={13} className="text-amber-300" />
              <span>{t.hero.taglineBadge}</span>
            </div>

            {/* Mobile Quote Lines placed cleanly at the top so couple portrait is unobstructed */}
            <div className="block sm:hidden text-center px-4 mt-2 space-y-0.5">
              <p className="font-script text-2xl text-amber-50 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                {t.hero.quote1}
              </p>
              <p className="text-[11px] text-gray-100 font-light tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                {t.hero.quote2}
              </p>
            </div>
          </div>

          {/* Desktop Center Quote Lines */}
          <div className="hidden sm:block relative z-10 max-w-2xl mx-auto text-center my-auto py-4">
            <div className="space-y-1.5 mb-4 px-2">
              <p className="font-script text-4xl md:text-5xl text-amber-50 font-normal tracking-wide max-w-2xl leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                {t.hero.quote1}
              </p>
              <p className="text-sm md:text-base text-gray-100 font-light tracking-wider drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                {t.hero.quote2}
              </p>
            </div>
          </div>

          {/* Bottom Action Area: Royal Wax Seal & Open Invitation Button */}
          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center pb-2 sm:pb-4 shrink-0">
            {/* ROYAL WEDDING WAX SEAL (Custom Symbol) */}
            <div className="mb-2 sm:mb-3 relative flex flex-col items-center">
              <button
                type="button"
                onClick={openInvitation}
                className="group relative cursor-pointer focus:outline-none"
                aria-label="Royal Wedding Seal - Tap to open invitation"
              >
                {/* Outer Glow Halo */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] opacity-30 blur-md group-hover:opacity-65 transition duration-500" />

                {/* Wax Seal Medallion */}
                <div className="relative w-18 h-18 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-[#3D1414]/95 via-[#230808]/95 to-[#120202]/95 backdrop-blur-md border-2 border-[#E2B755] shadow-[0_0_20px_rgba(226,183,85,0.4)] group-hover:shadow-[0_0_30px_rgba(226,183,85,0.7)] flex flex-col items-center justify-center p-1.5 sm:p-2 transition-all duration-300 transform group-hover:scale-105 active:scale-95">
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-[#FCE08B]/45 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-[#E2B755]/25 pointer-events-none" />
                  <div className="text-[#FCE08B] mb-0.5 opacity-85 group-hover:scale-110 transition-transform">
                    <Sparkles size={10} className="text-[#FCE08B]" />
                  </div>
                  <div className="relative w-[44px] h-[34px] sm:w-[60px] sm:h-[46px] flex items-center justify-center">
                    <Image
                      src="/images/wedding-symbol.png"
                      alt="Wedding Monogram"
                      width={164}
                      height={124}
                      className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                      priority
                    />
                  </div>
                </div>
              </button>
            </div>

            {/* OPEN INVITATION BUTTON */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={openInvitation}
                className="cursor-pointer group relative inline-flex items-center gap-2 px-7 py-2.5 sm:px-8 sm:py-3.5 rounded-full text-sm sm:text-base md:text-lg font-semibold text-[#250E0E] bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] shadow-[0_4px_25px_rgba(226,183,85,0.55)] hover:shadow-[0_6px_35px_rgba(226,183,85,0.85)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border-2 border-amber-200"
              >
                <Heart
                  size={16}
                  className="fill-[#8E6314] text-[#8E6314] group-hover:scale-125 transition-transform"
                />
                <span>{t.hero.cta}</span>
              </button>

              <button
                type="button"
                onClick={openInvitation}
                className="text-[11px] sm:text-xs text-amber-200/90 hover:text-white flex items-center gap-1 transition-colors pt-0.5 animate-bounce cursor-pointer"
              >
                <span>{t.hero.stepInto}</span>
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Bottom City / Location tag */}
            <div className="text-[10px] sm:text-xs text-gray-300/80 pt-1">
              <span>{t.hero.city}</span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            2. THE SACRED INVITATION & LIVE COUNTDOWN
        ══════════════════════════════════════════════════ */}
        <section
          id="invitation"
          className={`relative py-24 px-6 flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
            isRevealing
              ? "opacity-30 scale-[0.98] blur-[1px]"
              : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="max-w-4xl w-full bg-white/95 rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-900/15 relative overflow-hidden text-center">
            {/* TOP LINE: THE WEDDING OF / Harsha / & / Harshitha */}
            <div className="my-6">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase block text-neutral-800 mb-6 sm:mb-8">
                {t.invitation.weddingOfHeading}
              </span>

              {/* Groom's Name - In Radiant Gold */}
              <h2
                className={`font-script text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#A6781D] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${
                  lang === "kn"
                    ? "font-serif italic font-bold text-2xl sm:text-4xl md:text-5xl"
                    : ""
                }`}
              >
                {t.invitation.groom}
              </h2>

              <span className="font-serif italic text-lg sm:text-2xl text-[#C9932B] block my-2 sm:my-3">
                &amp;
              </span>

              {/* Bride's Name - In Radiant Gold */}
              <h2
                className={`font-script text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#A6781D] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${
                  lang === "kn"
                    ? "font-serif italic font-bold text-2xl sm:text-4xl md:text-5xl"
                    : ""
                }`}
              >
                {t.invitation.bride}
              </h2>

              {/* Couple Wedding Tag */}
              <div className="mt-3">
                <span className="inline-block px-3.5 py-0.5 rounded-full bg-amber-500/10 border border-[#C9932B]/30 text-[#A6781D] font-sans font-medium tracking-[0.2em] text-[11px] sm:text-xs uppercase">
                  #HARSHSQUARED
                </span>
              </div>
            </div>

            <div className="my-8 sm:my-10 flex items-center justify-center gap-4">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9932B]/50 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[#B38728]/70 shadow-sm" />
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9932B]/50 to-transparent" />
            </div>

            {/* HEADING: THE INVITATION & PARENTS TEXT */}
            <div className="space-y-3.5 max-w-xl mx-auto">
              <h3 className="font-serif text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-neutral-900">
                {t.invitation.invitationHeading}
              </h3>

              <p className="font-sans font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.invitation.togetherWithFamilies}
              </p>

              {/* Parents Names in refined italic serif in deep charcoal black */}
              <div className="py-2 space-y-1">
                <p className="font-serif italic text-base sm:text-lg font-semibold text-neutral-900 tracking-wide">
                  {t.invitation.groomsParents}
                </p>
                <p className="text-[11px] sm:text-xs uppercase tracking-widest text-neutral-400 font-medium my-0.5">
                  {t.invitation.andSeparator}
                </p>
                <p className="font-serif italic text-base sm:text-lg font-semibold text-neutral-900 tracking-wide">
                  {t.invitation.bridesParents}
                </p>
              </div>

              <p className="font-sans font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.invitation.cordiallyInvite}
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            3. SAVE THE DATE (Interactive Gold Scratch Cards)
        ══════════════════════════════════════════════════ */}
        <section
          id="save-the-date"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#FDFBF7] overflow-hidden"
        >
          {/* Subtle Artistic Gold Teardrops Scattered on White/Ivory Background */}
          <GoldTeardrop className="absolute top-10 left-[8%] w-5 h-7 opacity-25 rotate-12 pointer-events-none" />
          <GoldTeardrop className="absolute top-16 right-[10%] w-6 h-8 opacity-30 -rotate-12 pointer-events-none" />
          <GoldTeardrop className="absolute bottom-16 left-[10%] w-4 h-6 opacity-20 -rotate-45 pointer-events-none" />
          <GoldTeardrop className="absolute bottom-12 right-[8%] w-5 h-7 opacity-25 rotate-45 pointer-events-none" />
          <GoldTeardrop className="absolute top-1/2 left-[4%] w-4 h-6 opacity-15 rotate-6 pointer-events-none hidden sm:block" />
          <GoldTeardrop className="absolute top-1/2 right-[5%] w-4 h-6 opacity-20 -rotate-6 pointer-events-none hidden sm:block" />

          <div className="max-w-4xl w-full text-center relative z-10">
            {/* "Save the Date": same font as bride/groom's name in gold */}
            <h2
              className={`text-[#A6781D] mb-3 sm:mb-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] ${
                lang === "kn"
                  ? "font-serif italic font-bold text-3xl sm:text-5xl"
                  : "font-script text-5xl sm:text-7xl font-normal tracking-wide"
              }`}
            >
              {t.saveTheDate.title}
            </h2>

            {/* Tagline in charcoal and complementing font (italic) */}
            <p className="font-sans italic font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mt-2">
              &ldquo;{t.saveTheDate.tagline}&rdquo;
            </p>

            {/* DUAL GOLD SCRATCH CARDS */}
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mt-12">
              {/* Card 1: Reception */}
              <GoldScratchCard
                title={t.saveTheDate.receptionCardTitle}
                date={t.saveTheDate.receptionCardDate}
                time={t.saveTheDate.receptionCardTime}
                bottomHint={t.saveTheDate.swipeBottomHint}
                isRevealedText={t.saveTheDate.revealedBadge}
                isKannada={lang === "kn"}
              />

              {/* Card 2: Muhurtham */}
              <GoldScratchCard
                title={t.saveTheDate.muhurthamCardTitle}
                date={t.saveTheDate.muhurthamCardDate}
                time={t.saveTheDate.muhurthamCardTime}
                bottomHint={t.saveTheDate.swipeBottomHint}
                isRevealedText={t.saveTheDate.revealedBadge}
                isKannada={lang === "kn"}
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            4. COUNTING DOWN (Dedicated Timer Page)
        ══════════════════════════════════════════════════ */}
        <section
          id="countdown"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#FDFBF7]"
        >
          <div className="max-w-3xl w-full bg-white/95 rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-900/15 relative overflow-hidden text-center">
            {/* Top Badge: "Counting Down" in charcoal */}
            <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase block text-neutral-800">
              {t.countdown.badge}
            </span>

            {/* A lifetime of togetherness in gold cursive script */}
            <div className="my-4 space-y-1">
              <p
                className={`text-[#A6781D] my-2 drop-shadow-sm ${
                  lang === "kn"
                    ? "font-serif italic font-bold text-2xl sm:text-4xl"
                    : "font-script text-4xl sm:text-6xl font-normal"
                }`}
              >
                {t.countdown.subline1}
              </p>
              {/* Begins with one sacred step without all-caps, font in line with previous pages */}
              <p className="font-sans font-light tracking-[0.08em] text-xs sm:text-sm text-neutral-600 mt-1">
                {t.countdown.subline2}
              </p>
            </div>

            <div className="my-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-20 bg-amber-700/30" />
              <Heart size={18} className="text-amber-700 fill-amber-700/20" />
              <div className="h-[1px] w-20 bg-amber-700/30" />
            </div>

            {/* Countdown Numbers */}
            <div className="mt-6">
              {isMounted && timeLeft.isFinished ? (
                <div className="text-2xl font-serif text-rose-700 font-bold">
                  Today is the Wedding Day! ❤️
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-md mx-auto">
                  {[
                    { label: t.countdown.days, val: isMounted ? timeLeft.days : 0 },
                    { label: t.countdown.hours, val: isMounted ? timeLeft.hours : 0 },
                    { label: t.countdown.mins, val: isMounted ? timeLeft.minutes : 0 },
                    { label: t.countdown.secs, val: isMounted ? timeLeft.seconds : 0 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50/70 rounded-2xl p-3 sm:p-4 border border-amber-200/80 shadow-sm flex flex-col items-center"
                    >
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#8E6314]">
                        {String(item.val).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] sm:text-xs tracking-wider uppercase text-gray-600 mt-1">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Calendar Buttons in Gold Theme (Reception & Muhurtham) */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <a
                  href={receptionGoogleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] text-[#250E0E] text-xs sm:text-sm font-semibold border-2 border-amber-200 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <CalendarPlus size={15} className="text-[#250E0E]" />
                  <span>{lang === "kn" ? "ಆರತಕ್ಷತೆ (ಡಿಸೆಂಬರ್ 05)" : "Add Reception (Dec 05)"}</span>
                </a>

                <a
                  href={muhurthamGoogleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] text-[#250E0E] text-xs sm:text-sm font-semibold border-2 border-amber-200 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <CalendarPlus size={15} className="text-[#250E0E]" />
                  <span>{lang === "kn" ? "ಮುಹೂರ್ತ (ಡಿಸೆಂಬರ್ 06)" : "Add Muhurtham (Dec 06)"}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            5. A LITTLE NOTE FOR YOU (From our Hearts)
        ══════════════════════════════════════════════════ */}
        <section
          id="note"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#F9F5EE]"
        >
          <div className="max-w-3xl w-full text-center">
            {/* HEADING: A LITTLE NOTE FOR YOU */}
            <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase block text-neutral-800">
              {t.note.badge}
            </span>

            {/* BELOW THAT: From our Hearts in gold script */}
            <h2
              className={`text-[#A6781D] my-2 drop-shadow-sm ${
                lang === "kn"
                  ? "font-serif italic font-bold text-2xl sm:text-4xl"
                  : "font-script text-4xl sm:text-6xl font-normal tracking-wide"
              }`}
            >
              {t.note.title}
            </h2>

            {/* Heartfelt Message Box */}
            <div className="mt-8 bg-white/95 rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-900/15 relative overflow-hidden text-center">
              {/* Corner subtle ornamental borders */}
              <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-amber-300/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-5 right-5 w-12 h-12 border-t-2 border-r-2 border-amber-300/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-5 left-5 w-12 h-12 border-b-2 border-l-2 border-amber-300/40 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-12 h-12 border-b-2 border-r-2 border-amber-300/40 rounded-br-xl pointer-events-none" />

              <p
                className={`text-[#A6781D] leading-tight my-1 drop-shadow-sm ${
                  lang === "kn"
                    ? "font-serif italic font-bold text-xl sm:text-3xl"
                    : "font-script text-3xl sm:text-5xl font-normal"
                }`}
              >
                {t.note.hook1}
              </p>

              <p className="font-serif italic text-base sm:text-lg text-neutral-800 font-medium tracking-wide mt-2 mb-6">
                {t.note.hook2}
              </p>

              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#C9932B]/50 to-transparent mx-auto my-6" />

              <div className="space-y-4 max-w-2xl mx-auto text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
                <p>{t.note.p1}</p>
                <p>{t.note.p2}</p>
                <p>{t.note.p3}</p>
                <p>{t.note.p4}</p>
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-amber-900/10">
                <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#8E6314] tracking-wide">
                  {t.note.signature}
                </h3>
                <p className="font-sans italic font-light tracking-wide text-xs sm:text-sm text-neutral-500 mt-2">
                  {t.note.closing}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            5. CAPTURED MOMENTS (Photo Gallery - Luxury Gold Theme)
        ══════════════════════════════════════════════════ */}
        <section
          id="gallery"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#FDFBF7] overflow-hidden"
        >
          {/* Subtle Artistic Gold Teardrops Scattered on Background */}
          <GoldTeardrop className="absolute top-12 left-[6%] w-5 h-7 opacity-20 rotate-12 pointer-events-none" />
          <GoldTeardrop className="absolute top-20 right-[8%] w-6 h-8 opacity-25 -rotate-12 pointer-events-none" />
          <GoldTeardrop className="absolute bottom-16 left-[8%] w-4 h-6 opacity-20 -rotate-45 pointer-events-none" />
          <GoldTeardrop className="absolute bottom-12 right-[6%] w-5 h-7 opacity-25 rotate-45 pointer-events-none" />

          <div className="max-w-5xl w-full relative z-10">
            {/* Gallery Title in Charcoal & Gold Cursive Script */}
            <div className="text-center mb-12">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase block text-neutral-800">
                {t.nav.gallery}
              </span>
              <h2 className="font-script text-4xl sm:text-6xl text-[#A6781D] my-1 font-normal tracking-wide drop-shadow-sm">
                {t.gallery.title}
              </h2>
              <p className="font-sans italic font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 mt-2">
                &ldquo;{t.gallery.subtitle}&rdquo;
              </p>
              <p className="text-[11px] text-[#A6781D] font-medium tracking-wider uppercase mt-2 flex items-center justify-center gap-1.5">
                <Sparkles size={13} className="text-[#D4AF37]" />
                <span>{t.gallery.tapHint}</span>
              </p>
            </div>

            {/* NATURAL CINEMATIC WEDDING ALBUM SHOWCASE */}
            <div className="relative max-w-xl sm:max-w-2xl w-full mx-auto px-4">
              {/* Luxury Muted Gold Photo Card */}
              <div
                onClick={() => setSelectedPhoto(galleryImages[activeSlide].src)}
                className="group relative bg-white/95 rounded-3xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(201,147,43,0.18)] border-2 border-[#E2C799]/50 hover:border-[#D4AF37] transition-all duration-500 cursor-pointer overflow-hidden select-none"
              >
                {/* Full-Frame Photo Container */}
                <div className="relative aspect-[3/4] sm:aspect-[2/3] max-h-[580px] w-full rounded-2xl overflow-hidden bg-[#180A0A] flex items-center justify-center border border-amber-900/10 shadow-inner">
                  <Image
                    key={activeSlide}
                    src={`/images/${galleryImages[activeSlide].src}`}
                    alt={galleryImages[activeSlide].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 680px"
                    className={`object-cover ${galleryImages[activeSlide].position || "object-center"} w-full h-full transition-all duration-700 ease-out group-hover:scale-103`}
                  />
                  {/* Subtle ambient bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Natural Caption & Counter */}
                <div className="mt-4 flex items-center justify-between px-2 sm:px-3">
                  <div>
                    <p className="font-serif italic text-lg sm:text-xl font-semibold text-neutral-900 tracking-wide">
                      {galleryImages[activeSlide].title}
                    </p>
                    <p className="text-[11px] font-sans font-medium tracking-[0.2em] text-[#A6781D] uppercase mt-0.5">
                      #HARSHSQUARED
                    </p>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-500 bg-amber-50/80 px-3.5 py-1 rounded-full border border-amber-200/80 shadow-xs">
                    {String(activeSlide + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Floating Next/Prev Arrow Buttons */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#8E6314] border-2 border-[#E2C799]/70 shadow-xl hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer z-20"
                aria-label="Previous photo"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#8E6314] border-2 border-[#E2C799]/70 shadow-xl hover:bg-amber-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer z-20"
                aria-label="Next photo"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Indicator Bar Below: 6 Dots / Small Lines that highlight as they slide */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-500 rounded-full h-2 cursor-pointer ${
                    activeSlide === idx
                      ? "w-8 sm:w-10 bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] shadow-md"
                      : "w-2 sm:w-2.5 bg-amber-200/80 hover:bg-amber-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Thumbnail Preview Strip */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 overflow-x-auto py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${
                    activeSlide === idx
                      ? "border-[#B38728] shadow-md scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <Image
                    src={`/images/${img.src}`}
                    alt={img.title}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
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
            {/* Top Badge: "THE VENUE" in charcoal */}
            <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase block text-neutral-800">
              {t.venue.badge}
            </span>

            {/* Title in Radiant Gold Cursive Script (same as other pages) */}
            <h2 className="font-script text-4xl sm:text-6xl text-[#A6781D] my-1 font-normal tracking-wide drop-shadow-sm">
              {t.venue.title}
            </h2>

            {/* Subtitle in Complementary Italic Light Font */}
            <p className="font-sans italic font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 mt-2">
              &ldquo;{t.venue.subtitle}&rdquo;
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

              {/* Direct Google Maps Action Button in Gold Theme */}
              <div className="mt-6">
                <a
                  href="https://maps.app.goo.gl/JkBY1LKde4m9sWLs7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] text-[#250E0E] px-8 py-3.5 rounded-full font-semibold border-2 border-amber-200 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                >
                  <MapPin size={18} className="text-[#250E0E]" />
                  <span>{t.venue.mapsBtn}</span>
                  <ExternalLink size={16} className="text-[#250E0E]" />
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

            {/* Family Closing Greetings in Warm Gold */}
            <p className="font-serif italic text-[#8E6314] text-base sm:text-lg mt-6">
              {t.venue.familyClosing}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            7. GUEST WISHES & BLESSINGS WALL
        ══════════════════════════════════════════════════ */}
        <section
          id="wishes"
          className="relative py-24 px-6 flex flex-col justify-center items-center bg-[#F9F5EE]"
        >
          <div className="max-w-5xl w-full">
            <div className="text-center mb-12">
              {/* Top Badge: "GUESTBOOK" in charcoal */}
              <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase block text-neutral-800">
                {t.wishes.badge}
              </span>

              {/* Title in Radiant Gold Cursive Script (same as other pages) */}
              <h2 className="font-script text-4xl sm:text-6xl text-[#A6781D] my-1 font-normal tracking-wide drop-shadow-sm">
                {t.wishes.title}
              </h2>

              {/* Subtitle in Complementary Italic Light Font */}
              <p className="font-sans italic font-light tracking-[0.06em] text-xs sm:text-sm text-neutral-600 mt-2 max-w-xl mx-auto">
                &ldquo;{t.wishes.subtitle}&rdquo;
              </p>
            </div>

            {/* Post A Wish Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 mb-12 max-w-2xl mx-auto">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#8E6314] mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#E2B755]" />
                <span>{t.wishes.formTitle}</span>
              </h3>

              <form onSubmit={handlePostWish} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                      {t.wishes.nameLabel} <span className="text-amber-700">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newWishName}
                      onChange={(e) => setNewWishName(e.target.value)}
                      placeholder={t.wishes.namePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                      {t.wishes.relationLabel}
                    </label>
                    <select
                      value={newWishRelation || t.wishes.relations[0]}
                      onChange={(e) => setNewWishRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 outline-none text-sm bg-white"
                    >
                      {t.wishes.relations.map((rel, idx) => (
                        <option key={idx} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Blessing Mood Tag */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1.5">
                    {t.wishes.tagLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {t.wishes.tags.map((tag, idx) => {
                      const isSelected = (newWishTag || t.wishes.tags[0]) === tag;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewWishTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
                            isSelected
                              ? "bg-amber-100/90 border-[#B38728] text-[#8E6314] font-semibold"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-amber-300"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                    {t.wishes.msgLabel} <span className="text-amber-700">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    placeholder={t.wishes.msgPlaceholder}
                    className="w-full p-3.5 rounded-xl border border-gray-300 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20 outline-none text-sm"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FCE08B] via-[#E2B755] to-[#D4AF37] hover:from-[#FFF2B8] hover:to-[#E2B755] text-[#250E0E] px-7 py-3 rounded-full font-semibold border-2 border-amber-200 shadow-md hover:shadow-lg transition cursor-pointer text-sm"
                  >
                    <Heart size={15} className="fill-[#250E0E] text-[#250E0E]" />
                    <span>{t.wishes.postBtn}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Wishes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {wishesList.map((wish) => {
                const isLiked = likedWishIds.includes(wish.id);
                return (
                  <div
                    key={wish.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-amber-900/10 hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Mood & Timestamp */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                          {wish.tag}
                        </span>
                        <span className="text-gray-400 font-light">
                          {wish.createdAt}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-gray-700 font-serif italic text-base sm:text-lg leading-relaxed mb-4">
                        &quot;{wish.message}&quot;
                      </p>
                    </div>

                    {/* Bottom Author & Likes */}
                    <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {wish.name}
                        </h4>
                        <span className="text-xs text-amber-800">
                          {wish.relation}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleLikeWish(wish.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          isLiked
                            ? "bg-rose-100 text-rose-700 border border-rose-300"
                            : "bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 border border-gray-200"
                        }`}
                        aria-label="Send Love"
                      >
                        <Heart
                          size={14}
                          className={
                            isLiked ? "fill-rose-600 text-rose-600" : ""
                          }
                        />
                        <span>{wish.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-[#250E0E] text-white border-t border-amber-300/20 text-center px-6">
        <p className="font-serif italic text-2xl text-[#FCE08B]">
          {t.footer.couple}
        </p>
        <p className="text-xs sm:text-sm font-sans font-medium tracking-[0.25em] text-[#FCE08B] uppercase mt-1">
          #HARSHSQUARED
        </p>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          {t.footer.subtext}
        </p>
      </footer>

      {/* ─── HIDDEN AUDIO ELEMENT & FLOATING MUSIC TOGGLE ─── */}
      <audio
        ref={audioRef}
        src="/audio/reunited.mp3"
        loop
        preload="auto"
      />

      {/* Floating Gold Music Control Button (Clean Circular Music On/Off Toggle) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleAudio}
          className="group w-12 h-12 rounded-full bg-[#250E0E]/90 hover:bg-[#3D1414] text-[#FCE08B] border-2 border-amber-300/40 shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center relative"
          aria-label={isPlaying ? "Turn Music Off" : "Turn Music On"}
          title={isPlaying ? "Music On" : "Music Off"}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 rounded-full bg-amber-400/20 animate-ping opacity-60" />
              <Volume2 size={20} className="text-[#FCE08B]" />
            </div>
          ) : (
            <VolumeX size={20} className="text-gray-400" />
          )}
        </button>
      </div>

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
