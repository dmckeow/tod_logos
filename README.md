# To do
- Add Readability examples
- Put bigger images dataset on repo, and the next image is always random. Maybe bias towards bands with no data?
- Feedback for user on how accurate they are being?

# To list logos

```{bash}
python3 -c 'import os, json; print(json.dumps(sorted(f for f in os.listdir("logos") if not f.startswith(".")), indent=2))' > logos.json
```