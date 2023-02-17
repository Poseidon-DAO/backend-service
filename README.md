## Scrips

The project contains two scripts for aidrops:

- For users that minted during the drop
- For users that have been holding before the next drop

## Running Scripts

### Fetching all users that minted during the drop

Run

```bash
  yarn run mints-airdrop
```

or npm

```bash
  npm run mints-airdrop
```

### Fetching users that have been holding at a specific point of time

Run

```bash
  yarn run holds-airdrop [date] [snapshotNumber]
```

or

```bash
  npm run holds-airdrop [date] [snapshotNumber]
```

e.g.

```bash
  yarn run holds-airdrop "2022-11-28 21:00:23+01" 2
```

`snapshotNumber` should be 2 or greater, 1 is automatically give to mints script
