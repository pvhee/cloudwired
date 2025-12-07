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
                                Hi there, I&apos;m Peter and I mostly write about cloud-native development.
                            </p>
                            <ul className="icons">
                                <li><a href="https://github.com/pvhee" className="icon brands fa-github"><span className="label">GitHub</span></a></li>
                            </ul>
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
