/**
 * @fileoverview BibTeX for the cite links. An element with data-bib="key"
 * opens BIBTEX_DATABASE[key] in the citation dialog (see site.js).
 * tools/build.py only loads this file on pages that have cite links.
 */

/** @const {!Object<string, {title: string, bibtex: string}>} */
window.BIBTEX_DATABASE = {
  shinyobjects: {
    title: 'Shiny Objects: Object-Centric Characterization of Chromium',
    bibtex: `@article{10.1145/3788102,
author = {Upadhyay, Saket and Venkat, Ashish},
title = {Shiny Objects: Object-Centric Characterization of Chromium},
year = {2026},
issue_date = {March 2026},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
volume = {10},
number = {1},
url = {https://doi.org/10.1145/3788102},
doi = {10.1145/3788102},
abstract = {Modern web browsers manage millions of dynamic objects across tabs, frames, DOM elements, and JavaScript contexts. However, fine-grained behaviors related to object allocation, lifetime, and memory usage in production browsers remain elusive. Chromium's modular and extensible design, use of specialized memory allocators, and sensitivity to instrumentation overhead further complicate precise object tracking. To this end, we develop a lightweight, thread-safe, and non-intrusive profiling framework. Using this infrastructure, we present an empirical characterization of Chromium's memory object behavior across twelve diverse, user-centric workloads. We examine object lifetime events, size diversity, spatial locality, type diversity, and memory activity, and reflect on their broader software and architectural implications. Our study offers a systems-oriented view into Chromium's architecture and memory behavior, and highlights structural challenges in efficient memory management in large-scale and diverse systems.},
journal = {Proc. ACM Meas. Anal. Comput. Syst.},
month = mar,
articleno = {20},
numpages = {27},
keywords = {object lifecycle profiling, compile-time instrumentation, memory characterization, browser performance, llvm, microarchitectural analysis}
}`,
  },
  fuzzdistill: {
    title: 'FuzzDistill',
    bibtex: `@misc{upadhyay2024fuzzdistillintelligentfuzzingtarget,
title={FuzzDistill: Intelligent Fuzzing Target Selection using Compile-Time Analysis and Machine Learning},
author={Saket Upadhyay},
year={2024},
eprint={2412.08100},
archivePrefix={arXiv},
primaryClass={cs.SE},
url={https://arxiv.org/abs/2412.08100}
}`,
  },
  esweek2024: {
    title: 'Detecting and Defending Vulnerabilities',
    bibtex: `@inproceedings{patnala2024detecting,
title={Detecting and Defending Vulnerabilities in Heterogeneous and Monolithic Systems: Current Strategies and Future Directions},
author={Patnala, Venkat Nitin and Dinakarrao, Sai Manoj Pudukotai and Venkataramani, Guru and Chen, Jie and Doroslovacki, Milos and Yao, Fan and Fang, Hongyu and Demissie, Meron and Austin, Todd and Biernacki, Lauren and Upadhyay, Saket and Kalita, Arnabjyoti and Venkat, Ashish},
booktitle={Proceedings of the 2024 International Conference on Hardware/Software Codesign and System Synthesis (ESWEEK)},
year={2024},
month={09}
}`,
  },
  firefly: {
    title: 'Modified Firefly Optimization Algorithm-Based IDS',
    bibtex: `@article{shandilya2023firefly,
title={Modified Firefly Optimization Algorithm-Based IDS for Nature-Inspired Cybersecurity},
author={Shandilya, Shishir Kumar and Choi, Bong Jun and Kumar, Ajit and Upadhyay, Saket},
journal={Processes},
volume={11},
number={3},
pages={715},
year={2023},
publisher={MDPI},
doi={10.3390/pr11030715}
}`,
  },
  nicsanomaly: {
    title: 'Nature-Inspired Malware and Anomaly Detection',
    bibtex: `@incollection{upadhyay2021nature,
title={Nature-Inspired Malware and Anomaly Detection in Android-Based Systems},
author={Upadhyay, Saket},
booktitle={Advances in Nature-Inspired Cyber Security and Resilience},
year={2021},
publisher={Springer},
month={10},
doi={10.1007/978-3-030-90708-2_5}
}`,
  },
  nicstestbed: {
    title: 'AI-assisted Computer Network Operations testbed',
    bibtex: `@article{shandilya2021ai,
title={AI-assisted Computer Network Operations testbed for Nature-Inspired Cyber Security based adaptive defense simulation and analysis},
author={Shandilya, Shishir Kumar and Upadhyay, Saket and Kumar, Ajit and Nagar, Atulya K},
journal={Future Generation Computer Systems},
year={2021},
month={02},
doi={10.1016/j.future.2021.09.017}
}`,
  },
  pacer: {
    title: 'PACER',
    bibtex: `@article{kumar2020pacer,
title={PACER: Platform for Android Malware Classification, Performance Evaluation and Threat Reporting},
author={Kumar, Ajit and Agarwal, Vinti and Shandilya, Shishir Kumar and Shalaginov, Andrii and Upadhyay, Saket and Yadav, Bhawna},
journal={Future Internet},
volume={12},
number={4},
pages={66},
year={2020},
month={04},
publisher={MDPI},
doi={10.3390/fi12040066}
}`,
  },
  pace: {
    title: 'PACE',
    bibtex: `@inproceedings{kumar2019pace,
title={PACE: Platform for Android Malware Classification and Performance Evaluation},
author={Kumar, Ajit and Agarwal, Vinti and Shandilya, Shishir Kumar and Shalaginov, Andrii and Upadhyay, Saket and Yadav, Bhawna},
booktitle={2019 IEEE International Conference on Big Data},
year={2019},
month={12},
organization={IEEE},
doi={10.1109/BigData47090.2019.9006557}
}`,
  },
};
