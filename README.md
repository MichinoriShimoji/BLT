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
- **IPA** input palette (vowels / consonants / suprasegmentals / diacritics).
- Interlinear glossing with customizable annotation tiers (text / udl / morph / gloss / pos / trans …).
- Multi-speaker support with overlapping speech (per-speaker lanes).
- Sentence/word boundary coding layers (bdr / wbdr).
- Import and export **ELAN EAF**; export **TSV**, **JSON**, and split-audio **ZIP**.
- Analysis & simple dictionary tab (word/morpheme counts, morpheme list, examples with audio).

## Usage

Download [`blt.html`](blt.html) and open it in a browser, or use the live version linked above.

## Citation

If you use BLT in your research, please cite the archived release:

> Shimoji, Michinori. (2026). *BLT: Browser-based Lightweight Toolkit for Editing Field Data* (v1.0.1) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.20707256

- **Concept DOI** (always the latest version): [10.5281/zenodo.20707256](https://doi.org/10.5281/zenodo.20707256)
- **This version (v1.0.1)**: [10.5281/zenodo.20707257](https://doi.org/10.5281/zenodo.20707257)

A machine-readable citation is in [`CITATION.cff`](CITATION.cff) (GitHub shows a
"Cite this repository" button).

## License

[MIT](LICENSE) © 2026 Michinori Shimoji
