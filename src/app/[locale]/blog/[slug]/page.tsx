import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ArticleToc from "@/components/ArticleToc";
import PostComments from "@/components/PostComments";
import ReadingProgress from "@/components/ReadingProgress";
import { getAuthorProfile } from "@/lib/author";
import {
  formatPostDate,
  getComments,
  getPostBySlug,
  preparePostBody,
} from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post — DALLFI" };
  return {
    title: `${post.title} — DALLFI`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations("Blog");
  const locale = await getLocale();
  const [comments, authorProfile] = await Promise.all([
    getComments(post.id),
    getAuthorProfile(),
  ]);

  const authorName = post.author || authorProfile.name;
  const authorAvatar = post.authorAvatar || authorProfile.avatarUrl;
  const { html: bodyHtml, headings } = preparePostBody(post);

  return (
    <main className="flex-1 bg-white">
      <ReadingProgress />
      <article className="medium-article mx-auto max-w-[680px] px-5 py-10 sm:px-6 lg:py-14">
        <Link
          href={
            /build/i.test(post.category)
              ? "/blog?category=builds"
              : /release|version/i.test(post.category)
                ? "/blog?category=releases"
                : "/blog"
          }
          className="medium-meta hover:text-[#242424]"
        >
          ← {t("back")}
        </Link>

        <div className="article-title-row mt-8">
          <h1 className="text-[clamp(2rem,5vw,2.75rem)] text-[#242424]">
            {post.title}
          </h1>
          <ArticleToc headings={headings} label={t("toc")} inline />
        </div>

        {post.excerpt ? <p className="medium-deck mt-4">{post.excerpt}</p> : null}

        <div className="medium-meta mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#f0f0f0] pb-6">
          <span className="inline-flex items-center gap-2">
            <span className="author-avatar">
              <Image
                src={authorAvatar}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-cover"
                unoptimized
              />
            </span>
            <span className="font-medium text-[#242424]">{authorName}</span>
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt, locale)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.category}</span>
        </div>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-[#f2f2f2]">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 680px"
              priority
              unoptimized
            />
          </div>
        ) : null}

        <div
          className="medium-body mt-8"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <PostComments postId={post.id} initialComments={comments} />
      </article>
    </main>
  );
}
