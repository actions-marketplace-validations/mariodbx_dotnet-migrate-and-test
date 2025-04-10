# :warning: WORK IN PROGRESS :warning:

This action is still in an experimental phase, to use with discretion.

# Dotnet Migrate and Test GitHub Action

This GitHub Action automates the process of running EF Core migrations and
testing .NET projects. It is designed to streamline CI/CD workflows for .NET
applications. When used in conjunction with the `setup-dotnet` action, it
enables you to build, restore, and manage your .NET projects efficiently.

## Features

- **Build and Test**: Runs tests in a specified folder and uploads test results
  as artifacts.
- **EF Core Migrations**: Applies pending EF Core migrations and supports
  rollback on failure.
- **Customizable Inputs**: Configure the action to suit your project's needs.
- **Parallel Testing**: Supports running tests in parallel for faster execution.
- **Timeout Configuration**: Allows setting a timeout for test execution.
- **Environment Configuration**: Supports setting up custom environments for
  testing and deployment.

---

## Roadmap

### Current Features

- [x] Apply EF Core migrations with rollback support.
- [x] Test .NET projects.

### Upcoming Features

- [ ] Unit tests and integration tests for the action.
- [ ] Test code coverage for the action.
- [ ] Parallel test execution for faster workflows.
- [ ] Configurable test timeouts.
- [ ] Enhanced logging and debugging options.
- [ ] Improved error handling and reporting.

---

## Usage

To use this action in your workflow, include it in your `.github/workflows` YAML
file. Combine it with `setup-dotnet` to build, restore, and manage your .NET
projects seamlessly.

### Example Workflow

```yml
name: Build and Test

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x

      - name: Run Dotnet Build and Test Action
        uses: ./ # Use the local action or replace with the repository path
        with:
          getExecOutput: true
          envName: Test
          dotnetRoot: /usr/bin/dotnet
          skipMigrations: false
          migrationsFolder: ./src/Migrations
          useGlobalDotnetEf: false
          skipTests: false
          testFolder: ./tests/MyTestProject
          testFormat: trx
          testOutputFolder: 'TestResults'
```

---

## Inputs

| Input Name                       | Description                                                            | Required | Default Value                 |
| -------------------------------- | ---------------------------------------------------------------------- | -------- | ----------------------------- |
| `getExecOutput`                  | Whether to capture execution output (`true`) or stream it (`false`).   | Yes      | `true`                        |
| `envName`                        | Environment name for ASP.NET Core (e.g., `Development`, `Production`). | No       | `Test`                        |
| `dotnetRoot`                     | Path to the `dotnet` executable.                                       | No       | `/usr/bin/dotnet`             |
| `skipMigrations`                 | Skip applying EF Core migrations.                                      | No       | `false`                       |
| `migrationsFolder`               | Path to the folder containing EF Core migrations.                      | No       | `/Persistance/Pipelines.Data` |
| `useGlobalDotnetEf`              | Use globally installed `dotnet-ef` instead of a local installation.    | No       | `false`                       |
| `skipTests`                      | Skip running tests.                                                    | No       | `false`                       |
| `testFolder`                     | Path to the folder containing test projects.                           | Yes      | N/A                           |
| `testFormat`                     | Format for test results (e.g., `trx`, `html`, `json`).                 | No       | `html`                        |
| `testOutputFolder`               | Path to the folder where test results will be stored.                  | No       | `TestResults`                 |
| `rollbackMigrationsOnTestFailed` | Rollback migrations if tests fail.                                     | No       | `false`                       |

---

## Outputs

| Output Name     | Description                          |
| --------------- | ------------------------------------ |
| `lastMigration` | The last applied database migration. |
| `startTime`     | The time when the workflow started.  |
| `endTime`       | The time when the workflow finished. |

---

## How It Works

1. **Migrations**:

   - If `skipMigrations` is `false`, the action checks for pending EF Core
     migrations in the specified `migrationsFolder`.
   - If migrations are pending, it applies them using either a global or local
     `dotnet-ef` installation.
   - If `rollbackMigrationsOnTestFailed` is `true`, migrations are rolled back
     if tests fail.

2. **Tests**:

   - If `skipTests` is `false`, the action runs tests in the specified
     `testFolder`.
   - Test results are saved in the `testOutputFolder` and uploaded as artifacts.

3. **Environment Variables**:
   - The action sets the `DOTNET_ENVIRONMENT` variable to the value of
     `envName`.

---

## Requirements

- **.NET SDK**: Ensure the .NET SDK is installed on the runner.
- **EF Core Tools**: If `useGlobalDotnetEf` is `true`, ensure `dotnet-ef` is
  globally installed.

---

## Notes

- Ensure that the `testFolder` and `migrationsFolder` paths are correctly set
  relative to the repository root.
- Use the `rollbackMigrationsOnTestFailed` input to ensure database consistency
  in case of test failures.
