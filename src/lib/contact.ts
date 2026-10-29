import { k, p } from "./contact.generated";

type TrustedEvent = { isTrusted: boolean };

const unxor = (s: string) =>
  Array.from(s, (c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length)),
  ).join("");

/**
 * Rebuilds the contact address. Only call from inside a user-initiated event
 * handler; returns null for synthetic events. Never store the result in state
 * or render it into the DOM.
 */
function decode(event: TrustedEvent): string | null {
  if (!event.isTrusted || p.length === 0) return null;
  return [...p]
    .reverse()
    .map((part) => [...unxor(atob(part))].reverse().join(""))
    .join("");
}

export function openMail(event: TrustedEvent): boolean {
  const address = decode(event);
  if (!address) return false;
  window.location.href = `mailto:${address}`;
  return true;
}

export async function copyAddress(event: TrustedEvent): Promise<boolean> {
  const address = decode(event);
  if (!address) return false;
  try {
    await navigator.clipboard.writeText(address);
    return true;
  } catch {
    return legacyCopy(address);
  }
}

function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.setAttribute("aria-hidden", "true");
  field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}
