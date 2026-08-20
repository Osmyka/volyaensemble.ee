import { Fragment, type ReactNode } from "react";

/**
 * Renders a dictionary string that carries line breaks as `\n`, so translators
 * control where a line wraps without any markup in the locale files.
 */
export function lines(value: string): ReactNode {
  return value.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

/** Substitutes `{n}` in a dictionary string, used for numbered image alt text. */
export function withNumber(value: string, n: number): string {
  return value.replace("{n}", String(n));
}
