import { LanguageWordType } from "@/db/types";
import { LanguageCodeType, LanguageLevelsType, WordType } from "@/types";
import { LANGUAGE_OPTIONS } from "./ui";
import { capitalize } from "lodash";

export const WORDS_CATEGORIES = [
  "Greetings",
  "Family",
  "Friends",
  "Daily Life",
  "Food",
  "Hobbies",
  "Travel",
  "Work",
  "Education",
  "Home",
  "Shopping",
  "Health",
  "Weather",
  "Time",
  "Numbers",
  "Colors",
  "Animals",
  "Music",
  "Books",
  "Sports",
  "Technology",
  "Internet",
  "News",
  "Money",
  "Transport",
  "Language",
  "Countries",
  "Festivals",
  "Childhood",
  "Dreams",
  "Opinions",
  "Problems",
  "Plans",
  "Memories",
  "Nature",
  "Art",
  "Fashion",
  "Emotions",
  "Directions",
  "Appointments",
  "Restaurants",
  "Doctor",
  "Past",
  "Future",
  "Agreement",
  "Suggestions",
  "Advice",
  "Thanks",
  "Apologies",
  "Appearance",
  "Beliefs",
  "Business",
  "Celebrations",
  "Changes",
  "City Life",
  "Clothes",
  "Communication",
  "Community",
  "Comparisons",
  "Computers",
  "Cooking",
  "Countryside",
  "Culture",
  "Decisions",
  "Descriptions",
  "Entertainment",
  "Environment",
  "Events",
  "Excuses",
  "Experiences",
  "Feelings",
  "Finance",
  "Games",
  "Gardening",
  "History",
  "Holidays",
  "Humor",
  "Ideas",
  "Imagination",
  "Inventions",
  "Law",
  "Leisure",
  "Love",
  "Machines",
  "Media",
  "Meetings",
  "Mistakes",
  "Motivation",
  "Names",
  "Needs",
  "Organizations",
  "Parties",
  "Personalities",
  "Pets",
  "Places",
  "Possessions",
  "Predictions",
  "Relationships",
  "Safety",
  "Science",
  "Secrets",
  "Senses",
  "Silence",
  "Sleep",
  "Smells",
  "Solutions",
  "Sounds",
  "Space (Outer)",
  "Stages of Life",
  "Stories",
  "Stress",
  "Success",
  "Surprises",
  "Tastes",
  "Technology Trends",
  "Thoughts",
  "Traditions",
  "Traffic",
  "Tragedy",
  "Trends",
  "Understanding",
  "Vacations",
  "Values",
  "Violence",
  "Virtues",
  "Visions",
  "Volunteering",
  "Weaknesses",
  "Wealth",
  "Wishes",
  "Wonder",
  "Words",
  "World Issues",
  "Writing",
  "Youth",
  "Zoos",
  "Ambitions",
  "Annoyances",
  "Choices",
  "Comfort",
  "Creativity",
  "Curiosity",
  "Danger",
  "Debates",
  "Discoveries",
  "Dreams (Nighttime)",
  "Effort",
];

export const WORDS_LANGUAGE_LEVELS: LanguageLevelsType[] = [
  "A0",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export const WORD_TYPES: Record<
  LanguageCodeType,
  LanguageWordType[LanguageCodeType]
> = {
  pl: {
    noun: "rzeczownik",
    verb: "czasownik",
    adjective: "przymiotnik",
    adverb: "przysłówek",
    numeral: "liczebnik",
    pronoun: "zaimek",
    preposition: "przyimek",
    conjunction: "spójnik",
    particle: "partykuła",
  },
  ru: {
    noun: "существительное",
    verb: "глагол",
    adjective: "прилагательное",
    adverb: "наречие",
    numeral: "числительное",
    pronoun: "местоимение",
    preposition: "предлог",
    conjunction: "союз",
    particle: "частица",
  },
};

export const WORDS_TYPES_OPTIONS = [
  ...Object.keys(WORD_TYPES["pl"]).map((type) => ({
    value: type,
    label: capitalize(type),
  })),
];

export const WORD_TYPES_PROMPTS: Record<
  LanguageCodeType,
  Record<WordType, string>
> = {
  pl: {
    noun: `- Słowo musi być **rzeczownikiem** w liczbie pojedynczej i w mianowniku.
- Tylko pojedyncze słowa (nie wyrażenia).
- Nie powinno zawierać przyimków, partykuł ani innych elementów.`,
    verb: `- Słowo musi być **czasownikiem** w formie podstawowej (bezokolicznik), np. "czytać", "biegać".
- Tylko pojedyncze słowa, bez zaimków osobowych, np. "ja", "my".`,
    adjective: `- Słowo musi być **przymiotnikiem** w rodzaju męskim, liczbie pojedynczej i w mianowniku, np. "wysoki", "piękny".
- Tylko jedno słowo. Bez przysłówków czy wyrażeń złożonych.`,
    adverb: `- Słowo musi być **przysłówkiem** w podstawowej, nieodmiennej formie, np. "szybko", "często".
- **Nie mogą to być frazy**, np. "bez wątpienia" — takie należy odrzucić.
- Unikaj słów zawierających przyimki, partykuły lub inne klasy wyrazów.`,
    numeral: `- Słowo musi być **liczebnikiem głównym** w formie podstawowej, np. "jeden", "trzy".
- Tylko pojedyncze słowa (bez połączeń typu "dwadzieścia jeden").`,
    pronoun: `- Słowo musi być **zaimkiem** osobowym, dzierżawczym lub wskazującym w mianowniku, np. "ja", "ten", "mój".
- Tylko pojedyncze słowa, bez dodatkowych elementów.`,
    preposition: `- Słowo musi być **przyimkiem** powszechnie używanym w nowoczesnym języku polskim, np. "na", "do", "bez".
- Nie mogą to być całe frazy z rzeczownikami, np. "bez wątpienia" — to należy odrzucić.`,
    conjunction: `- Słowo musi być **spójnikiem**, który łączy części zdań, np. "ale", "i", "lub".
- Nie może zawierać dodatkowych słów.`,
    particle: `- Słowo musi być **partykulą**, np. "nie", "już", "niby".
- Tylko jedno słowo — **frazy lub złożenia należy odrzucić**.
- Upewnij się, że nie są to przysłówki, przyimki lub inne typy.`,
  },
  ru: {
    noun: `- Слово должно быть **существительным** в единственном числе и в именительном падеже, например: "стол", "день".
- Только одно слово. Исключите выражения или сочетания.`,
    verb: `- Слово должно быть **глаголом** в начальной форме (инфинитив), например: "читать", "идти".
- Только один глагол. Без местоимений или дополнений.`,
    adjective: `- Слово должно быть **прилагательным** в мужском роде, единственном числе и в именительном падеже, например: "красивый", "новый".
- Не допускаются сложные выражения или наречия.`,
    adverb: `- Слово должно быть **наречием** в простой, несклоняемой форме, например: "быстро", "часто".
- **Не допускаются фразы** (например, "без сомнения" — это не наречие, а приём).
- Убедитесь, что слово не является частицей, предлогом или местоимением.`,
    numeral: `- Слово должно быть **количественным числительным** в начальной форме, например: "один", "три".
- Только одно слово, без составных числительных.`,
    pronoun: `- Слово должно быть **местоимением** — личным, притяжательным или указательным, в именительном падеже, например: "я", "мой", "этот".`,
    preposition: `- Слово должно быть **предлогом**, часто используемым в современном русском языке, например: "на", "с", "без".
- Исключите любые словосочетания с существительными или наречиями.`,
    conjunction: `- Слово должно быть **союзом**, соединяющим части предложения, например: "и", "но", "чтобы".
- Никаких дополнительных слов.`,
    particle: `- Слово должно быть **частицей**, например: "не", "ли", "же".
- Только одно слово. Исключите сложные фразы или наречия.`,
  },
} as const;

export const ALPHABETS = {
  pl: [
    "a",
    "b",
    "c",
    "ć",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "ł",
    "m",
    "n",
    "ń",
    "o",
    "ó",
    "p",
    "r",
    "s",
    "ś",
    "t",
    "u",
    "w",
    "y",
    "z",
    "ź",
    "ż",
  ],
  ru: [
    "а",
    "б",
    "в",
    "г",
    "д",
    "е",
    "ё",
    "ж",
    "з",
    "и",
    "й",
    "к",
    "л",
    "м",
    "н",
    "о",
    "п",
    "р",
    "с",
    "т",
    "у",
    "ф",
    "х",
    "ц",
    "ч",
    "ш",
    "щ",
    "ъ",
    "ы",
    "ь",
    "э",
    "ю",
    "я",
  ],
};

export const vocabTablesNames = {
  pl: "pl_vocabulary",
  ru: "ru_vocabulary",
};

export const SUPPORTED_LANGUAGES: Record<LanguageCodeType, string> = {
  pl: "Polish",
  ru: "Russian",
};

export const SUPPORTED_LANGUAGES_FLAGS: Record<LanguageCodeType, string> = {
  pl: "🇵🇱",
  ru: "🇷🇺",
};

export const SUPPORTED_LANGUAGES_CODES = Object.keys(
  SUPPORTED_LANGUAGES
) as LanguageCodeType[];

const generateLanguagePairs = () => {
  const languages = Object.entries(SUPPORTED_LANGUAGES) as [
    LanguageCodeType,
    string
  ][];

  const pairs: {
    code: string;
    name: string;
    source: { code: LanguageCodeType; name: string };
    target: { code: LanguageCodeType; name: string };
  }[] = [];

  for (let i = 0; i < languages.length; i++) {
    for (let j = 0; j < languages.length; j++) {
      if (i !== j) {
        pairs.push({
          code: `${languages[i][0]}-${languages[j][0]}`,
          name: `${languages[i][1]}-${languages[j][1]}`,
          source: {
            code: languages[i][0],
            name: languages[i][1],
          },
          target: {
            code: languages[j][0],
            name: languages[j][1],
          },
        });
      }
    }
  }

  return pairs;
};

export const languagePairs = generateLanguagePairs();

export const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];
