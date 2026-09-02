import { createFileRoute } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Section } from "@/components/site/Section";
import { RoleMembersGrid } from "@/components/site/RoleMembersGrid";

export const Route = createFileRoute("/supervision")({
  head: () => ({
    meta: [
      { title: "الطاقم الرقابي — Arab First RP" },
      {
        name: "description",
        content: "قائمة الطاقم الرقابي في Arab First RP مع أفاتارات ويوزرات الديسكورد الرسمية.",
      },
      { property: "og:title", content: "Supervision Team — Arab First RP" },
      {
        property: "og:description",
        content: "The supervision team of Arab First RP with live Discord avatars and handles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupervisionPage,
});

const ROLE_ID = "1475060512050909215";

function SupervisionPage() {
  const { t, dict } = useLang();
  return (
    <Section kicker={t(dict.staffPages.supK)} title={t(dict.staffPages.supT)}>
      <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-loose text-muted-foreground">
        {t(dict.staffPages.supP)}
      </p>
      <RoleMembersGrid roleId={ROLE_ID} roleLabel={dict.staffPages.supRole} icon={Eye} />
    </Section>
  );
}
