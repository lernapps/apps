# Licence of the basic vocabulary of English

The files of this folder (`source.yaml`, `words.yaml`) are derived from **EFLLex** (CEFRLex, CENTAL, UCLouvain,
<https://cental.uclouvain.be/cefrlex/efllex/download/>) and are licensed, as EFLLex is, under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
The MIT licence of this repository does not apply to them.

Changes to EFLLex: only the words of the levels A1 and A2, without the frequencies; the level of a word is the first
level at which at least two documents of EFLLex's corpus use it (`minDocuments` in `source.yaml`); lemmas with a digit,
an underscore or no leading letter are left out; a few words added, a few levels corrected and a few American words
removed, each with its reason in `source.yaml` and in the `note` of the word.

Please cite EFLLex as its authors ask:

- Dürlich, L. & François, T. (2018). EFLLex: A Graded Lexical Resource for Learners of English as a Foreign
  Language. In Proceedings of the 11th International Conference on Language Resources and Evaluation (LREC 2018),
  Miyazaki, Japan.
