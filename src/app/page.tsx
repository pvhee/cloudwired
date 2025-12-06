import Link from "next/link";

export default function Home() {
  return (
    <>
      <div id="wrapper">
        <header id="header">
          <div className="content">
            <div className="inner">
              <h1>Cloudwired</h1>
              <p>
                <Link href="/blog">Blog</Link> • <Link href="/about">About Me</Link>
              </p>
            </div>
          </div>
          <nav>
            <ul>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/about">About</Link></li>
              {/* <li><a href="#contact">Contact</a></li> */}
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
