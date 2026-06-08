import Link from 'next/link';
import { getSortedPostsData, getSourceName } from '@/lib/posts';

export default function Notes() {
    const allPostsData = getSortedPostsData();

    return (
        <>
            <div id="wrapper" className="notes-list-wrapper">
                <header id="header">
                    <div className="content">
                        <div className="inner">
                            <h1>Peter&apos;s Notes</h1>
                            <p>Thoughts, tutorials and technical deep dives.</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '1rem', marginBottom: '0.75rem' }}>
                                Written by Peter Vanhee, thinking and tinkering out loud.
                            </p>
                            <ul className="icons" style={{ margin: 0 }}>
                                <li>
                                    <a href="https://www.linkedin.com/in/petervanhee" className="icon brands fa-linkedin-in" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                        <span className="label">LinkedIn</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/pvhee" className="icon brands fa-github" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                        <span className="label">GitHub</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                        </ul>
                    </nav>
                </header>

                <div id="main" style={{ display: 'block' }}>
                    {allPostsData.map(({ slug, date, title, originalUrl }) => (
                        <article key={slug} id={slug} className="active" style={{ display: 'block', marginBottom: '2rem' }}>
                            <h2 className="major" style={{ marginBottom: '0.5rem', borderBottom: 'none', fontSize: '1.5rem' }}><Link href={`/notes/${slug}`}>{title}</Link></h2>
                            <p style={{ marginBottom: '0', fontSize: '0.9rem' }}>
                                {date}
                                {originalUrl && (
                                    <> · Originally posted on <a href={originalUrl} target="_blank" rel="noopener noreferrer">{getSourceName(originalUrl)}</a></>
                                )}
                            </p>
                        </article>
                    ))}
                </div>

                <footer id="footer">
                    {/* <p className="copyright">More info soon</p> */}
                </footer>
            </div>
            <div id="bg"></div>
        </>
    );
}
