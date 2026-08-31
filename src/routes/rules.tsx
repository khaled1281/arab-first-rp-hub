import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ShieldAlert, ScrollText, Gamepad2, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/site/Reveal";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "القوانين — Arab First RP" },
      {
        name: "description",
        content:
          "قوانين Arab First RP الكاملة: قوانين السيرفر، قوانين الإدارة، وقوانين الرول بلاي مع قاموس لغة السيرفر.",
      },
      { property: "og:title", content: "Rules — Arab First RP" },
      {
        property: "og:description",
        content:
          "Full rules of Arab First RP: server rules, administration rules, and roleplay rules with a server slang glossary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RulesPage,
});

type Rule = [string, string];

type Section = {
  key: string;
  ar: string;
  en: string;
  icon: typeof ScrollText;
  intro?: Rule;
  items: Rule[];
  closing?: Rule;
};

const SECTIONS: Section[] = [
  {
    key: "server",
    ar: "قوانين السيرفر",
    en: "Server Rules",
    icon: ScrollText,
    items: [
      [
        "احترام الجميع وعدم السب والإساءة لأي شخص مهما كانت الظروف ولو بطريقة غير مباشرة.",
        "Respect everyone; no insults or abuse toward anyone under any circumstances, even indirectly.",
      ],
      [
        "عدم وضع الروابط أو روابط تحتوي دعوات لسيرفرات أخرى، يعرضك ذلك لعقوبة إدارية صارمة.",
        "Do not post links or invites to other servers — this leads to strict administrative punishment.",
      ],
      ["عدم التدخل في شؤون الآخرين أو شخصنة الحوارات.", "Do not interfere in others' affairs or personalize discussions."],
      [
        "عدم الخوض بالأمور الدينية أو السياسية أو التطرق لها بأي شكل، يعرضك ذلك لعقوبة إدارية مع باند يحدد مدته الإدارة العليا.",
        "No religious or political topics in any form — leads to a ban whose duration is set by senior staff.",
      ],
      [
        "تعدد الحسابات غير مسموح. امتلاك أكثر من حساب ديسكورد في السيرفر عليها باند نهائي ولن يتم فكه حتى بتعويض.",
        "Multi-accounting is forbidden. Owning more than one Discord account in the server results in a permanent, non-appealable ban.",
      ],
      ["يمنع انتحال الشخصيات الإدارية، ومن يخالف هذا القانون يتم تبنيده بشكل تام.", "Impersonating staff is strictly forbidden and leads to a full ban."],
      [
        "يمنع السخرية والاستهزاء من الآخرين، سيتم منعه من الكتابة بجميع الشاتات، وإذا تكرر الأمر قد يصل إلى باند شهر.",
        "No mocking or ridiculing others — chat mute across all channels; repeated offense may lead to a one-month ban.",
      ],
      [
        "يمنع الاستفسار بالشات العام، عندك استفسار أو سؤال توجه إلى الدعم الفني (في حال مخالفتك راح يجيك تايم ٤ ساعات).",
        "No questions in the general chat — use the support channel (violation = 4-hour timeout).",
      ],
    ],
    closing: [
      "نود إخباركم نحن إدارة Arab First بأن من يخالف هذه القوانين سيتم تبنيده، ونحن لسنا مسؤولين عن من لم يقرأها. وشكرًا لكم.",
      "Note from Arab First staff: anyone who breaks these rules will be banned, and we are not responsible for those who did not read them. Thank you.",
    ],
  },
  {
    key: "admin",
    ar: "قوانين الإدارة",
    en: "Administration Rules",
    icon: ShieldAlert,
    intro: [
      "بسم الله الرحمن الرحيم والصلاة والسلام على أشرف الأنبياء والمرسلين سيدنا محمد وعلى آله وصحبه أجمعين، أما بعد.",
      "In the name of God, and peace be upon our master Muhammad, his family and companions. Amen.",
    ],
    items: [
      [
        "يمنع عليك منعًا باتًّا تسريب معلومات الإدارة، تتعرض للفصل التام مع باند شهر كامل + بلاك ليست من الإدارة والديسكورد.",
        "Leaking staff information is strictly forbidden — full dismissal + one-month ban + blacklist from staff and Discord.",
      ],
      [
        "يمنع عليك إعطاء رتبة لمن ليس بالإدارة دون التوجه للإدارة العليا، تتعرض للفصل الإداري المؤقت.",
        "Do not grant roles to non-staff without senior staff approval — temporary administrative dismissal.",
      ],
      ["يمنع عليك محاسبة من هو أعلى منك بالإدارة، تتعرض للعقوبة الإدارية الصارمة.", "Do not discipline a higher-ranking staff member — strict administrative penalty."],
      ["يمنع عليك سحب رتب من أي شخص، تتعرض للعقوبة الإدارية الصارمة.", "Do not revoke anyone's role — strict administrative penalty."],
      ["لا يمكنك دخول الإدارة بأكثر من حساب.", "You may not join staff with more than one account."],
      [
        "يمنع دخول أي بوت، وإذا أدخلته سيتم طردك من الإدارة أنت والبوت تبعك مع بلاك ليست من الإدارة.",
        "No bots allowed — bringing one in gets you and your bot removed and blacklisted from staff.",
      ],
      ["يمنع عليك فعل إعلان دون التوجه للإدارة العليا.", "No announcements without senior staff approval."],
      [
        "يمنع استعمال صلاحيات رتبتك الإدارية في أمر ضد الإدارة، يعرضك للفصل الإداري لمدة شهرين.",
        "Do not use your staff powers against the administration — two-month administrative dismissal.",
      ],
      [
        "يمنع منعًا باتًّا سب أو قذف لاعب. في حال قذفك اللاعب وطردته أو حاسبته دون التوجه للإدارة العليا تتحاسب أنت وهو. عندك حالتين: يا ترد القذف بالقذف وتكون مصور، يا ترفع اسمه للإدارة العليا مع الأدلة. الشتم ما يجوز — أخلاق المسلم ودينه تمنعه.",
        "Absolutely no insulting or slandering a player. If you slander, kick, or discipline a player without senior staff, both of you are held accountable. Either respond with equal evidence (recorded) or escalate to senior staff with proof. Insults are unacceptable — a Muslim's morals and faith forbid them.",
      ],
      ["يمنع منعًا باتًّا مناقشة الإدارة العليا في عقوبة فُرضت عليك إلا في حال عندك أدلة.", "Do not dispute a senior-staff penalty unless you have evidence."],
      [
        "يمنع مخالفتك لقوانين السيرفر، وعلمًا بأنه بتقديم الإدارة مكتوب أنك حافظ وفاهم قوانين السيرفر.",
        "You may not break the server rules — joining staff means you confirm you know and uphold them.",
      ],
    ],
    closing: [
      "نود إخباركم نحن إدارة Arab First بأن من يخالف هذه القوانين سيتم تبنيده، ونحن لسنا مسؤولين عن من لم يقرأها. وشكرًا لكم.",
      "Note from Arab First staff: anyone who breaks these rules will be banned, and we are not responsible for those who did not read them. Thank you.",
    ],
  },
  {
    key: "rp",
    ar: "قوانين الرول بلاي",
    en: "Roleplay Rules",
    icon: Gamepad2,
    items: [
      [
        "يجب على الجميع أن يكون جديًا في طريقة اللعب وطريقة اختياره للشخصية — تقمص الرول بلاي الحقيقي.",
        "Everyone must be serious in gameplay and character choice — true roleplay immersion.",
      ],
      ["يمنع القفز بالمركبة قفزات انتحارية، مثال: القفز من أعلى الجبل بطريقة غير واقعية.", "No suicidal vehicle jumps — e.g. jumping off a mountain unrealistically."],
      [
        "يمنع التلفظ بالألفاظ السيئة، وفي حال تم رصد ذلك سيتم محاسبتك محاسبة إدارية صارمة.",
        "No foul language — if caught, you face strict administrative accountability.",
      ],
      ["يجب عليك تقدير الموقف بأي شكل ومن أي ظرف وعدم الاستهتار.", "Always assess the situation seriously; no recklessness under any circumstance."],
      [
        "يمنع منعًا باتًّا السرقة أو الإجرام قبل نهاية الرول بـ ١٥ دقيقة، وذلك سيعرضك لعقوبة صارمة.",
        "No robbery or crime in the final 15 minutes of a roleplay — strict penalty.",
      ],
      [
        "يمنع قتل أي شخص لسبب تافه أو لأجل أمر شخصي أو شخصنة داخل الرول، ممنوع منعًا باتًّا ويعرضك لعقوبة صارمة.",
        "No killing over trivial, personal, or targeted reasons — strictly forbidden, strict penalty.",
      ],
      [
        "يجب أن يكون التهديد بشكل مباشر، لا يمكنك التهديد وأنت بداخل المركبة أو بعيد عن الشخص.",
        "Threats must be direct — no threatening from inside a vehicle or from a distance.",
      ],
      [
        "يجب على جميع اللاعبين لبس ملابس مناسبة لأعمالهم وتطبيق الرول بلاي المناسب للوظيفة أو الشخصية.",
        "All players must wear appropriate clothing for their job and roleplay it properly.",
      ],
      [
        "يمنع منعًا باتًّا معالجة شخص في حال تواجد مسعفين في المستشفى، ويمنع على المسعفين إنعاش الشخص دون نقله للمستشفى.",
        "No treating a player when medics are at the hospital; medics may not revive on-site — must transport to hospital.",
      ],
      [
        "يجب الالتزام بالذوق العام في الملابس وعدم تقديم إساءة للاعبين، ذلك يعرضك لعقوبة إدارية صارمة وقد تصل للباند.",
        "Maintain public decency in clothing and do not offend players — strict penalty, possibly a ban.",
      ],
      [
        "يمنع منعًا باتًّا التحدث عن أمور خارج الرول بلاي أو التلميح بها، وذلك يعتبر مخالفًا للرول بلاي.",
        "No mentioning or hinting at out-of-RP matters — it breaks roleplay.",
      ],
      [
        "ممنوع الكلام المشفر بجميع أنواعه (أي كلام له أكثر من معنى) ممنوع منعًا باتًّا، يعرضك للباند الفوري ويتم تحديد مدته من عليا الرقابة.",
        "No coded/double-meaning speech of any kind — instant ban, duration set by senior oversight.",
      ],
      [
        "يجب عليك تقمص شخصيتك مع الكل حتى لو صديقك — لو أنت عسكري وخويك مجرم ما تتساهل معه أبدًا، ممنوع منعًا باتًّا ويعرضك لعقوبة.",
        "Stay in character with everyone, even friends — a soldier must not go easy on a criminal friend. Strictly enforced.",
      ],
      ["عدم ترابط شخصيتك الأولى بالشخصية الثانية، يمنع تكرار الأسماء بين الشخصيات.", "Do not link your first and second characters; no repeating names across characters."],
      ["يمنع على الشخص الميت أثناء السيناريو العودة إليه مرة أخرى.", "A dead player may not return to the same scenario."],
      ["تمنع الشخصنة بجميع أشكالها وأنواعها، يعرضك إلى عقوبة.", "No personalization/targeting in any form — penalty."],
      ["يمنع لبس الملابس الجيشية والعسكرية.", "No military or army clothing."],
      ["يمنع التدخل في سيناريو قائم.", "Do not interfere in an ongoing scenario."],
      [
        "يمنع التحدث بالسياسة والأعراض والدين وأيضًا المضايقات، وفي حال تم رصد أيًّا منها باند فوري والمدة نهائي.",
        "No politics, honor, religion, or harassment — instant permanent ban if caught.",
      ],
    ],
    closing: [
      "نود إخباركم نحن إدارة Arab First بأن من يخالف هذه القوانين سيتم تبنيده، ونحن لسنا مسؤولين عن من لم يقرأها. وشكرًا لكم.",
      "Note from Arab First staff: anyone who breaks these rules will be banned, and we are not responsible for those who did not read them. Thank you.",
    ],
  },
];

// Server slang glossary (Arabic term → meaning)
const GLOSSARY: { term: string; meaning: [string, string] }[] = [
  { term: "قلتش / سحر أسود", meaning: ["غش أو استغلال ثغرات داخل اللعب.", "Cheating or exploiting in-game."] },
  { term: "هاك", meaning: ["ساحر / غشّاش.", "Hacker / cheater."] },
  { term: "لاق أو ملقلق", meaning: ["صداع أو مصدّع.", "Headache / annoying."] },
  { term: "رقابي", meaning: ["شبح.", "Ghost / stalker."] },
  { term: "الدسكورد", meaning: ["تطبيق الدولة.", "The state's app (Discord)."] },
  { term: "باند / مبند", meaning: ["تسفير أو مسفّر.", "Deported / exiled (banned)."] },
  { term: "بطلع", meaning: ["بنام.", "I'm going to sleep."] },
  { term: "حسابك دسكورد", meaning: ["هويتك الوطنية.", "Your national ID (Discord account)."] },
  { term: "الرسبون", meaning: ["الجوازات.", "The passport office (spawn point)."] },
];

function RulesPage() {
  const { t, dict } = useLang();
  const [active, setActive] = useState("server");
  const section = SECTIONS.find((s) => s.key === active)!;

  return (
    <Section kicker={t(dict.rules.k)} title={t(dict.rules.t)}>
      {/* Tabs */}
      <div className="mx-auto mb-10 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = s.key === active;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "border-gold/50 bg-gold/15 text-gold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--gold)_38%,transparent)]"
                  : "border-border/60 bg-surface/40 text-muted-foreground hover:border-gold/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t([s.ar, s.en])}
            </button>
          );
        })}
      </div>

      <Reveal className="mx-auto max-w-4xl">
        {/* Section header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <section.icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-xl font-extrabold">{t([section.ar, section.en])}</h3>
            <p className="text-xs text-muted-foreground">{section.items.length} {t(["قاعدة", "rules"])}</p>
          </div>
        </div>

        {/* Intro (admin only) */}
        {section.intro && (
          <div className="mb-5 surface-card rounded-xl p-4 text-center text-sm leading-relaxed text-muted-foreground">
            {t(section.intro)}
          </div>
        )}

        {/* Rules list */}
        <div className="grid gap-3 sm:grid-cols-2">
          {section.items.map((r, idx) => (
            <div
              key={idx}
              className="surface-card flex items-start gap-3 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-xs font-extrabold text-gold">
                {idx + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(r)}</p>
            </div>
          ))}
        </div>

        {/* Glossary (admin only) */}
        {section.key === "admin" && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2 text-gold">
              <BookOpen className="h-4 w-4" />
              <h4 className="font-display text-sm font-extrabold tracking-wide">
                {t(["قاموس لغة السيرفر", "Server Slang Glossary"])}
              </h4>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {GLOSSARY.map((g, i) => (
                <div
                  key={i}
                  className="surface-card flex items-center justify-between gap-3 rounded-lg px-4 py-3"
                >
                  <span className="font-display text-sm font-bold text-foreground">{g.term}</span>
                  <span className="text-right text-xs text-muted-foreground">{t(g.meaning)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-center text-xs font-bold text-gold">
              {t([
                "في حال ما طبقتها داخل الماب سيتم تحذيرك وتصل للباند ❗",
                "If you don't use them in-game you'll be warned and may reach a ban ❗",
              ])}
            </div>
          </div>
        )}

        {/* Closing note */}
        {section.closing && (
          <div className="mt-8 gold-ring relative overflow-hidden rounded-2xl bg-surface/70 p-5 text-center backdrop-blur-xl">
            <p className="text-sm leading-relaxed text-muted-foreground">{t(section.closing)}</p>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
