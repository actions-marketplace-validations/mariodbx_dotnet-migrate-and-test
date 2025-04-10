import * as core from '@actions/core'

/**
 * Interface for GitHub Action inputs.
 *
 * @property testFolder - The folder containing test projects.
 * @property migrationsFolder - The folder containing the EF Core migrations.
 * @property envName - The environment name for the runtime (e.g., 'Development', 'Production').
 * @property home - The home directory to set for the action.
 * @property skipMigrations - If true, migrations will not be applied.
 * @property skipTests - If true, tests will be skipped.
 * @property dotnetRoot - The path to the dotnet executable.
 * @property useGlobalDotnetEf - Determines whether to use the globally installed dotnet-ef tool.
 * @property getExecOutput - If true, command output is captured via exec.getExecOutput; otherwise, output is streamed.
 * @property testOutputFolder - The folder where test results are stored.
 * @property testFormat - Format to log test results (e.g., html, trx, json).
 * @property rollbackMigrationsOnTestFailed - If true, migrations will be rolled back if tests fail.
 *
 * @example
 * // Example object:
 * const inputs: ActionInputs = {
 *   testFolder: './tests',
 *   migrationsFolder: './migrations',
 *   envName: 'Development',
 *   home: '/home/node',
 *   skipMigrations: false,
 *   skipTests: false,
 *   dotnetRoot: '/usr/bin/dotnet',
 *   useGlobalDotnetEf: true,
 *   getExecOutput: true,
 *   testOutputFolder: './tests/TestResults',
 *   testFormat: 'html',
 *   rollbackMigrationsOnTestFailed: true
 * }
 */
export interface ActionInputs {
  testFolder: string
  migrationsFolder: string
  envName: string
  home: string
  skipMigrations: boolean
  skipTests: boolean
  dotnetRoot: string
  useGlobalDotnetEf: boolean
  getExecOutput: boolean
  testOutputFolder: string
  testFormat: string
  rollbackMigrationsOnTestFailed: boolean
}

/**
 * Reads and parses GitHub Action inputs from the environment.
 *
 * This function uses the GitHub Actions `core.getInput` method to retrieve user-specified
 * inputs as defined in the action metadata file (`action.yml`). Default values are provided
 * if no user input is present for a specific property.
 *
 * The loaded inputs include:
 * - Execution mode for capturing output.
 * - Paths to the .NET executable and project folders.
 * - Flag to decide whether to skip migrations or tests.
 * - Test output format and folder.
 * - A flag to determine if migrations should be rolled back when tests fail.
 *
 * The function logs all input values for transparency and debugging.
 *
 * @returns An object that conforms to the ActionInputs interface.
 *
 * @example
 * ```ts
 * const inputs: ActionInputs = getInputs()
 * core.info(`Running tests in folder: ${inputs.testFolder}`)
 * ```
 */
export function getInputs(): ActionInputs {
  // Parse boolean inputs by checking if the provided string is 'true'
  const getExecOutput: boolean = core.getInput('getExecOutput') === 'true'
  const skipMigrations: boolean = core.getInput('skipMigrations') === 'true'
  const useGlobalDotnetEf: boolean =
    core.getInput('useGlobalDotnetEf') === 'true'
  const skipTests: boolean = core.getInput('skipTests') === 'true'

  // Parse string inputs with defaults provided when empty
  const dotnetRoot: string = core.getInput('dotnetRoot') || '/usr/bin/dotnet'
  const envName: string = core.getInput('envName') || 'Test'
  const home: string = core.getInput('home') || '/home/node'
  const migrationsFolder: string =
    core.getInput('migrationsFolder') || './sample-project/sample-project.MVC'
  const testFolder: string =
    core.getInput('testFolder') || './sample-project/sample-project.Tests'
  const testFormat: string = core.getInput('testFormat') || 'html'
  const testOutputFolder: string =
    core.getInput('testOutputFolder') || `${testFolder}/TestResults`

  // Process rollback configuration; defaults to true if not provided.
  const rawRollbackInput =
    core.getInput('rollbackMigrationsOnTestFailed') || 'true'
  const rollbackMigrationsOnTestFailed: boolean =
    rawRollbackInput.trim().toLowerCase() === 'true'

  // Log the raw and processed rollback input for debugging.
  core.info(`rollbackMigrationsOnTestFailed raw value: "${rawRollbackInput}"`)
  core.info(
    `rollbackMigrationsOnTestFailed boolean: ${rollbackMigrationsOnTestFailed}`
  )
  core.info(
    `rollbackMigrationsOnTestFailed raw value: "${core.getInput('rollbackMigrationsOnTestFailed')}"`
  )
  core.info(
    `rollbackMigrationsOnTestFailed boolean: ${rollbackMigrationsOnTestFailed}`
  )

  // Log a summary of all loaded inputs.
  core.info(`Loaded inputs:

  - getExecOutput: ${getExecOutput}
  - Dotnet Root: ${dotnetRoot}
  - Environment: ${envName}
  - Home: ${home}
  - Skip Migrations: ${skipMigrations}
  - Migration Folder: ${migrationsFolder}
  - Use Global dotnet-ef: ${useGlobalDotnetEf}

  - Skip Tests: ${skipTests}
  - Test Folder: ${testFolder}
  - Test Output Folder: ${testOutputFolder}
  - Test Format: ${testFormat}
  - Rollback Migrations On Test Failed: ${rollbackMigrationsOnTestFailed}
  `)

  return {
    getExecOutput,
    dotnetRoot,
    envName,
    home,
    skipMigrations,
    migrationsFolder,
    useGlobalDotnetEf,
    skipTests,
    testFolder,
    testFormat,
    testOutputFolder,
    rollbackMigrationsOnTestFailed
  }
}

/* 
// Example usage:
//
// (async () => {
//   try {
//     const inputs = getInputs()
//     core.info(`Action is starting with the following inputs:`)
//     console.info(inputs)
//     // Proceed with further action logic using the provided inputs...
//   } catch (error) {
//     core.error(`Failed to load inputs: ${error}`)
//     process.exit(1)
//   }
// })()
*/
