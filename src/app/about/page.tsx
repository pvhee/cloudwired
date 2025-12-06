import Link from "next/link";

export default function About() {
    return (
        <>
            <div id="wrapper">
                <header id="header">
                    <div className="content">
                        <div className="inner">
                            <h1>About Me</h1>
                            <p>
                                I'm Peter, a software engineer passionate about cloud technologies and serverless architectures.
                            </p>
                            <p>
                                Welcome to my personal corner of the internet where I share my thoughts and experiences.
                            </p>
                        </div>
                    </div>
                    <nav>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                        </ul>
                    </nav>
                </header>
                <footer id="footer">
                    {/* <p className="copyright">More info soon</p> */}
                </footer>
            </div>
            <div id="bg"></div>
        </>
    );
}
