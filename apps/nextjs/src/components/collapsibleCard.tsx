import * as Accordion from "@radix-ui/react-accordion";
import React from "react";

function CardHeader({
  children,
  className = "",
}: React.PropsWithChildren<{className?: string}>) {
  return (
    <Accordion.Header
      className={
        className + " text-md flex h-12 w-full flex-row px-4 dark:bg-gray-900"
      }>
      {children}
      <Accordion.Trigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
            clipRule="evenodd"
          />
        </svg>
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

function CardContent({
  children,
  className = "",
}: React.PropsWithChildren<{className?: string}>) {
  return (
    <Accordion.Content className={className + " p-1"}>
      {children}
    </Accordion.Content>
  );
}

CollapsibleCard.CardContent = CardContent;
CollapsibleCard.CardHeader = CardHeader;

export default function CollapsibleCard({
  className = "",
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  let header = null;
  let content = null;
  const _children: React.ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;
    else if (child.type === CardHeader) header = child;
    else if (child.type === CardContent) content = child;
    else _children.push(child);
  });

  return (
    <Accordion.Root
      type="single"
      defaultValue="category"
      collapsible
      className={className + " rounded-lg bg-white shadow-lg dark:bg-gray-800"}>
      <Accordion.Item value="category" className="shadow-lg">
        {!!header && header}
        {!!content && content}
        {_children}
      </Accordion.Item>
    </Accordion.Root>
  );
}
