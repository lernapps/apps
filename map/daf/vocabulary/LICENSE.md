# Licence of the basic vocabulary of German as a foreign language

The files of this folder (`source.yaml`, `words.yaml`) are derived from **DAFlex** (CEFRLex, CENTAL / VALIBEL,
UCLouvain, <https://cental.uclouvain.be/cefrlex/daflex/download/>) and are licensed, as DAFlex is, under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
The MIT licence of this repository does not apply to them.

Changes to DAFlex: only the words of the levels A1 and A2, without the frequencies; the level of a word is the first
level at which at least three documents of DAFlex's corpus use it (`minDocuments` in `source.yaml`); lemmas with a
digit, an underscore or no leading letter are left out; a few words added, a few levels corrected for children's
everyday life, and a few corpus artefacts removed, each with its reason in `source.yaml` and in the `note` of the word.

Please cite DAFlex as its authors ask:

- François, T., Kerres, P., De Meyere, D. & Suñer Muñoz, F. DAFlex: A CEFR-graded lexical resource for German as a
  foreign language. CENTAL / VALIBEL, UCLouvain. <https://cental.uclouvain.be/cefrlex/daflex/> (reference article
  forthcoming).
