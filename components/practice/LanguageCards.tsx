import LanguageCard from "./LanguageCard";

interface LanguageCardsProps {
  language: {
    code: string;
    name: string;
    wordsMastered: number;
    wordsReviewing: number;
    wordsLearning: number;
  };
}

const LanguageCards = ({ language }: LanguageCardsProps) => {
  const { code, name, wordsMastered, wordsReviewing, wordsLearning } = language;

  return (
    <>
      <LanguageCard
        type="learning"
        languageName={name}
        languageCode={code}
        wordCount={wordsLearning}
        description={`Practice your own vocabulary words in ${name}`}
      />

      <LanguageCard
        type="mastered"
        languageName={name}
        languageCode={code}
        wordCount={wordsMastered}
        description={`Practice your already mastered words in ${name}, not to forget them.`}
      />

      <LanguageCard
        type="reviewing"
        languageName={name}
        languageCode={code}
        wordCount={wordsReviewing}
        description={`Practice words you are familiar with in ${name}, to master them completely.`}
      />
    </>
  );
};

export default LanguageCards;
