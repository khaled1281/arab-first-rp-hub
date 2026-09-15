import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, X, Loader2, ShieldAlert, Inbox } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useLang } from "@/lib/i18n";
import {
  listPendingApplications,
  decideApplication,
  type AdminApplication,
} from "@/lib/activation-admin.functions";

export const Route = createFileRoute("/verify/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التقديمات — Arab First RP" },
      {
        name: "description",
        content: "لوحة مراجعة تقديمات التفعيل الخاصة بإدارة سيرفر Arab First RP.",
      },
      { property: "og:title", content: "Applications Panel — Arab First RP" },
      {
        property: "og:description",
        content: "Staff panel for reviewing Arab First RP activation applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

const TOKEN_KEY = "af_verify_token";

function age(iso: string | null, lang: "ar" | "en"): string {
  if (!iso) return lang === "ar" ? "غير معروف" : "Unknown";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (lang === "ar")
    return years > 0 ? `${years} سنة و ${months} شهر` : months > 0 ? `${months} شهر` : `${days} يوم`;
  return years > 0 ? `${years}y ${months}m` : months > 0 ? `${months}m` : `${days}d`;
}

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "—";
}

function AdminPage() {
  const { t, lang } = useLang();
  const list = useServerFn(listPendingApplications);
  const decide = useServerFn(decideApplication);

  const [apps, setApps] = useState<AdminApplication[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError("NO_SESSION");
      setApps([]);
      return;
    }
    try {
      const res = await list({ data: { token } });
      if (res.ok) {
        setApps(res.apps);
        setError(null);
      } else {
        setError(res.error);
        setApps([]);
      }
    } catch {
      setError("SERVER");
      setApps([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDecide(id: string, decision: "approved" | "rejected") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setWorking(id);
    try {
      await decide({ data: { token, id, decision } });
      setApps((prev) => (prev ?? []).filter((a) => a.id !== id));
    } catch {
      setError("SERVER");
    } finally {
      setWorking(null);
    }
  }

  const label = (ar: string, en: string) => t([ar, en] as const);

  return (
    <Section
      kicker={label("الإدارة", "Staff")}
      title={label("تقديمات التفعيل", "Activation Applications")}
    >
      <div className="mx-auto max-w-3xl">
        {apps === null ? (
          <div className="surface-card flex items-center justify-center gap-3 rounded-2xl p-10 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
            {label("جاري التحميل...", "Loading...")}
          </div>
        ) : error ? (
          <div className="surface-card rounded-2xl p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              {error === "FORBIDDEN"
                ? label("هذه الصفحة للإدارة فقط.", "This page is for staff only.")
                : error === "NO_SESSION"
                  ? label("سجّل الدخول أولاً من صفحة التفعيل.", "Sign in first from the activation page.")
                  : label("حدث خطأ، حاول مرة أخرى.", "Something went wrong, try again.")}
            </p>
            <Link
              to="/verify"
              className="mt-5 inline-block rounded-xl bg-gold px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              {label("صفحة التفعيل", "Activation page")}
            </Link>
          </div>
        ) : apps.length === 0 ? (
          <div className="surface-card rounded-2xl p-10 text-center text-sm text-muted-foreground">
            <Inbox className="mx-auto mb-3 h-8 w-8 text-gold" />
            {label("لا توجد تقديمات منتظرة حالياً.", "No pending applications right now.")}
          </div>
        ) : (
          <div className="space-y-5">
            {apps.map((a, i) => (
              <Reveal key={a.id} delay={i * 70}>
                <div className="surface-card rounded-2xl p-5">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {a.robloxAvatarUrl && (
                      <img
                        src={a.robloxAvatarUrl}
                        alt={a.robloxUsername}
                        className="mx-auto h-32 w-32 shrink-0 rounded-xl border border-gold/30 bg-surface-2/60 object-contain"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {a.discordAvatarUrl && (
                          <img
                            src={a.discordAvatarUrl}
                            alt={a.discordUsername}
                            className="h-10 w-10 rounded-full border border-border object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-display font-bold">
                            {a.discordDisplayName ?? a.discordUsername}
                          </p>
                          <p className="truncate font-tech text-xs text-muted-foreground" dir="ltr">
                            @{a.discordUsername}
                          </p>
                        </div>
                      </div>

                      <dl className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          [label("الاسم الحقيقي", "Real name"), a.realName],
                          [label("العمر", "Age"), String(a.realAge)],
                          [label("يوزر روبلوكس", "Roblox user"), a.robloxUsername],
                          [
                            label("حساب روبلوكس", "Roblox account"),
                            `${fmt(a.robloxCreatedAt)} • ${age(a.robloxCreatedAt, lang)}`,
                          ],
                          [
                            label("حساب ديسكورد", "Discord account"),
                            `${fmt(a.discordCreatedAt)} • ${age(a.discordCreatedAt, lang)}`,
                          ],
                          [label("تاريخ التقديم", "Submitted"), fmt(a.createdAt)],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-xl border border-border/60 bg-surface/40 p-3">
                            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                            <dd className="mt-1 break-words font-semibold text-foreground">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => onDecide(a.id, "approved")}
                          disabled={working === a.id}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
                        >
                          {working === a.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          {label("قبول", "Approve")}
                        </button>
                        <button
                          onClick={() => onDecide(a.id, "rejected")}
                          disabled={working === a.id}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive transition-transform hover:scale-[1.02] disabled:opacity-60"
                        >
                          <X className="h-4 w-4" />
                          {label("رفض", "Reject")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
