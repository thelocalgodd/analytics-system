function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <>
      <hr className="mx-auto flex border-solid border border-zinc-400 mb-4" />

      <footer className="flex justify-between w-[350px] md:w-auto mx-auto mb-2 px-3 md:px-1 text-sm">
        <div id="left">
          <p>&copy; {year} | analytics.thelocalgodd.me</p>
          <p className="text-zinc-400">reactjs | tailwind</p>
        </div>
        <div id="right" aria-label="footer, right side" className="text-right">
          <p className="text-red-300">[ analytics ]</p>
          <p id="heading" aria-label="source code link">
            <a
              aria-label="source code link"
              href="https://github.com/thelocalgodd"
              target="_blank"
              rel="noopener noreferrer"
            >
              <u className="underline-offset-4">
                <span className="hover:text-zinc-600">
                  <a
                    href="https://github.com/thelocalgodd/test.thelocalgodd.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    source code
                  </a>
                </span>
              </u>
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
