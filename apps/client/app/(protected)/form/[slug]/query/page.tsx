import FormQueryClient from "./_components/FormQueryClient";

export default async function FormQueryPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;

  return <FormQueryClient slug={slug} />;
}
