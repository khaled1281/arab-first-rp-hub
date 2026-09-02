import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Section } from "@/components/site/Section";
import { RoleMembersGrid } from "@/components/site/RoleMembersGrid";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "الطاقم الإداري — Arab First RP" },
      {
        name: "description",
        content: "قائمة الطاقم الإداري في Arab First RP مع أفاتارات ويوزرات الديسكورد الرسمية.",
      },
      { property: "og:title", content: "Administrative Staff — Arab First RP" },
      {
        property: "og:description",
        content: "The full administrative staff of Arab First RP with live Discord avatars and handles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StaffPage,
});

const ROLE_ID = "1475060298670014484";

function StaffPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.staffPages.adminK)} title={t(dict.staffPages.adminT)}>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-loose text-muted-foreground">
        {t(dict.staffPages.adminP)}
      </p>
      <RoleMembersGrid roleId={ROLE_ID} roleLabel={dict.staffPages.adminRole} icon={ShieldCheck} />
    </Section>
  );
}
