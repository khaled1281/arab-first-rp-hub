import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Loader2, ShieldCheck, Send, LogOut, KeyRound } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useLang } from "@/lib/i18n";
import {
  requestVerifyCode,
  confirmVerifyCode,
  getVerifyState,
  submitActivation,
  type VerifyState,
} from "@/lib/activation.functions";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "التفعيل — Arab First RP" },
      {
        name: "description",
        content:
          "فعّل حسابك في سيرفر Arab First RP عبر كود تحقق يصلك من بوت ديسكورد، ثم قدّم على التفعيل داخل السيرفر.",
      },
      { property: "og:title", content: "Activation — Arab First RP" },
      {
        property: "og:description",
        content: "Verify your Discord account and apply for activation in Arab First RP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

const TOKEN_KEY = "af_verify_token";

const ERRORS: Record<string, readonly [string, string]> = {
  NOT_IN_GUILD: ["لم نجد هذا اليوزر داخل سيرفر الديسكورد.", "This user was not found in the Discord server."],
  DM_CLOSED: [
    "لم نستطع إرسال الكود، افتح الرسائل الخاصة من إعدادات السيرفر ثم أعد المحاولة.",
    "We couldn't DM you. Open your direct messages and try again.",
  ],
  TOO_SOON: ["انتظر قليلاً قبل طلب كود جديد.", "Please wait a moment before requesting a new code."],
  BOT_UNAVAILABLE: ["البوت غير متصل حالياً، حاول لاحقاً.", "The bot is unavailable, try again later."],
  WRONG_CODE: ["الكود غير صحيح.", "Incorrect code."],
  EXPIRED: ["انتهت صلاحية الكود، اطلب كود جديد.", "The code expired, request a new one."],
  USED: ["هذا الكود مستخدم مسبقاً.", "This code was already used."],
  TOO_MANY: ["تجاوزت عدد المحاولات، اطلب كود جديد.", "Too many attempts, request a new code."],
  INVALID: ["طلب غير صالح.", "Invalid request."],
  NO_SESSION: ["انتهت الجلسة، سجّل الدخول مرة أخرى.", "Session expired, sign in again."],
  ROBLOX_NOT_FOUND: ["لم نجد حساب روبلوكس بهذا اليوزر.", "No Roblox account with that username."],
  ALREADY_ACTIVATED: ["أنت مفعل بالفعل.", "You are already activated."],
  PENDING: ["لديك تقديم قيد المراجعة.", "You already have a pending application."],
  APPROVED: ["تم قبول تقديمك مسبقاً.", "Your application was already approved."],
  SERVER: ["حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again."],
};

function VerifyPage() {
  const { t, lang } = useLang();
  const reqCode = useServerFn(requestVerifyCode);
  const confirm = useServerFn(confirmVerifyCode);
  const loadState = useServerFn(getVerifyState);
  const submit = useServerFn(submitActivation);

  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<VerifyState | null>(null);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const [realName, setRealName] = useState("");
  const [realAge, setRealAge] = useState("");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [sent, setSent] = useState(false);

  const msg = (key: string | null) => (key && ERRORS[key] ? t(ERRORS[key]) : key ? t(ERRORS.SERVER!) : null);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setBooting(false);
      return;
    }
    setToken(saved);
    loadState({ data: { token: saved } })
      .then((res) => {
        if (res.ok) setState(res.state);
        else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => undefined)
      .finally(() => setBooting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await reqCode({ data: { username } });
      if (res.ok) setRequestId(res.requestId);
      else setError(res.error);
    } catch {
      setError("SERVER");
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await confirm({ data: { requestId, code } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      const st = await loadState({ data: { token: res.token } });
      if (st.ok) setState(st.state);
      else setError(st.error);
    } catch {
      setError("SERVER");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await submit({ data: { token, realName, realAge, robloxUsername } });
      if (res.ok) setSent(true);
      else setError(res.error);
    } catch {
      setError("SERVER");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setState(null);
    setRequestId(null);
    setCode("");
    setUsername("");
    setSent(false);
  }

  const input =
    "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";
  const button =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60";

  return (
    <Section
      kicker={t(["التفعيل", "Activation"] as const)}
      title={t(["تفعيل الحساب", "Account Activation"] as const)}
    >
      <div className="mx-auto max-w-lg">
        {booting ? (
          <div className="surface-card flex items-center justify-center gap-3 rounded-2xl p-10 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
            {t(["جاري التحميل...", "Loading..."] as const)}
          </div>
        ) : !state ? (
          <Reveal>
            <div className="surface-card rounded-2xl p-6">
              {!requestId ? (
                <form onSubmit={onRequestCode} className="space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <KeyRound className="h-5 w-5" />
                    <h3 className="font-display text-lg font-bold">
                      {t(["تسجيل الدخول بديسكورد", "Sign in with Discord"] as const)}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t([
                      "اكتب يوزرك في ديسكورد وسيرسل لك البوت كود تحقق برسالة خاصة، صالح لمدة ١٠ دقائق.",
                      "Enter your Discord username and the bot will DM you a code, valid for 10 minutes.",
                    ] as const)}
                  </p>
                  <input
                    className={input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t(["يوزر ديسكورد", "Discord username"] as const)}
                    maxLength={40}
                    required
                    dir="ltr"
                  />
                  <button className={button} disabled={busy}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {t(["إرسال الكود", "Send code"] as const)}
                  </button>
                </form>
              ) : (
                <form onSubmit={onConfirm} className="space-y-4">
                  <div className="flex items-center gap-2 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                    <h3 className="font-display text-lg font-bold">
                      {t(["كود التحقق", "Verification code"] as const)}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t([
                      "أدخل الكود المكوّن من ٦ أرقام الذي وصلك بالخاص من البوت.",
                      "Enter the 6-digit code the bot sent you privately.",
                    ] as const)}
                  </p>
                  <input
                    className={`${input} text-center font-tech text-2xl tracking-[0.5em]`}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    placeholder="000000"
                    dir="ltr"
                    required
                  />
                  <button className={button} disabled={busy || code.length !== 6}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                    {t(["تأكيد", "Confirm"] as const)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestId(null);
                      setCode("");
                      setError(null);
                    }}
                    className="w-full text-xs text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
                  >
                    {t(["تغيير اليوزر", "Change username"] as const)}
                  </button>
                </form>
              )}

              {error && (
                <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                  {msg(error)}
                </p>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="surface-card rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <img
                  src={state.avatarUrl}
                  alt={state.username}
                  className="h-16 w-16 rounded-full border border-gold/40 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">{state.displayName}</p>
                  <p className="truncate font-tech text-xs text-muted-foreground" dir="ltr">
                    @{state.username}
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {state.isAdmin && (
                <Link
                  to="/verify/admin"
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-bold text-gold"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t(["لوحة التقديمات", "Applications panel"] as const)}
                </Link>
              )}

              <div className="mt-6">
                {state.isActivated ? (
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed">
                    <p className="font-bold text-gold">
                      {t(["أنت مفعل بالفعل ✅", "You are already activated ✅"] as const)}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {t([
                        "لا تحتاج للتقديم على التفعيل مرة أخرى، استمتع باللعب والتزم بالقوانين.",
                        "You don't need to apply again. Enjoy the roleplay and follow the rules.",
                      ] as const)}
                    </p>
                  </div>
                ) : sent || state.application?.status === "pending" ? (
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed">
                    <p className="font-bold text-gold">
                      {t(["تم إرسال تقديمك للإدارة", "Your application was sent to the staff"] as const)}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {t([
                        "سيتم مراجعة تقديمك، وستوصلك رسالة خاصة في ديسكورد بالنتيجة.",
                        "Your application will be reviewed and you'll get a DM with the result.",
                      ] as const)}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmitApplication} className="space-y-4">
                    <h3 className="font-display text-lg font-bold text-gold">
                      {t(["تقديم التفعيل", "Activation application"] as const)}
                    </h3>
                    {state.application?.status === "rejected" && (
                      <p className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-xs text-muted-foreground">
                        {t([
                          "تقديمك السابق مرفوض، يمكنك التقديم مرة أخرى.",
                          "Your previous application was rejected. You may apply again.",
                        ] as const)}
                      </p>
                    )}
                    <input
                      className={input}
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder={t(["اسمك الحقيقي", "Your real name"] as const)}
                      maxLength={80}
                      required
                    />
                    <input
                      className={input}
                      value={realAge}
                      onChange={(e) => setRealAge(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      placeholder={t(["عمرك الحقيقي", "Your real age"] as const)}
                      inputMode="numeric"
                      required
                    />
                    <input
                      className={input}
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      placeholder={t(["يوزر روبلوكس", "Roblox username"] as const)}
                      maxLength={30}
                      required
                      dir="ltr"
                    />
                    <button className={button} disabled={busy}>
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {t(["إرسال التقديم", "Submit application"] as const)}
                    </button>
                  </form>
                )}
              </div>

              {error && (
                <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                  {msg(error)}
                </p>
              )}

              <p className="mt-6 text-center text-[11px] text-muted-foreground" dir={lang === "ar" ? "rtl" : "ltr"}>
                Arab First RP • EST. 2025
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
