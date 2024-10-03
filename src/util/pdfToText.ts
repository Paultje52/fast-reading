import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";
import * as pdfjsLib from "pdfjs-dist";
import base64ToBinary from "./base64ToBinary";

export default async function pdfToText(base64: string): Promise<string> {
  Object.assign(window, { pdfjsWorker });

  const data = base64ToBinary(base64);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  const pages = pdf._pdfInfo.numPages;
  const promises = [];
  const text: string[] = [];

  for (let pageNumber = 0; pageNumber < pages; pageNumber++) {
    promises.push(
      pdf.getPage(pageNumber + 1).then(async (page) => {
        const content = await page.getTextContent();
        text[pageNumber] = content.items.map((item: any) => item.str).join("\n");
      })
    );
  }

  await Promise.all(promises);
  return text.join("\n\n");
}
