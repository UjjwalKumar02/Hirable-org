import FormSubmitClient from "./_components/FormSubmitClient";

export default async function FormSubmitPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;

  return <FormSubmitClient slug={slug} />;
}
