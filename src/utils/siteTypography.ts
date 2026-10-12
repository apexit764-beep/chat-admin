// منسوخ كما هو من qhub-site/src/lib/typography.ts — معاينة العناوين تطابق الموقع
// حرفياً لأنها تستعمل الدوالّ نفسها. لا تعدّله هنا: عدّل الأصل ثم انسخه.

/** حرف التطويل (الكشيدة) */
const TATWEEL = "ـ";

/**
 * الحروف الي ما تتصل بالي بعدها — ما ينفع نحط كشيدة بعدها.
 * (ا د ذ ر ز و + الهمزات + التاء المربوطة + الألف المقصورة)
 */
const NO_FORWARD_JOIN = new Set("ادذرزوؤإأآةىءٱ");

/** التشكيل — نتجاهله وقت البحث عن موضع التطويل */
const HARAKAT = /[ً-ْٰٓ-ٕ]/;

/**
 * جسم الكلمة = حروف عربية وتشكيل فقط.
 * مهم نستثني الترقيم العربي (، ؛ ؟) — لو دخل ضمن الجسم يصير التطويل
 * قبل الفاصلة مباشرة: «المنتصفـــ،».
 */
const WORD_CORE = /^([ء-يً-ْٰٱ-ۓـ]+)(.*)$/;

/**
 * جسم الكلمة اللاتينية — نجرّد الترقيم المحيط بها.
 * نحتاجه للنسخة الإنجليزية: «fast.» في العنوان لازم تطابق «fast» في قائمة
 * التمييز، وإلا ضاع اللون بصمت.
 */
const LATIN_CORE = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/u;

/** يجرّد الكلمة من الترقيم — للمقارنة بين كلمة في النص وكلمة في القائمة */
export function bareWord(word: string): string {
  const m = word.match(WORD_CORE);
  if (m) return m[1];
  const l = word.match(LATIN_CORE);
  return l ? l[0] : word;
}

/**
 * يضيف كشيدة داخل الكلمة عند آخر موضع صالح — وهو غالباً قبل الحرف الأخير،
 * الموضع الكلاسيكي في الخط العربي.
 *
 * يتجاوز:
 * - المواضع قبل ألف مسبوقة بلام (ما نكسر رباط «لا»)
 * - الموضع قبل التاء المربوطة (يطلع ضعيف بصرياً: «ذكيـــة»)
 * - الكلمات القصيرة (أقل من 4 حروف) والكلمات غير العربية
 */
export function kashida(word: string, count = 3): string {
  const match = word.match(WORD_CORE);
  if (!match) return word;

  const [, core, tail] = match;
  const letters = [...core].filter((c) => !HARAKAT.test(c));
  if (letters.length < 4) return word;

  for (let i = core.length - 2; i >= 1; i--) {
    const ch = core[i];
    const next = core[i + 1];

    if (HARAKAT.test(ch) || NO_FORWARD_JOIN.has(ch)) continue;
    // لا نكسر رباط «لا»
    if (ch === "ل" && next === "ا") continue;

    // التطويل يجي بعد الحرف وتشكيله، مو بينهما — وإلا انفصلت الشدّة
    // عن حرفها: «صنـــّاع» بدل «صنّـــاع»
    let at = i + 1;
    while (at < core.length && HARAKAT.test(core[at])) at++;

    // بعد تخطّي التشكيل لازم يبقى حرف على الأقل، وما يكون تاء مربوطة
    if (at >= core.length) continue;
    if (core[at] === "ة") continue;

    return core.slice(0, at) + TATWEEL.repeat(count) + core.slice(at) + tail;
  }

  return word;
}

/**
 * يطابق كلمة من النص مع كلمة مستهدفة — مطابقة كاملة بعد تجريد الترقيم.
 * المقارنة بلا حساسية لحالة الأحرف: أول كلمة في العنوان الإنجليزي تبدأ
 * بحرف كبير، والقائمة تُكتب بحروف صغيرة.
 */
export function matchesWord(word: string, target: string): boolean {
  return bareWord(word).toLowerCase() === bareWord(target).toLowerCase();
}
