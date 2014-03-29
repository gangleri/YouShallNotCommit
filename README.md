# You Shall Not Commit #

Wizards are great they destroy magic rings, slay dragons kick tyrant kings from thrones and crown rightful
heirs a kingdom. When they aren't off on a quest you can employ a wizard to guard your code from the
forces of chao better known as carless developers.

YouShallNotCommit is a [pre-commit hook](http://git-scm.com/book/en/Customizing-Git-Git-Hooks) for git that 
works wih [npm scripts](https://npmjs.org/doc/scripts.html), you define scripts as normal in your package.json. Then add a pre-commit 
array to the package.json the wizard will run these scripts when you attempt to commit code to your git 
repo helping keep the orcs from the realm of broken code from breaching the gates of your repo.


## Recommended spells ##
Some spells/scripts that I like to give my wizard

* [JSHint]()
* [David]()
* [Missing]()
* Any unit tests, I like [tape]().

Please feel free to suggest more.


## Installation ##
Recommed installing this as a dev dependency.

```sh
npm install YouShallNotCommit --save-dev
```
Running this will place a pre-commit script in your .git/hooks folder if one doesn't already exist. It uses
the magic of the install attribute in package.json.

Define a set of scripts

```json
scripts: {
  "findHobbit": "echo found hobbit && exit 0",
  "goOnQuest": "echo 'Off to the mountains' && exit 0",
  "killDragin": "echo 'Dragon dead' && exit 0",
  "smokeSwapWeed": "echo 'smoking is bad'; exit 1"
}
```
The exit 1 is important, any script that exits with a code other than 0 will result in the commit
being aborted.


Tell the wizard which scripts he should use. Nothing is run by default you have complete control over what
the wizard will do. Killing dragons each timme you check in code may take time and result in grumpy 
developers so we can just leave that script out.


```json
pre-commit[
  "findHobbit",
  "goOnQuest",
  "smokeSwapWeed"
]
```

## How does this differ from similar modules ##
Apart from the talk of wizards, spells and orcs? Other pre-commit hooks that I've seen assume that the .git
lives in the same folder as package.json while this is probably fine for most projects I have worked on
projects which have had a number of sub folders each with their own package.json. Here the wizard was able
to begin the quest for the .git folder and keep moving up the directory tree until it was found. 

The wizard will then look at the files being committed find the appropriate package.json for each and run
the scripts you have befined for each.



## License ##
MIT
