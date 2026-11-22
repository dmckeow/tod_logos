# To do
- What happens with anonymous input? Or name that is already in the database
- Confidence only required if they enter an answer
- If no answer and submit, default to NA confidence, readability 1
- Add Readability examples
- Put bigger images dataset on repo, and each reviewer gets different random subset of them?
- Feedback for user on how accurate they are being?

# To list logos

```{bash}
python3 -c 'import os, json; print(json.dumps(sorted(f for f in os.listdir("logos") if not f.startswith(".")), indent=2))' > logos.json
```