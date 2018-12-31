workflow "New workflow" {
  on = "push"
  resolves = ["GitHub Action for npm-2"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@e7aaefe"
  runs = "npm install"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@e7aaefe"
  needs = ["GitHub Action for npm"]
  runs = "npm run test"
}

action "GitHub Action for npm-2" {
  uses = "actions/npm@e7aaefe"
  needs = ["GitHub Action for npm-1"]
  runs = "npm run build"
}
