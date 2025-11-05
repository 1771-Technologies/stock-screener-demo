import { type PropsWithChildren } from "react";
import { Dialog, DropdownMenu } from "radix-ui";
import { tw } from "../lib/tw";

export function GridDialogContent(props: PropsWithChildren) {
  return (
    <>
      <Dialog.Overlay className="fixed z-50 inset-0 bg-black/10 data-[state=open]:animate-overlayShow" />

      <Dialog.Content
        className={tw(
          "z-50 top-[50%] left-[calc(100vw/2)] translate-x-[-50%] translate-y-[-50%] border-ln-gray-30 border fixed rounded-lg bg-ln-gray-05 max-h-[80vh] pb-3"
        )}
      >
        {props.children}
      </Dialog.Content>
    </>
  );
}

export function GridDropMenuContent(props: PropsWithChildren) {
  return (
    <DropdownMenu.Content
      className={tw(
        "bg-ln-gray-05 border-ln-gray-30 border z-50 rounded-lg p-1"
      )}
    >
      {props.children}
    </DropdownMenu.Content>
  );
}
