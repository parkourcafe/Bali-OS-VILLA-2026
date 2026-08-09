/**
 * Environment value hygiene.
 *
 * Values pasted into hosting dashboards routinely arrive with invisible
 * baggage — a trailing newline from the clipboard, a stray space, or the
 * quotes someone copied along with the value. A Telegram token with a
 * trailing newline builds a broken API URL; a salt with a trailing space
 * fails every comparison, silently. Every env read goes through here so a
 * paste artifact can never masquerade as a wrong secret.
 */
export function cleanEnv(name, env = process.env) {
  let v = env[name];
  if (typeof v !== 'string') return '';
  v = v.trim();
  if (v.length >= 2 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) {
    v = v.slice(1, -1).trim();
  }
  return v;
}
