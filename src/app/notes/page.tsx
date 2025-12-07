import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Notes() {
    const allPostsData = getSortedPostsData();

    return (
        <>
            <div id="wrapper" className="notes-wrapper">
                <header id="header">
                    <div className="content">
                        <div className="inner">
                            <h1>Peter&apos;s Notes</h1>
                            <p>Thoughts, tutorials and technical deep dives.</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                                Written by <a href="https://www.linkedin.com/in/petervanhee" target="_blank" rel="noopener noreferrer">Peter Vanhee</a>, <a href="https://github.com/pvhee" target="_blank" rel="noopener noreferrer">tinkering technologist</a>.
                            </p>
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                        </ul>
                    </nav>
                </header>

                <div id="main" style={{ display: 'block' }}>
                    {allPostsData.map(({ slug, date, title }) => (
                        <article key={slug} id={slug} className="active" style={{ display: 'block', marginBottom: '2rem' }}>
                            <h2 className="major" style={{ marginBottom: '0.5rem', borderBottom: 'none', fontSize: '1.5rem' }}><Link href={`/notes/${slug}`}>{title}</Link></h2>
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
