# Catalog provenance and verification

Prepared 2 November 2026. These are local snapshots, not a live registry or a claim that every external link was individually visited.

## GitHub metadata

- Author/compiler: **Mieaz**, [github-repos-metadata-ge3](https://huggingface.co/datasets/Mieaz/github-repos-metadata-ge3).
- [Dataset card and attribution](https://huggingface.co/datasets/Mieaz/github-repos-metadata-ge3#license--attribution): **Creative Commons Attribution 4.0**, [licence](https://creativecommons.org/licenses/by/4.0/).
- Imported the first Parquet shard, `data/train-00000-of-00004.parquet`, containing **1,320,730 repository records**. The full dataset advertises 5,289,726 records; we did not download or scan all four shards.
- The provider combines a historical base through mid-2022 with periodic 2023–2026 snapshots. Stars are values at each record's crawl time, not live counts. Active and historical repositories are included.
- Changes: selected and grouped metadata using names, descriptions, topics and ecosystem languages; ranked by topical match and then stars; removed exact URL duplicates and likely rename/mirror duplicates with the same repository basename and identical substantial description. Repeated `: more` sections take disjoint batches from a deduplicated category pool. No repository code was downloaded or executed.
- Metadata licence does not replace the individual software repository's licence.

## Python packages

- Source: [Repology PyPI metadata cache](https://pypicache.repology.org/), [download](https://pypicache.repology.org/pypicache.json.zst), ultimately [PyPI](https://pypi.org/).
- Source page reports generation **2026-11-01 22:42 UTC**, 533,375 records, 381.51 MiB. Processing retained **531,786 distinct normalized package names**. Package-name normalization collapses case and runs of hyphens, underscores and dots.
- Entries contain actual package names, declared versions, summaries and author-supplied classifiers. Classification uses Topic classifiers plus package names, summaries and keywords; generic Programming Language and Operating System classifiers were excluded from topical matching.
- 35 groups have 1,300 candidates each. Repeated topic groups use disjoint batches. No package was installed, imported or executed.
- The cache states that its coverage is incomplete and consistency is not guaranteed. Package versions represent this snapshot. The cache landing page does not declare a blanket metadata licence; do not label all PyPI software CC BY or MIT. Individual projects retain their own licences. The website links to original PyPI project pages and does not redistribute package code.

## Windows documentation

Official sources, downloaded on 2 November 2026:

- [MicrosoftDocs/windowsserverdocs](https://github.com/MicrosoftDocs/windowsserverdocs), branch `main`; [content licence](https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/LICENSE).
- [MicrosoftDocs/windows-powershell-docs](https://github.com/MicrosoftDocs/windows-powershell-docs), branch `main`; [content licence](https://github.com/MicrosoftDocs/windows-powershell-docs/blob/main/LICENSE).
- [MicrosoftDocs/windows-driver-docs](https://github.com/MicrosoftDocs/windows-driver-docs), branch `staging`; [content licence](https://github.com/MicrosoftDocs/windows-driver-docs/blob/staging/LICENSE).

All three downloaded LICENSE files declare **Creative Commons Attribution 4.0 International** for documentation. Their separate LICENSE-CODE files specify MIT for code. We use document titles and links, not article bodies or code. Attribution: Microsoft and MicrosoftDocs contributors. Changes: extract titles, deduplicate titles case-insensitively across OS versions, classify, select and link. The download archive hashes are saved in `source-audit.json`.

20,475 unique document titles remained after removing navigation, include fragments and duplicate titles across OS versions. Five expanded groups have pools of 1,655; 4,618; 3,808; 4,121; and 20,474 matches respectively, with 1,500 candidates retained per group.

These expanded Windows groups contain documentation and command reference pages, **not 1,000 distinct Windows images or rescue-disk products**. Preserve explicit expanded scope and document type in the interface.

## Quality and counting limits

- Candidate groups have no duplicate canonical URLs internally. Known GitHub rename/mirror duplicates with identical names/descriptions were removed. This does not guarantee that every fork or renamed project has been identified.
- Windows versions of the same titled document/cmdlet are counted once. Different document pages with similar subject matter remain separate entries.
- A project can legitimately occur in multiple different topical groups. Total placements are not the same number as globally distinct projects.
- Grouping is based on source metadata and broad explicitly stated scopes, not individual editorial review of every entry. Some author-supplied classifiers are overly broad. Sample: `nara` declares a Visualization classifier although its summary describes AI retrieval; `geniz` declares Build Tools while its summary is generic. These illustrate why the catalog should not claim every item was manually verified.
- Representative valid samples: a disk-storage group includes RAM-disk/filesystem projects; backup includes photo synchronization; remote access includes administration/VPN tools; standards includes protocol implementations; Windows recovery includes diagnostic and debugger references.
- No synthetic numbered filler, fake package names, generated URL guesses or duplicated OS-version pages were used to reach the counts.
