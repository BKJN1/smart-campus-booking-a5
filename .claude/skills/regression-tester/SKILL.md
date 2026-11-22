---
name: regression-tester
description: Derive regression tests from acceptance criteria for the Smart Campus booking app. Use when writing or reviewing tests after a bug fix.
---
# Regression Tester

## Procedure
1. Derive one or more tests per acceptance criterion (AC1-AC6).
2. Use a fixed clock (constant `now`) and fresh fixtures for every test.
3. Assert exact results and that input booking data is not mutated.
4. Run tests only if a terminal tool is available.
5. Report unexecuted tests honestly.
6. Compare proposed coverage with the Lesson #07 tests.
