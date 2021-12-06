$OFS = "`r`n"
$ver = $host | select version
if ($ver.Version.Major -gt 1)  {$Host.Runspace.ThreadOptions = "ReuseThread"}

# Verify that user running script is an administrator
$Current=[Security.Principal.WindowsIdentity]::GetCurrent()
If ((New-Object Security.Principal.WindowsPrincipal $Current).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator) -eq $FALSE)
{
    #"`nERROR: You are NOT a local administrator.  Run this script after logging on with a local administrator account."
    # We are not running "as Administrator" - so relaunch as administrator

    # Create a new process object that starts PowerShell
    $ProcessInfo = new-object System.Diagnostics.ProcessStartInfo "cmd";

    # Specify the current script path and name as a parameter
    $output = New-TemporaryFile
    # F
    $cmd_args = ($args -join ' ')
    $ProcessInfo.Arguments = "/c " + "$cmd_args > " + $output;
    # Indicate that the process should be elevated
    $ProcessInfo.Verb = "runas";
    
    $ProcessInfo.WindowStyle = "Hidden";

    # # Require use shell execution policy
    $ProcessInfo.UseShellExecute = $true;

    $ProcessInfo.WorkingDirectory = $PSScriptRoot;

    # Start the new process
    try{
        $process = [System.Diagnostics.Process]::Start($ProcessInfo);
        $process.WaitForExit()
        $dd = Get-Content $output
        Write-Output $dd
        Remove-Item -Force -ErrorAction SilentlyContinue $output
        exit 0
    }
    catch [System.ComponentModel.Win32Exception]{
        Write-Error "`nERROR: The user canceled the elevation prompt."
        exit 1
    }
    catch{
        Write-Error "`nERROR: An error occurred while trying to elevate."
        exit 1
    }
} else {
    # We are running "as Administrator" - so continue with the script
    $cmd_args = ($args -join ' ')
    $cmd_result = (cmd /c $cmd_args)
    Write-Output $cmd_result
    exit 0
}