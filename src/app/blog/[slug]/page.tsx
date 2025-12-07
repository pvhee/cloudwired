import { getAllPostSlugs, getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => path.params);
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    // Get all posts to find previous/next
    const allPosts = getSortedPostsData();
    const currentIndex = allPosts.findIndex(post => post.slug === slug);
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return (
        <>
            <div id="wrapper" className="blog-wrapper">
                <header id="header" style={{ display: 'none' }}>
                    {/* Hidden header for layout consistency if needed, or just omit */}
                </header>

                <div id="main" style={{ display: 'block' }}>
                    <article id={slug} className="active" style={{ display: 'block' }}>
                        <h2 className="major">{postData.title}</h2>
                        <span className="image main"><img src="/images/pic01.jpg" alt="" /></span>
                        <p className="date">{postData.date} by Peter Vanhee</p>
                        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />

                        <hr />

                        <ul className="actions fit">
                            <li>
                                {prevPost ? (
                                    <Link href={`/blog/${prevPost.slug}`} className="button fit">
                                        &larr; Previous: {prevPost.title}
                                    </Link>
                                ) : (
                                    <span className="button fit disabled">&larr; Previous</span>
                                )}
                            </li>
                            <li><Link href="/blog" className="button primary fit">Back to Blog</Link></li>
                            <li>
                                {nextPost ? (
                                    <Link href={`/blog/${nextPost.slug}`} className="button fit">
                                        Next: {nextPost.title} &rarr;
                                    </Link>
                                ) : (
                                    <span className="button fit disabled">Next &rarr;</span>
                                )}
                            </li>
                        </ul>
                    </article>
                </div>

                <footer id="footer">
                    {/* <p className="copyright">More info soon</p> */}
                </footer>
            </div>
        </>
    );
}
