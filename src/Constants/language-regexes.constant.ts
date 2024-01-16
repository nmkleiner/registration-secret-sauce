/*
 * sourced from: https://polish.typeit.org/
 * */
export const LanguagesRegexes = {
  EnglishWithNumbers: /^[a-zA-Z0-9 '`"-]+$/,
  English: /^[(a-zA-Z\s)][a-zA-Z\s]*$/,
  Hebrew: /[(.אבגדהוזחטיכלמנסעפצקרשתךםןץף\s)]/,
  Russian:
    /[(ёъяшертыуиопющэжьлкйчгфдсазхцвбнмЁЯШЕРТЫУИОПЮЩЭЖЬЛКЙЧГФДСАЗХЦВБНМ.\s)]/,
  Spanish: /[(a-zA-ZñáéíóúüÁÉÍÑÓÚÜ.\s)]/,
  French: /[(a-zA-ZùûüÿàâæçéèêëïîôœÙÛÜŸÀÂÆÇÉÈÊËÏÎÔŒ.\s)]/,
  German: /[(a-zA-ZäöüßÄÖÜẞ.\s)]/,
  Portuguese: /[(a-zA-ZãáàçâéêíõóôúüÃÁÀÂÇÉÊÍÕÓÔÚÜ.\s)]/,
  Hungarian: /[(a-zA-áéúőóüöÁÉÍÖÓŐÜÚŰ.\s)]/,
  Polish: /[(a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ.\s)]/,
};
