// `?printable` renders the CV as a non-interactive single pager (PDF-like, print friendly)
export const IS_PRINTABLE = new URLSearchParams(window.location.search).has('printable');
