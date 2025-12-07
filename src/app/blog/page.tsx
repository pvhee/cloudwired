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
                        <article key={slug} id={slug} className="active" style={{ display: 'block', marginBottom: '2rem' }}>
                            <h2 className="major" style={{ marginBottom: '0.5rem', borderBottom: 'none' }}><Link href={`/blog/${slug}`}>{title}</Link></h2>
                            <p style={{ marginBottom: '0', fontSize: '0.9rem', color: '#757575' }}>{date}</p>
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
