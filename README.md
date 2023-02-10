# Circle Interface 

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

## How works?

# High-level implementation design

The implementation is composed of three parts:

GitCircleClient - A local git client executable that runs on a developer machine on Storm

GitServerCircle - A “hidden” git server that listens to private messages sent via Storm

GitStorageCircle - A storage based Carbonado for archieve chats and repositories

# GitCircleClient

This is a standard git client with modifications to make it communicate over Storm. The client tracks local source files the same as before. It mainly differs in the following way:
User id: user id is the Storm id of the user.
Git Pull request: 
Initiate a fetch request by sending a private message to a Storm user that represents a GitServerCircle
Get requested data from GitServerCircle  in the form of private Storm
Do local merge “regularly”
Push by sending Storm messages to theGitServerCircle Storm Id

# GitServerCircle

This is a standard Git server with modifications to make it communicate over Storm. The main difference is that the server does not listen on an IP. Instead, it listens on Its Storm user ID.
It receives requests from GitCircleClient in the form of Storm Messages 
Requests are parsed by its communication layer, translated into standard Git server commands, and executed standardly in its logical layer.  
Responses are sent back to the  GitCircleClient in the form of Nostr messages to the NostrableGitClient  Storm ID.

# GitStorageCircle

This is a standard git storage with modifications to make it communcate over Storm. The main difference is that the server stay on Carbonado.
Instead, to be present in a web client like central data center

# Client-Circle

[More info](https://github.com/AreaLayer/Circle-Client)


# To-Do

- [ ] Testnet
- [ ] Integration with LND, CLN, LDK, LNP
- [ ] Mainnet
- [ ] Fees
- [ ] RGB, Lightning Network, Nostr and Storm integrations
