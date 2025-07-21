import React from "react"

export type TagProps = {
    children: React.ReactNode | React.ReactElement
    className: string;
}
export default function Tag(props: TagProps) {
    return (
      <span className={`${props.className} px-2 text-xs rounded-lg w-fit`}>
        {props.children}
      </span>
    );
}