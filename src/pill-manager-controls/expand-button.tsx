import type { JSX } from "react";

export function ExpandButton({
  expandToggle,
  expanded,
}: {
  expandToggle: () => void;
  expanded: boolean;
}) {
  return (
    <button
      data-ln-button="secondary"
      data-ln-size="md"
      data-ln-expanded={expanded}
      data-ln-icon
      onClick={() => expandToggle()}
    >
      <Icon>{expanded ? <CollapseIcon /> : <ExpandIcon />}</Icon>
    </button>
  );
}
const ExpandIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.84325 17.0415L2.9488 17.038L2.94531 13.1436"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.02344 11.9639L2.94924 17.0381"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1577 2.93409L17.0522 2.93758L17.0557 6.83203"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0518 2.93555L11.9776 8.00974"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CollapseIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.8198 8.07763L11.9254 8.07414L11.9219 4.17969"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 3L11.9258 8.0742"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.51124 11.5786L8.40569 11.5821L8.40918 15.4766"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.40527 11.5801L3.33107 16.6543"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function Icon(props: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      style={{
        height: 20,
        width: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...props.style,
      }}
    />
  );
}
