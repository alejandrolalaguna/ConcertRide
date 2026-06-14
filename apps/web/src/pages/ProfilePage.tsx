import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AlertTriangle, Bell, BellOff, Check, Link2, ShieldCheck, Star, TrendingUp, Upload } from "lucide-react";
import type { IdentityReview, LicenseReview, Review, Ride } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { usePush } from "@/lib/usePush";
import { SPANISH_CITIES } from "@/lib/constants";
import { initials, formatDay, formatDate } from "@/lib/format";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useI18n } from "@/lib/i18n";

const GENRE_OPTIONS = [
  "Indie",
  "Rock",
  "Pop",
  "Electrónica",
  "Hip-Hop",
  "Reggaetón",
  "Techno",
  "Punk",
  "Metal",
  "Folk",
  "Jazz",
  "Clásica",
];

function normalizeGenre(s: string) {
  return s.trim().toLowerCase();
}

type Tristate = "yes" | "no" | "";

function toTristate(val: boolean | null | undefined): Tristate {
  if (val === true) return "yes";
  if (val === false) return "no";
  return "";
}

function fromTristate(val: Tristate): boolean | null {
  if (val === "yes") return true;
  if (val === "no") return false;
  return null;
}

function TristateToggle({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Tristate;
  onChange: (v: Tristate) => void;
  options: { value: Tristate; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
        {label}
      </span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 transition-colors ${
              value === opt.value
                ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useI18n();
  const { user, loading, refresh, logout } = useSession();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [smoker, setSmoker] = useState<Tristate>("");
  const [hasLicense, setHasLicense] = useState<Tristate>("");
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [bio, setBio] = useState("");
  const [musicGenresInput, setMusicGenresInput] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [topArtistsInput, setTopArtistsInput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [confirmedTrips, setConfirmedTrips] = useState(0);
  const [refCopied, setRefCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [licenseReview, setLicenseReview] = useState<LicenseReview | null | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [identityReview, setIdentityReview] = useState<IdentityReview | null | undefined>(undefined);
  const [identityVerifying, setIdentityVerifying] = useState(false);
  const [identityVerifyError, setIdentityVerifyError] = useState<string | null>(null);
  const [identitySelectedFile, setIdentitySelectedFile] = useState<File | null>(null);
  const [identityPreviewUrl, setIdentityPreviewUrl] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const { state: pushState, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePush();

  useSeoMeta({
    title: "Mi perfil",
    description: "Gestiona tu perfil de ConcertRide: datos personales, ciudad base, preferencias de viaje y vehículo.",
    canonical: `${SITE_URL}/profile`,
    noindex: true,
  });

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? "");
    setHomeCity(user.home_city ?? "");
    setSmoker(toTristate(user.smoker));
    setHasLicense(toTristate(user.has_license));
    setCarModel(user.car_model ?? "");
    setCarColor(user.car_color ?? "");
    setBio(user.bio ?? "");
    const userGenres = user.music_genres ?? [];
    setMusicGenresInput(userGenres.join(", "));
    setSelectedGenres(userGenres);
    setTopArtistsInput((user.top_artists ?? []).join(", "));
  }, [user]);

  const knownGenreSet = useMemo(
    () => new Set(GENRE_OPTIONS.map(normalizeGenre)),
    [],
  );
  const customGenres = useMemo(
    () => selectedGenres.filter((g) => !knownGenreSet.has(normalizeGenre(g))),
    [selectedGenres, knownGenreSet],
  );

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) => {
      const target = normalizeGenre(genre);
      const exists = prev.some((g) => normalizeGenre(g) === target);
      const next = exists
        ? prev.filter((g) => normalizeGenre(g) !== target)
        : prev.length >= 8
        ? prev
        : [...prev, genre];
      setMusicGenresInput(next.join(", "));
      return next;
    });
  }

  useEffect(() => {
    if (!user) return;
    setReviewsLoading(true);
    api.users
      .listReviews(user.id)
      .then((r) => setReviews(r.reviews))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    api.rides
      .list({ driver_id: user.id })
      .then((r) => setMyRides(r.rides))
      .catch(() => setMyRides([]));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    api.rides
      .listMine()
      .then((r) => setConfirmedTrips(r.passenger_requests.filter((req) => req.status === "confirmed").length))
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!user || user.license_verified) return;
    api.auth.myLicenseReview().then((r) => setLicenseReview(r.review)).catch(() => setLicenseReview(null));
  }, [user?.id, user?.license_verified]);

  useEffect(() => {
    if (!user || user.identity_verified) return;
    api.auth.myIdentityReview().then((r) => setIdentityReview(r.review)).catch(() => setIdentityReview(null));
  }, [user?.id, user?.identity_verified]);

  if (!loading && !user) return <Navigate to="/login?next=/profile" replace />;
  if (loading || !user) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const splitTags = (raw: string, max: number): string[] | null => {
        const parts = raw
          .split(/[,|\n]/)
          .map((p) => p.trim())
          .filter(Boolean)
          .slice(0, max);
        return parts.length ? parts : null;
      };
      const finalGenres = selectedGenres.length > 0 ? selectedGenres.slice(0, 8) : splitTags(musicGenresInput, 8);
      await api.auth.updateProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || null,
        home_city: homeCity || null,
        smoker: fromTristate(smoker),
        has_license: fromTristate(hasLicense),
        car_model: carModel.trim() || null,
        car_color: carColor.trim() || null,
        bio: bio.trim() || null,
        music_genres: finalGenres,
        top_artists: splitTags(topArtistsInput, 10),
      });
      await refresh();
      setSaved(true);
      toast.success(t("profile.toastSaved"));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main" className="relative min-h-dvh bg-cr-bg text-cr-text pt-14 overflow-hidden">
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(219,255,0,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-12 space-y-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-5"
        >
          {/* Avatar — sharp corners, lime ring on hover */}
          <div className="relative group/avatar flex-shrink-0">
            <div className="w-16 h-16 bg-cr-primary text-black font-display text-2xl font-black flex items-center justify-center transition-shadow duration-200 group-hover/avatar:shadow-[0_0_24px_rgb(219_255_0/0.3)]">
              {initials(user.name)}
            </div>
            {user.verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cr-primary flex items-center justify-center" aria-label={t("profile.verifiedBadge")}>
                <ShieldCheck size={10} strokeWidth={2.5} className="text-black" />
              </span>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-1">
              {t("profile.eyebrow")}
            </p>
            <h1 className="font-display text-3xl md:text-4xl uppercase leading-[0.92] tracking-tight">{user.name}</h1>
            <p className="font-mono text-xs text-white/35 mt-1">{user.email}</p>
          </div>
        </motion.header>

        {/* Stats row */}
        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-0 border border-white/[0.06] bg-white/[0.02]"
        >
          {[
            { label: t("profile.statRidesGiven"), value: user.rides_given, color: "text-cr-text" },
            {
              label: t("profile.statRating"),
              value: user.rating.toFixed(1),
              suffix: user.rating_count > 0 ? ` (${user.rating_count})` : "",
              color: "text-cr-primary",
              star: true,
            },
            { label: t("profile.statConfirmed"), value: confirmedTrips, color: "text-cr-text" },
          ].map((stat, i) => (
            <div key={stat.label} className={`flex-1 px-5 py-4 ${i > 0 ? "border-l border-white/[0.06]" : ""}`}>
              <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">{stat.label}</dt>
              <dd className={`font-mono text-xl font-bold flex items-center gap-1 ${stat.color}`}>
                {stat.star && <Star size={13} className="fill-cr-primary stroke-cr-primary" aria-hidden="true" />}
                {stat.value}
                {stat.suffix && <span className="text-white/30 text-[11px] font-normal">{stat.suffix}</span>}
              </dd>
            </div>
          ))}
        </motion.dl>

        {/* Driver earnings panel — only shown if user has license or has published rides */}
        {(user.has_license || myRides.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4 border border-white/[0.08] bg-white/[0.02] p-5 relative overflow-hidden"
          >
            <div aria-hidden="true" className="absolute top-0 right-0 w-[200px] h-[100px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(219,255,0,0.04) 0%, transparent 70%)" }} />
            <header className="flex items-center gap-2 relative">
              <TrendingUp size={14} className="text-cr-primary" aria-hidden="true" />
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary">
                {t("profile.driverPanel")}
              </h2>
            </header>
            <dl className="grid grid-cols-3 gap-0 border border-white/[0.06]">
              <div className="px-4 py-3">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.statRidesGiven")}
                </dt>
                <dd className="font-mono text-xl text-cr-text">{user.rides_given}</dd>
              </div>
              <div className="px-4 py-3 border-l border-white/[0.06]">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.earningsEst")}
                </dt>
                <dd className="font-mono text-xl text-cr-primary">
                  €{myRides
                    .filter((r) => r.status === "completed")
                    .reduce((sum, r) => sum + r.price_per_seat * (r.seats_total - r.seats_left), 0)
                    .toFixed(0)}
                </dd>
              </div>
              <div className="px-4 py-3 border-l border-white/[0.06]">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.seatsSold")}
                </dt>
                <dd className="font-mono text-xl text-cr-text">
                  {myRides.reduce((sum, r) => sum + (r.seats_total - r.seats_left), 0)}
                </dd>
              </div>
            </dl>

            {myRides.filter((r) => r.status === "active" || r.status === "full").length > 0 && (
              <div className="border-t border-dashed border-cr-border pt-4 space-y-2">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  {t("profile.upcomingRides")}
                </p>
                <ul className="space-y-2">
                  {myRides
                    .filter((r) => r.status === "active" || r.status === "full")
                    .slice(0, 3)
                    .map((r) => (
                      <li key={r.id}>
                        <Link
                          to={`/rides/${r.id}`}
                          className="flex items-center justify-between gap-4 py-2 border-b border-dashed border-cr-border last:border-0 hover:text-cr-primary transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="font-sans text-xs font-semibold text-cr-text group-hover:text-cr-primary truncate">
                              {r.concert.artist}
                            </p>
                            <p className="font-mono text-[11px] text-cr-text-muted">
                              {r.origin_city} → {r.concert.venue.city} · {formatDate(r.departure_time)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-mono text-xs text-cr-primary">{t("profile.pricePerSeat", { price: r.price_per_seat })}</p>
                            <p className="font-mono text-[11px] text-cr-text-muted">
                              {t("profile.seatsFree", { left: r.seats_left, total: r.seats_total })}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {user.referral_code && (
              <div className="border-t border-dashed border-cr-border pt-4 space-y-2">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  {t("profile.referralTitle")}
                  {user.referral_count >= 3 && (
                    <span className="ml-2 bg-cr-primary text-black px-1.5 py-0.5 text-[9px]">
                      {t("profile.ambassadorBadge")}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-[11px] text-cr-text bg-cr-bg border border-cr-border px-2 py-1.5 truncate">
                    {`${window.location.origin}/register?ref=${user.referral_code}`}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`${window.location.origin}/register?ref=${user.referral_code}`)
                        .then(() => {
                          setRefCopied(true);
                          setTimeout(() => setRefCopied(false), 2000);
                        });
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                  >
                    <Link2 size={12} aria-hidden="true" />
                    {refCopied ? t("profile.copied") : t("profile.copy")}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-cr-text-muted">
                  {user.referral_count === 1
                    ? t("profile.referralCountSingular", { count: user.referral_count })
                    : t("profile.referralCountPlural", { count: user.referral_count })}
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* Tu impacto */}
        {(user.rides_given > 0 || confirmedTrips > 0) && (
          <section className="space-y-4 border border-white/[0.06] bg-white/[0.02] p-5">
            <header className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary">
                {t("profile.impactTitle")}
              </span>
            </header>
            <dl className="grid grid-cols-3 gap-0 border border-white/[0.06]">
              <div className="px-4 py-3">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.asDriver")}
                </dt>
                <dd className="font-mono text-xl text-cr-text">{user.rides_given}</dd>
              </div>
              <div className="px-4 py-3 border-l border-white/[0.06]">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.asPassenger")}
                </dt>
                <dd className="font-mono text-xl text-cr-text">{confirmedTrips}</dd>
              </div>
              <div className="px-4 py-3 border-l border-white/[0.06]">
                <dt className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30 mb-1">
                  {t("profile.co2Saved")}
                </dt>
                <dd className="font-mono text-xl text-cr-primary">
                  {Math.round((user.rides_given + confirmedTrips) * 120 * 0.12)} kg
                </dd>
              </div>
            </dl>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
            {t("profile.archiveTitle")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/memorias"
              className="group block border border-white/[0.08] bg-white/[0.02] p-4 hover:border-cr-primary/50 hover:bg-cr-primary/[0.03] transition-all duration-200"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 group-hover:text-cr-primary/60 transition-colors">
                {t("profile.memoriesEyebrow")}
              </p>
              <p className="mt-1.5 font-display text-base uppercase group-hover:text-white transition-colors">{t("profile.memoriesTitle")}</p>
              <p className="mt-1 text-xs text-white/35">
                {t("profile.memoriesDesc")}
              </p>
            </Link>
            <Link
              to="/crew"
              className="group block border border-white/[0.08] bg-white/[0.02] p-4 hover:border-cr-primary/50 hover:bg-cr-primary/[0.03] transition-all duration-200"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 group-hover:text-cr-primary/60 transition-colors">
                {t("profile.crewEyebrow")}
              </p>
              <p className="mt-1.5 font-display text-base uppercase group-hover:text-white transition-colors">{t("profile.crewTitle")}</p>
              <p className="mt-1 text-xs text-white/35">
                {user.crew_count > 0
                  ? user.crew_count === 1
                    ? t("profile.crewCountSingular", { count: user.crew_count })
                    : t("profile.crewCountPlural", { count: user.crew_count })
                  : t("profile.crewEmpty")}
              </p>
            </Link>
            <Link
              to="/feed"
              className="group block border border-white/[0.08] bg-white/[0.02] p-4 hover:border-cr-primary/50 hover:bg-cr-primary/[0.03] transition-all duration-200"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 group-hover:text-cr-primary/60 transition-colors">
                {t("profile.feedEyebrow")}
              </p>
              <p className="mt-1.5 font-display text-base uppercase group-hover:text-white transition-colors">{t("profile.feedTitle")}</p>
              <p className="mt-1 text-xs text-white/35">
                {t("profile.feedDesc")}
              </p>
            </Link>
          </div>
        </section>

        {/* Reviews received */}
        {(reviewsLoading || reviews.length > 0) && (
          <section className="space-y-3">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
              {t("profile.reviewsTitle")}
            </h2>
            {reviewsLoading ? (
              <p className="font-mono text-xs text-cr-text-muted">{t("profile.loading")}</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="bg-cr-surface border border-cr-border p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cr-border text-cr-text-muted font-display text-xs flex items-center justify-center flex-shrink-0">
                          {initials(r.reviewer.name)}
                        </div>
                        <span className="font-sans text-xs font-semibold text-cr-text">{r.reviewer.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={11}
                            className={n <= r.rating ? "fill-cr-primary stroke-cr-primary" : "stroke-cr-border fill-transparent"}
                          />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="font-mono text-xs text-cr-text-muted leading-relaxed">{r.comment}</p>
                    )}
                    <p className="font-mono text-[10px] text-cr-text-dim">{formatDay(r.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Push notifications */}
        {pushState !== "unsupported" && (
          <div className="flex items-center justify-between gap-4 border border-dashed border-cr-border px-4 py-3">
            <div className="flex items-center gap-2">
              {pushState === "subscribed" ? (
                <Bell size={14} className="text-cr-primary shrink-0" aria-hidden="true" />
              ) : (
                <BellOff size={14} className="text-cr-text-muted shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="font-sans text-xs font-semibold text-cr-text">
                  {pushState === "subscribed" ? t("profile.pushOn") : t("profile.pushOff")}
                </p>
                <p className="font-mono text-[11px] text-cr-text-muted">
                  {pushState === "denied"
                    ? t("profile.pushDenied")
                    : pushState === "subscribed"
                      ? t("profile.pushSubscribedHint")
                      : t("profile.pushEnableHint")}
                </p>
              </div>
            </div>
            {pushState !== "denied" && (
              <button
                type="button"
                onClick={pushState === "subscribed" ? pushUnsubscribe : pushSubscribe}
                disabled={pushState === "loading"}
                className={`shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 px-3 py-1.5 transition-colors disabled:opacity-40 ${
                  pushState === "subscribed"
                    ? "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
                    : "border-cr-primary text-cr-primary hover:bg-cr-primary/10"
                }`}
              >
                {pushState === "loading" ? "…" : pushState === "subscribed" ? t("profile.deactivate") : t("profile.activate")}
              </button>
            )}
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">

          {/* Cuenta */}
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
              {t("profile.accountSection")}
            </h2>
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {t("profile.nameLabel")}
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] outline-none px-4 py-3 font-sans text-sm text-cr-text transition-all duration-150"
              />
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {t("profile.phoneLabel")}
                </span>
                {user.phone_verified_at ? (
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-cr-primary border border-cr-primary/40 px-1.5 py-0.5">{t("profile.verified")}</span>
                ) : (
                  <span className="font-sans text-[10px] text-cr-text-dim">{t("profile.notVerified")}</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="flex-1 bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
                />
                {!user.phone_verified_at && phone.trim().length >= 6 && !otpSent && (
                  <button
                    type="button"
                    disabled={otpSending}
                    onClick={async () => {
                      setOtpSending(true);
                      setOtpError(null);
                      try {
                        await api.auth.sendPhoneOtp(phone.trim());
                        setOtpSent(true);
                      } catch {
                        setOtpError(t("profile.otpSendError"));
                      } finally {
                        setOtpSending(false);
                      }
                    }}
                    className="font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 border-cr-primary text-cr-primary px-3 py-2 hover:bg-cr-primary/10 disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    {otpSending ? t("profile.sending") : t("profile.verify")}
                  </button>
                )}
              </div>
              {otpSent && !user.phone_verified_at && (
                <div className="space-y-2">
                  <p className="font-sans text-xs text-cr-text-muted">{t("profile.otpPrompt", { phone })}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-36 bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                    />
                    <button
                      type="button"
                      disabled={otpCode.length !== 6 || otpVerifying}
                      onClick={async () => {
                        setOtpVerifying(true);
                        setOtpError(null);
                        try {
                          const result = await api.auth.verifyPhoneOtp(otpCode);
                          await refresh();
                          setOtpSent(false);
                          setOtpCode("");
                          if (result.user) setOtpError(null);
                        } catch {
                          setOtpError(t("profile.otpInvalid"));
                        } finally {
                          setOtpVerifying(false);
                        }
                      }}
                      className="font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-3 py-2 disabled:opacity-40 transition-opacity"
                    >
                      {otpVerifying ? t("profile.verifying") : t("profile.confirm")}
                    </button>
                    <button type="button" onClick={() => { setOtpSent(false); setOtpCode(""); }} className="font-sans text-xs text-cr-text-dim px-2">{t("profile.cancel")}</button>
                  </div>
                </div>
              )}
              {otpError && <p className="font-mono text-xs text-cr-secondary">{otpError}</p>}
            </div>
          </section>

          {/* Ubicación */}
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
              {t("profile.locationSection")}
            </h2>
            <label className="block space-y-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {t("profile.homeCityLabel")}
              </span>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] outline-none px-4 py-3 font-sans text-sm text-cr-text transition-all duration-150 [color-scheme:dark]"
              >
                <option value="">{t("profile.unspecified")}</option>
                {SPANISH_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
          </section>

          {/* Identidad musical */}
          <section className="space-y-4">
            <div className="border-b border-cr-border pb-2">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                {t("profile.musicIdentityTitle")}
              </h2>
              <p className="mt-1 text-xs text-cr-text-muted">
                {t("profile.musicIdentityDesc")}
              </p>
            </div>
            <label className="block">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted">
                {t("profile.bioLabel")}
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                rows={2}
                placeholder={t("profile.bioPlaceholder")}
                className="mt-1 w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-2.5 font-sans text-sm text-cr-text transition-all duration-150"
              />
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-dim">
                {bio.length}/200
              </span>
            </label>
            <div className="space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted">
                {t("profile.genresLabel")}
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("profile.genresAria")}>
                {GENRE_OPTIONS.map((genre) => {
                  const target = normalizeGenre(genre);
                  const selected = selectedGenres.some((g) => normalizeGenre(g) === target);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      aria-pressed={selected}
                      className={
                        selected
                          ? "border-2 border-cr-primary bg-cr-primary text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
                          : "border-2 border-cr-border bg-cr-surface text-cr-text-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-cr-primary/50"
                      }
                    >
                      {genre}
                    </button>
                  );
                })}
                {customGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    aria-pressed={true}
                    className="border-2 border-cr-primary bg-cr-primary text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-dim">
                {selectedGenres.length}/8
              </span>
            </div>
            <label className="block">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted">
                {t("profile.topArtistsLabel")}
              </span>
              <input
                type="text"
                value={topArtistsInput}
                onChange={(e) => setTopArtistsInput(e.target.value)}
                placeholder="Rosalía, C. Tangana, Vetusta Morla"
                className="mt-1 w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-2.5 font-sans text-sm text-cr-text transition-all duration-150"
              />
            </label>
          </section>

          {/* Sobre ti */}
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
              {t("profile.travelPrefsSection")}
            </h2>
            <TristateToggle
              label={t("profile.licenseToggleLabel")}
              value={hasLicense}
              onChange={setHasLicense}
              options={[
                { value: "", label: t("profile.notIndicated") },
                { value: "yes", label: t("profile.licenseYes") },
                { value: "no", label: t("profile.licenseNo") },
              ]}
            />
            <TristateToggle
              label={t("profile.smokerToggleLabel")}
              value={smoker}
              onChange={setSmoker}
              options={[
                { value: "", label: t("profile.notIndicated") },
                { value: "no", label: t("profile.smokerNo") },
                { value: "yes", label: t("profile.smokerYes") },
              ]}
            />

            {/* License verification */}
            {user.license_verified ? (
              <div className="flex items-center gap-2 border border-cr-primary/40 bg-cr-primary/[0.06] px-4 py-3">
                <ShieldCheck size={14} className="text-cr-primary shrink-0" aria-hidden="true" />
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-primary">
                  {t("profile.driverVerified")}
                </p>
              </div>
            ) : licenseReview?.status === "pending" ? (
              <div className="space-y-3 border border-yellow-500/40 bg-yellow-500/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-yellow-400 shrink-0" aria-hidden="true" />
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-yellow-400">
                    {t("profile.pendingApproval")}
                  </p>
                </div>
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.licensePendingBody", { date: new Date(licenseReview.submitted_at).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) })}
                </p>
                <a
                  href={`mailto:help@concertride.me?subject=${encodeURIComponent("Estado verificación carnet — " + user.name)}&body=${encodeURIComponent("Hola,\n\nQuería preguntar por el estado de la verificación de mi carnet de conducir.\n\nMi usuario: " + user.email + "\nID de revisión: " + licenseReview.id + "\n\nGracias.")}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary underline underline-offset-2 transition-colors"
                >
                  {t("profile.askStatus")}
                </a>
              </div>
            ) : licenseReview?.status === "rejected" ? (
              <div className="space-y-3 border border-cr-secondary/40 bg-cr-secondary/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-cr-secondary shrink-0" aria-hidden="true" />
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-secondary">
                    {t("profile.verificationRejected")}
                  </p>
                </div>
                {licenseReview.rejection_reason && (
                  <p className="font-sans text-xs text-cr-text-muted">
                    {t("profile.rejectionReason", { reason: licenseReview.rejection_reason })}
                  </p>
                )}
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.resubmitHint")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setLicenseReview(null)}
                    className="font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-3 py-2 hover:bg-cr-primary/90 transition-colors"
                  >
                    {t("profile.sendNewDocument")}
                  </button>
                  <a
                    href={`mailto:help@concertride.me?subject=${encodeURIComponent("Revisión rechazo carnet — " + user.name)}&body=${encodeURIComponent("Hola,\n\nMi verificación fue rechazada y me gustaría entender el motivo o enviar un documento nuevo.\n\nMi usuario: " + user.email + "\nID de revisión: " + licenseReview.id + "\n\nGracias.")}`}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary underline underline-offset-2 transition-colors"
                  >
                    {t("profile.askTeam")}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3 border border-dashed border-cr-border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={14} className="text-cr-text-muted mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-cr-text">
                      {t("profile.verifyLicenseTitle")}
                    </p>
                    <p className="font-sans text-xs text-cr-text-muted mt-0.5">
                      {t("profile.verifyLicenseDesc")}
                    </p>
                    <p className="font-sans text-[11px] text-cr-text-muted mt-2 leading-relaxed">
                      {t("profile.licensePrivacy")}{" "}
                      <Link to="/privacidad" className="underline underline-offset-2 hover:text-cr-primary">
                        {t("profile.privacyPolicy")}
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Step 1: file picker (hidden once a file is selected) */}
                {!selectedFile && (
                  <label className="flex flex-col items-center gap-3 w-full border-2 border-dashed border-cr-border px-4 py-6 transition-colors cursor-pointer hover:border-cr-primary">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSelectedFile(file);
                        setVerifyError(null);
                        if (file.type.startsWith("image/")) {
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        } else {
                          setPreviewUrl(null);
                        }
                      }}
                    />
                    <Upload size={20} className="text-cr-text-muted" aria-hidden="true" />
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                      {t("profile.selectFile")}
                    </span>
                    <span className="font-mono text-[10px] text-cr-text-dim">
                      {t("profile.fileFormats4mb")}
                    </span>
                  </label>
                )}

                {/* Step 2: preview + confirm */}
                {selectedFile && (
                  <div className="space-y-3">
                    {previewUrl ? (
                      <div className="border border-cr-border bg-cr-surface p-2">
                        <img
                          src={previewUrl}
                          alt={t("profile.licensePreviewAlt")}
                          className="max-h-52 w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 border border-cr-border bg-cr-surface px-3 py-3">
                        <Upload size={13} className="text-cr-text-muted shrink-0" aria-hidden="true" />
                        <span className="font-mono text-xs text-cr-text truncate">{selectedFile.name}</span>
                      </div>
                    )}

                    <p className="font-mono text-[11px] text-cr-text-muted">
                      {selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={verifying}
                        onClick={() => {
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setVerifyError(null);
                        }}
                        className="flex-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted border border-cr-border px-3 py-2 hover:border-cr-primary hover:text-cr-text transition-colors disabled:opacity-40"
                      >
                        {t("profile.change")}
                      </button>
                      <button
                        type="button"
                        disabled={verifying}
                        onClick={async () => {
                          if (!selectedFile) return;
                          setVerifying(true);
                          setVerifyError(null);
                          try {
                            const result = await api.auth.verifyLicense(selectedFile);
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setLicenseReview({ id: result.review_id, user_id: user.id, file_kv_key: "", status: "pending", submitted_at: new Date().toISOString(), reviewed_at: null, rejection_reason: null });
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          } catch (err) {
                            setVerifyError(err instanceof Error ? err.message : t("profile.documentSendError"));
                          } finally {
                            setVerifying(false);
                          }
                        }}
                        className="flex-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-3 py-2 hover:bg-cr-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {verifying ? t("profile.sending") : t("profile.confirmAndSend")}
                      </button>
                    </div>
                  </div>
                )}

                {verifyError && (
                  <p className="font-mono text-xs text-cr-secondary">{verifyError}</p>
                )}
              </div>
            )}
          </section>

          {/* Identity verification */}
          <section className="space-y-3 border-t border-dashed border-cr-border pt-5">
            <h3 className="font-display text-sm uppercase tracking-wide text-cr-text-muted">
              {t("profile.identityPassengerTitle")}
            </h3>

            {user.identity_verified ? (
              <div className="flex items-center gap-2 border border-cr-primary/40 bg-cr-primary/[0.06] px-4 py-3">
                <ShieldCheck size={14} className="text-cr-primary shrink-0" aria-hidden="true" />
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-primary">
                  {t("profile.identityVerified")}
                </p>
              </div>
            ) : identityReview?.status === "pending" ? (
              <div className="space-y-3 border border-yellow-500/40 bg-yellow-500/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-yellow-400 shrink-0" aria-hidden="true" />
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-yellow-400">
                    {t("profile.pendingApproval")}
                  </p>
                </div>
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.identityPendingBody", { date: new Date(identityReview.submitted_at).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) })}
                </p>
              </div>
            ) : identityReview?.status === "rejected" ? (
              <div className="space-y-3 border border-cr-secondary/40 bg-cr-secondary/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-cr-secondary shrink-0" aria-hidden="true" />
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-secondary">
                    {t("profile.verificationRejected")}
                  </p>
                </div>
                {identityReview.rejection_reason && (
                  <p className="font-sans text-xs text-cr-text-muted">
                    {t("profile.rejectionReason", { reason: identityReview.rejection_reason })}
                  </p>
                )}
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.resubmitHint")}
                </p>
                <button
                  type="button"
                  onClick={() => setIdentityReview(null)}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-3 py-2 hover:bg-cr-primary/90 transition-colors"
                >
                  {t("profile.sendNewDocument")}
                </button>
              </div>
            ) : (
              <div className="space-y-3 border border-dashed border-cr-border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={14} className="text-cr-text-muted mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-cr-text">
                      {t("profile.verifyIdentityTitle")}
                    </p>
                    <p className="font-sans text-xs text-cr-text-muted mt-0.5">
                      {t("profile.verifyIdentityDesc")}
                    </p>
                    <p className="font-sans text-[11px] text-cr-text-muted mt-2 leading-relaxed">
                      {t("profile.identityPrivacy")}{" "}
                      <Link to="/privacidad" className="underline underline-offset-2 hover:text-cr-primary">
                        {t("profile.privacyPolicy")}
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {!identitySelectedFile && (
                  <label className="flex flex-col items-center gap-3 w-full border-2 border-dashed border-cr-border px-4 py-6 transition-colors cursor-pointer hover:border-cr-primary">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIdentitySelectedFile(file);
                        setIdentityVerifyError(null);
                        if (file.type.startsWith("image/")) {
                          setIdentityPreviewUrl(URL.createObjectURL(file));
                        } else {
                          setIdentityPreviewUrl(null);
                        }
                      }}
                    />
                    <Upload size={20} className="text-cr-text-muted" aria-hidden="true" />
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                      {t("profile.selectFile")}
                    </span>
                    <span className="font-mono text-[10px] text-cr-text-dim">
                      {t("profile.fileFormats10mb")}
                    </span>
                  </label>
                )}

                {identitySelectedFile && (
                  <div className="space-y-3">
                    {identityPreviewUrl ? (
                      <div className="border border-cr-border bg-cr-surface p-2">
                        <img
                          src={identityPreviewUrl}
                          alt={t("profile.documentPreviewAlt")}
                          className="max-h-52 w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 border border-cr-border bg-cr-surface px-3 py-3">
                        <Upload size={13} className="text-cr-text-muted shrink-0" aria-hidden="true" />
                        <span className="font-mono text-xs text-cr-text truncate">{identitySelectedFile.name}</span>
                      </div>
                    )}
                    <p className="font-mono text-[11px] text-cr-text-muted">
                      {identitySelectedFile.name} · {(identitySelectedFile.size / 1024).toFixed(0)} KB
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={identityVerifying}
                        onClick={() => {
                          if (identityPreviewUrl) URL.revokeObjectURL(identityPreviewUrl);
                          setIdentitySelectedFile(null);
                          setIdentityPreviewUrl(null);
                          setIdentityVerifyError(null);
                        }}
                        className="flex-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted border border-cr-border px-3 py-2 hover:border-cr-primary hover:text-cr-text transition-colors disabled:opacity-40"
                      >
                        {t("profile.change")}
                      </button>
                      <button
                        type="button"
                        disabled={identityVerifying}
                        onClick={async () => {
                          if (!identitySelectedFile) return;
                          setIdentityVerifying(true);
                          setIdentityVerifyError(null);
                          try {
                            const result = await api.auth.verifyIdentity(identitySelectedFile);
                            if (identityPreviewUrl) URL.revokeObjectURL(identityPreviewUrl);
                            setIdentityReview({ id: result.review_id, user_id: user.id, file_kv_key: "", status: "pending", submitted_at: new Date().toISOString(), reviewed_at: null, rejection_reason: null });
                            setIdentitySelectedFile(null);
                            setIdentityPreviewUrl(null);
                          } catch (err) {
                            setIdentityVerifyError(err instanceof Error ? err.message : t("profile.documentSendError"));
                          } finally {
                            setIdentityVerifying(false);
                          }
                        }}
                        className="flex-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-3 py-2 hover:bg-cr-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {identityVerifying ? t("profile.sending") : t("profile.confirmAndSend")}
                      </button>
                    </div>
                  </div>
                )}

                {identityVerifyError && (
                  <p className="font-mono text-xs text-cr-secondary">{identityVerifyError}</p>
                )}
              </div>
            )}
          </section>

          {/* Coche */}
          <section className="space-y-4">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary border-b border-white/[0.06] pb-3">
              {t("profile.vehicleSection")}
            </h2>
            <div className="bg-cr-surface border border-dashed border-cr-border px-4 py-3 flex items-start gap-3">
              <span aria-hidden="true" className="text-base mt-0.5">🚗</span>
              <div className="space-y-0.5">
                <p className="font-sans text-xs font-semibold text-cr-text">
                  {t("profile.vehicleInfoTitle")}
                </p>
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.vehicleInfoDesc")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {t("profile.carModelLabel")}
                </span>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder={t("profile.carModelPlaceholder")}
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] outline-none px-4 py-3 font-sans text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
                />
              </label>
              <label className="block space-y-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {t("profile.carColorLabel")}
                </span>
                <input
                  type="text"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  placeholder={t("profile.carColorPlaceholder")}
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] outline-none px-4 py-3 font-sans text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
                />
              </label>
            </div>
            {(carModel || carColor) && (
              <div className="flex items-center gap-2 font-mono text-[11px] text-cr-text-muted">
                <span aria-hidden="true">👁</span>
                <span>{t("profile.passengersWillSee")} <strong className="text-cr-text">{[carModel, carColor].filter(Boolean).join(" · ")}</strong></span>
              </div>
            )}
          </section>

          {error && (
            <p className="font-mono text-xs text-cr-secondary" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`cr-btn-shine w-full font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${
              saved
                ? "bg-cr-primary/20 text-cr-primary border border-cr-primary/40"
                : "bg-cr-primary text-black hover:bg-[#c8ec00]"
            }`}
          >
            {submitting ? t("profile.saving") : saved ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Check size={14} aria-hidden="true" /> {t("profile.saved")}
              </span>
            ) : t("profile.saveChanges")}
          </button>
        </form>

        {/* Danger zone — GDPR art.17 right-to-erasure */}
        <section className="mt-16 pt-8 border-t border-cr-border space-y-4">
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary flex items-center gap-2">
            <AlertTriangle size={13} />
            {t("profile.dangerZone")}
          </h2>
          {!confirmDelete ? (
            <div className="flex items-start justify-between gap-4 border border-cr-border p-4">
              <div>
                <p className="font-sans text-sm text-cr-text font-semibold mb-1">{t("profile.deleteAccount")}</p>
                <p className="font-sans text-xs text-cr-text-muted">
                  {t("profile.deleteAccountDesc")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex-shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 border-cr-secondary text-cr-secondary hover:bg-cr-secondary hover:text-white px-3 py-2 transition-colors"
              >
                {t("profile.delete")}
              </button>
            </div>
          ) : (
            <div className="border-2 border-cr-secondary bg-cr-secondary/5 p-4 space-y-3">
              <p className="font-sans text-sm text-cr-text">
                {t("profile.deleteConfirmBefore")} <strong className="font-mono text-cr-secondary">ELIMINAR</strong> {t("profile.deleteConfirmAfter")}
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                autoFocus
                className="w-full bg-cr-bg border-2 border-cr-border focus:border-cr-secondary outline-none px-3 py-2 font-mono text-sm text-cr-text placeholder:text-cr-text-dim"
              />
              {deleteError && (
                <p className="font-mono text-xs text-cr-secondary" role="alert">{deleteError}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setConfirmDelete(false); setConfirmText(""); setDeleteError(null); }}
                  disabled={deleting}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:text-cr-text px-3 py-2 transition-colors disabled:opacity-50"
                >
                  {t("profile.cancel")}
                </button>
                <button
                  type="button"
                  disabled={deleting || confirmText !== "ELIMINAR"}
                  onClick={async () => {
                    setDeleting(true);
                    setDeleteError(null);
                    try {
                      await api.auth.deleteAccount();
                      await logout();
                      navigate("/", { replace: true });
                    } catch {
                      setDeleteError(t("profile.deleteError"));
                      setDeleting(false);
                    }
                  }}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-secondary text-white px-4 py-2 hover:bg-cr-secondary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {deleting ? t("profile.deleting") : t("profile.deletePermanently")}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
