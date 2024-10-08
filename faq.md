# FAQ

For all the questions.

## Why?

Originally I wanted to make my own Discord client which (at least on the non-modules side) is open source 1:1 with the official Discord client, I abandoned it after realizing it's too much work. However still it has purposes somewhere.

## What is updater.node?

`updater.node` is a node addon of `app.asar` that interacts with Discord's update server and installs updates. 

It is only for Windows users, as it relies on and modifies `installer.db` which is exclusive to (Discord's modified) Squirrel.Windows.

`updater.node` also has a function that gets known folders and creates shortcuts.

## Will this 100% match the original?

Rust is hard to reverse-engineer with, *I tried to do this before switching to the approach I am doing right now*. So this will not be 100% match the original bytecode. However, you would expect the functionalities will be intact.

Besides I want to do improvements to `updater.node` anyways.

## Will this include Discord's code?

**No.** Although this is not a competing replacement of Discord, it's better safe to make a completely new code than to include Discord's. Just look at Spacebar.

## How does this compare to Mu (OpenAsar)?

Mu is a different implementation that uses their own server. (Also according to Ducko/CanadaHonk it's dead)

reUpdater is just a replacement that replaces a part of Discord's **frontend** code, replicating the exact same in terms of functionality.

Ignoring the technical side, reUpdater uses Discord's server so it would be updated as same as Discord's, Mu will lag behind in this a little bit.

(Sidenote: Mu, and by extension OpenAsar removes functions that are deemed unnesecary for an asar replacement, for repackers like me, that's bad enough. No hate for OpenAsar though!)

## Will I use this to connect to a compatible backend replacement?

Sure you can! Although it's not on this side of the frontend though, you should change it in `app.asar`.

## What improvements does this have over the original?

- Multithreaded downloads and installs, enabling all updates to be downloaded, and simultaneously installs them.

- Allows custom update API. Unlike Discord's `updater.node`, this allows for integration with alternative update APIs, enabling patched updates.

- Enhanced privacy. Discord logs analytics for installs and updates, this replacement does not send any analytics to Discord.

## Would this be available to macOS/Linux users?

**Maybe.**

As stated above, this relies on and modifies `installer.db` which is exclusive to (Discord's modified) Squirrel.Windows, which is Windows only, although someone can make a custom installer that creates it.