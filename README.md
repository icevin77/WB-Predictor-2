# WB Predictor

Western blot outcome predictor. Given a cell line, a drug (known or novel) and a set of
markers, it combines a local database of published western blot results with live lookups
(PubChem, Cellosaurus, UniProt, LINCS L1000, cBioPortal, PubMed/PMC, Semantic Scholar)
and returns a prediction table, a simulated blot, an evidence review and the signaling
chain for each marker.

## Files

| Path            | Purpose                                                        |
|-----------------|----------------------------------------------------------------|
| `index.html`    | Single-page front end                                          |
| `wb_db.csv`     | 7,824 western blot results extracted from the literature       |
| `api/chat.js`   | Serverless proxy that holds the API credentials                |

## Deploy on Vercel

1. Import the repository as a new Vercel project (no build step, static + serverless).
2. Set the project environment variables:

   | Variable        | Required | Description                                  |
   |-----------------|----------|----------------------------------------------|
   | `MODEL_API_URL` | yes      | Provider messages endpoint                   |
   | `MODEL_API_KEY` | yes      | Provider API key                             |
   | `MODEL_NAME`    | yes      | Model identifier                             |
   | `MODEL_VERSION` | no       | API version value, when the provider needs one |
   | `MODEL_VERSION_HEADER` | no | Header name for `MODEL_VERSION`              |
   | `MAX_TOKENS`    | no       | Response token limit (default 12000)         |

3. Deploy. The front end calls `/api/chat`, so no key is ever exposed to the browser.

## Local run

Any static server works, as long as `/api/chat` is available:

```
vercel dev
```

`wb_db.csv` is fetched at page load, so opening `index.html` directly from the file
system will not populate the database.

## Database columns

`cell, cell_ac, is_rare_cell, drug, drug_cid, conc_uM, time_h, marker, marker_uniprot,
direction, intensity, condition, figure, evidence, cell_raw, drug_raw, conc_raw, time_raw,
marker_raw, pmcid, year, quality`

`direction` is one of `up`, `down`, `none`, `unknown`; `quality` is a 0-100 confidence
score for the extracted row.

## Note

Predictions are inferences from published data and signaling logic, not measurements.
Always confirm experimentally.
