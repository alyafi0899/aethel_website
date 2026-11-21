import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  HeartPulse,
  History,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Pill,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import "./clinical.css";

type WorkspaceMode = "nurse" | "doctor";
type TriageLevel = "Hijau" | "Kuning" | "Merah" | "Hitam";
type Decision = "pending" | "accepted" | "changed" | "rejected";

const patient = {
  name: "Nadia Prameswari",
  initials: "NP",
  mrn: "RM-2026-01842",
  encounter: "KJ-260218-0047",
  age: "34 tahun",
  sex: "Perempuan",
  queue: "A-014",
  allergies: "Amoksisilin",
  complaint: "Nyeri perut kanan bawah sejak tadi malam",
};

const vitals = [
  ["Tekanan darah", "118/76", "mmHg", "Stabil"],
  ["Nadi", "108", "x/menit", "Perlu ditinjau"],
  ["SpO₂", "98", "%", "Dalam rentang"],
  ["Suhu", "37.8", "°C", "Meningkat"],
  ["Pernapasan", "20", "x/menit", "Dalam rentang"],
  ["Skala nyeri", "7", "/10", "Nyeri berat"],
];

const timeline = [
  ["08:42", "Registrasi kunjungan", "Resepsionis · sumber: walk-in"],
  ["08:51", "Pemeriksaan awal dimulai", "Ns. Maya Putri"],
  ["09:02", "Tanda vital dicatat", "6 parameter · data asli dipertahankan"],
  ["09:08", "Laporan perawat dikirim", "Menunggu verifikasi dokter"],
];

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "indigo";
}) {
  return <span className={`cw-status ${tone}`}>{children}</span>;
}

function WorkspaceLogo() {
  return (
    <div className="cw-logo">
      <img src="/clinical-assets/brand-mark-3.svg" alt="Aethel" />
      <span>Clinical workspace</span>
    </div>
  );
}

function Sidebar({
  mode,
  onModeChange,
  open,
  onClose,
}: {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  open: boolean;
  onClose: () => void;
}) {
  const items =
    mode === "nurse"
      ? [
          [LayoutDashboard, "Ruang kerja", true],
          [Users, "Antrean pasien", false],
          [ClipboardCheck, "Pemeriksaan awal", false],
          [AlertTriangle, "Laporan darurat", false],
          [History, "Riwayat tugas", false],
        ]
      : [
          [LayoutDashboard, "Ruang kerja", true],
          [Users, "Antrean konsultasi", false],
          [Stethoscope, "Kunjungan aktif", false],
          [FileCheck2, "Rekam medis", false],
          [History, "Riwayat pasien", false],
        ];

  return (
    <aside className={`cw-sidebar ${open ? "open" : ""}`}>
      <div className="cw-side-top">
        <WorkspaceLogo />
        <button className="cw-side-close" onClick={onClose} aria-label="Tutup navigasi">
          <X size={18} />
        </button>
      </div>
      <div className="cw-clinic">
        <span className="cw-clinic-mark">KH</span>
        <div>
          <b>Klinik Harmoni</b>
          <small>Jakarta Selatan</small>
        </div>
        <ChevronDown size={15} />
      </div>
      <div className="cw-mode-switch" aria-label="Pilih mode">
        <button className={mode === "nurse" ? "active" : ""} onClick={() => onModeChange("nurse")}>
          Perawat
        </button>
        <button
          className={mode === "doctor" ? "active" : ""}
          onClick={() => onModeChange("doctor")}
        >
          Dokter
        </button>
      </div>
      <nav className="cw-nav">
        <small>ALUR KLINIS</small>
        {items.map(([Icon, label, active]) => {
          const ItemIcon = Icon as typeof LayoutDashboard;
          return (
            <button className={active ? "active" : ""} key={label as string}>
              <ItemIcon size={17} />
              <span>{label as string}</span>
              {active && <i />}
            </button>
          );
        })}
      </nav>
      <div className="cw-side-note">
        <ShieldCheck size={17} />
        <div>
          <b>Prototipe UI</b>
          <span>Data demonstrasi. Tidak untuk keputusan klinis.</span>
        </div>
      </div>
      <div className="cw-user">
        <span>{mode === "nurse" ? "MP" : "AS"}</span>
        <div>
          <b>{mode === "nurse" ? "Ns. Maya Putri" : "dr. Arya Santoso"}</b>
          <small>{mode === "nurse" ? "Perawat · Shift pagi" : "Dokter umum · Poli 1"}</small>
        </div>
        <MoreHorizontal size={17} />
      </div>
    </aside>
  );
}

function Topbar({ mode, onMenu }: { mode: WorkspaceMode; onMenu: () => void }) {
  return (
    <header className="cw-topbar">
      <button className="cw-mobile-menu" onClick={onMenu} aria-label="Buka navigasi">
        <Menu size={20} />
      </button>
      <div className="cw-breadcrumb">
        <span>Ruang kerja</span>
        <ChevronRight size={13} />
        <b>{mode === "nurse" ? "Pemeriksaan awal" : "Konsultasi dokter"}</b>
      </div>
      <div className="cw-top-actions">
        <div className="cw-saved">
          <CheckCircle2 size={14} />
          Tersimpan 09:12
        </div>
        <button className="cw-icon-button" aria-label="Cari">
          <Search size={18} />
        </button>
        <button className="cw-icon-button has-alert" aria-label="Notifikasi">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

function PatientHeader({ mode }: { mode: WorkspaceMode }) {
  return (
    <section className="cw-patient-header">
      <div className="cw-patient-main">
        <button className="cw-back" aria-label="Kembali">
          <ArrowLeft size={18} />
        </button>
        <span className="cw-patient-avatar">{patient.initials}</span>
        <div className="cw-patient-name">
          <div>
            <h1>{patient.name}</h1>
            <StatusPill tone={mode === "nurse" ? "warning" : "indigo"}>
              {mode === "nurse" ? "Pemeriksaan awal" : "Menunggu verifikasi"}
            </StatusPill>
          </div>
          <p>
            {patient.mrn} <i /> {patient.age} <i /> {patient.sex} <i /> Antrean {patient.queue}
          </p>
        </div>
      </div>
      <div className="cw-patient-alert">
        <AlertTriangle size={17} />
        <span>
          <small>ALERGI TERCATAT</small>
          <b>{patient.allergies}</b>
        </span>
      </div>
    </section>
  );
}

function WorkflowRail({ mode }: { mode: WorkspaceMode }) {
  const steps =
    mode === "nurse"
      ? ["Data perawat", "Pemeriksaan awal", "Triase", "Kirim laporan"]
      : ["Ringkasan perawat", "Pemeriksaan fisik", "Panduan", "Keputusan", "RME & billing"];
  const active = mode === "nurse" ? 2 : 1;
  return (
    <div className="cw-workflow-rail">
      {steps.map((step, index) => (
        <div className={index < active ? "done" : index === active ? "active" : ""} key={step}>
          <span>{index < active ? <Check size={12} /> : index + 1}</span>
          <b>{step}</b>
        </div>
      ))}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  eyebrow,
  title,
  action,
  children,
  className = "",
}: {
  icon: typeof Activity;
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`cw-card ${className}`}>
      <div className="cw-card-head">
        <div className="cw-card-title">
          <span>
            <Icon size={18} />
          </span>
          <div>
            {eyebrow && <small>{eyebrow}</small>}
            <h2>{title}</h2>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SocratesSummary() {
  const items = [
    ["S · Site", "Perut kanan bawah"],
    ["O · Onset", "Muncul perlahan sejak tadi malam"],
    ["C · Character", "Tajam, menetap"],
    ["R · Radiation", "Tidak menjalar"],
    ["A · Associations", "Mual, nafsu makan berkurang"],
    ["T · Timing", "Memburuk dalam 6 jam terakhir"],
    ["E · Exacerbating", "Bergerak dan batuk"],
    ["S · Severity", "7 dari 10"],
  ];
  return (
    <div className="cw-socrates-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <small>{label}</small>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
}

function VitalsGrid() {
  return (
    <div className="cw-vitals-grid">
      {vitals.map(([label, value, unit, status], index) => (
        <div className={index === 1 || index === 3 || index === 5 ? "attention" : ""} key={label}>
          <span>{label}</span>
          <p>
            <b>{value}</b>
            <small>{unit}</small>
          </p>
          <em>{status}</em>
        </div>
      ))}
    </div>
  );
}

function NurseMode() {
  const [selectedLevel, setSelectedLevel] = useState<TriageLevel>("Kuning");
  const [finalLevel, setFinalLevel] = useState<TriageLevel>("Kuning");
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [overrideSaved, setOverrideSaved] = useState(false);
  const levels: TriageLevel[] = ["Hijau", "Kuning", "Merah", "Hitam"];

  function saveOverride() {
    setFinalLevel(selectedLevel);
    setOverrideSaved(true);
    setOverrideOpen(false);
  }

  return (
    <>
      <div className="cw-page-intro">
        <div>
          <p className="cw-overline">KUNJUNGAN {patient.encounter}</p>
          <h2>Pemeriksaan awal & triase</h2>
          <p>Lengkapi konteks pasien, tinjau data asli, lalu tetapkan keputusan triase final.</p>
        </div>
        <StatusPill tone={submitted ? "success" : "neutral"}>
          {submitted ? "Laporan terkirim" : "Draf otomatis tersimpan"}
        </StatusPill>
      </div>

      <SectionCard
        icon={MessageSquareText}
        eyebrow="KELUHAN UTAMA"
        title={patient.complaint}
        action={<button className="cw-link-button">Ubah data</button>}
      >
        <SocratesSummary />
      </SectionCard>

      <div className="cw-two-column">
        <SectionCard icon={History} title="Riwayat kesehatan">
          <div className="cw-info-list">
            <div>
              <span>Riwayat penyakit</span>
              <b>Gastritis berulang</b>
            </div>
            <div>
              <span>Obat rutin</span>
              <b>Tidak ada</b>
            </div>
            <div>
              <span>Alergi obat</span>
              <b className="danger-text">Amoksisilin</b>
            </div>
            <div>
              <span>Riwayat keluarga</span>
              <b>Belum diketahui</b>
            </div>
          </div>
        </SectionCard>
        <SectionCard icon={Paperclip} title="Pemeriksaan penunjang">
          <div className="cw-empty-compact">
            <FlaskConical size={22} />
            <div>
              <b>Belum ada hasil laboratorium</b>
              <span>Tambahkan hasil dengan satuan dan rentang rujukan.</span>
            </div>
          </div>
          <button className="cw-outline-button">
            <Plus size={14} /> Tambah hasil / lampiran
          </button>
        </SectionCard>
      </div>

      <SectionCard
        icon={Activity}
        eyebrow="DICATAT 09:02 · NS. MAYA PUTRI"
        title="Tanda vital & pengukuran"
        action={<StatusPill tone="success">Data asli</StatusPill>}
      >
        <VitalsGrid />
        <div className="cw-source-note">
          <LockKeyhole size={14} />
          Data pengukuran asli tidak diubah oleh hasil kalkulasi. Satuan, waktu, dan penulis tetap
          tersimpan.
        </div>
      </SectionCard>

      <SectionCard
        icon={HeartPulse}
        eyebrow="SIMULASI UI · ATURAN KLINIS BELUM DIMUAT"
        title="Rekomendasi triase"
        className="cw-triage-card"
      >
        <div className="cw-triage-layout">
          <div className="cw-recommendation">
            <span className="cw-recommend-label">CONTOH REKOMENDASI SISTEM</span>
            <div className="cw-level-display yellow">
              <span />
              <div>
                <small>LEVEL</small>
                <b>Kuning</b>
              </div>
            </div>
            <p>
              Rekomendasi ini hanya mendemonstrasikan tata letak. Katalog aturan tervalidasi belum
              tersedia di repository ini.
            </p>
            <div className="cw-trigger-list">
              <b>Data pemicu ilustratif</b>
              <span>
                <AlertTriangle size={14} /> Skala nyeri tercatat 7/10
              </span>
              <span>
                <Activity size={14} /> Nadi 108 x/menit
              </span>
              <span>
                <Clock3 size={14} /> Keluhan memburuk dalam 6 jam
              </span>
            </div>
          </div>
          <div className="cw-final-decision">
            <div className="cw-decision-head">
              <div>
                <small>KEPUTUSAN FINAL PERAWAT</small>
                <h3>{finalLevel}</h3>
              </div>
              <StatusPill tone={overrideSaved ? "warning" : "success"}>
                {overrideSaved ? "Di-override" : "Sesuai rekomendasi"}
              </StatusPill>
            </div>
            {!overrideOpen ? (
              <>
                <p>
                  Perawat tetap bertanggung jawab menetapkan level akhir berdasarkan penilaian
                  klinis.
                </p>
                <div className="cw-decision-actions">
                  <button className="cw-primary-button" onClick={() => setOverrideSaved(false)}>
                    <Check size={15} /> Terima rekomendasi
                  </button>
                  <button className="cw-outline-button" onClick={() => setOverrideOpen(true)}>
                    Ubah level
                  </button>
                </div>
              </>
            ) : (
              <div className="cw-override-form">
                <label>Level final</label>
                <div className="cw-level-options">
                  {levels.map((level) => (
                    <button
                      className={selectedLevel === level ? `active ${level.toLowerCase()}` : ""}
                      onClick={() => setSelectedLevel(level)}
                      key={level}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <label>
                  Alasan perubahan
                  <textarea
                    defaultValue="Penilaian ulang kondisi pasien dan konteks pemeriksaan langsung."
                    rows={3}
                  />
                </label>
                <div className="cw-decision-actions">
                  <button className="cw-primary-button" onClick={saveOverride}>
                    Simpan override
                  </button>
                  <button className="cw-quiet-button" onClick={() => setOverrideOpen(false)}>
                    Batal
                  </button>
                </div>
              </div>
            )}
            {overrideSaved && (
              <div className="cw-audit-line">
                <History size={14} />
                Rekomendasi Kuning → keputusan {finalLevel} · Ns. Maya Putri · 09:14 · versi aturan
                belum tersedia
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={AlertTriangle}
        title="Catatan & laporan darurat"
        action={<StatusPill tone="neutral">Tidak ada laporan aktif</StatusPill>}
      >
        <div className="cw-emergency-row">
          <div>
            <b>Eskalasikan segera bila ditemukan tanda bahaya</b>
            <span>
              Alur darurat tidak menunggu seluruh pemeriksaan atau rekomendasi katalog selesai.
            </span>
          </div>
          <button className="cw-danger-outline">
            <AlertTriangle size={15} /> Mulai laporan darurat
          </button>
        </div>
      </SectionCard>

      <div className="cw-sticky-action">
        <div>
          <Save size={16} />
          <span>
            <b>Semua perubahan tersimpan</b>
            <small>Draf terakhir 09:14 · kunjungan {patient.encounter}</small>
          </span>
        </div>
        <button className="cw-primary-button" onClick={() => setSubmitted(true)}>
          {submitted ? (
            <>
              <Check size={16} /> Laporan terkirim
            </>
          ) : (
            <>
              Kirim ke dokter <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </>
  );
}

function NurseHandover() {
  return (
    <SectionCard
      icon={ClipboardCheck}
      eyebrow="LAPORAN PERAWAT · DIKIRIM 09:08"
      title="Ringkasan pemeriksaan awal"
      action={<StatusPill tone="warning">Menunggu verifikasi</StatusPill>}
    >
      <div className="cw-handover">
        <div className="cw-handover-main">
          <div className="cw-summary-callout">
            <MessageSquareText size={17} />
            <div>
              <small>KELUHAN UTAMA</small>
              <b>{patient.complaint}</b>
            </div>
          </div>
          <SocratesSummary />
        </div>
        <div className="cw-handover-side">
          <div>
            <small>RIWAYAT</small>
            <b>Gastritis berulang</b>
          </div>
          <div>
            <small>ALERGI</small>
            <b className="danger-text">Amoksisilin</b>
          </div>
          <div>
            <small>OBAT RUTIN</small>
            <b>Tidak ada</b>
          </div>
          <div>
            <small>LAMPIRAN</small>
            <b>0 berkas</b>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function DoctorMode() {
  const [decision, setDecision] = useState<Decision>("pending");
  const [signed, setSigned] = useState(false);
  const [activeGuide, setActiveGuide] = useState(0);
  const guides = useMemo(
    () => [
      ["Nyeri perut akut", "Kandidat panduan berdasarkan keluhan utama dan lokasi nyeri."],
      ["Mual pada dewasa", "Referensi pendamping berdasarkan gejala terkait yang dicatat."],
      ["Pemantauan tanda vital", "Konteks untuk meninjau perubahan nadi dan suhu."],
    ],
    [],
  );

  return (
    <>
      <div className="cw-page-intro">
        <div>
          <p className="cw-overline">KONSULTASI · {patient.encounter}</p>
          <h2>Ringkasan kunjungan & asesmen</h2>
          <p>
            Tinjau laporan perawat, lengkapi pemeriksaan, lalu tetapkan keputusan klinis secara
            eksplisit.
          </p>
        </div>
        <StatusPill tone={signed ? "success" : "warning"}>
          {signed ? "RME ditandatangani" : "Draf belum final"}
        </StatusPill>
      </div>

      <NurseHandover />

      <SectionCard
        icon={Activity}
        title="Tanda vital terakhir"
        action={<button className="cw-link-button">Lihat tren</button>}
      >
        <VitalsGrid />
      </SectionCard>

      <SectionCard icon={Stethoscope} eyebrow="DIISI OLEH DOKTER" title="Pemeriksaan fisik">
        <div className="cw-form-grid">
          <label>
            Keadaan umum
            <select defaultValue="Tampak sakit sedang">
              <option>Tampak baik</option>
              <option>Tampak sakit sedang</option>
              <option>Tampak sakit berat</option>
            </select>
          </label>
          <label>
            Kesadaran
            <select defaultValue="Compos mentis">
              <option>Compos mentis</option>
              <option>Penurunan kesadaran</option>
            </select>
          </label>
          <label className="span-two">
            Temuan pemeriksaan abdomen
            <textarea
              rows={4}
              defaultValue="Inspeksi dalam batas pengamatan. Nyeri tekan kuadran kanan bawah. Temuan lain perlu dikonfirmasi pada pemeriksaan lanjutan."
            />
          </label>
        </div>
        <button className="cw-outline-button">
          <Plus size={14} /> Tambah sistem pemeriksaan
        </button>
      </SectionCard>

      <SectionCard
        icon={BookOpen}
        eyebrow="KATALOG TERVALIDASI · PROTOTIPE TANPA KONTEN KLINIS"
        title="Panduan klinis yang relevan"
        className="cw-guide-card"
      >
        <div className="cw-guide-layout">
          <div className="cw-guide-list">
            {guides.map(([title, copy], index) => (
              <button
                className={activeGuide === index ? "active" : ""}
                onClick={() => setActiveGuide(index)}
                key={title}
              >
                <span>
                  <BookOpen size={16} />
                </span>
                <div>
                  <b>{title}</b>
                  <small>{copy}</small>
                </div>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
          <div className="cw-guide-detail">
            <div className="cw-guide-meta">
              <StatusPill tone="indigo">Referensi, bukan diagnosis</StatusPill>
              <span>Versi konten: belum tersedia</span>
            </div>
            <h3>{guides[activeGuide][0]}</h3>
            <p>
              Bagian ini akan menampilkan isi katalog tervalidasi yang relevan terhadap data
              kunjungan. Konten klinis tidak disalin atau direkonstruksi karena file sumber belum
              tersedia pada repository prototipe.
            </p>
            <div className="cw-limitation">
              <AlertTriangle size={16} />
              <span>
                <b>Keterbatasan</b> Kandidat panduan tidak menetapkan diagnosis, order, atau resep.
                Data yang belum tersedia tetap ditandai “belum diketahui”.
              </span>
            </div>
            <button className="cw-text-button">
              Buka referensi lengkap <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={ClipboardCheck} eyebrow="KEPUTUSAN DOKTER" title="Tinjau rekomendasi">
        <div className="cw-review-recommendation">
          <div>
            <span className="cw-recommend-label">KANDIDAT ASESMEN · CONTOH UI</span>
            <h3>Nyeri abdomen akut — perlu evaluasi lanjutan</h3>
            <p>
              Ditampilkan karena keluhan utama, lokasi, karakter, dan data pemeriksaan yang
              tercatat. Bukan diagnosis final.
            </p>
          </div>
          <div className="cw-review-buttons">
            <button
              className={decision === "accepted" ? "active" : ""}
              onClick={() => setDecision("accepted")}
            >
              <Check size={15} /> Terima
            </button>
            <button
              className={decision === "changed" ? "active" : ""}
              onClick={() => setDecision("changed")}
            >
              Ubah
            </button>
            <button
              className={decision === "rejected" ? "active reject" : ""}
              onClick={() => setDecision("rejected")}
            >
              Tolak
            </button>
          </div>
        </div>
        {decision !== "pending" && (
          <div className="cw-decision-record">
            <label>
              Catatan keputusan dokter
              <textarea
                rows={3}
                defaultValue={
                  decision === "accepted"
                    ? "Rekomendasi diterima sebagai referensi asesmen, tetap memerlukan evaluasi klinis lanjutan."
                    : "Keputusan disesuaikan berdasarkan pemeriksaan langsung dan konteks klinis pasien."
                }
              />
            </label>
            <div>
              <History size={14} /> Keputusan{" "}
              {decision === "accepted" ? "diterima" : decision === "changed" ? "diubah" : "ditolak"}{" "}
              · dr. Arya Santoso · 09:24
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon={FileText}
        eyebrow="DRAF OTOMATIS · WAJIB DITINJAU"
        title="Rekam medis SOAP"
      >
        <div className="cw-soap-grid">
          <label>
            <span>S</span>
            <div>
              <b>Subjective</b>
              <textarea
                rows={4}
                defaultValue="Nyeri perut kanan bawah sejak tadi malam, tajam dan menetap, skala 7/10, disertai mual."
              />
            </div>
          </label>
          <label>
            <span>O</span>
            <div>
              <b>Objective</b>
              <textarea
                rows={4}
                defaultValue="TD 118/76 mmHg, nadi 108 x/menit, suhu 37.8°C. Nyeri tekan kuadran kanan bawah."
              />
            </div>
          </label>
          <label>
            <span>A</span>
            <div>
              <b>Assessment</b>
              <textarea rows={4} placeholder="Diagnosis final hanya ditetapkan oleh dokter." />
            </div>
          </label>
          <label>
            <span>P</span>
            <div>
              <b>Plan</b>
              <textarea
                rows={4}
                placeholder="Pemeriksaan, tindakan, terapi, edukasi, dan tindak lanjut."
              />
            </div>
          </label>
        </div>
      </SectionCard>

      <div className="cw-two-column">
        <SectionCard icon={Pill} title="Resep & order klinis">
          <div className="cw-empty-compact">
            <Pill size={22} />
            <div>
              <b>Belum ada order disetujui</b>
              <span>Rekomendasi panduan tidak otomatis menjadi resep.</span>
            </div>
          </div>
          <button className="cw-outline-button">
            <Plus size={14} /> Tambah order untuk ditinjau
          </button>
        </SectionCard>
        <SectionCard icon={WalletCards} title="Pratinjau item biaya">
          <div className="cw-billing-line">
            <span>
              Konsultasi dokter umum<small>Layanan · 1 item</small>
            </span>
            <b>Rp 150.000</b>
          </div>
          <div className="cw-billing-total">
            <span>Pratinjau total</span>
            <b>Rp 150.000</b>
          </div>
          <p className="cw-card-footnote">
            Invoice diterbitkan dan pembayaran diterima melalui hak akses kasir.
          </p>
        </SectionCard>
      </div>

      <SectionCard icon={CalendarClock} title="Kronologi kunjungan">
        <div className="cw-timeline">
          {timeline.map(([time, title, note]) => (
            <div key={time}>
              <span>{time}</span>
              <i />
              <p>
                <b>{title}</b>
                <small>{note}</small>
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="cw-sticky-action">
        <div>
          <LockKeyhole size={16} />
          <span>
            <b>
              {signed ? "Rekam medis telah ditandatangani" : "Diagnosis dan terapi belum final"}
            </b>
            <small>
              {signed
                ? "Versi final tercatat pada kunjungan ini"
                : "Tinjau seluruh draf sebelum menandatangani"}
            </small>
          </span>
        </div>
        <div className="cw-sticky-buttons">
          <button className="cw-outline-button">Simpan draf</button>
          <button className="cw-primary-button" onClick={() => setSigned(true)}>
            {signed ? (
              <>
                <Check size={16} /> Ditandatangani
              </>
            ) : (
              <>
                Tinjau & tanda tangani <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default function ClinicalWorkspace() {
  const [mode, setMode] = useState<WorkspaceMode>("nurse");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="cw-app">
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          className="cw-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup navigasi"
        />
      )}
      <div className="cw-main">
        <Topbar mode={mode} onMenu={() => setSidebarOpen(true)} />
        <PatientHeader mode={mode} />
        <WorkflowRail mode={mode} />
        <main className="cw-content">{mode === "nurse" ? <NurseMode /> : <DoctorMode />}</main>
      </div>
    </div>
  );
}
