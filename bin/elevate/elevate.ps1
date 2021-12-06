$OFS = "`r`n"
$ver = $host | Select-Object version
if ($ver.Version.Major -gt 1) { $Host.Runspace.ThreadOptions = "ReuseThread" }

# Verify that user running script is an administrator
$Current = [Security.Principal.WindowsIdentity]::GetCurrent()
If ((New-Object Security.Principal.WindowsPrincipal $Current).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator) -eq $FALSE) {
    # We are not running "as Administrator" - so relaunch as administrator

    # Create a new process object that starts PowerShell
    $ProcessInfo = new-object System.Diagnostics.ProcessStartInfo "cmd";

    # Use temporary file to store the script back
    $temp_file = New-TemporaryFile

    # Format the command line parameters 
    $cmd_args = ($args -join ' ')
    $ProcessInfo.Arguments = "/c " + "$cmd_args > " + $temp_file;
    
    # Indicate that the process should be elevated
    $ProcessInfo.Verb = "runas";
    
    $ProcessInfo.WindowStyle = "Hidden";

    # Require use shell execution policy
    $ProcessInfo.UseShellExecute = $true;

    $ProcessInfo.WorkingDirectory = $PSScriptRoot;

    # Start the new process
    try {
        $process = [System.Diagnostics.Process]::Start($ProcessInfo);
        $process.WaitForExit()
        $content = Get-Content $temp_file
        Write-Output $content
        Remove-Item -Force -ErrorAction SilentlyContinue $output
        exit 0
    }
    catch [System.ComponentModel.Win32Exception] {
        Write-Error "`nERROR: The user canceled the elevation prompt."
        exit 1
    }
    catch {
        Write-Error "`nERROR: An error occurred while trying to elevate."
        exit 1
    }
}
else {
    # We are running "as Administrator" - so continue with the script
    $cmd_args = ($args -join ' ')
    $cmd_result = (cmd /c $cmd_args)
    Write-Output $cmd_result
    exit 0
}