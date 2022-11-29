# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ingest `Dynamic` and `SCA` scans alongside `Static`

[4.0.1] - 2022-05-24

### Added

- managed question

[4.0.0] - 2022-05-18

### Added

- `veracode_project` entity

### Changed

- BREAKING: `veracode_account` no longer `HAS` `veracode_assessment`
- instead `veracode_account HAS veracode_project` and
  `veracode_project HAS veracode_assessment`
- raw data previously housed in `veracode_assessment` now lives in
  `veracode_project` instead

[3.0.0] - 2022-05-11

### Changed

- BREAKING: change `veracode_application` to `veracode_assessment`
- change class of said entity from `Application` to `Assessment`
- update packaged question

[2.1.0] - 2022-04-01

### Added

- add cwe property to `veracode_finding` entity

### Changed

- change displayName of `veracode_finding` entity

[2.0.1] - 2022-03-22

### Fixed

- handle veracode accounts with no applications

[2.0.0] - 2022-03-18

- BREAKING: target `@jupiterone/graph-veracode` new major version to mark
  deprecation of old project
- add questions.yml

[1.0.0] - 2022-03-16

### NOTE

- the following version was published under `@jupiterone/graph-veracode-v2`, all
  new versions will be on `@jupiterone/graph-veracode`

### Fixed

- security vuln in url-parse

### Added

- cleanup from template
- account entity
- application entity
- findings from static scans
- relationships b/w these entities
- docs
- tests
- veracode client with valid auth
