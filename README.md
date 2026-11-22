

# To list logos

```{bash}
python3 -c 'import os, json; print(json.dumps(sorted(f for f in os.listdir("logos") if not f.startswith(".")), indent=2))' > logos.json
```