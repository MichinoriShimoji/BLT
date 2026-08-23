# BLT — Browser-based Lightweight Toolkit for Editing Field Data

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20707256.svg)](https://doi.org/10.5281/zenodo.20707256)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A simple, intuitive toolkit for transcription, annotation, glossing, and conversion.

**BLT** is a single-file, fully client-side browser tool for field linguistics.
Open [`blt.html`](blt.html) in any modern browser — no installation, no server,
no external libraries, and your data never leaves your machine.

🔗 **Live version:** https://michinorishimoji.github.io/mshimoji.com/blt.html

## Features

- Reads raw **WAV** audio and auto-segments it by silence detection (smoothed RMS + auto threshold + hysteresis).
- Waveform-based boundary editing; missed-audio detection.
- **IPA** input palette (vowels / consonants / suprasegmentals / diacritics), with keyboard
  shortcuts you assign to the symbols you actually use. Assignments are saved with the project.
- Interlinear glossing with customizable annotation tiers (text / udl / morph / gloss / pos / trans …).
- Multi-speaker support with overlapping speech (per-speaker lanes).
- Sentence/word boundary coding layers (bdr / wbdr).
- Import and export **ELAN EAF**; export **TSV**, **JSON**, split-audio **ZIP**,
  **LaTeX** (gb4e, with IPA converted to `tipa`), and **Word** (.docx).
- Analysis & simple dictionary tab (word/morpheme counts, morpheme list, examples with audio).

## Usage

Download [`blt.html`](blt.html) and open it in a browser, or use the live version linked above.

## Interoperability with ELAN

BLT reads and writes [ELAN](https://archive.mpi.nl/tla/elan) `.eaf` files so that data can
move freely between the two tools — for example, segment and gloss in BLT, then continue in
ELAN. The EAF support is an independent implementation written from the publicly documented
EAF schema; no ELAN source code is used or included.

BLT is an independent project. It is **not** affiliated with, endorsed by, or derived from
ELAN, the Max Planck Institute for Psycholinguistics, or The Language Archive. "ELAN" is the
name of their software and is referred to here only to describe file-format compatibility.

## Citation

If you use BLT in your research, please cite the archived release:

> Shimoji, Michinori. (2026). *BLT: Browser-based Lightweight Toolkit for Editing Field Data* (v1.2.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.20707256

- **Concept DOI** (always resolves to the latest version): [10.5281/zenodo.20707256](https://doi.org/10.5281/zenodo.20707256)
- Earlier versions: v1.1.0 — [10.5281/zenodo.22056173](https://doi.org/10.5281/zenodo.22056173) ·
  v1.0.2 — [10.5281/zenodo.20749188](https://doi.org/10.5281/zenodo.20749188) ·
  v1.0.1 — [10.5281/zenodo.20707257](https://doi.org/10.5281/zenodo.20707257)

A machine-readable citation is in [`CITATION.cff`](CITATION.cff) (GitHub shows a
"Cite this repository" button).

## License

[MIT](LICENSE) © 2026 Michinori Shimoji
