import FormDesignClient from "./_components/FormDesignClient";

export default async function FormDesignPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;

  return <FormDesignClient slug={slug} />;
}
