import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPostDate, getAllPosts, type PostCategory } from "@/lib/posts";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { category } = await searchParams;
  const t = await getTranslations("Blog");

  if (category === "builds") {
    return { title: `${t("buildsTitle")} — DALLFI`, description: t("buildsIntro") };
  }
  if (category === "releases") {
    return { title: `${t("releasesTitle")} — DALLFI`, description: t("releasesIntro") };
  }

  return { title: `${t("title")} — DALLFI`, description: t("intro") };
}

export default async function BlogPage({ searchParams }: Props) {
  const { category: rawCategory } = await searchParams;
  const category =
    rawCategory === "builds" || rawCategory === "releases"
      ? (rawCategory as PostCategory)
      : null;

  const t = await getTranslations("Blog");
  const posts = (await getAllPosts(category)) ?? [];

  const heading =
    category === "builds"
      ? t("buildsTitle")
      : category === "releases"
        ? t("releasesTitle")
        : t("title");

  const intro =
    category === "builds"
      ? t("buildsIntro")
      : category === "releases"
        ? t("releasesIntro")
        : t("intro");

  return (
    <main className="flex-1 bg-[#fff]">
      <div className="mx-auto max-w-[680px] px-5 py-12 sm:px-6 lg:py-16">
        <h1 className="medium-list-title text-[2.5rem] leading-tight text-[#242424] sm:text-[2.75rem]">
          {heading}
        </h1>
        <p className="mt-3 max-w-xl text-[1.05rem] leading-7 font-normal text-[#6b6b6b]">
          {intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#f0f0f0] pb-6 text-[13px]">
          <Link
            href="/blog"
            className={`px-3 py-1.5 ${
              !category ? "bg-[#242424] text-white" : "bg-[#f2f2f2] text-[#242424]"
            }`}
          >
            {t("all")}
          </Link>
          <Link
            href="/blog?category=builds"
            className={`px-3 py-1.5 ${
              category === "builds" ? "bg-[#242424] text-white" : "bg-[#f2f2f2] text-[#242424]"
            }`}
          >
            {t("buildsTitle")}
          </Link>
          <Link
            href="/blog?category=releases"
            className={`px-3 py-1.5 ${
              category === "releases"
                ? "bg-[#242424] text-white"
                : "bg-[#f2f2f2] text-[#242424]"
            }`}
          >
            {t("releasesTitle")}
          </Link>
        </div>

        <ul className="divide-y divide-[#f0f0f0]">
          {posts.length === 0 ? (
            <li className="py-12 text-[1rem] text-[#6b6b6b]">{t("empty")}</li>
          ) : (
            posts.map((post) => (
              <li key={post.id} className="py-10">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-normal text-[#6b6b6b]">
                        {post.author}
                        <span className="mx-1.5 text-[#ccc]">·</span>
                        {formatPostDate(post.publishedAt)}
                        <span className="mx-1.5 text-[#ccc]">·</span>
                        {post.category}
                      </p>
                      <h2 className="medium-list-title mt-2 text-[1.5rem] leading-snug text-[#242424] group-hover:underline sm:text-[1.65rem]">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-[1rem] leading-7 font-normal text-[#6b6b6b]">
                        {post.excerpt || post.content.slice(0, 160)}
                      </p>
                      <span className="mt-4 inline-block text-[13px] font-normal text-[#242424] underline-offset-2 group-hover:underline">
                        {t("readMore")}
                      </span>
                    </div>
                    {post.coverImage ? (
                      <div className="relative h-36 w-full shrink-0 overflow-hidden bg-[#f2f2f2] sm:h-28 sm:w-40">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="160px"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
