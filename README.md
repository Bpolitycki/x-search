# x-search

x-search is a simple cli-tool to search within XML-files on your filesystem with XPath (v3.1).

## Installation

x-search can be used as a local npm-package or as binary (see releases). To build from scratch run the following commands:

```
npm i
npm pkg-build
```

If you want to use the executable binary just store an alias in your terminal configuration and you're good to go:
```
alias xs="/your-path-to-the-binary/x-search-arm64 xs"
```
## Usage

Assuming you want to find all occurences of `<p/>` in a TEI-XML-file named `test.xml` run:

```
xs test.xml -q //p
```

## To-Dos

[ ] Implement recursive search in folders
[ ] Add tests
[ ] Add better error handling
[ ] Add better formating on the output
