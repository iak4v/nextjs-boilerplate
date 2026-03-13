import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw"; // embed html elements like <div>, <iframe> etc // FIXME: vulnerable to XSS attack
import rehypeSlug from "rehype-slug"; // decorate heading with ids
import remarkGfm from "remark-gfm"; // checkboxes, tables from github-flavored-markdown
import { Icon, type IconName } from "./icon";
// import GoogleAd from "./ad";
import React from "react";

const MDXComponents: Partial<Components> = {
  // WONT Be Used as title is extracted out on the /posts/:slug page
  // h1: (props) => (
  //     <h1 {...props} className="mt-10 scroll-m-20 pb-2 text-4xl font-extrabold tracking-tight transition-colors first:mt-0">
  //         {props.children}
  //     </h1>
  // ),
  // ins: () => <GoogleAd />,
  h1: (props) => (
    <h1 {...props} className="scroll-m-20 border-b text-3xl font-semibold tracking-tight" />
  ),
  h2: (props) => <h2 {...props} className="scroll-m-20 text-2xl font-bold tracking-tight" />,
  h3: (props) => <h3 {...props} className="scroll-m-20 text-xl font-bold tracking-tight" />,
  p: (props) => <p {...props} className="leading-7" />,
  blockquote: (props) => <blockquote {...props} className="border-l-2 pl-6 italic" />,
  table: (props) => (
    <div {...props} className="my-6 w-full overflow-y-auto">
      <table className="w-full">{props.children}</table>
    </div>
  ),
  tr: (props) => <tr {...props} className="even:bg-muted m-0 border-t p-0" />,
  th: (props) => (
    <th
      {...props}
      className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right"
    />
  ),
  td: (props) => (
    <td
      {...props}
      className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right"
    />
  ),
  ul: (props) => <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />,
  code: (props) => (
    <code
      {...props}
      className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
    />
  ),
  a: (props) => {
    const [text, icon] = (props.children as string).split(":") as [string, IconName | undefined];
    return (
      <a
        {...props}
        className="text-primary font-medium underline underline-offset-4 inline-flex items-center gap-0.5"
      >
        {text}
        <Icon name={icon} fallback="ArrowUpRight" size={15} />
      </a>
    );
  },
  details: (props) => (
    <details className="leading-7 border open:border-primary shadow-sm marker:text-primary p-3 pb-0 open:pb-3 rounded-lg cursor-pointer [&>p]:mt-2">
      {props.children}
    </details>
  ),
  summary: (props) => (
    <>
      <hr className="h-1 w-full" />
      <summary {...props} className="text-lg mb-3 font-medium " />
    </>
  ),
  ol: (props) => <ol {...props} className="ml-6 list-decimal" />,
  iframe: (props) => <iframe {...props} className="w-full rounded-xl aspect-video" />,
};

type MarkdownProps = { content: string };
const Markdown = ({ content, ...props }: React.ComponentProps<"article"> & MarkdownProps) => {
  return (
    <article {...props}>
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSlug, remarkGfm]} components={MDXComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default Markdown;
