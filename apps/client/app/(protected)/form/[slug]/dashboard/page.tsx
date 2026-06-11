import FormDashboardClient from "./_components/FormDashboardClient";

export default async function FormDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;

  return <FormDashboardClient slug={slug} />;
}
