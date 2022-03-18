# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
