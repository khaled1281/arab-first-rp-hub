import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getRoleMembers, type RoleMember } from "@/lib/discord-role-members.functions";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function RoleMembersGrid({
  roleId,
  roleLabel,
  icon: Icon,
}: {
  roleId: string;
  roleLabel: readonly [string, string];
  icon: LucideIcon;
}) {
  const { t, dict } = useLang();
  const fetchMembers = useServerFn(getRoleMembers);
  const [members, setMembers] = useState<RoleMember[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchMembers({ data: { roleId } })
      .then((res) => alive && setMembers(res ?? []))
      .catch(() => alive && setMembers([]));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  if (members === null) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-gold" />
        <span className="text-sm">{t(dict.staffPages.loading)}</span>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-border/60 bg-surface/50 p-10 text-center">
        <ShieldAlert className="h-6 w-6 text-gold" />
        <p className="text-sm text-muted-foreground">{t(dict.staffPages.empty)}</p>
      </div>
    );
  }

  return (
    <>
      <Reveal className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-1.5 font-tech text-[0.7rem] tracking-[0.25em] text-gold">
          <Icon className="h-3.5 w-3.5" />
          {members.length} {t(dict.staffPages.count).toUpperCase()}
        </span>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((m, i) => (
          <Reveal key={m.id} delay={Math.min(i * 50, 400)}>
            <MemberCard m={m} roleLabel={t(roleLabel)} icon={Icon} />
          </Reveal>
        ))}
      </div>
    </>
  );
}

function MemberCard({
  m,
  roleLabel,
  icon: Icon,
}: {
  m: RoleMember;
  roleLabel: string;
  icon: LucideIcon;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <TiltCard className="surface-card flex h-full flex-col items-center gap-3 overflow-hidden rounded-3xl p-5 text-center hover:shadow-[var(--shadow-gold)]">
      <div className="relative shrink-0" style={{ transform: "translateZ(40px)" }}>
        <div
          className="absolute inset-0 rounded-full bg-gold/25 blur-xl transition-all duration-500 group-hover/tilt:bg-gold/45"
          aria-hidden="true"
        />
        <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-gold/45 bg-surface-2/80 font-tech text-xl font-black text-gold-gradient shadow-[var(--shadow-gold)] transition-transform duration-500 group-hover/tilt:scale-105">
          {broken ? (
            m.username.slice(0, 2).toUpperCase()
          ) : (
            <img
              src={m.avatarUrl}
              alt={`@${m.username}`}
              loading="lazy"
              onError={() => setBroken(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-gold" style={{ transform: "translateZ(26px)" }}>
        <Icon className="h-3 w-3 transition-transform duration-500 group-hover/tilt:rotate-12" />
        <span className="font-display text-[0.6rem] tracking-[0.24em]">{roleLabel.toUpperCase()}</span>
      </div>

      <p
        className="font-tech text-base font-black text-foreground transition-colors duration-300 group-hover/tilt:text-gold-gradient"
        style={{ transform: "translateZ(18px)" }}
      >
        @{m.username}
      </p>
    </TiltCard>
  );
}
