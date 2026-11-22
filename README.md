# To do
- What happens with anonymous input? Or name that is already in the database
- Allow submission with nothing entered default to confidence low readability 1
- Confidence only required if they enter an answer
- If no answer and submit, default to NA confidence, readability 1
- Add Readability examples
- Put bigger images dataset on repo, and each reviewer gets different random subset of them?
- Bad logo button in case logo is unreadable for technical reasons

# To list logos

```{bash}
python3 -c 'import os, json; print(json.dumps(sorted(f for f in os.listdir("logos") if not f.startswith(".")), indent=2))' > logos.json
```