export type SupportedLang = "en" | "hi" | "ta" | "te" | "kn" | "mr"

// Utility to perform ordered replacements (longest matches first)
function applyOrderedMap(input: string, map: Record<string, string>) {
  if (!input) return input
  let out = ""
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (let i = 0; i < input.length; ) {
    let matched = false
    for (const k of keys) {
      if (k && input.slice(i, i + k.length).toLowerCase() === k) {
        out += map[k]
        i += k.length
        matched = true
        break
      }
    }
    if (!matched) {
      // keep original char for punctuation, numbers, spaces, and unrecognized letters
      out += input[i]
      i += 1
    }
  }
  return out
}

// Shared Latin → Devanagari for Hindi/Marathi (simplified, digraphs first)
const devanagariMap: Record<string, string> = {
  // vowels - digraphs
  aa: "आ",
  ee: "ई",
  ii: "ई",
  oo: "ऊ",
  uu: "ऊ",
  ai: "ऐ",
  au: "औ",

  // consonant digraphs
  kh: "ख",
  gh: "घ",
  ch: "च",
  jh: "झ",
  th: "थ",
  dh: "ध",
  ph: "फ",
  bh: "भ",
  sh: "श",
  gn: "ग्न",
  ts: "त्स",
  ks: "क्स",

  // vowels - singles
  a: "अ",
  i: "इ",
  u: "उ",
  e: "ए",
  o: "ओ",

  // consonants - singles
  b: "ब",
  c: "क",
  d: "द",
  f: "फ",
  g: "ग",
  h: "ह",
  j: "ज",
  k: "क",
  l: "ल",
  m: "म",
  n: "न",
  p: "प",
  q: "क",
  r: "र",
  s: "स",
  t: "त",
  v: "व",
  w: "व",
  x: "क्स",
  y: "य",
  z: "ज",
}

// Latin → Tamil (simplified)
const tamilMap: Record<string, string> = {
  // vowels - digraphs
  aa: "ஆ",
  ee: "ஈ",
  ii: "ஈ",
  oo: "ஊ",
  uu: "ஊ",
  ai: "ஐ",
  au: "ஔ",

  // consonant digraphs
  ng: "ங",
  ny: "ஞ",
  sh: "ஷ",
  kh: "க",
  gh: "க",
  ch: "ச",
  jh: "ஜ",
  th: "த",
  dh: "த",
  ph: "ப",
  bh: "ப",

  // vowels - singles
  a: "அ",
  i: "இ",
  u: "உ",
  e: "எ",
  o: "ஒ",

  // consonants - singles
  b: "ப",
  c: "க",
  d: "த",
  f: "ஃப",
  g: "க",
  h: "ஹ",
  j: "ஜ",
  k: "க",
  l: "ல",
  m: "ம",
  n: "ந",
  p: "ப",
  q: "க",
  r: "ர",
  s: "ஸ",
  t: "ட",
  v: "வ",
  w: "வ",
  x: "க்ஸ்",
  y: "ய",
  z: "ஸ",
}

// Latin → Telugu (simplified)
const teluguMap: Record<string, string> = {
  // vowels - digraphs
  aa: "ఆ",
  ee: "ఈ",
  ii: "ఈ",
  oo: "ఊ",
  uu: "ఊ",
  ai: "ఐ",
  au: "ఔ",

  // consonant digraphs
  kh: "ఖ",
  gh: "ఘ",
  ch: "చ",
  jh: "ఝ",
  th: "థ",
  dh: "ధ",
  ph: "ఫ",
  bh: "భ",
  sh: "శ",
  ng: "ఙ",
  ny: "ఞ",
  ks: "క్ష",

  // vowels - singles
  a: "అ",
  i: "ఇ",
  u: "ఉ",
  e: "ఎ",
  o: "ఒ",

  // consonants - singles
  b: "బ",
  c: "క",
  d: "ద",
  f: "ఫ",
  g: "గ",
  h: "హ",
  j: "జ",
  k: "క",
  l: "ల",
  m: "మ",
  n: "న",
  p: "ప",
  q: "క",
  r: "ర",
  s: "స",
  t: "త",
  v: "వ",
  w: "వ",
  x: "క్ష",
  y: "య",
  z: "జ",
}

// Latin → Kannada (simplified)
const kannadaMap: Record<string, string> = {
  // vowels - digraphs
  aa: "ಆ",
  ee: "ಈ",
  ii: "ಈ",
  oo: "ಊ",
  uu: "ಊ",
  ai: "ಐ",
  au: "ಔ",

  // consonant digraphs
  kh: "ಖ",
  gh: "ಘ",
  ch: "ಚ",
  jh: "ಝ",
  th: "ಥ",
  dh: "ಧ",
  ph: "ಫ",
  bh: "ಭ",
  sh: "ಶ",
  ng: "ಙ",
  ny: "ಞ",
  ks: "ಕ್ಷ",

  // vowels - singles
  a: "ಅ",
  i: "ಇ",
  u: "ಉ",
  e: "ಎ",
  o: "ಒ",

  // consonants - singles
  b: "ಬ",
  c: "ಕ",
  d: "ದ",
  f: "ಫ",
  g: "ಗ",
  h: "ಹ",
  j: "ಜ",
  k: "ಕ",
  l: "ಲ",
  m: "ಮ",
  n: "ನ",
  p: "ಪ",
  q: "ಕ",
  r: "ರ",
  s: "ಸ",
  t: "ತ",
  v: "ವ",
  w: "ವ",
  x: "ಕ್ಷ",
  y: "ಯ",
  z: "ಜ",
}

function toScript(input: string, lang: SupportedLang) {
  switch (lang) {
    case "en":
      return input
    case "hi":
    case "mr":
      return applyOrderedMap(input, devanagariMap)
    case "ta":
      return applyOrderedMap(input, tamilMap)
    case "te":
      return applyOrderedMap(input, teluguMap)
    case "kn":
      return applyOrderedMap(input, kannadaMap)
    default:
      return input
  }
}

export function transliterate(input: string, lang: SupportedLang): string {
  // Convert each and every character; preserve punctuation/whitespace
  return toScript(input, lang)
}
