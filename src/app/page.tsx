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
                <Link href="/notes">Notes</Link>
              </p>
            </div>
          </div>

        </header>
        <footer id="footer">
          {/* <p className="copyright">More info soon</p> */}
        </footer>
      </div>
      <div id="bg"></div>
    </>
  );
}
