import { MouseEventHandler, ReactNode } from "react";

export const Letter = ({
  children,
  onClick,
  id,
  selectedIds,
  solved,
  ...rest
}: {
  children: ReactNode;
  onClick: (
    event: Parameters<MouseEventHandler<HTMLSpanElement>>[0],
    reason: "on" | "off",
    word: string
  ) => void;
  id: string;
  selectedIds: string[];
  solved: boolean;
}) => {
  const active = selectedIds.includes(id);

  const handleClick: MouseEventHandler<HTMLSpanElement> = (e) => {
    onClick(e, active ? "off" : "on", id);
  };

  const thing = active && !solved;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        userSelect: "none",
      }}
    >
      <span
        style={{
          opacity: thing ? "0.5" : "1",
          transition: "opacity 100ms ease-in-out",
        }}
        onClick={handleClick}
        data-letter
        data-solved={solved}
        id={id}
        {...rest}
      >
        {children}
      </span>

      <span
        style={{
          display: "inline-block",
          borderRadius: "50%",
          backgroundColor: thing ? "white" : "transparent",
          height: "0.1em",
          width: "0.1em",
          transition: "background-color 100ms ease-in-out",
        }}
      />
    </div>
  );
};
