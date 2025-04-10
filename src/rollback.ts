import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * Rolls back EF Core database migrations in a GitHub Actions workflow.
 *
 * This function automates the execution of the `dotnet ef database update <targetMigration>`
 * command, allowing for rollback to a specified migration. It supports both local and global installations
 * of the `dotnet-ef` tool, and provides an option to capture and log command output.
 *
 * @param getExecOutput - If true, uses `getExecOutput` to capture the stdout and stderr of the rollback command.
 * @param envName - The ASP.NET Core environment name to use (e.g., "Development", "Staging", "Production").
 * @param home - The home directory path to set as `HOME` in the execution environment.
 * @param migrationsFolder - The working directory where the migrations should be run.
 * @param dotnetRoot - Path to the local dotnet executable or root directory (used when not using global dotnet-ef).
 * @param useGlobalDotnetEf - Whether to use a globally installed `dotnet-ef` CLI tool.
 * @param targetMigration - The migration name or ID to which the database should be rolled back.
 *
 * @returns A Promise that resolves once the rollback process is complete.
 *
 * @example
 * ```ts
 * await rollbackMigrations(
 *   true,
 *   'Development',
 *   '/home/runner',
 *   './src/MyApp.Infrastructure',
 *   '/home/runner/.dotnet',
 *   false,
 *   'InitialCreate'
 * )
 * ```
 *
 * This would rollback the database to the 'InitialCreate' migration using a locally installed dotnet-ef tool,
 * capturing and logging the command output.
 */
export async function rollbackMigrations(
  getExecOutput: boolean,
  envName: string,
  home: string,
  migrationsFolder: string,
  dotnetRoot: string,
  useGlobalDotnetEf: boolean,
  targetMigration: string
): Promise<void> {
  core.info(`Rolling back to migration: ${targetMigration}...`)

  const baseEnv = {
    DOTNET_ROOT: dotnetRoot,
    HOME: process.env.HOME || home,
    ASPNETCORE_ENVIRONMENT: envName
  }

  const rollbackArgs = useGlobalDotnetEf
    ? ['database', 'update', targetMigration]
    : ['tool', 'run', 'dotnet-ef', 'database', 'update', targetMigration]

  const execOptions: exec.ExecOptions = {
    cwd: migrationsFolder,
    env: baseEnv
  }

  if (getExecOutput) {
    const result = await exec.getExecOutput(
      useGlobalDotnetEf ? 'dotnet-ef' : dotnetRoot,
      rollbackArgs,
      execOptions
    )
    core.info(result.stdout)
  } else {
    await exec.exec(
      useGlobalDotnetEf ? 'dotnet-ef' : dotnetRoot,
      rollbackArgs,
      execOptions
    )
  }

  core.info('Rollback completed successfully.')
}
