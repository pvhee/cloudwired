import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Blog() {
    const allPostsData = getSortedPostsData();

    return (
        <>
            <div id="wrapper" className="blog-wrapper">
                <header id="header">
                    <div className="content">
                        <div className="inner">
                            <h1>Blog</h1>
                            <p>Thoughts, tutorials and technical deep dives.</p>
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About</Link></li>
                        </ul>
                    </nav>
                </header>

                <div id="main" style={{ display: 'block' }}>
                    {allPostsData.map(({ slug, date, title }) => (
                        <article key={slug} id={slug} className="active" style={{ display: 'block', marginBottom: '4rem' }}>
                            <h2 className="major"><Link href={`/blog/${slug}`}>{title}</Link></h2>
                            <span className="image main"><img src="/images/pic01.jpg" alt="" /></span>
                            <p>{date}</p>
                            <ul className="actions">
                                <li><Link href={`/blog/${slug}`} className="button">Read More</Link></li>
                            </ul>
                        </article>
                    ))}
                </div>

                <footer id="footer">
                    {/* <p className="copyright">More info soon</p> */}
                </footer>
            </div>
        </>
    );
}
