import { getAllPostSlugs, getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => path.params);
}

function getSourceName(url: string): string {
    if (url.includes('marzeelabs.org')) return 'Marzee';
    if (url.includes('comicrelief.com')) return 'Comic Relief Technology Blog';
    if (url.includes('hackernoon.com')) return 'Hackernoon';
    if (url.includes('medium.com/we-are-serverless')) return 'We Are Serverless';
    try {
        return new URL(url).hostname;
    } catch {
        return url;
    }
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
            <div id="wrapper" className="notes-wrapper">
                <header id="header">
                    <div className="content">
                        <div className="inner">
                            <h1>{postData.title}</h1>
                            <p>{postData.date} • by Peter Vanhee</p>
                            {postData.originalUrl && (
                                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#aaa', marginTop: '0.5rem' }}>
                                    Originally posted on <a href={postData.originalUrl} target="_blank" rel="noopener noreferrer">{getSourceName(postData.originalUrl)}</a>
                                </p>
                            )}
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/notes">Notes</Link></li>
                        </ul>
                    </nav>
                </header>

                <div id="main" style={{ display: 'block' }}>
                    <article className="active" style={{ display: 'block', width: '100%' }}>

                        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />

                        <hr />

                        <ul className="actions fit">
                            <li>
                                {prevPost ? (
                                    <Link href={`/notes/${prevPost.slug}`} className="button fit">
                                        ← Previous
                                    </Link>
                                ) : (
                                    <span className="button fit disabled">← Previous</span>
                                )}
                            </li>
                            <li><Link href="/notes" className="button primary fit">Back to Notes</Link></li>
                            <li>
                                {nextPost ? (
                                    <Link href={`/notes/${nextPost.slug}`} className="button fit">
                                        Next →
                                    </Link>
                                ) : (
                                    <span className="button fit disabled">Next →</span>
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
