# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Now uses the three.js library from localhost rather than from a CDN.
We have no internet connection while connected to the drone, duh.
- Swap controls for roll and yaw. Roll with left and right arrow keys
and turn left and right with A and D.