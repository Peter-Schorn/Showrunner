# Heroku Cheat Sheet

## Setup Command Line Client

Install the heroku command line client (CLI):  

* Globally: 
  
  `npm install -g heroku`

* Locally:
  
  `npm install -D heroku`

**NOTE**: If installed locally, you must use `npx heroku` instead of just `heroku` for *all* commands.

Confirm the heroku CLI is installed (always ignore suggestions to update):  
`heroku --version`

Connect the CLI to your heroku account:  
`heroku login`

## General

Group App name: **showrunner**

List your apps:  
`heroku apps`

Open app on browser:  
`heroku open -a showrunner`

Run app locally (*must* be in showrunner directory):  
`heroku local --port 3000`

## View Logs

`heroku logs -a showrunner` (add `--tail` to continuously stream real-time logs)

## SSH into app in terminal

This command creates a secure connection to the app in your terminal:

`heroku ps:excec -a showrunner`

(try printing the os info: `cat /etc/os-release`)

See https://devcenter.heroku.com/articles/exec.
