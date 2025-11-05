import { Logo1771 } from "./logos/1771-logo";
import { LyteNyteLogo } from "./logos/lytenyte-logo";

export function Header() {
  return (
    <div className="container mx-auto">
      <header className="flex w-full h-16 border-b border-ln-gray-30 justify-between items-center px-8">
        <a href="https://www.1771technologies.com/" className="flex-1">
          <span className="sr-only">1771 Technologies home page</span>
          <Logo1771 width={200} />
        </a>
        <a
          href="https://www.1771technologies.com/docs/server-data-loading-overview"
          className="flex justify-center"
        >
          <span className="sr-only">
            1771 Technologies server data loading documentation
          </span>
          <LyteNyteLogo width={120} />
        </a>
      </header>
    </div>
  );
}
