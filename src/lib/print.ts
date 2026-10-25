/**
 * Native print → "Save as PDF".
 *
 * This is deliberately the browser's own print pipeline: the output is a
 * vector PDF with real, selectable text (ATS-parsable), and it costs no
 * bundle size. The title is set while printing so the suggested filename
 * is e.g. "mukesh_resume".
 */
export async function printResume(fileTitle: string): Promise<void> {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }
  // Let React/layout settle so the print copy matches the preview.
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const previousTitle = document.title;
  document.title = fileTitle;
  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  try {
    window.print();
  } catch (e) {
    restore();
    throw e;
  }
}
