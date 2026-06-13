import { getCurriculumIndex } from "../src/data/curriculum/buildCurriculum.ts";
import { auditTranslation } from "../src/data/curriculum/verifiedPairs.ts";

const idx = getCurriculumIndex();
const issues = [];

for (const lang of ["de", "en"]) {
  for (const level of Object.keys(idx[lang])) {
    for (const lesson of idx[lang][level]) {
      for (const word of lesson.words) {
        const issue = auditTranslation(
          word.foreign,
          word.translationKg,
          word.translationRu
        );
        if (issue) {
          issues.push({ lang, level, lesson: lesson.number, theme: lesson.theme, ...issue });
        }
        if (!word.sampleSentence?.foreign?.trim()) {
          issues.push({
            lang,
            level,
            lesson: lesson.number,
            theme: lesson.theme,
            foreign: word.foreign,
            reason: "missing sampleSentence.foreign",
            translationKg: word.translationKg,
          });
        }
        if (!word.word?.trim()) {
          issues.push({
            lang,
            level,
            lesson: lesson.number,
            theme: lesson.theme,
            foreign: word.foreign,
            reason: "missing canonical word lemma",
            translationKg: word.translationKg,
          });
        }
      }
    }
  }
}

if (issues.length > 0) {
  console.error(`Translation QA failed: ${issues.length} issue(s)`);
  for (const i of issues.slice(0, 50)) {
    console.error(
      `[${i.lang} ${i.level} L${i.lesson} ${i.theme}] ${i.foreign}: ${i.reason} (KY: ${i.translationKg})`
    );
  }
  process.exit(1);
}

console.log("Translation QA passed: all curriculum pairs verified.");
