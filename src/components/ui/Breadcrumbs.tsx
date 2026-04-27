"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || pathname === "/account") return null;

  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="container mx-auto px-5 lg:px-8 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-coffee-100/50 hover:bg-coffee-200 text-coffee-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <nav className="flex items-center text-sm text-coffee-500 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link href="/" className="hover:text-coffee-900 transition-colors">Home</Link>
          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;
            const title = path.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div key={path} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                {isLast ? (
                  <span className="text-coffee-900 font-semibold truncate max-w-[150px] sm:max-w-xs">{title}</span>
                ) : (
                  <Link href={href} className="hover:text-coffee-900 transition-colors">
                    {title}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
