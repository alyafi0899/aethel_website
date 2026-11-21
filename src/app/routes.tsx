import {
  Activity,
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileHeart,
  HeartHandshake,
  HeartPulse,
  Layers3,
  LockKeyhole,
  Menu,
  MessageCircle,
  Network,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import aethelDashboard from "../screenshot/aethel (1).png";
import aethelDoctors from "../screenshot/aethel (2).png";
import meridianClinic from "../screenshot/meridian (1).png";
import meridianSearch from "../screenshot/meridian (2).png";
import meridianConsultation from "../screenshot/meridian (3).png";
import meridianDashboard from "../screenshot/meridian dashboard (1).png";
import ordinAssessment from "../screenshot/Ordin - Nurse Mode (1).jpeg";
import ordinEmergency from "../screenshot/Ordin - Nurse Mode (2).jpeg";
import ordinQueue from "../screenshot/Ordin - Nurse Mode (3).jpeg";
import {
  Link,
  NavLink,
  Outlet,
  createBrowserRouter,
  redirect,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router";

type Language = "ID" | "EN";
type Status = "live" | "building" | "vision";
type PlatformKey = "aethel" | "ordin" | "meridian";

const LangContext = createContext<{
  language: Language;
  setLanguage: (value: Language) => void;
}>({ language: "ID", setLanguage: () => undefined });

const photos = {
  conversation: "/images/care-conversation.jpg",
  doctor: "/images/doctor-patient.jpg",
  professional: "/images/healthcare-professional.jpg",
};

type PlatformScreenshot = {
  src: string;
  title: { ID: string; EN: string };
  alt: { ID: string; EN: string };
  layout: "desktop" | "mobile";
};

const platformScreenshots: Record<
  PlatformKey,
  { featured: PlatformScreenshot; gallery: PlatformScreenshot[] }
> = {
  aethel: {
    featured: {
      src: aethelDashboard,
      title: { ID: "Dashboard operasional", EN: "Operations dashboard" },
      alt: {
        ID: "Dashboard operasional klinik dengan ringkasan kunjungan, jadwal, dan aktivitas.",
        EN: "Clinic operations dashboard showing visit summaries, schedules, and activity.",
      },
      layout: "desktop",
    },
    gallery: [
      {
        src: aethelDoctors,
        title: { ID: "Manajemen dokter", EN: "Doctor management" },
        alt: {
          ID: "Halaman manajemen dokter dengan jadwal, ketersediaan, dan ringkasan operasional.",
          EN: "Doctor management screen with schedules, availability, and an operations summary.",
        },
        layout: "desktop",
      },
    ],
  },
  ordin: {
    featured: {
      src: ordinAssessment,
      title: { ID: "Laporan pemeriksaan awal", EN: "Initial assessment report" },
      alt: {
        ID: "Layar laporan pemeriksaan awal perawat, termasuk keluhan, SOCRATES, dan tanda vital.",
        EN: "Nurse initial assessment report showing the complaint, SOCRATES, and vital signs.",
      },
      layout: "mobile",
    },
    gallery: [
      {
        src: ordinQueue,
        title: { ID: "Daftar tugas perawat", EN: "Nurse task list" },
        alt: {
          ID: "Daftar tugas pemeriksaan dengan pasien yang menunggu dan penanda kondisi darurat.",
          EN: "Assessment task list showing waiting patients and emergency indicators.",
        },
        layout: "mobile",
      },
      {
        src: ordinEmergency,
        title: { ID: "Pemeriksaan tanda vital darurat", EN: "Emergency vital signs" },
        alt: {
          ID: "Layar pemeriksaan cepat pasien darurat dengan input tanda vital.",
          EN: "Emergency rapid assessment screen with vital sign inputs.",
        },
        layout: "mobile",
      },
    ],
  },
  meridian: {
    featured: {
      src: meridianDashboard,
      title: { ID: "Beranda pasien", EN: "Patient home" },
      alt: {
        ID: "Beranda aplikasi pasien dengan janji temu, rekomendasi dokter, dan akses layanan.",
        EN: "Patient app home screen with an appointment, doctor recommendations, and service access.",
      },
      layout: "mobile",
    },
    gallery: [
      {
        src: meridianSearch,
        title: { ID: "Temukan klinik", EN: "Find a clinic" },
        alt: {
          ID: "Layar pencarian klinik dan dokter terdekat.",
          EN: "Clinic and nearby doctor search screen.",
        },
        layout: "mobile",
      },
      {
        src: meridianClinic,
        title: { ID: "Profil klinik & janji temu", EN: "Clinic profile & booking" },
        alt: {
          ID: "Profil klinik dengan informasi layanan dan tombol pemesanan janji.",
          EN: "Clinic profile showing services and an appointment booking action.",
        },
        layout: "mobile",
      },
      {
        src: meridianConsultation,
        title: { ID: "Akses konsultasi", EN: "Consultation access" },
        alt: {
          ID: "Layar konsultasi pasien dengan janji temu, spesialis, dan dokter.",
          EN: "Patient consultation screen with appointments, specialties, and doctors.",
        },
        layout: "mobile",
      },
    ],
  },
};

const platformData: Record<
  PlatformKey,
  {
    name: string;
    descriptor: { ID: string; EN: string };
    audience: { ID: string; EN: string };
    accent: string;
    logo: string;
  }
> = {
  aethel: {
    name: "Aethel",
    descriptor: { ID: "Operasional klinik", EN: "Clinic operations" },
    audience: { ID: "Fasilitas & tim operasional", EN: "Facilities & operations teams" },
    accent: "blue",
    logo: "/brand/aethel.svg",
  },
  ordin: {
    name: "Ordin",
    descriptor: { ID: "Ruang kerja klinis", EN: "Clinical workspace" },
    audience: { ID: "Perawat & dokter", EN: "Nurses & doctors" },
    accent: "teal",
    logo: "/brand/ordin.svg",
  },
  meridian: {
    name: "Meridian",
    descriptor: { ID: "Perjalanan pasien", EN: "Patient journey" },
    audience: { ID: "Pasien & keluarga", EN: "Patients & families" },
    accent: "coral",
    logo: "/brand/meridian.svg",
  },
};

function useLang() {
  return useContext(LangContext);
}

function T({ id, en }: { id: ReactNode; en: ReactNode }) {
  return <>{useLang().language === "ID" ? id : en}</>;
}

function Root() {
  const [language, setLanguage] = useState<Language>("ID");
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
      setMenuOpen(false);
      setPlatformOpen(false);
      return () => window.cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setMenuOpen(false);
    setPlatformOpen(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty(
          "--scroll-progress",
          `${scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0}`,
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let revealObserver: IntersectionObserver | undefined;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      document.documentElement.classList.add("has-scroll-reveals");
      revealObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          }),
        { rootMargin: "0px 0px 12% 0px", threshold: 0.01 },
      );
      revealItems.forEach((item) => revealObserver?.observe(item));
    }

    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const active = !reducedMotion && window.innerWidth >= 768;
      const viewportHeight = window.innerHeight;
      parallaxItems.forEach((item) => {
        if (!active) {
          item.style.setProperty("--parallax-offset", "0px");
          return;
        }
        const bounds = item.getBoundingClientRect();
        const currentOffset =
          Number.parseFloat(item.style.getPropertyValue("--parallax-offset")) || 0;
        const progress =
          (viewportHeight - (bounds.top - currentOffset)) / (viewportHeight + bounds.height);
        const offset = Math.max(-18, Math.min(18, (0.5 - progress) * 36));
        item.style.setProperty("--parallax-offset", `${offset.toFixed(1)}px`);
      });
    };
    const scheduleParallaxUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", scheduleParallaxUpdate, { passive: true });
    window.addEventListener("resize", scheduleParallaxUpdate);

    return () => {
      revealObserver?.disconnect();
      window.removeEventListener("scroll", scheduleParallaxUpdate);
      window.removeEventListener("resize", scheduleParallaxUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  return (
    <LangContext.Provider value={{ language, setLanguage }}>
      <a className="skip-link" href="#main-content">
        <T id="Lewati ke konten" en="Skip to content" />
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <div className="nav-wrap">
          <Link to="/" className="wordmark" aria-label="Aethel home">
            <BrandGlyph />
            <span>aethel</span>
          </Link>
          <nav
            id="primary-navigation"
            className={menuOpen ? "nav-links open" : "nav-links"}
            aria-label="Primary"
          >
            <NavLink to="/ecosystem">
              <T id="Ekosistem" en="Ecosystem" />
            </NavLink>
            <NavLink to="/journey">
              <T id="Perjalanan pasien" en="Patient journey" />
            </NavLink>
            <div className="nav-menu">
              <button
                type="button"
                onClick={() => setPlatformOpen((value) => !value)}
                aria-expanded={platformOpen}
                aria-controls="platform-navigation"
              >
                <T id="Platform" en="Platforms" /> <ChevronDown size={14} />
              </button>
              <div
                id="platform-navigation"
                className={platformOpen ? "nav-popover show" : "nav-popover"}
              >
                {(Object.keys(platformData) as PlatformKey[]).map((key) => (
                  <Link to={`/platform/${key}`} key={key}>
                    <span className={`brand-dot ${platformData[key].accent}`} />
                    <span>
                      <b>{platformData[key].name}</b>
                      <small>{platformData[key].descriptor[language]}</small>
                    </span>
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/technology">
              <T id="Teknologi" en="Technology" />
            </NavLink>
            <NavLink to="/about">
              <T id="Tentang" en="About" />
            </NavLink>
            <Link className="mobile-demo" to="/contact">
              <T id="Minta demo" en="Request a demo" />
            </Link>
          </nav>
          <div className="nav-actions">
            <div className="language" aria-label="Language">
              <button
                type="button"
                className={language === "ID" ? "active" : ""}
                onClick={() => setLanguage("ID")}
              >
                ID
              </button>
              <span>·</span>
              <button
                type="button"
                className={language === "EN" ? "active" : ""}
                onClick={() => setLanguage("EN")}
              >
                EN
              </button>
            </div>
            <Link className="button button-dark button-small" to="/contact">
              <T id="Minta demo" en="Request a demo" />
            </Link>
            <button
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div id="main-content">
        <Outlet />
      </div>
      <Footer />
    </LangContext.Provider>
  );
}

function BrandGlyph({ muted = false }: { muted?: boolean }) {
  return (
    <svg
      className={muted ? "brand-glyph muted" : "brand-glyph"}
      viewBox="0 0 70 72"
      aria-hidden="true"
    >
      <path d="M35 1 55 12.5v23L35 47 15 35.5v-23L35 1Z" fill="#45C9BE" />
      <path d="M20 25 40 36.5v23L20 71 0 59.5v-23L20 25Z" fill="#2E8BC0" />
      <path d="M50 25 70 36.5v23L50 71 30 59.5v-23L50 25Z" fill="#2E8BC0" />
    </svg>
  );
}

function PageIntro({
  kicker,
  title,
  copy,
  children,
  theme = "light",
}: {
  kicker: ReactNode;
  title: ReactNode;
  copy: ReactNode;
  children?: ReactNode;
  theme?: "light" | "dark" | "teal" | "coral";
}) {
  return (
    <section className={`page-intro ${theme}`}>
      <div className="ambient-grid" />
      <div className="container page-intro-grid">
        <div data-reveal>
          <p className="kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="lede">{copy}</p>
          <div className="button-row">
            <Link className="button button-primary" to="/contact">
              <T id="Minta demo" en="Request a demo" />
              <ArrowRight size={17} />
            </Link>
            <Link className="button button-quiet" to="/ecosystem">
              <T id="Lihat ekosistem" en="See the ecosystem" />
            </Link>
          </div>
        </div>
        <div className="page-intro-art" data-parallax="slow">
          {children}
        </div>
      </div>
    </section>
  );
}

function SectionTitle({
  kicker,
  title,
  copy,
  centered = false,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  copy?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "section-title centered" : "section-title"} data-reveal>
      {kicker && <p className="kicker">{kicker}</p>}
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const labels = {
    live: <T id="Tersedia" en="Available" />,
    building: <T id="Dikembangkan" en="In development" />,
    vision: <T id="Visi" en="Vision" />,
  };
  return (
    <span className={`status ${status}`}>
      <i />
      {labels[status]}
    </span>
  );
}

function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-glow glow-a" data-parallax="slow" />
        <div className="hero-glow glow-b" data-parallax="slow" />
        <div className="container hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="kicker">
              <T id="Ekosistem teknologi kesehatan" en="A healthcare technology ecosystem" />
            </p>
            <h1>
              <T
                id={
                  <>
                    Satu perjalanan.
                    <br />
                    <em>Tiga cara untuk peduli.</em>
                  </>
                }
                en={
                  <>
                    One journey.
                    <br />
                    <em>Three ways to care.</em>
                  </>
                }
              />
            </h1>
            <p className="hero-lede">
              <T
                id="Aethel menghubungkan operasional klinik, tenaga klinis, dan pasien agar konteks tidak hilang saat layanan berpindah tangan."
                en="Aethel connects clinic operations, clinical teams, and patients so context is not lost when care changes hands."
              />
            </p>
            <div className="button-row">
              <Link className="button button-primary" to="/ecosystem">
                <T id="Jelajahi ekosistem" en="Explore the ecosystem" />
                <ArrowRight size={17} />
              </Link>
              <Link className="button button-quiet" to="/contact">
                <T id="Mulai percakapan" en="Start a conversation" />
              </Link>
            </div>
            <div className="hero-proof">
              <span>
                <ShieldCheck size={16} />
                <T id="Akses berbasis peran" en="Role-based access" />
              </span>
              <span>
                <HeartHandshake size={16} />
                <T id="Keputusan tetap pada manusia" en="Humans remain accountable" />
              </span>
            </div>
          </div>
          <EcosystemStage />
        </div>
        <a className="scroll-cue" href="#why">
          <T id="Ikuti alurnya" en="Follow the flow" />
          <ArrowDown size={15} />
        </a>
      </section>

      <section className="section editorial-intro" id="why">
        <div className="container editorial-grid">
          <p className="chapter">
            01 / <T id="Masalah yang nyata" en="A real problem" />
          </p>
          <div>
            <blockquote data-reveal>
              <T
                id="Pelayanan kesehatan bukan rangkaian layar. Ia adalah rangkaian kepercayaan."
                en="Healthcare is not a sequence of screens. It is a sequence of trust."
              />
            </blockquote>
            <p className="large-copy" data-reveal>
              <T
                id="Ketika registrasi, pemeriksaan awal, keputusan klinis, dan tindak lanjut berdiri sendiri, tim mengulang pekerjaan dan pasien kehilangan kejelasan. Aethel dibangun untuk menjaga perjalanan itu tetap utuh."
                en="When registration, initial assessment, clinical decisions, and follow-up stand apart, teams repeat work and patients lose clarity. Aethel is built to keep that journey whole."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="section platform-curtain">
        <div className="container">
          <SectionTitle
            kicker={<T id="Tiga platform, satu konteks" en="Three platforms, one context" />}
            title={
              <T
                id="Berbeda untuk setiap peran. Terhubung untuk setiap kunjungan."
                en="Distinct for every role. Connected for every visit."
              />
            }
            copy={
              <T
                id="Identitas dan fokus tiap platform tetap jelas, sementara handoff mengikuti alur kunjungan yang sama."
                en="Each platform keeps a clear identity and focus while handoffs follow the same visit flow."
              />
            }
          />
          <div className="platform-editorial">
            <PlatformPanel platform="aethel" index="01" />
            <PlatformPanel platform="ordin" index="02" />
            <PlatformPanel platform="meridian" index="03" />
          </div>
        </div>
      </section>

      <section className="section journey-teaser">
        <div className="container journey-split">
          <div className="sticky-copy">
            <p className="chapter">
              02 / <T id="Satu kunjungan" en="One visit" />
            </p>
            <SectionTitle
              title={
                <T
                  id="Konteks bergerak. Tanggung jawab tetap jelas."
                  en="Context moves. Responsibility stays clear."
                />
              }
              copy={
                <T
                  id="Dari kebutuhan pasien hingga tindak lanjut, setiap perpindahan membawa informasi yang relevan—bukan akses tanpa batas."
                  en="From a patient’s need to follow-up, each handoff carries relevant information—not unrestricted access."
                />
              }
            />
            <Link className="text-link" to="/journey">
              <T id="Lihat perjalanan lengkap" en="See the full journey" />
              <ArrowRight size={16} />
            </Link>
            <JourneyPathLinks />
          </div>
          <VisitRibbon />
        </div>
      </section>

      <section className="section philosophy-band">
        <div className="container philosophy-grid">
          <div className="portrait-stack" data-reveal>
            <img src={photos.conversation} alt="Tenaga kesehatan berbicara dengan pasien" />
            <span>
              <T
                id="Teknologi berada di belakang. Manusia tetap di depan."
                en="Technology stays behind. People stay in front."
              />
            </span>
          </div>
          <div>
            <p className="chapter">
              03 / <T id="Filosofi" en="Philosophy" />
            </p>
            <h2 data-reveal>
              <T
                id="Bukan satu aplikasi. Fondasi untuk inovasi yang berguna."
                en="Not one app. A foundation for useful innovation."
              />
            </h2>
            <p data-reveal>
              <T
                id="Aethel dirancang sebagai wadah teknologi kesehatan yang berangkat dari masalah nyata, diuji bersama pengguna, lalu dihubungkan secara bertahap ketika manfaat dan tanggung jawabnya jelas."
                en="Aethel is designed as a home for healthcare technology that begins with real problems, is tested with users, and is connected gradually when its value and responsibilities are clear."
              />
            </p>
            <Link className="text-link light" to="/technology">
              <T id="Pelajari pendekatannya" en="Explore the approach" />
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function EcosystemStage({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? "ecosystem-stage compact" : "ecosystem-stage"}
      data-parallax={compact ? undefined : "slow"}
      aria-label="Diagram tiga platform Aethel"
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="central-context">
        <BrandGlyph />
        <b>
          <T id="Konteks kunjungan" en="Visit context" />
        </b>
        <small>
          <T id="satu alur bersama" en="one shared flow" />
        </small>
      </div>
      <Link to="/platform/aethel" className="orbit-card card-a">
        <LogoCrop platform="aethel" />
        <small>
          <T id="Registrasi · antrean · billing" en="Registration · queue · billing" />
        </small>
      </Link>
      <Link to="/platform/ordin" className="orbit-card card-o">
        <LogoCrop platform="ordin" />
        <small>
          <T id="Triase · konsultasi · handoff" en="Triage · consultation · handoff" />
        </small>
      </Link>
      <Link to="/platform/meridian" className="orbit-card card-m">
        <LogoCrop platform="meridian" />
        <small>
          <T id="Akses · janji · tindak lanjut" en="Access · appointments · follow-up" />
        </small>
      </Link>
      <span className="data-pulse pulse-one" />
      <span className="data-pulse pulse-two" />
      <span className="data-pulse pulse-three" />
    </div>
  );
}

function LogoCrop({ platform }: { platform: PlatformKey }) {
  return (
    <img
      className={`logo-crop ${platform}`}
      src={platformData[platform].logo}
      alt={platformData[platform].name}
    />
  );
}

function PlatformPanel({ platform, index }: { platform: PlatformKey; index: string }) {
  const item = platformData[platform];
  const body = {
    aethel: {
      id: "Mengatur alur operasional tanpa membuka detail klinis kepada peran yang tidak berwenang.",
      en: "Coordinates operations without exposing clinical details to unauthorized roles.",
      status: "live" as Status,
    },
    ordin: {
      id: "Mendampingi perawat dan dokter dari pemeriksaan awal hingga dokumentasi dan handoff.",
      en: "Supports nurses and doctors from initial assessment through documentation and handoff.",
      status: "live" as Status,
    },
    meridian: {
      id: "Membawa akses layanan, janji temu, status kunjungan, dan hasil yang relevan ke pasien.",
      en: "Brings service access, appointments, visit status, and relevant outcomes to patients.",
      status: "building" as Status,
    },
  }[platform];
  return (
    <article className={`platform-panel ${item.accent}`} data-reveal>
      <span className="panel-index">{index}</span>
      <LogoCrop platform={platform} />
      <p>{useLang().language === "ID" ? body.id : body.en}</p>
      <div>
        <StatusBadge status={body.status} />
        <Link to={`/platform/${platform}`} className="panel-explore">
          <T id="Jelajahi platform" en="Explore platform" />
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function VisitRibbon() {
  const steps = [
    [Search, "01", "Akses", "Kebutuhan & pilihan layanan"],
    [CalendarDays, "02", "Kunjungan", "Identitas, jadwal & antrean"],
    [HeartPulse, "03", "Pemeriksaan awal", "SOCRATES, vital & triase"],
    [Stethoscope, "04", "Konsultasi", "Keputusan & rekam medis"],
    [CreditCard, "05", "Penyelesaian", "Resep, pulang & billing"],
    [MessageCircle, "06", "Tindak lanjut", "Informasi sesuai hak akses"],
  ] as const;
  return (
    <div className="visit-ribbon" data-parallax="slow">
      {steps.map(([Icon, number, title, detail], index) => (
        <article key={number} data-reveal style={{ transitionDelay: `${index * 55}ms` }}>
          <span>{number}</span>
          <Icon size={22} />
          <div>
            <b>{title}</b>
            <small>{detail}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

const journeyEntrances = [
  {
    id: "scheduled",
    icon: CalendarDays,
    title: { ID: "Janji temu", EN: "Scheduled visit" },
    description: {
      ID: "Pasien memilih layanan dan waktu kunjungan.",
      EN: "A patient chooses a service and visit time.",
    },
    handoff: {
      ID: "Jadwal dan antrean terhubung ke kunjungan.",
      EN: "The schedule and queue connect to the visit.",
    },
    platform: "meridian" as PlatformKey,
  },
  {
    id: "walkin",
    icon: Building2,
    title: { ID: "Datang langsung", EN: "Walk-in" },
    description: {
      ID: "Klinik mendaftarkan pasien dan mengatur check-in.",
      EN: "The clinic registers the patient and coordinates check-in.",
    },
    handoff: {
      ID: "Kunjungan masuk ke antrean dan alur klinik.",
      EN: "The visit enters the clinic queue and workflow.",
    },
    platform: "aethel" as PlatformKey,
  },
  {
    id: "emergency",
    icon: HeartPulse,
    title: { ID: "Kebutuhan darurat", EN: "Emergency need" },
    description: {
      ID: "Tim klinis memprioritaskan respons sesuai kondisi.",
      EN: "The care team prioritizes a response to the situation.",
    },
    handoff: {
      ID: "Eskalasi tidak menunggu alur administrasi selesai.",
      EN: "Escalation does not wait for routine administration.",
    },
    platform: "ordin" as PlatformKey,
  },
] as const;

const journeyOutcomes = [
  {
    id: "consultation",
    icon: Stethoscope,
    platform: "ordin" as PlatformKey,
    title: { ID: "Konsultasi dokter", EN: "Doctor consultation" },
    description: {
      ID: "Dokter meninjau konteks, memeriksa, lalu menetapkan keputusan.",
      EN: "The doctor reviews context, examines, and makes a decision.",
    },
    handoff: {
      ID: "Rekam medis, resep bila diperlukan, dan rencana pulang.",
      EN: "Medical record, prescription when needed, and discharge plan.",
    },
  },
  {
    id: "nurse-service",
    icon: ClipboardCheck,
    platform: "ordin" as PlatformKey,
    title: { ID: "Layanan tanpa dokter", EN: "Nurse-led service" },
    description: {
      ID: "Untuk layanan yang memang tidak memerlukan konsultasi dokter.",
      EN: "For services that do not require a doctor consultation.",
    },
    handoff: {
      ID: "Hasil layanan diteruskan ke alur kasir klinik.",
      EN: "Service results continue to the clinic cashier workflow.",
    },
  },
  {
    id: "escalation",
    icon: Activity,
    platform: "ordin" as PlatformKey,
    title: { ID: "Eskalasi / rujukan", EN: "Escalation / referral" },
    description: {
      ID: "Tenaga klinis menentukan respons dan kebutuhan tindak lanjut.",
      EN: "Care professionals determine the response and follow-up needs.",
    },
    handoff: {
      ID: "Keputusan dan instruksi dicatat oleh tenaga klinis.",
      EN: "Care professionals document decisions and instructions.",
    },
  },
] as const;

function JourneyPathLinks() {
  const { language } = useLang();
  return (
    <div className="journey-path-links" data-reveal>
      <p>
        <T id="Pilih titik awal perjalanan" en="Choose where the journey begins" />
      </p>
      <div>
        {journeyEntrances.map((entry) => {
          const EntryIcon = entry.icon;
          return (
            <Link
              to={`/journey?entry=${entry.id}#route-branches`}
              key={entry.id}
              aria-label={`${entry.title[language]} — ${entry.description[language]}`}
            >
              <EntryIcon size={16} />
              <span>{entry.title[language]}</span>
              <ArrowRight size={14} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const journeyStages = [
  {
    id: "access",
    number: "01",
    title: { ID: "Akses & registrasi", EN: "Access & registration" },
    actor: { ID: "Pasien · Resepsionis", EN: "Patient · Receptionist" },
    platform: "Meridian → Aethel",
    input: { ID: "Kebutuhan layanan, identitas, jadwal", EN: "Care need, identity, schedule" },
    handoff: {
      ID: "Kunjungan terstruktur dan nomor antrean",
      EN: "Structured visit and queue ticket",
    },
    human: {
      ID: "Petugas memverifikasi identitas secara visual",
      EN: "Staff visually verifies identity",
    },
    system: {
      ID: "Sistem mengatur tahap dan tiket antrean",
      EN: "System manages stage and queue ticket",
    },
  },
  {
    id: "screening",
    number: "02",
    title: { ID: "Skrining & triase", EN: "Screening & triage" },
    actor: { ID: "Pasien · Perawat", EN: "Patient · Nurse" },
    platform: "Aethel → Ordin",
    input: { ID: "Keluhan, SOCRATES, tanda vital", EN: "Complaint, SOCRATES, vital signs" },
    handoff: {
      ID: "Prioritas triase dan konteks untuk dokter",
      EN: "Triage priority and context for doctor",
    },
    human: {
      ID: "Perawat menilai, mengonfirmasi, dan mengeskalasi",
      EN: "Nurse assesses, confirms, and escalates",
    },
    system: {
      ID: "Aturan red-flag hanya membantu tinjauan",
      EN: "Red-flag rules only assist review",
    },
  },
  {
    id: "consult",
    number: "03",
    title: { ID: "Konsultasi", EN: "Consultation" },
    actor: { ID: "Dokter · Perawat", EN: "Doctor · Nurse" },
    platform: "Ordin",
    input: { ID: "Riwayat, hasil triase, pemeriksaan", EN: "History, triage, examination" },
    handoff: {
      ID: "Rekam medis, diagnosis, resep, rencana",
      EN: "Medical record, diagnosis, prescription, plan",
    },
    human: {
      ID: "Dokter mengambil dan menandatangani keputusan",
      EN: "Doctor makes and signs the decision",
    },
    system: {
      ID: "Sistem menyimpan versi dan jejak perubahan",
      EN: "System stores versions and change history",
    },
  },
  {
    id: "resolve",
    number: "04",
    title: { ID: "Billing & tindak lanjut", EN: "Billing & follow-up" },
    actor: { ID: "Kasir · Pasien", EN: "Cashier · Patient" },
    platform: "Aethel → Meridian",
    input: {
      ID: "Layanan, resep, ringkasan pulang",
      EN: "Services, prescription, discharge summary",
    },
    handoff: {
      ID: "Tagihan, status selesai, instruksi relevan",
      EN: "Invoice, completion status, relevant instructions",
    },
    human: {
      ID: "Kasir memvalidasi item dan pembayaran",
      EN: "Cashier validates items and payment",
    },
    system: {
      ID: "Pembayaran online memerlukan jalur server",
      EN: "Online payment requires a server-side path",
    },
  },
];

function BranchingJourney() {
  const { language } = useLang();
  const [searchParams] = useSearchParams();
  const requestedEntry = searchParams.get("entry");
  const [entryId, setEntryId] = useState(
    () => journeyEntrances.find((entry) => entry.id === requestedEntry)?.id ?? "scheduled",
  );
  const [outcomeId, setOutcomeId] = useState("consultation");
  useEffect(() => {
    setEntryId(journeyEntrances.find((entry) => entry.id === requestedEntry)?.id ?? "scheduled");
  }, [requestedEntry]);
  const entry = journeyEntrances.find((item) => item.id === entryId) ?? journeyEntrances[0];
  const outcome = journeyOutcomes.find((item) => item.id === outcomeId) ?? journeyOutcomes[0];
  const involvedPlatforms = Array.from(
    new Set([entry.platform, "aethel" as PlatformKey, outcome.platform]),
  );
  const EntryIcon = entry.icon;

  return (
    <section className="section branching-journey" id="route-branches">
      <div className="container">
        <SectionTitle
          kicker={<T id="Peta jalur pelayanan" en="Care pathway map" />}
          title={
            <T
              id="Tidak semua perjalanan dimulai atau berakhir dengan cara yang sama."
              en="Not every care journey starts or ends the same way."
            />
          }
          copy={
            <T
              id="Baca dari kiri ke kanan: pilih cara pasien datang, lihat alur klinik yang tetap berjalan, lalu pilih layanan berikutnya. Ringkasan dan platform terkait akan berubah mengikuti pilihan Anda."
              en="Read from left to right: choose how the patient arrives, follow the shared clinic workflow, then choose the next service. The summary and related platforms update with your choices."
            />
          }
        />

        <div className="branch-map" aria-label="Peta interaktif jalur kunjungan">
          <svg
            className="branch-wires"
            viewBox="0 0 1000 460"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={entryId === "scheduled" ? "active" : ""}
              d="M285 80 C390 80 385 230 500 230"
            />
            <path
              className={entryId === "walkin" ? "active" : ""}
              d="M285 230 C380 230 400 230 500 230"
            />
            <path
              className={entryId === "emergency" ? "active" : ""}
              d="M285 380 C390 380 385 230 500 230"
            />
            <path
              className={outcomeId === "consultation" ? "active" : ""}
              d="M500 230 C610 230 610 80 715 80"
            />
            <path
              className={outcomeId === "nurse-service" ? "active" : ""}
              d="M500 230 C610 230 610 230 715 230"
            />
            <path
              className={outcomeId === "escalation" ? "active" : ""}
              d="M500 230 C610 230 610 380 715 380"
            />
          </svg>

          <div className="branch-column">
            <div className="branch-column-heading">
              <span>01</span>
              <div>
                <b>
                  <T id="Cara pasien datang" en="How the patient arrives" />
                </b>
                <small>
                  <T id="Pilih satu pilihan" en="Choose one option" />
                </small>
              </div>
            </div>
            <div className="branch-options">
              {journeyEntrances.map((option) => {
                const OptionIcon = option.icon;
                const selected = entryId === option.id;
                return (
                  <button
                    className={`branch-option ${selected ? "selected" : ""}`}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setEntryId(option.id)}
                    key={option.id}
                  >
                    <span className="branch-option-icon">
                      <OptionIcon size={17} />
                    </span>
                    <span className="branch-option-copy">
                      <b>{option.title[language]}</b>
                      <small>{option.description[language]}</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="branch-core">
            <div className="branch-core-orbit" aria-hidden="true">
              <span />
            </div>
            <small>
              <T id="02 · ALUR KLINIK" en="02 · CLINIC WORKFLOW" />
            </small>
            <h3>
              <T id="Langkah yang tetap terjadi" en="Steps that still happen" />
            </h3>
            <div className="branch-core-steps">
              <span>
                <b>01</b>
                <T id="Registrasi & data kunjungan" en="Registration & visit details" />
              </span>
              <span>
                <b>02</b>
                <T id="Pemeriksaan awal & triase" en="Initial assessment & triage" />
              </span>
              <span>
                <b>03</b>
                <T id="Handoff ke layanan berikutnya" en="Handoff to the next service" />
              </span>
            </div>
            <div className="branch-context">
              <EntryIcon size={15} />
              <span>
                <small>
                  <T id="Dampak pilihan awal" en="Effect of this entry choice" />
                </small>
                {entry.handoff[language]}
              </span>
            </div>
          </div>

          <div className="branch-column">
            <div className="branch-column-heading">
              <span>03</span>
              <div>
                <b>
                  <T id="Layanan berikutnya" en="Next service" />
                </b>
                <small>
                  <T id="Pilih satu kemungkinan" en="Choose one possible path" />
                </small>
              </div>
            </div>
            <div className="branch-options">
              {journeyOutcomes.map((option) => {
                const OptionIcon = option.icon;
                const selected = outcomeId === option.id;
                return (
                  <button
                    className={`branch-option outcome ${selected ? "selected" : ""}`}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setOutcomeId(option.id)}
                    key={option.id}
                  >
                    <span className="branch-option-icon">
                      <OptionIcon size={17} />
                    </span>
                    <span className="branch-option-copy">
                      <b>{option.title[language]}</b>
                      <small>{option.description[language]}</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="branch-detail" aria-live="polite">
          <div className="branch-detail-route">
            <span>
              <T id="RINGKASAN JALUR YANG DIPILIH" en="YOUR SELECTED PATH" />
            </span>
            <div className="branch-summary-step">
              <small>
                <T id="01 · Cara masuk" en="01 · Entry" />
              </small>
              <b>{entry.title[language]}</b>
              <em>{platformData[entry.platform].name}</em>
            </div>
            <ArrowRight size={15} />
            <div className="branch-summary-step">
              <small>
                <T id="02 · Alur klinik" en="02 · Clinic workflow" />
              </small>
              <b>
                <T id="Registrasi, asesmen, triase" en="Registration, assessment, triage" />
              </b>
              <em>Aethel</em>
            </div>
            <ArrowRight size={15} />
            <div className="branch-summary-step">
              <small>
                <T id="03 · Layanan berikutnya" en="03 · Next service" />
              </small>
              <b>{outcome.title[language]}</b>
              <em>{platformData[outcome.platform].name}</em>
            </div>
          </div>
          <p>
            <strong>
              <T id="Dampak pilihan awal: " en="Entry effect: " />
            </strong>
            {entry.handoff[language]}{" "}
            <strong>
              <T id="Setelahnya: " en="Next: " />
            </strong>
            {outcome.description[language]} {outcome.handoff[language]}
          </p>
          <div className="branch-platform-links">
            <small>
              <T id="Platform yang terlibat" en="Platforms involved" />
            </small>
            <div>
              {involvedPlatforms.map((platform) => (
                <Link className="button button-quiet" to={`/platform/${platform}`} key={platform}>
                  <T
                    id={`Jelajahi ${platformData[platform].name}`}
                    en={`Explore ${platformData[platform].name}`}
                  />
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="branch-note">
          <ShieldCheck size={15} />
          <T
            id="Peta ini menjelaskan pilihan alur. Prioritas klinis dan keputusan perawatan tetap ditentukan tenaga kesehatan."
            en="This map explains workflow options. Clinical priority and care decisions remain with healthcare professionals."
          />
        </p>
      </div>
    </section>
  );
}

function EcosystemPage() {
  const [active, setActive] = useState(0);
  const { language } = useLang();

  useEffect(() => {
    const stages = Array.from(document.querySelectorAll<HTMLElement>("[data-ecosystem-stage]"));
    if (!stages.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const index = Number(visible?.target.getAttribute("data-ecosystem-stage"));
        if (Number.isInteger(index)) setActive(index);
      },
      { rootMargin: "-34% 0px -52% 0px", threshold: 0 },
    );
    stages.forEach((stage) => observer.observe(stage));
    return () => observer.disconnect();
  }, []);

  function goToStage(index: number) {
    document.getElementById(`ecosystem-stage-${index}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
    setActive(index);
  }

  return (
    <main>
      <PageIntro
        theme="dark"
        kicker={<T id="Peta ekosistem" en="Ecosystem map" />}
        title={
          <T
            id="Satu sistem tidak berarti semua orang melihat hal yang sama."
            en="One system does not mean everyone sees the same thing."
          />
        }
        copy={
          <T
            id="Aethel menghubungkan alur kunjungan sambil menjaga peran, konteks, dan batas tanggung jawab setiap aktor."
            en="Aethel connects the visit flow while preserving each actor’s role, context, and responsibility boundary."
          />
        }
      >
        <EcosystemStage compact />
      </PageIntro>

      <section className="section ecosystem-explorer">
        <div className="container">
          <SectionTitle
            kicker={<T id="Infografis utama" en="Core infographic" />}
            title={
              <T id="Ikuti satu kasus, tahap demi tahap." en="Follow one case, stage by stage." />
            }
            copy={
              <T
                id="Pilih tahap untuk melihat aktor, platform, informasi yang berpindah, dan batas keputusan manusia–sistem."
                en="Choose a stage to see actors, platforms, information handoffs, and the human–system decision boundary."
              />
            }
          />
          <div className="journey-scrollytelling">
            <nav className="journey-stage-nav" aria-label="Navigasi tahap perjalanan">
              <span>
                <T
                  id="Pilih tahap untuk melihat detailnya"
                  en="Choose a stage to see its details"
                />
              </span>
              {journeyStages.map((item, index) => (
                <button
                  type="button"
                  aria-current={active === index ? "step" : undefined}
                  className={active === index ? "active" : ""}
                  onClick={() => goToStage(index)}
                  key={item.id}
                >
                  <b>{item.number}</b>
                  <span>{item.title[language]}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
              <Link className="journey-branch-link" to="/journey#route-branches">
                <Network size={15} />
                <span>
                  <T id="Lihat jalur bercabang" en="Explore branching paths" />
                </span>
                <ArrowRight size={14} />
              </Link>
            </nav>
            <div className="journey-stage-list">
              {journeyStages.map((item, index) => (
                <article
                  id={`ecosystem-stage-${index}`}
                  className={`journey-stage-card ${active === index ? "active" : ""}`}
                  data-ecosystem-stage={index}
                  key={item.id}
                >
                  <div className="journey-stage-card-head">
                    <span>{item.number}</span>
                    <div>
                      <small>
                        {item.actor[language]} · {item.platform}
                      </small>
                      <h3>{item.title[language]}</h3>
                    </div>
                  </div>
                  <div className="journey-stage-transfer">
                    <div>
                      <small>
                        <T id="MASUK" en="INPUT" />
                      </small>
                      <p>{item.input[language]}</p>
                    </div>
                    <ArrowRight size={18} />
                    <div>
                      <small>
                        <T id="BERPINDAH KE" en="HANDOFF" />
                      </small>
                      <p>{item.handoff[language]}</p>
                    </div>
                  </div>
                  <div className="journey-stage-boundaries">
                    <div>
                      <UserRound size={16} />
                      <span>
                        <b>
                          <T id="Peran manusia" en="Human responsibility" />
                        </b>
                        <small>{item.human[language]}</small>
                      </span>
                    </div>
                    <div>
                      <Layers3 size={16} />
                      <span>
                        <b>
                          <T id="Peran sistem" en="System role" />
                        </b>
                        <small>{item.system[language]}</small>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section actors-section">
        <div className="container">
          <SectionTitle
            centered
            kicker={<T id="Aktor & akses" en="Actors & access" />}
            title={
              <T
                id="Informasi yang tepat, untuk peran yang tepat."
                en="The right information, for the right role."
              />
            }
          />
          <div className="actor-grid">
            {[
              [UserRound, "Pasien", "Miliknya sendiri: status, resep, hasil, tagihan"],
              [Building2, "Operasional", "Status alur tanpa isi klinis sensitif"],
              [HeartPulse, "Perawat", "Intake, vital, triase, tugas dan handoff"],
              [Stethoscope, "Dokter", "Konteks klinis, rekam medis, resep, pulang"],
              [CreditCard, "Kasir", "Item tagihan dan status pembayaran"],
            ].map(([Icon, title, copy]) => {
              const ActorIcon = Icon as typeof UserRound;
              return (
                <article key={title as string} data-reveal>
                  <ActorIcon />
                  <h3>{title as string}</h3>
                  <p>{copy as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <InnovationDock />
      <ClosingCta />
    </main>
  );
}

function PatientJourneyPage() {
  const { language } = useLang();
  return (
    <main>
      <PageIntro
        theme="coral"
        kicker={<T id="Patient journey" en="Patient journey" />}
        title={
          <T
            id="Satu kebutuhan pasien. Banyak tangan yang menjaga."
            en="One patient need. Many hands that care."
          />
        }
        copy={
          <T
            id="Contoh berikut memakai data ilustratif untuk menunjukkan apa yang dilakukan setiap aktor, kapan konteks berpindah, dan apa yang tetap menjadi keputusan manusia."
            en="This example uses illustrative data to show what each actor does, when context moves, and what remains a human decision."
          />
        }
      >
        <PatientCard />
      </PageIntro>
      <section className="section story-rail">
        <div className="container story-layout">
          <aside className="story-aside">
            <p className="chapter">CASE / 001</p>
            <h2>
              <T id="Perjalanan Ibu Maya" en="Maya’s journey" />
            </h2>
            <p>
              <T
                id="Keluhan nyeri dada ringan saat beraktivitas. Seluruh nama dan data di halaman ini adalah ilustrasi."
                en="Mild chest discomfort during activity. All names and data on this page are illustrative."
              />
            </p>
            <span className="dummy-note">
              <LockKeyhole size={14} />
              <T id="Bukan data pasien nyata" en="Not real patient data" />
            </span>
          </aside>
          <div className="story-steps">
            {journeyStages.map((stage, index) => (
              <article key={stage.id} data-reveal>
                <span className="story-number">{stage.number}</span>
                <div>
                  <small>
                    {stage.actor[language]} · {stage.platform}
                  </small>
                  <h3>{stage.title[language]}</h3>
                  <p>
                    {stage.input[language]} → {stage.handoff[language]}
                  </p>
                  <div className="story-boundary">
                    <UserRound size={16} />
                    {stage.human[language]}
                  </div>
                </div>
                <MiniInterface stage={index} />
              </article>
            ))}
          </div>
        </div>
      </section>
      <BranchingJourney />
      <section className="section outcome-section">
        <div className="container">
          <SectionTitle
            title={
              <T
                id="Akhir kunjungan bukan akhir konteks."
                en="The end of a visit is not the end of context."
              />
            }
          />
          <div className="outcome-grid">
            {[
              [FileHeart, "Rekam medis", "Versi ditandatangani dan perubahan tercatat"],
              [ClipboardCheck, "Rencana pulang", "Ringkasan dan jadwal tindak lanjut"],
              [CreditCard, "Administrasi", "Tagihan dan pembayaran sesuai kewenangan"],
              [MessageCircle, "Pasien", "Informasi relevan kembali ke pasien"],
            ].map(([Icon, title, copy], index) => {
              const OutcomeIcon = Icon as typeof FileHeart;
              return (
                <article
                  key={title as string}
                  data-reveal
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <OutcomeIcon />
                  <b>{title as string}</b>
                  <small>{copy as string}</small>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function PatientCard() {
  return (
    <div className="patient-card">
      <div className="patient-card-top">
        <span>MY</span>
        <div>
          <b>Maya Pradana</b>
          <small>
            <T id="Data ilustrasi" en="Illustrative data" />
          </small>
        </div>
        <StatusBadge status="live" />
      </div>
      <div className="patient-card-main">
        <small>
          <T id="Kunjungan hari ini" en="Today’s visit" />
        </small>
        <h3>
          <T id="Konsultasi umum" en="General consultation" />
        </h3>
        <p>
          <Clock3 size={15} />
          10:30 · Antrean U-012
        </p>
      </div>
      <div className="patient-progress">
        <span className="done" />
        <span className="done" />
        <span className="active" />
        <span />
      </div>
      <small>
        <T id="Sedang menunggu konsultasi dokter" en="Waiting for doctor consultation" />
      </small>
    </div>
  );
}

function MiniInterface({ stage }: { stage: number }) {
  const content = [
    ["U-012", "Check-in selesai", "2 orang di depan"],
    ["118/76", "SpO₂ 98%", "Triase: hijau"],
    ["SOCRATES", "Rekam medis", "Siap ditandatangani"],
    ["Rp 185.000", "Invoice diterbitkan", "Tindak lanjut 14 hari"],
  ][stage];
  return (
    <div className="mini-interface" data-parallax="slow">
      <i />
      <i />
      <strong>{content[0]}</strong>
      <span>{content[1]}</span>
      <small>{content[2]}</small>
    </div>
  );
}

function PlatformPage() {
  const params = useParams();
  const key = (params.platform || "aethel") as PlatformKey;
  const platform = platformData[key] || platformData.aethel;
  const { language } = useLang();
  const copy = {
    aethel: {
      headline: {
        ID: "Operasional klinik yang melihat alur, bukan sekadar daftar.",
        EN: "Clinic operations that see the flow, not just a list.",
      },
      intro: {
        ID: "Aethel membantu fasilitas mengatur registrasi, jadwal, antrean, kunjungan, administrasi, dan billing dalam satu alur yang dapat ditindaklanjuti.",
        EN: "Aethel helps facilities coordinate registration, schedules, queues, visits, administration, and billing in one actionable flow.",
      },
      quote: {
        ID: "Bagi tim operasional, kejelasan adalah bentuk pelayanan.",
        EN: "For operations teams, clarity is a form of care.",
      },
      image: photos.doctor,
      features: [
        [
          "Registrasi & kunjungan",
          "Pasien baru atau terdaftar, walk-in, rujukan, dan janji.",
          "live",
        ],
        ["Jadwal, check-in & antrean", "Tahap kunjungan dan antrean per stasiun/dokter.", "live"],
        [
          "Billing & pembayaran offline",
          "Item, invoice, dan pencatatan pembayaran oleh peran berwenang.",
          "live",
        ],
        [
          "Akses aplikasi pasien penuh",
          "Penautan riwayat dan pengalaman pasien terus dikembangkan.",
          "building",
        ],
      ],
    },
    ordin: {
      headline: {
        ID: "Ruang kerja klinis yang mengikuti ritme pelayanan.",
        EN: "A clinical workspace that follows the rhythm of care.",
      },
      intro: {
        ID: "Ordin adalah identitas publik untuk pengalaman tenaga klinis—aplikasi dokter/perawat di implementasi produk—yang menjaga konteks dari pemeriksaan awal hingga handoff.",
        EN: "Ordin is the public identity for the clinical workforce experience—the doctor/nurse app in the product implementation—preserving context from initial assessment to handoff.",
      },
      quote: {
        ID: "Alat bantu yang baik mengurangi friksi, bukan mengurangi pertimbangan klinis.",
        EN: "A good tool reduces friction, not clinical judgment.",
      },
      image: photos.professional,
      features: [
        [
          "Pemeriksaan awal & SOCRATES",
          "Keluhan, riwayat, penilaian nyeri terstruktur, dan berkas.",
          "live",
        ],
        ["Tanda vital & triase", "Prioritas, red flag, penugasan, dan handoff ke dokter.", "live"],
        [
          "Konsultasi & rekam medis",
          "Catatan, diagnosis, versi, tanda tangan, resep, dan pulang.",
          "live",
        ],
        [
          "Modul klinis baru",
          "Perangkat dan keputusan berbantuan harus melewati validasi.",
          "vision",
        ],
      ],
    },
    meridian: {
      headline: {
        ID: "Akses layanan yang dimulai dari kebutuhan pasien.",
        EN: "Access to care that begins with the patient’s need.",
      },
      intro: {
        ID: "Meridian adalah pengalaman pasien untuk menemukan fasilitas, membuat janji, mengikuti status kunjungan, dan menerima informasi yang relevan.",
        EN: "Meridian is the patient experience for discovering facilities, booking appointments, following visit status, and receiving relevant information.",
      },
      quote: {
        ID: "Pasien tidak perlu memahami sistem untuk memahami langkah berikutnya.",
        EN: "Patients should not need to understand the system to understand what comes next.",
      },
      image: photos.conversation,
      features: [
        [
          "Pencarian fasilitas & layanan",
          "Profil publik, layanan, dokter, jadwal, dan ketersediaan.",
          "building",
        ],
        [
          "Janji, check-in & status",
          "Registrasi kunjungan dan pemantauan tahap serta antrean.",
          "building",
        ],
        [
          "Hasil yang relevan",
          "Akses milik sendiri ke resep, rekam medis, dan tagihan.",
          "building",
        ],
        [
          "Telekonsultasi lengkap",
          "Ruang percakapan dan integrasi pengalaman masih bertahap.",
          "vision",
        ],
      ],
    },
  }[key];

  return (
    <main className={`platform-page theme-${platform.accent}`}>
      <PageIntro
        theme={key === "ordin" ? "teal" : key === "meridian" ? "coral" : "light"}
        kicker={
          <>
            <T id="Platform" en="Platform" /> · {platform.audience[language]}
          </>
        }
        title={copy.headline[language]}
        copy={copy.intro[language]}
      >
        <div className="platform-hero-device">
          <PlatformPreview platform={key} />
        </div>
      </PageIntro>
      <PlatformScreenshotGallery platform={key} />
      <section className="section platform-story">
        <div className="container platform-story-grid">
          <div className="platform-photo" data-parallax="slow">
            <img src={copy.image} alt="" />
          </div>
          <div data-reveal>
            <p className="chapter">
              01 / <T id="Mengapa platform ini ada" en="Why this platform exists" />
            </p>
            <blockquote>{copy.quote[language]}</blockquote>
            <p>{copy.intro[language]}</p>
          </div>
        </div>
      </section>
      <section className="section capability-section">
        <div className="container">
          <SectionTitle
            kicker={<T id="Kapabilitas & status" en="Capabilities & status" />}
            title={
              <T
                id="Yang bekerja hari ini. Yang sedang dibangun. Yang masih menjadi visi."
                en="What works today. What is being built. What remains a vision."
              />
            }
          />
          <div className="capability-list">
            {copy.features.map(([title, detail, status], index) => (
              <article key={title} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
                <StatusBadge status={status as Status} />
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section connection-section">
        <div className="container connection-grid">
          <SectionTitle
            title={
              <T
                id={`${platform.name} tidak bekerja sendiri.`}
                en={`${platform.name} does not work alone.`}
              />
            }
          />
          <div className="connection-chain">
            {(Object.keys(platformData) as PlatformKey[]).map((item, index) => (
              <Link
                className={item === key ? "current" : ""}
                to={`/platform/${item}`}
                key={item}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span>{index + 1}</span>
                <b>{platformData[item].name}</b>
                <small>{platformData[item].descriptor[language]}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function PlatformPreview({ platform }: { platform: PlatformKey }) {
  const { language } = useLang();
  const screenshot = platformScreenshots[platform].featured;
  return (
    <figure className={`platform-preview ${screenshot.layout}`}>
      {screenshot.layout === "desktop" && (
        <div className="preview-toolbar" aria-hidden="true">
          <span />
          <span />
          <span />
          <small>{platformData[platform].name} · {screenshot.title[language]}</small>
        </div>
      )}
      <img src={screenshot.src} alt={screenshot.alt[language]} fetchPriority="high" />
      {screenshot.layout === "mobile" && (
        <figcaption>{platformData[platform].name} · {screenshot.title[language]}</figcaption>
      )}
    </figure>
  );
}

function PlatformScreenshotGallery({ platform }: { platform: PlatformKey }) {
  const { language } = useLang();
  const screenshots = platformScreenshots[platform].gallery;
  return (
    <section className="section platform-screenshots">
      <div className="container">
        <SectionTitle
          kicker={<T id="Antarmuka platform" en="Platform interface" />}
          title={
            <T
              id={`Jelajahi antarmuka ${platformData[platform].name}.`}
              en={`Explore the ${platformData[platform].name} interface.`}
            />
          }
          copy={
            <T
              id="Cuplikan layar ini memperlihatkan contoh pengalaman produk. Informasi pada layar bersifat ilustratif."
              en="These screen previews show examples of the product experience. On-screen information is illustrative."
            />
          }
        />
        {screenshots[0]?.layout === "mobile" && (
          <p className="screenshot-scroll-cue">
            <T id="Geser untuk melihat layar lainnya" en="Swipe to see more screens" />
            <ArrowRight size={15} aria-hidden="true" />
          </p>
        )}
        <div className={`platform-screenshot-grid ${screenshots[0]?.layout || "desktop"}`}>
          {screenshots.map((screenshot) => (
            <figure className={`platform-screenshot ${screenshot.layout}`} key={screenshot.src}>
              {screenshot.layout === "desktop" ? (
                <div className="screenshot-window">
                  <div className="preview-toolbar" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <small>{platformData[platform].name}</small>
                  </div>
                  <img src={screenshot.src} alt={screenshot.alt[language]} loading="lazy" />
                </div>
              ) : (
                <img src={screenshot.src} alt={screenshot.alt[language]} loading="lazy" />
              )}
              <figcaption>{screenshot.title[language]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnologyPage() {
  return (
    <main>
      <PageIntro
        theme="dark"
        kicker={<T id="Teknologi & inovasi" en="Technology & innovation" />}
        title={
          <T
            id="Inovasi masuk melalui pintu yang bertanggung jawab."
            en="Innovation enters through a responsible door."
          />
        }
        copy={
          <T
            id="Fondasi Aethel menyatukan workflow terstruktur, konteks kunjungan, dan akses berbasis peran—lalu memberi ruang bagi teknologi baru untuk diuji sebelum diintegrasikan."
            en="Aethel’s foundation combines structured workflows, visit context, and role-based access—then gives new technology room to be tested before integration."
          />
        }
      >
        <ArchitectureOrb />
      </PageIntro>
      <section className="section foundation-section">
        <div className="container">
          <SectionTitle
            kicker={<T id="Fondasi saat ini" en="Current foundation" />}
            title={
              <T
                id="Terhubung bukan berarti tanpa batas."
                en="Connected does not mean unrestricted."
              />
            }
          />
          <div className="foundation-grid">
            {[
              [
                Network,
                "Satu alur kunjungan",
                "Tahap bersama menjaga transisi tetap konsisten.",
                "live",
              ],
              [
                LockKeyhole,
                "Akses berbasis peran",
                "RLS dan RPC menjadi otoritas; UI bukan pengganti keamanan.",
                "live",
              ],
              [
                FileHeart,
                "Konteks & versi",
                "Rekam medis ditandatangani dan perubahan memerlukan alasan.",
                "live",
              ],
              [
                Activity,
                "Realtime operasional",
                "Status alur diperbarui tanpa membawa detail klinis ke inbox.",
                "live",
              ],
            ].map(([Icon, title, copy, status]) => {
              const TechIcon = Icon as typeof Network;
              return (
                <article key={title as string} data-reveal>
                  <TechIcon />
                  <StatusBadge status={status as Status} />
                  <h3>{title as string}</h3>
                  <p>{copy as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section innovation-cycle">
        <div className="container">
          <SectionTitle
            kicker={<T id="Gerbang inovasi" en="Innovation gate" />}
            title={
              <T id="Dari masalah nyata, bukan dari tren." en="From real problems, not trends." />
            }
          />
          <div className="cycle-track">
            {[
              ["01", "Masalah nyata", "Didefinisikan bersama pengguna"],
              ["02", "Prototipe", "Menguji alur dan asumsi"],
              ["03", "Validasi", "Ditinjau pengguna & klinisi"],
              ["04", "Pilot", "Terbatas, terukur, dapat dihentikan"],
              ["05", "Evaluasi", "Manfaat, risiko, tanggung jawab"],
              ["06", "Integrasi", "Hanya bila bukti cukup"],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section ludesc-section">
        <div className="container ludesc-grid">
          <div>
            <StatusBadge status="vision" />
            <p className="kicker">INNOVATION EXAMPLE · LUDESC</p>
            <h2>
              <T
                id="Contoh teknologi yang dapat menemukan rumah di ekosistem."
                en="An example of technology that could find a home in the ecosystem."
              />
            </h2>
            <p>
              <T
                id="Ludesc adalah stetoskop digital bertenaga AI yang telah dibuat sebagai inovasi tersendiri. Ia ditampilkan sebagai contoh potensi kolaborasi—bukan fitur Aethel yang sudah terintegrasi, bukan alat diagnosis, dan bukan klaim validasi klinis."
                en="Ludesc is an AI-powered digital stethoscope built as a separate innovation. It is shown as an example of potential collaboration—not an already integrated Aethel feature, a diagnostic tool, or a claim of clinical validation."
              />
            </p>
          </div>
          <div className="ludesc-visual">
            <Activity />
            <span />
            <span />
            <span />
            <small>
              <T id="Potensi modul masa depan" en="Potential future module" />
            </small>
          </div>
        </div>
      </section>
      <section className="section innovation-submit" id="dock-module">
        <div className="container">
          <div className="innovation-submit-grid">
            <div data-reveal>
              <p className="kicker">
                <T id="Program docking modul" en="Module docking program" />
              </p>
              <h2>
                <T
                  id="Punya inovasi yang ingin menemukan rumah di Aethel?"
                  en="Have an innovation that could find a home in Aethel?"
                />
              </h2>
              <p>
                <T
                  id="Kami mengundang tenaga kesehatan, peneliti, startup, dan inovator untuk mengusulkan modul yang menyelesaikan masalah nyata. Setiap usulan akan ditinjau sebelum ada pembicaraan integrasi; mengirim usulan tidak berarti otomatis diterima atau menjadi fitur produk."
                  en="We welcome healthcare professionals, researchers, startups, and innovators to propose modules that solve real problems. Every proposal is reviewed before integration is discussed; submission does not guarantee acceptance or inclusion as a product feature."
                />
              </p>
              <a
                className="button button-primary innovation-submit-cta"
                href="mailto:solutivolabs@gmail.com?subject=Pengajuan%20Inovasi%20Modul%20Aethel"
              >
                <Send size={16} />
                <T id="Kirim detail inovasi" en="Submit innovation details" />
                <ArrowRight size={15} />
              </a>
              <a className="innovation-submit-email" href="mailto:solutivolabs@gmail.com">
                solutivolabs@gmail.com
              </a>
            </div>
            <div className="innovation-dossier" data-reveal>
              <p>
                <ClipboardCheck size={16} />
                <T id="Materi yang membantu peninjauan" en="Materials for our review" />
              </p>
              {[
                [
                  "01",
                  "Deck & masalah yang diselesaikan",
                  "Pengguna sasaran, konteks penggunaan, dan manfaat yang diharapkan.",
                ],
                [
                  "02",
                  "Prototype & status validasi",
                  "Tautan demo atau video, tahap kesiapan, pengujian, dan bukti yang tersedia.",
                ],
                [
                  "03",
                  "Arsitektur & aliran data",
                  "Diagram sistem, integrasi, dependensi, keamanan, dan kebutuhan data.",
                ],
                [
                  "04",
                  "Pembeda dari solusi lain",
                  "Alternatif yang ada, kelebihan, batasan, dan alasan pendekatan ini lebih sesuai.",
                ],
                [
                  "05",
                  "Risiko & rencana keselamatan",
                  "Risiko penggunaan, status regulasi/validasi, serta mitigasi yang direncanakan.",
                ],
              ].map(([number, title, copy]) => (
                <div className="innovation-dossier-item" key={number}>
                  <span>{number}</span>
                  <div>
                    <b>{title}</b>
                    <small>{copy}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="innovation-submit-note">
            <ShieldCheck size={16} />
            <T
              id="Jangan kirim data pasien yang dapat dikenali, kredensial, atau materi rahasia melalui email ini."
              en="Do not email identifiable patient data, credentials, or confidential materials."
            />
          </p>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function ArchitectureOrb() {
  return (
    <div className="architecture-orb">
      <div className="arch-core">
        <BrandGlyph />
        <small>VISIT CONTEXT</small>
      </div>
      {["Workflow", "Roles", "Records", "Modules"].map((item, index) => (
        <span className={`arch-node n${index + 1}`} key={item}>
          {item}
        </span>
      ))}
      <i className="arch-ring r1" />
      <i className="arch-ring r2" />
    </div>
  );
}

function InnovationDock() {
  return (
    <section className="innovation-dock">
      <div className="container">
        <div>
          <p className="kicker">
            <T id="Modul masa depan" en="Future modules" />
          </p>
          <h2>
            <T
              id="Ekosistem yang dapat berkembang tanpa kehilangan arah."
              en="An ecosystem that can evolve without losing direction."
            />
          </h2>
        </div>
        <Link className="button button-light" to="/technology">
          <T id="Lihat fondasi inovasi" en="See the innovation foundation" />
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <main>
      <PageIntro
        kicker={<T id="Tentang Aethel" en="About Aethel" />}
        title={
          <T
            id="Teknologi seharusnya mendekatkan orang pada pelayanan—bukan pada kerumitan baru."
            en="Technology should bring people closer to care—not to new complexity."
          />
        }
        copy={
          <T
            id="Aethel dibangun oleh PT Solutivo Labs Indonesia sebagai ekosistem teknologi kesehatan yang menghubungkan fasilitas, tenaga kesehatan, dan pasien."
            en="Aethel is built by PT Solutivo Labs Indonesia as a healthcare technology ecosystem connecting facilities, healthcare professionals, and patients."
          />
        }
      >
        <div className="about-image">
          <img src={photos.doctor} alt="Dokter berbicara dengan pasien" />
        </div>
      </PageIntro>
      <section className="section manifesto">
        <div className="container manifesto-grid">
          <p className="chapter">MANIFESTO / 001</p>
          <div>
            <h2>
              <T id="Kami tidak memulai dari fitur." en="We do not begin with features." />
            </h2>
            <p>
              <T
                id="Kami memulai dari momen saat konteks hilang: pasien harus mengulang cerita, perawat bekerja tanpa gambaran utuh, dokter menunggu informasi, atau klinik sulit melihat hambatan dalam alur."
                en="We begin at the moment context is lost: patients repeat their story, nurses work without a full picture, doctors wait for information, or clinics cannot see where the flow is blocked."
              />
            </p>
            <p>
              <T
                id="Aethel menyusun ulang hubungan itu melalui sistem yang menjaga peran manusia tetap nyata. Teknologi membantu mengatur, mengingat, menghubungkan, dan memberi konteks. Keputusan klinis tetap menjadi tanggung jawab tenaga kesehatan."
                en="Aethel rebuilds those relationships through a system that keeps human roles real. Technology helps coordinate, remember, connect, and provide context. Clinical decisions remain the responsibility of healthcare professionals."
              />
            </p>
          </div>
        </div>
      </section>
      <section className="section values">
        <div className="container">
          <SectionTitle
            centered
            kicker={<T id="Prinsip" en="Principles" />}
            title={
              <T
                id="Nilai yang terlihat dalam keputusan produk."
                en="Values visible in product decisions."
              />
            }
          />
          <div className="values-grid">
            {[
              ["01", "Berguna sebelum canggih", "Teknologi harus menyelesaikan friksi yang nyata."],
              ["02", "Konteks dengan batas", "Terhubung tetap menghormati hak akses dan privasi."],
              [
                "03",
                "Manusia tetap bertanggung jawab",
                "Sistem membantu; tenaga kesehatan menilai dan memutuskan.",
              ],
              [
                "04",
                "Berkembang dengan bukti",
                "Konsep, pilot, dan fitur tersedia tidak disamakan.",
              ],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "error" | "ready">("idle");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const required = ["name", "email", "organization", "interest", "message"];
    const next = Object.fromEntries(
      required.filter((key) => !String(data.get(key) || "").trim()).map((key) => [key, true]),
    );
    if (!next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email"))))
      next.email = true;
    setErrors(next);
    setStatus(Object.keys(next).length ? "error" : "ready");
  }

  return (
    <main className="contact-page">
      <section className="contact-wrap">
        <div className="container contact-grid">
          <div>
            <p className="kicker">
              <T id="Mulai percakapan" en="Start a conversation" />
            </p>
            <h1>
              <T
                id="Ceritakan pelayanan yang ingin Anda perbaiki."
                en="Tell us about the care experience you want to improve."
              />
            </h1>
            <p>
              <T
                id="Kami akan memulai dari konteks organisasi, pengguna, dan masalahnya—bukan langsung dari daftar fitur."
                en="We will begin with your organization, users, and problem—not immediately with a feature list."
              />
            </p>
            <div className="contact-promise">
              <ShieldCheck />
              <div>
                <b>
                  <T id="Jelas sejak awal" en="Clear from the start" />
                </b>
                <span>
                  <T
                    id="Form ini adalah prototipe antarmuka dan belum terhubung ke backend pengiriman."
                    en="This form is an interface prototype and is not connected to a submission backend."
                  />
                </span>
              </div>
            </div>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="form-head">
              <span>REQUEST / INTRODUCTION</span>
              <h2>
                <T id="Minta demo" en="Request a demo" />
              </h2>
            </div>
            <div className="form-pair">
              <Field label="Nama lengkap" name="name" error={errors.name} />
              <Field label="Organisasi" name="organization" error={errors.organization} />
            </div>
            <Field label="Email profesional" name="email" type="email" error={errors.email} />
            <label className={errors.interest ? "error" : ""}>
              <span>Topik</span>
              <select name="interest" defaultValue="">
                <option value="" disabled>
                  Pilih topik
                </option>
                <option>Ekosistem Aethel</option>
                <option>Aethel · Operasional klinik</option>
                <option>Ordin · Tenaga klinis</option>
                <option>Meridian · Pasien</option>
                <option>Kemitraan & inovasi</option>
              </select>
            </label>
            <label className={errors.message ? "error" : ""}>
              <span>Pesan</span>
              <textarea
                name="message"
                rows={5}
                placeholder="Ceritakan konteks dan kebutuhan Anda..."
              />
            </label>
            {status === "error" && (
              <p className="form-message error">
                <T id="Lengkapi kolom yang ditandai." en="Complete the highlighted fields." />
              </p>
            )}
            {status === "ready" && (
              <p className="form-message ready">
                <Check size={17} />
                <T
                  id="Data sudah lengkap. Pengiriman belum dilakukan karena endpoint belum dikonfigurasi."
                  en="Your information is complete. Nothing was sent because an endpoint has not been configured."
                />
              </p>
            )}
            <button className="button button-primary" type="submit">
              <T id="Periksa permintaan" en="Review request" />
              <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: boolean;
}) {
  return (
    <label className={error ? "error" : ""}>
      <span>{label}</span>
      <input name={name} type={type} placeholder={label} />
    </label>
  );
}

function ClosingCta() {
  return (
    <section className="closing-cta">
      <div className="cta-signal" />
      <div className="container">
        <p className="kicker">
          <T id="Percakapan berikutnya" en="The next conversation" />
        </p>
        <h2>
          <T id="Mulai dari masalah pelayanan yang nyata." en="Start with a real care problem." />
        </h2>
        <p>
          <T
            id="Jelajahi bagaimana Aethel dapat tumbuh bersama fasilitas, tenaga kesehatan, pasien, dan mitra inovasi."
            en="Explore how Aethel can grow with facilities, healthcare professionals, patients, and innovation partners."
          />
        </p>
        <div className="button-row">
          <Link className="button button-light" to="/contact">
            <T id="Minta demo" en="Request a demo" />
            <ArrowRight size={16} />
          </Link>
          <Link className="button button-outline-light" to="/ecosystem">
            <T id="Kembali ke ekosistem" en="Return to ecosystem" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link to="/" className="wordmark footer-wordmark">
            <BrandGlyph />
            <span>aethel</span>
          </Link>
          <p>
            <T
              id="Ekosistem teknologi kesehatan yang menghubungkan alur, peran, dan konteks."
              en="A healthcare technology ecosystem connecting flow, roles, and context."
            />
          </p>
        </div>
        <div>
          <b>
            <T id="Jelajahi" en="Explore" />
          </b>
          <Link to="/ecosystem">
            <T id="Ekosistem" en="Ecosystem" />
          </Link>
          <Link to="/journey">
            <T id="Perjalanan pasien" en="Patient journey" />
          </Link>
          <Link to="/technology">
            <T id="Teknologi" en="Technology" />
          </Link>
          <Link to="/about">
            <T id="Tentang" en="About" />
          </Link>
        </div>
        <div>
          <b>Platform</b>
          <Link to="/platform/aethel">Aethel</Link>
          <Link to="/platform/ordin">Ordin</Link>
          <Link to="/platform/meridian">Meridian</Link>
        </div>
        <div>
          <b>
            <T id="Status produk" en="Product status" />
          </b>
          <span>
            <StatusBadge status="live" />{" "}
            <T id="Tersedia dalam implementasi" en="Available in implementation" />
          </span>
          <span>
            <StatusBadge status="building" /> <T id="Sedang dikembangkan" en="In development" />
          </span>
          <span>
            <StatusBadge status="vision" />{" "}
            <T id="Konsep / arah masa depan" en="Concept / future direction" />
          </span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Aethel · PT Solutivo Labs Indonesia</span>
        <span>
          <T
            id="Klaim produk mengikuti dokumentasi proyek yang tersedia."
            en="Product claims follow available project documentation."
          />
        </span>
      </div>
    </footer>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "ecosystem", Component: EcosystemPage },
      { path: "journey", Component: PatientJourneyPage },
      { path: "platform/vanguard", loader: () => redirect("/platform/ordin") },
      { path: "platform/:platform", Component: PlatformPage },
      { path: "technology", Component: TechnologyPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: Home },
    ],
  },
  {
    path: "/clinical",
    lazy: async () => ({
      Component: (await import("../ClinicalWorkspace")).default,
    }),
  },
]);
