import { loaderStore } from "@/lib/stores";
import { a } from "motion/react-client";
import { HTMLProps } from "react";

export type LinkProps = {
  href: string;
};

export default function Link({
  href,
  className,
  ...props
}: LinkProps & HTMLProps<HTMLAnchorElement>) {
  const { setState, state, comingInternal, setComingInternal } = loaderStore();
  return (
    <a
      onClick={() => {
        setComingInternal(true);
        setState(true);

        setTimeout(() => {
          window.location.href = href;
        }, 250);
      }}
      className={`cursor-pointer ${className}`}
      {...props}
    />
  );
}
