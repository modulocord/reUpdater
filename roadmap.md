# Roadmap

## Reimplemented functions

- [x] command
- [x] command_blocking
- [ ] known_folder
- [ ] create_shortcut

## Reimplemented commands
- [x] UpdateToLatest
    - [x] Download full packages
    - [ ] Download delta packages
    - [x] Install packages
    - [ ] Update `installer.db` states
    - [x] Show task progress
    - [x] Return Manifest info when done

- [ ] InstallModule
    - [ ] Download packages
    - [ ] Install packages
    - [ ] Update `installer.db` states
    - [ ] Show task progress

- [ ] QueryCurrentVersions
    - [ ] Send updated versions

## Stubbed commands

`SetManifests`, `Repair`, `CollectGarbage`

Those will not do anything and will just return `[(TaskID), "Ok"]`
