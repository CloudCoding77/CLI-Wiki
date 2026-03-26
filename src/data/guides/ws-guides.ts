import type { Guide } from '../../types'

export const wsGuides: Guide[] = [
  // ─── 1. Set Up an Active Directory Domain ─────────────────────────────────
  {
    id: 'ws-ad-domain-setup',
    title: 'Set Up an Active Directory Domain',
    description:
      'Install and configure Active Directory Domain Services (AD DS) on Windows Server, promote the server to a domain controller, configure DNS integration, create the first organizational units, and verify replication and domain health.',
    category: 'ws-activedirectory',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    prerequisites: [
      'Windows Server 2019 or 2022 installed with a static IP address',
      'Local Administrator access',
      'A planned domain name (e.g. corp.contoso.com)',
      'Network connectivity and DNS resolution to upstream forwarders',
    ],
    steps: [
      {
        title: 'Assign a static IP address',
        description:
          'Before promoting the server, ensure it has a static IPv4 address, subnet mask, default gateway, and preferred DNS pointing to itself (127.0.0.1). A domain controller must never use DHCP for its own address.',
        code: `# View current IP configuration
Get-NetIPConfiguration

# Assign static IP (adjust InterfaceIndex, address, and gateway)
New-NetIPAddress -InterfaceIndex 4 -IPAddress 10.0.0.10 -PrefixLength 24 -DefaultGateway 10.0.0.1

# Set DNS to loopback (self) and an upstream forwarder
Set-DnsClientServerAddress -InterfaceIndex 4 -ServerAddresses 127.0.0.1,8.8.8.8`,
        codeLanguage: 'powershell',
        warning: 'Changing the IP address on a remote session will disconnect you. Perform this step from the console or ensure you reconnect using the new IP.',
      },
      {
        title: 'Rename the server',
        description:
          'Set a meaningful hostname for the domain controller before promotion. The name cannot be changed easily after AD DS is installed.',
        code: `# Rename and restart
Rename-Computer -NewName "DC01" -Restart`,
        codeLanguage: 'powershell',
        note: 'Choose a name that follows your naming convention (e.g. DC01, DC-SITE1). The server will reboot automatically.',
      },
      {
        title: 'Install the AD DS role',
        description:
          'Install the Active Directory Domain Services role and the management tools. This step only installs the binaries; promotion happens later.',
        code: `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > Active Directory Domain Services',
      },
      {
        title: 'Review the AD DS deployment prerequisites',
        description:
          'Run the prerequisite check to ensure the server meets all requirements for domain controller promotion. This validates the forest and domain functional levels, NTDS and SYSVOL paths, and DNS delegation.',
        code: `# Dry-run the prerequisite check
Test-ADDSForestInstallation -DomainName "corp.contoso.com" \\
  -DomainNetbiosName "CORP" \\
  -ForestMode WinThreshold \\
  -DomainMode WinThreshold \\
  -InstallDns`,
        codeLanguage: 'powershell',
        note: 'WinThreshold corresponds to the Windows Server 2016 functional level. Use Win2012R2 if you need backward compatibility with older DCs.',
      },
      {
        title: 'Promote the server to a domain controller',
        description:
          'Create a new Active Directory forest and promote this server as the first domain controller. The command installs DNS Server automatically, sets the Directory Services Restore Mode (DSRM) password, and configures SYSVOL replication.',
        code: `Install-ADDSForest \\
  -DomainName "corp.contoso.com" \\
  -DomainNetbiosName "CORP" \\
  -ForestMode WinThreshold \\
  -DomainMode WinThreshold \\
  -InstallDns \\
  -DatabasePath "C:\\Windows\\NTDS" \\
  -LogPath "C:\\Windows\\NTDS" \\
  -SysvolPath "C:\\Windows\\SYSVOL" \\
  -SafeModeAdministratorPassword (ConvertTo-SecureString "YourDSRMpassw0rd!" -AsPlainText -Force) \\
  -Force`,
        codeLanguage: 'powershell',
        warning: 'The server will reboot automatically after promotion. Store the DSRM password securely — you will need it for directory recovery scenarios.',
      },
      {
        title: 'Verify AD DS installation',
        description:
          'After the server reboots, log in with the domain administrator account and verify that AD DS and DNS are running correctly.',
        code: `# Check AD DS service
Get-Service NTDS, DNS

# Verify the domain
Get-ADDomain

# Verify the forest
Get-ADForest`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure DNS reverse lookup zone',
        description:
          'Create a reverse lookup zone so that IP-to-name resolution works correctly. This is required for many AD-integrated services.',
        code: `Add-DnsServerPrimaryZone -NetworkId "10.0.0.0/24" -ReplicationScope Domain
Get-DnsServerZone`,
        codeLanguage: 'powershell',
        note: 'Adjust the NetworkId to match your subnet. For multiple subnets, create a reverse zone for each one.',
      },
      {
        title: 'Create organizational units (OUs)',
        description:
          'Design and create an OU structure that reflects your organization. A common layout separates Users, Computers, Servers, and Groups into distinct OUs to simplify Group Policy targeting.',
        code: `$baseDN = "DC=corp,DC=contoso,DC=com"

New-ADOrganizationalUnit -Name "Company" -Path $baseDN -ProtectedFromAccidentalDeletion $true
$companyDN = "OU=Company,$baseDN"

"Users","Computers","Servers","Groups","Service Accounts" | ForEach-Object {
    New-ADOrganizationalUnit -Name $_ -Path $companyDN -ProtectedFromAccidentalDeletion $true
}

# Verify
Get-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create the first domain admin account',
        description:
          'Create a named domain administrator account instead of using the built-in Administrator. Add it to Domain Admins and Enterprise Admins groups.',
        code: `New-ADUser -Name "Admin.JDoe" \\
  -SamAccountName "admin.jdoe" \\
  -UserPrincipalName "admin.jdoe@corp.contoso.com" \\
  -Path "OU=Users,OU=Company,DC=corp,DC=contoso,DC=com" \\
  -AccountPassword (ConvertTo-SecureString "P@ssw0rd2024!" -AsPlainText -Force) \\
  -Enabled $true \\
  -PasswordNeverExpires $false \\
  -ChangePasswordAtLogon $true

Add-ADGroupMember -Identity "Domain Admins" -Members "admin.jdoe"`,
        codeLanguage: 'powershell',
        warning: 'Never use the built-in Administrator account for day-to-day administration. Always use named accounts for auditability.',
      },
      {
        title: 'Configure AD sites and subnets',
        description:
          'If you have multiple physical locations, create AD sites and link the corresponding subnets. This optimizes authentication traffic and replication topology.',
        code: `# Create a new site
New-ADReplicationSite -Name "Branch-Office-01"

# Create a subnet and associate it with the site
New-ADReplicationSubnet -Name "10.1.0.0/24" -Site "Branch-Office-01"

# Create a site link
New-ADReplicationSiteLink -Name "HQ-Branch01" \\
  -SitesIncluded "Default-First-Site-Name","Branch-Office-01" \\
  -ReplicationFrequencyInMinutes 15 -Cost 100`,
        codeLanguage: 'powershell',
        note: 'For a single-site deployment you can skip this step and keep the Default-First-Site-Name.',
      },
      {
        title: 'Run domain health diagnostics',
        description:
          'Use dcdiag and repadmin to validate the health of the domain controller, replication, and DNS integration.',
        code: `# Full domain controller diagnostics
dcdiag /v

# Check replication status
repadmin /replsummary

# Verify DNS records registered by AD
dcdiag /test:dns /v`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Enable the AD Recycle Bin',
        description:
          'Enable the Active Directory Recycle Bin to allow easy recovery of accidentally deleted AD objects without needing an authoritative restore.',
        code: `Enable-ADOptionalFeature -Identity "Recycle Bin Feature" \\
  -Scope ForestOrConfigurationSet \\
  -Target "corp.contoso.com" \\
  -Confirm:$false

# Verify
Get-ADOptionalFeature -Filter *`,
        codeLanguage: 'powershell',
        warning: 'Enabling the Recycle Bin is irreversible. The forest functional level must be Windows Server 2008 R2 or higher.',
      },
    ],
    relatedCommands: ['powershell-get-addomain', 'powershell-get-adforest'],
    relatedGuides: ['ws-gpo-create', 'ws-dns-config', 'ws-ad-user-bulk'],
    tags: ['active-directory', 'domain-controller', 'ad-ds', 'dns', 'forest', 'ou'],
  },

  // ─── 2. Create and Assign a Group Policy ──────────────────────────────────
  {
    id: 'ws-gpo-create',
    title: 'Create and Assign a Group Policy',
    description:
      'Create a Group Policy Object (GPO), configure common settings such as password policies, drive mappings, and software restrictions, link the GPO to an organizational unit, and verify application on client machines.',
    category: 'ws-activedirectory',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'An Active Directory domain with at least one domain controller',
      'Domain Admin or Group Policy Creator Owners membership',
      'Remote Server Administration Tools (RSAT) installed if managing from a workstation',
    ],
    steps: [
      {
        title: 'Open the Group Policy Management Console',
        description:
          'Launch the GPMC from Server Manager or by running the gpmc.msc snap-in. Expand the forest and domain to see the current OU and GPO structure.',
        code: `# Open GPMC
gpmc.msc

# Or install RSAT on a workstation
Install-WindowsFeature -Name GPMC`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Tools > Group Policy Management',
      },
      {
        title: 'Create a new GPO',
        description:
          'Create a new Group Policy Object with a descriptive name. By convention, prefix GPO names with their purpose (e.g. SEC- for security, CFG- for configuration).',
        code: `New-GPO -Name "SEC-PasswordPolicy" -Comment "Enforces strong password requirements for all domain users"`,
        codeLanguage: 'powershell',
        note: 'Creating a GPO does not apply it anywhere — you must link it to an OU, site, or domain in a later step.',
      },
      {
        title: 'Configure password policy settings',
        description:
          'Edit the GPO to configure the Account Policy / Password Policy section. Set minimum password length, complexity requirements, password history, and maximum password age.',
        code: `# Configure password policy via PowerShell (Fine-Grained Password Policy alternative)
New-ADFineGrainedPasswordPolicy -Name "StrongPasswordPolicy" \\
  -Precedence 10 \\
  -MinPasswordLength 14 \\
  -PasswordHistoryCount 24 \\
  -ComplexityEnabled $true \\
  -MaxPasswordAge "90.00:00:00" \\
  -MinPasswordAge "1.00:00:00" \\
  -LockoutThreshold 5 \\
  -LockoutDuration "00:30:00" \\
  -LockoutObservationWindow "00:30:00"

# Apply to a group
Add-ADFineGrainedPasswordPolicySubject -Identity "StrongPasswordPolicy" \\
  -Subjects "Domain Users"`,
        codeLanguage: 'powershell',
        note: 'Default domain password policy is set via the Default Domain Policy GPO. Fine-Grained Password Policies allow different settings for different groups and require Windows Server 2008+ domain functional level.',
      },
      {
        title: 'Configure drive mapping via Group Policy Preferences',
        description:
          'Add a drive mapping using Group Policy Preferences under User Configuration > Preferences > Windows Settings > Drive Maps. This maps a network share letter when users log in.',
        code: `# Set registry-based drive mapping via GPO preferences using PowerShell
Set-GPPrefRegistryValue -Name "CFG-DriveMappings" \\
  -Context User \\
  -Action Create \\
  -Key "HKCU\\Network\\S" \\
  -ValueName "RemotePath" \\
  -Value "\\\\FileServer\\Shared" \\
  -Type String`,
        codeLanguage: 'powershell',
        portalPath: 'GPMC > GPO > Edit > User Configuration > Preferences > Windows Settings > Drive Maps',
      },
      {
        title: 'Configure Windows Firewall rules',
        description:
          'Use a GPO to deploy Windows Firewall rules across the domain. This ensures consistent firewall settings on all domain-joined machines.',
        code: `# Create a GPO with a firewall rule via registry
# Alternatively, configure via GPMC:
# Computer Configuration > Policies > Windows Settings > Security Settings > Windows Firewall

# Example: allow ICMP (ping) inbound via PowerShell on target machines (deployed by GPO startup script)
New-NetFirewallRule -DisplayName "Allow ICMPv4" \\
  -Direction Inbound -Protocol ICMPv4 -Action Allow \\
  -Profile Domain`,
        codeLanguage: 'powershell',
        portalPath: 'GPMC > GPO > Edit > Computer Configuration > Policies > Windows Settings > Security Settings > Windows Defender Firewall',
      },
      {
        title: 'Link the GPO to an organizational unit',
        description:
          'Link the GPO to the appropriate OU so the policy applies to users or computers in that container. You can link the same GPO to multiple OUs.',
        code: `# Link GPO to the Users OU
New-GPLink -Name "SEC-PasswordPolicy" \\
  -Target "OU=Users,OU=Company,DC=corp,DC=contoso,DC=com" \\
  -LinkEnabled Yes

# Link a second GPO to the Computers OU
New-GPLink -Name "CFG-DriveMappings" \\
  -Target "OU=Computers,OU=Company,DC=corp,DC=contoso,DC=com" \\
  -LinkEnabled Yes`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Set GPO security filtering',
        description:
          'By default a GPO applies to all Authenticated Users. You can restrict it to specific security groups by modifying the security filtering.',
        code: `# Remove default Authenticated Users permission
Set-GPPermission -Name "SEC-PasswordPolicy" \\
  -TargetName "Authenticated Users" \\
  -TargetType Group \\
  -PermissionLevel None

# Apply to a specific group
Set-GPPermission -Name "SEC-PasswordPolicy" \\
  -TargetName "IT-Admins" \\
  -TargetType Group \\
  -PermissionLevel GpoApply`,
        codeLanguage: 'powershell',
        warning: 'If you remove Authenticated Users without adding another group, the GPO will apply to no one. Always add the target group before removing the default.',
      },
      {
        title: 'Force a Group Policy update on clients',
        description:
          'Trigger an immediate Group Policy refresh on client computers to test the new policy instead of waiting for the default 90-minute refresh interval.',
        code: `# On a single client
gpupdate /force

# Remote: force update on all computers in an OU
Get-ADComputer -SearchBase "OU=Computers,OU=Company,DC=corp,DC=contoso,DC=com" -Filter * |
  ForEach-Object { Invoke-GPUpdate -Computer $_.Name -Force -RandomDelayInMinutes 0 }`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Verify GPO application with gpresult',
        description:
          'Run gpresult on a client machine to generate a Resultant Set of Policy (RSoP) report and confirm that the GPO is applied correctly.',
        code: `# Generate HTML report
gpresult /H C:\\GPReport.html /F
Start-Process C:\\GPReport.html

# Quick summary in console
gpresult /R`,
        codeLanguage: 'powershell',
        note: 'If the GPO does not appear in gpresult, check the OU link, security filtering, WMI filters, and whether the computer/user object is in the correct OU.',
      },
    ],
    relatedCommands: ['powershell-new-gpo', 'powershell-get-gpo'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-ad-user-bulk'],
    tags: ['group-policy', 'gpo', 'active-directory', 'password-policy', 'security'],
  },

  // ─── 3. Bulk Import AD Users ──────────────────────────────────────────────
  {
    id: 'ws-ad-user-bulk',
    title: 'Bulk Import AD Users',
    description:
      'Import hundreds or thousands of Active Directory user accounts from a CSV file using PowerShell, including group membership assignment, OU placement, and validation of the imported accounts.',
    category: 'ws-activedirectory',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: [
      'An Active Directory domain with the target OUs already created',
      'A CSV file with user details (Name, SamAccountName, UPN, Department, etc.)',
      'ActiveDirectory PowerShell module installed',
      'Permission to create user accounts (Account Operators or Domain Admins)',
    ],
    steps: [
      {
        title: 'Prepare the CSV template',
        description:
          'Create a CSV file with columns for all the user attributes you need. At minimum, include FirstName, LastName, SamAccountName, UserPrincipalName, Department, and Password.',
        code: `# Example CSV header and sample rows
@"
FirstName,LastName,SamAccountName,UserPrincipalName,Department,JobTitle,OU,Password
John,Doe,jdoe,jdoe@corp.contoso.com,IT,Systems Engineer,"OU=Users,OU=Company,DC=corp,DC=contoso,DC=com",P@ssw0rd2024!
Jane,Smith,jsmith,jsmith@corp.contoso.com,HR,HR Manager,"OU=Users,OU=Company,DC=corp,DC=contoso,DC=com",P@ssw0rd2024!
"@ | Out-File -FilePath C:\\Import\\users.csv -Encoding UTF8`,
        codeLanguage: 'powershell',
        warning: 'Never store real passwords in plain text CSV files in production. Use a temporary password and force change at first logon.',
      },
      {
        title: 'Validate the CSV data',
        description:
          'Before importing, validate the CSV for duplicates, missing fields, and invalid characters in SamAccountName. This prevents partial imports and errors.',
        code: `$users = Import-Csv -Path C:\\Import\\users.csv

# Check for duplicates
$dupes = $users | Group-Object SamAccountName | Where-Object { $_.Count -gt 1 }
if ($dupes) { Write-Warning "Duplicate SamAccountNames found: $($dupes.Name -join ', ')" }

# Check for missing fields
$users | ForEach-Object {
    if (-not $_.FirstName -or -not $_.LastName -or -not $_.SamAccountName) {
        Write-Warning "Incomplete row: $($_ | ConvertTo-Json -Compress)"
    }
}

# Check SAM length (max 20 characters)
$users | Where-Object { $_.SamAccountName.Length -gt 20 } |
    ForEach-Object { Write-Warning "SAM too long: $($_.SamAccountName)" }`,
        codeLanguage: 'powershell',
        note: 'SamAccountName has a maximum length of 20 characters. UserPrincipalName can be up to 1024 characters.',
      },
      {
        title: 'Check for existing accounts',
        description:
          'Query AD to ensure none of the SamAccountNames in the CSV already exist, which would cause the import to fail for those entries.',
        code: `$users = Import-Csv -Path C:\\Import\\users.csv
$existing = @()

foreach ($user in $users) {
    $found = Get-ADUser -Filter "SamAccountName -eq '$($user.SamAccountName)'" -ErrorAction SilentlyContinue
    if ($found) {
        $existing += $user.SamAccountName
    }
}

if ($existing) {
    Write-Warning "These accounts already exist: $($existing -join ', ')"
} else {
    Write-Host "No conflicts found. Safe to import." -ForegroundColor Green
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Run the bulk import script',
        description:
          'Import all users from the CSV using New-ADUser. The script creates each account, sets the password, and places the user in the correct OU.',
        code: `$users = Import-Csv -Path C:\\Import\\users.csv
$successCount = 0
$errorCount = 0

foreach ($user in $users) {
    try {
        New-ADUser \\
            -Name "$($user.FirstName) $($user.LastName)" \\
            -GivenName $user.FirstName \\
            -Surname $user.LastName \\
            -SamAccountName $user.SamAccountName \\
            -UserPrincipalName $user.UserPrincipalName \\
            -Department $user.Department \\
            -Title $user.JobTitle \\
            -Path $user.OU \\
            -AccountPassword (ConvertTo-SecureString $user.Password -AsPlainText -Force) \\
            -Enabled $true \\
            -ChangePasswordAtLogon $true

        $successCount++
        Write-Host "Created: $($user.SamAccountName)" -ForegroundColor Green
    }
    catch {
        $errorCount++
        Write-Warning "Failed: $($user.SamAccountName) - $($_.Exception.Message)"
    }
}

Write-Host "\\nImport complete: $successCount created, $errorCount failed" -ForegroundColor Cyan`,
        codeLanguage: 'powershell',
        note: 'Use -ChangePasswordAtLogon $true so each user sets their own password at first login.',
      },
      {
        title: 'Assign users to security groups',
        description:
          'Add the imported users to the appropriate security groups based on their department or role using PowerShell.',
        code: `$users = Import-Csv -Path C:\\Import\\users.csv

# Group users by department and add to corresponding AD group
$users | Group-Object Department | ForEach-Object {
    $groupName = "GRP-$($_.Name)"

    # Create group if it does not exist
    if (-not (Get-ADGroup -Filter "Name -eq '$groupName'" -ErrorAction SilentlyContinue)) {
        New-ADGroup -Name $groupName -GroupScope Global -GroupCategory Security \\
            -Path "OU=Groups,OU=Company,DC=corp,DC=contoso,DC=com"
    }

    $members = $_.Group | ForEach-Object { $_.SamAccountName }
    Add-ADGroupMember -Identity $groupName -Members $members
    Write-Host "Added $($members.Count) users to $groupName"
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Set additional user attributes',
        description:
          'Update phone numbers, office locations, managers, and other attributes that may not have been set during initial creation.',
        code: `# Example: set manager and office for all IT users
$users = Import-Csv -Path C:\\Import\\users.csv | Where-Object { $_.Department -eq "IT" }

foreach ($user in $users) {
    Set-ADUser -Identity $user.SamAccountName \\
        -Office "HQ Building A" \\
        -Manager "admin.jdoe" \\
        -Company "Contoso Ltd."
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Generate an import report',
        description:
          'Query AD and export a report of all newly created users to verify the import was successful and all attributes are correct.',
        code: `# Export all recently created users (last 24 hours)
$yesterday = (Get-Date).AddDays(-1)

Get-ADUser -Filter { WhenCreated -ge $yesterday } \\
    -Properties Department, Title, WhenCreated, Enabled |
    Select-Object Name, SamAccountName, UserPrincipalName, Department, Title, Enabled, WhenCreated |
    Export-Csv -Path C:\\Import\\import_report.csv -NoTypeInformation

Write-Host "Report exported to C:\\Import\\import_report.csv"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Test a sample user account',
        description:
          'Log in with one of the newly created accounts to verify authentication works, the password change prompt appears, and group memberships are correct.',
        code: `# Verify a specific user
$user = Get-ADUser -Identity "jdoe" -Properties MemberOf, Department, Title, PasswordLastSet

$user | Select-Object Name, SamAccountName, Department, Title, Enabled, PasswordLastSet

# Show group memberships
$user.MemberOf | ForEach-Object { ($_ -split ',')[0] -replace 'CN=' }`,
        codeLanguage: 'powershell',
        note: 'If the user cannot log in, check that the account is enabled, the OU is not blocked by a restrictive GPO, and the password meets complexity requirements.',
      },
    ],
    relatedCommands: ['powershell-new-aduser', 'powershell-import-csv'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-gpo-create'],
    tags: ['active-directory', 'bulk-import', 'csv', 'user-management', 'powershell'],
  },

  // ─── 4. Configure a DNS Server ────────────────────────────────────────────
  {
    id: 'ws-dns-config',
    title: 'Configure a DNS Server',
    description:
      'Install and configure the DNS Server role on Windows Server, create forward and reverse lookup zones, configure conditional forwarders, set up DNS policies, and verify name resolution across the network.',
    category: 'ws-infrastructure',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'Windows Server 2019 or 2022 with a static IP address',
      'Local Administrator or Domain Admin access',
      'Network connectivity to upstream DNS forwarders (e.g. 8.8.8.8)',
    ],
    steps: [
      {
        title: 'Install the DNS Server role',
        description:
          'Install the DNS Server role if it was not installed during AD DS promotion. On standalone servers, you can install DNS independently.',
        code: `Install-WindowsFeature -Name DNS -IncludeManagementTools

# Verify installation
Get-WindowsFeature DNS`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > DNS Server',
        note: 'If this server is also a domain controller, DNS was likely installed during dcpromo. Verify with Get-WindowsFeature DNS.',
      },
      {
        title: 'Create a primary forward lookup zone',
        description:
          'Create an AD-integrated primary forward lookup zone for your domain. AD-integrated zones provide secure dynamic updates and automatic replication between domain controllers.',
        code: `# AD-integrated zone
Add-DnsServerPrimaryZone -Name "corp.contoso.com" \\
  -ReplicationScope Domain \\
  -DynamicUpdate Secure

# Or a standalone file-backed zone
# Add-DnsServerPrimaryZone -Name "corp.contoso.com" -ZoneFile "corp.contoso.com.dns"

Get-DnsServerZone`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create a reverse lookup zone',
        description:
          'Create a reverse lookup zone for PTR record resolution. This allows IP-to-hostname lookups, which are required by many services and security tools.',
        code: `Add-DnsServerPrimaryZone -NetworkId "10.0.0.0/24" \\
  -ReplicationScope Domain \\
  -DynamicUpdate Secure

# Verify
Get-DnsServerZone | Where-Object { $_.IsReverseLookupZone -eq $true }`,
        codeLanguage: 'powershell',
        note: 'Create one reverse zone per subnet. If your network has 10.0.0.0/24 and 10.1.0.0/24, you need two reverse zones.',
      },
      {
        title: 'Configure DNS forwarders',
        description:
          'Set up forwarders so the DNS server can resolve external names by forwarding queries to upstream resolvers.',
        code: `# Add forwarders
Set-DnsServerForwarder -IPAddress 8.8.8.8, 8.8.4.4, 1.1.1.1

# Verify
Get-DnsServerForwarder`,
        codeLanguage: 'powershell',
        warning: 'Do not add too many forwarders. The DNS server queries them in order, and excessive forwarders can slow down external resolution.',
      },
      {
        title: 'Add conditional forwarders',
        description:
          'Create conditional forwarders for partner domains or other internal zones managed by different DNS servers. This directs queries for specific domains to designated servers.',
        code: `# Forward all queries for partner.com to their DNS servers
Add-DnsServerConditionalForwarderZone -Name "partner.com" \\
  -MasterServers 192.168.1.10, 192.168.1.11 \\
  -ReplicationScope Forest

Get-DnsServerZone | Where-Object { $_.ZoneType -eq "Forwarder" }`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create static DNS records',
        description:
          'Manually add A, CNAME, MX, and TXT records for services that do not use dynamic DNS registration.',
        code: `# A record
Add-DnsServerResourceRecordA -ZoneName "corp.contoso.com" \\
  -Name "intranet" -IPv4Address "10.0.0.50"

# CNAME record
Add-DnsServerResourceRecordCName -ZoneName "corp.contoso.com" \\
  -Name "www" -HostNameAlias "intranet.corp.contoso.com"

# MX record
Add-DnsServerResourceRecordMX -ZoneName "corp.contoso.com" \\
  -Name "." -MailExchange "mail.corp.contoso.com" -Preference 10

# TXT record (e.g. SPF)
Add-DnsServerResourceRecord -ZoneName "corp.contoso.com" \\
  -Name "." -Txt -DescriptiveText "v=spf1 mx -all"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure DNS scavenging',
        description:
          'Enable aging and scavenging to automatically remove stale DNS records that are no longer valid, preventing DNS bloat.',
        code: `# Enable aging on the zone
Set-DnsServerZoneAging -Name "corp.contoso.com" \\
  -Aging $true \\
  -NoRefreshInterval 7.00:00:00 \\
  -RefreshInterval 7.00:00:00

# Enable scavenging on the server
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00

Get-DnsServerZoneAging -Name "corp.contoso.com"`,
        codeLanguage: 'powershell',
        note: 'Scavenging only removes records that have both aging enabled and have exceeded the no-refresh + refresh intervals. Test on a non-production zone first.',
      },
      {
        title: 'Configure DNS logging and diagnostics',
        description:
          'Enable DNS debug logging and analytics to troubleshoot resolution issues and monitor query patterns.',
        code: `# Enable DNS analytical logging
Set-DnsServerDiagnostics -All $true

# Enable debug logging to a file
Set-DnsServerDiagnostics \\
  -SaveLogsToPersistentStorage $true \\
  -EnableLoggingForLocalLookupEvent $true \\
  -EnableLoggingForRecursiveLookupEvent $true \\
  -EnableLoggingForRemoteServerEvent $true

# View recent DNS events
Get-WinEvent -LogName "DNS Server" -MaxEvents 20 |
    Select-Object TimeCreated, Id, Message`,
        codeLanguage: 'powershell',
        warning: 'DNS debug logging can generate large log files on busy servers. Enable it only during troubleshooting and disable it afterward.',
      },
      {
        title: 'Verify DNS resolution',
        description:
          'Test forward and reverse resolution, zone transfers, and external name resolution to confirm the DNS server is working correctly.',
        code: `# Test forward resolution
Resolve-DnsName -Name "intranet.corp.contoso.com" -Server 10.0.0.10

# Test reverse resolution
Resolve-DnsName -Name "10.0.0.50" -Type PTR -Server 10.0.0.10

# Test external resolution
Resolve-DnsName -Name "www.microsoft.com" -Server 10.0.0.10

# Comprehensive nslookup
nslookup corp.contoso.com 10.0.0.10`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['powershell-resolve-dnsname', 'nslookup'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-dhcp-setup'],
    tags: ['dns', 'name-resolution', 'zones', 'forwarders', 'infrastructure'],
  },

  // ─── 5. Set Up a DHCP Server ──────────────────────────────────────────────
  {
    id: 'ws-dhcp-setup',
    title: 'Set Up a DHCP Server',
    description:
      'Install and configure the DHCP Server role on Windows Server, create IPv4 scopes, set options for DNS, gateway, and domain, configure reservations and exclusions, and authorize the server in Active Directory.',
    category: 'ws-infrastructure',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: [
      'Windows Server 2019 or 2022 with a static IP address',
      'Domain Admin or DHCP Administrators group membership',
      'A planned IP address range for the DHCP scope',
      'DNS server addresses and default gateway IP',
    ],
    steps: [
      {
        title: 'Install the DHCP Server role',
        description:
          'Install the DHCP Server role and management tools from Server Manager or PowerShell.',
        code: `Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Verify
Get-WindowsFeature DHCP`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > DHCP Server',
      },
      {
        title: 'Authorize the DHCP server in Active Directory',
        description:
          'Only authorized DHCP servers can lease addresses in an AD environment. This prevents rogue DHCP servers from disrupting the network.',
        code: `# Authorize the DHCP server
Add-DhcpServerInDC -DnsName "DC01.corp.contoso.com" -IPAddress 10.0.0.10

# Verify authorization
Get-DhcpServerInDC`,
        codeLanguage: 'powershell',
        warning: 'An unauthorized DHCP server in an AD network will not respond to client requests. Always authorize after installation.',
      },
      {
        title: 'Complete post-installation configuration',
        description:
          'Run the post-installation tasks to create the DHCP security groups and complete the server configuration.',
        code: `# Complete post-install config
# This creates DHCP Administrators and DHCP Users local groups
Set-DhcpServerv4DnsSetting -ComputerName "DC01" -DynamicUpdates Always -DeleteDnsRROnLeaseExpiry $true

# Suppress the post-install notification flag
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\ServerManager\\Roles\\12" -Name ConfigurationState -Value 2

# Restart the DHCP service
Restart-Service DHCPServer`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create an IPv4 scope',
        description:
          'Create a DHCP scope that defines the range of IP addresses to lease to clients. The scope includes a start and end address, subnet mask, lease duration, and a descriptive name.',
        code: `Add-DhcpServerv4Scope -Name "Main Office LAN" \\
  -StartRange 10.0.0.100 \\
  -EndRange 10.0.0.254 \\
  -SubnetMask 255.255.255.0 \\
  -LeaseDuration 8.00:00:00 \\
  -State Active

Get-DhcpServerv4Scope`,
        codeLanguage: 'powershell',
        note: 'The lease duration should balance between address conservation (shorter leases) and reduced DHCP traffic (longer leases). 8 hours is common for office environments.',
      },
      {
        title: 'Configure scope options',
        description:
          'Set DHCP options that clients receive along with their IP address, such as the default gateway (option 003), DNS servers (option 006), and domain name (option 015).',
        code: `$scopeId = "10.0.0.0"

# Default gateway
Set-DhcpServerv4OptionValue -ScopeId $scopeId -OptionId 3 -Value 10.0.0.1

# DNS servers
Set-DhcpServerv4OptionValue -ScopeId $scopeId -OptionId 6 -Value 10.0.0.10

# Domain name
Set-DhcpServerv4OptionValue -ScopeId $scopeId -OptionId 15 -Value "corp.contoso.com"

# NTP server (optional)
Set-DhcpServerv4OptionValue -ScopeId $scopeId -OptionId 42 -Value 10.0.0.10

Get-DhcpServerv4OptionValue -ScopeId $scopeId`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Add exclusion ranges and reservations',
        description:
          'Exclude IP ranges used by servers, printers, or other static devices. Create reservations for devices that need a consistent IP but should still use DHCP for configuration.',
        code: `# Exclude IPs reserved for infrastructure
Add-DhcpServerv4ExclusionRange -ScopeId 10.0.0.0 -StartRange 10.0.0.100 -EndRange 10.0.0.110

# Add a reservation for a printer
Add-DhcpServerv4Reservation -ScopeId 10.0.0.0 \\
  -IPAddress 10.0.0.200 \\
  -ClientId "AA-BB-CC-DD-EE-FF" \\
  -Name "Printer-Floor2" \\
  -Description "Second floor network printer"

Get-DhcpServerv4ExclusionRange -ScopeId 10.0.0.0
Get-DhcpServerv4Reservation -ScopeId 10.0.0.0`,
        codeLanguage: 'powershell',
        note: 'The ClientId is the MAC address of the device. Use Get-NetAdapter on the device or check the switch ARP table to find it.',
      },
      {
        title: 'Configure DHCP failover',
        description:
          'Set up DHCP failover between two DHCP servers for high availability. Use Hot Standby mode for a primary/secondary setup or Load Balance mode to share the load.',
        code: `# Hot Standby failover
Add-DhcpServerv4Failover -Name "DHCP-Failover" \\
  -PartnerServer "DC02.corp.contoso.com" \\
  -ScopeId 10.0.0.0 \\
  -SharedSecret "S3cretK3y!" \\
  -Mode HotStandby \\
  -ReservePercent 10 \\
  -ServerRole Active \\
  -AutoStateTransition $true \\
  -StateSwitchInterval 00:01:00

Get-DhcpServerv4Failover`,
        codeLanguage: 'powershell',
        warning: 'Both DHCP servers must be authorized in AD. Ensure the partner server has the DHCP role installed and the same scope defined before configuring failover.',
      },
      {
        title: 'Verify DHCP operation',
        description:
          'Test the DHCP server by releasing and renewing an IP on a client, then check the lease table on the server to confirm addresses are being distributed.',
        code: `# On a client machine
ipconfig /release
ipconfig /renew
ipconfig /all

# On the DHCP server: view active leases
Get-DhcpServerv4Lease -ScopeId 10.0.0.0

# View DHCP statistics
Get-DhcpServerv4Statistics
Get-DhcpServerv4ScopeStatistics -ScopeId 10.0.0.0`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['ipconfig', 'powershell-get-dhcpserverv4scope'],
    relatedGuides: ['ws-dns-config', 'ws-ad-domain-setup'],
    tags: ['dhcp', 'ip-management', 'networking', 'infrastructure', 'failover'],
  },

  // ─── 6. Set Up a Certificate Authority ────────────────────────────────────
  {
    id: 'ws-ca-setup',
    title: 'Set Up a Certificate Authority',
    description:
      'Install and configure Active Directory Certificate Services (AD CS) as an Enterprise Root or Subordinate CA, configure certificate templates, enable auto-enrollment, and manage certificate lifecycle.',
    category: 'ws-security',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: [
      'Windows Server 2019 or 2022 joined to an Active Directory domain',
      'Enterprise Admin or Domain Admin membership',
      'A planned CA naming convention and key length (2048-bit minimum, 4096-bit recommended)',
      'Dedicated server recommended (not on a domain controller in production)',
    ],
    steps: [
      {
        title: 'Plan the PKI hierarchy',
        description:
          'Decide between a single-tier (Root CA only) or two-tier (Offline Root CA + Online Subordinate CA) architecture. For production, a two-tier hierarchy with an offline root CA is strongly recommended.',
        note: 'A single-tier architecture is acceptable for lab and test environments. For production, always use a two-tier or three-tier PKI hierarchy with the root CA offline.',
        warning: 'The CA name and key length cannot be changed after installation without rebuilding the entire CA. Plan carefully before proceeding.',
      },
      {
        title: 'Install the AD CS role',
        description:
          'Install Active Directory Certificate Services with the Certification Authority and optional components like the CA Web Enrollment service.',
        code: `Install-WindowsFeature -Name AD-Certificate \\
  -IncludeManagementTools \\
  -IncludeAllSubFeature

# Or install specific sub-features
Install-WindowsFeature -Name ADCS-Cert-Authority, ADCS-Web-Enrollment -IncludeManagementTools`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > Active Directory Certificate Services',
      },
      {
        title: 'Configure the Enterprise Root CA',
        description:
          'Run the AD CS configuration wizard to set up the CA type, key length, hash algorithm, and validity period.',
        code: `Install-AdcsCertificationAuthority \\
  -CAType EnterpriseRootCA \\
  -CACommonName "Contoso-Root-CA" \\
  -KeyLength 4096 \\
  -HashAlgorithmName SHA256 \\
  -ValidityPeriod Years \\
  -ValidityPeriodUnits 10 \\
  -CryptoProviderName "RSA#Microsoft Software Key Storage Provider" \\
  -Force`,
        codeLanguage: 'powershell',
        note: 'For a subordinate CA, use -CAType EnterpriseSubordinateCA and submit the certificate request to the root CA.',
      },
      {
        title: 'Configure the CA Web Enrollment service',
        description:
          'If installed, configure the web enrollment interface so users can request certificates through a browser.',
        code: `Install-AdcsWebEnrollment -Force

# Verify IIS site is running
Get-Website | Where-Object { $_.Name -like "*CertSrv*" -or $_.Name -eq "Default Web Site" }`,
        codeLanguage: 'powershell',
        portalPath: 'https://ca-server/certsrv',
      },
      {
        title: 'Configure CRL and AIA distribution points',
        description:
          'Set the Certificate Revocation List (CRL) and Authority Information Access (AIA) distribution point URLs. These are critical for certificate validation by clients.',
        code: `# View current CDP and AIA
$crlPaths = Get-CACrlDistributionPoint
$aiaPaths = Get-CAAuthorityInformationAccess

# Add an HTTP distribution point for CRL
Add-CACrlDistributionPoint -Uri "http://pki.corp.contoso.com/CertEnroll/<CaName><CRLNameSuffix><DeltaCRLAllowed>.crl" \\
  -AddToCertificateCdp -AddToFreshestCrl -Force

# Add an HTTP AIA location
Add-CAAuthorityInformationAccess -Uri "http://pki.corp.contoso.com/CertEnroll/<ServerDNSName>_<CaName><CertificateName>.crt" \\
  -AddToCertificateAia -Force

# Publish the CRL
certutil -CRL`,
        codeLanguage: 'powershell',
        warning: 'If CRL distribution points are unreachable, clients may reject certificates or experience long delays during validation. Always test CRL accessibility from client machines.',
      },
      {
        title: 'Create a custom certificate template',
        description:
          'Duplicate an existing template and customize it for your needs, such as web server certificates, user authentication, or code signing.',
        code: `# List existing templates
Get-CATemplate | Select-Object Name

# Duplicate and publish a template using certutil
# (Template editing is best done via the Certification Authority MMC)
# After editing in the MMC, publish the template:
Add-CATemplate -Name "ContosoWebServer" -Force

# Verify
Get-CATemplate | Where-Object { $_.Name -like "*Contoso*" }`,
        codeLanguage: 'powershell',
        portalPath: 'certsrv.msc > Certificate Templates > Manage > Duplicate Template',
        note: 'Certificate template editing requires the Certificate Templates MMC snap-in. PowerShell can publish and unpublish templates, but detailed editing uses the GUI.',
      },
      {
        title: 'Configure auto-enrollment via Group Policy',
        description:
          'Enable certificate auto-enrollment so domain-joined computers and users automatically request and renew certificates based on template permissions.',
        code: `# Create a GPO for auto-enrollment
New-GPO -Name "CFG-CertAutoEnroll" | New-GPLink \\
  -Target "DC=corp,DC=contoso,DC=com" -LinkEnabled Yes

# Set auto-enrollment registry values via GPO
# Computer Configuration > Policies > Windows Settings > Security Settings >
# Public Key Policies > Certificate Services Client - Auto-Enrollment
# Enable: Enroll certificates automatically, Renew expired certificates,
# Update certificates that use certificate templates

Set-GPRegistryValue -Name "CFG-CertAutoEnroll" \\
  -Key "HKLM\\SOFTWARE\\Policies\\Microsoft\\Cryptography\\AutoEnrollment" \\
  -ValueName "AEPolicy" -Value 7 -Type DWord`,
        codeLanguage: 'powershell',
        portalPath: 'GPMC > GPO > Computer Configuration > Policies > Windows Settings > Security Settings > Public Key Policies',
      },
      {
        title: 'Request a certificate manually',
        description:
          'Test the CA by requesting a certificate manually using PowerShell or certreq. This validates that the CA is issuing certificates correctly.',
        code: `# Request a computer certificate
$template = "Machine"
$cert = Get-Certificate -Template $template -CertStoreLocation Cert:\\LocalMachine\\My

# Or use certreq
# certreq -new request.inf request.req
# certreq -submit request.req certificate.cer
# certreq -accept certificate.cer

# View the issued certificate
Get-ChildItem Cert:\\LocalMachine\\My | Format-List Subject, Thumbprint, NotAfter`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure certificate revocation',
        description:
          'Learn to revoke certificates and publish updated CRLs. This is essential for removing trust from compromised or decommissioned certificates.',
        code: `# Revoke a certificate by serial number
$serialNumber = "6100000002abcdef"
certutil -revoke $serialNumber 1  # 1 = Key Compromise

# Publish the CRL immediately
certutil -CRL

# View the CRL
certutil -URL "http://pki.corp.contoso.com/CertEnroll/Contoso-Root-CA.crl"`,
        codeLanguage: 'powershell',
        note: 'Revocation reasons: 0=Unspecified, 1=Key Compromise, 2=CA Compromise, 3=Affiliation Changed, 4=Superseded, 5=Cease of Operation.',
      },
      {
        title: 'Back up the CA',
        description:
          'Back up the CA database and private key. This is critical for disaster recovery — losing the CA private key means all issued certificates become unrecoverable.',
        code: `# Back up the CA database and private key
Backup-CARoleService -Path "C:\\CABackup" -KeepLog -Password (ConvertTo-SecureString "BackupP@ss!" -AsPlainText -Force)

# Verify backup contents
Get-ChildItem C:\\CABackup -Recurse`,
        codeLanguage: 'powershell',
        warning: 'Store the CA backup and private key password in a secure, offline location (e.g. a safe or hardware security module). If the private key is lost, the entire PKI must be rebuilt.',
      },
      {
        title: 'Monitor CA health and issued certificates',
        description:
          'Regularly review issued certificates, pending requests, and failed requests to ensure the CA is operating correctly.',
        code: `# View all issued certificates
certutil -view -out "CommonName,NotAfter,SerialNumber" -restrict "Disposition=20"

# View pending requests
certutil -view -out "RequestID,CommonName,SubmittedWhen" -restrict "Disposition=9"

# View CA configuration summary
certutil -CAInfo

# Check certificate expiration in the next 30 days
$cutoff = (Get-Date).AddDays(30)
Get-ChildItem Cert:\\LocalMachine\\My |
    Where-Object { $_.NotAfter -le $cutoff } |
    Select-Object Subject, NotAfter, Thumbprint`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['certutil', 'powershell-get-certificate'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-rdp-gateway'],
    tags: ['pki', 'certificate-authority', 'ad-cs', 'ssl', 'encryption', 'security'],
  },

  // ─── 7. Set Up a WSUS Server ──────────────────────────────────────────────
  {
    id: 'ws-wsus-setup',
    title: 'Set Up a WSUS Server',
    description:
      'Install and configure Windows Server Update Services (WSUS) to manage and distribute Windows updates across your network, including classification selection, computer group targeting, approval rules, and reporting.',
    category: 'ws-infrastructure',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: [
      'Windows Server 2019 or 2022 with at least 40 GB free disk space for updates',
      'SQL Server Express (built-in WID) or a full SQL Server instance',
      'Internet access for downloading updates from Microsoft Update',
      'Domain Admin access for GPO configuration',
    ],
    steps: [
      {
        title: 'Install the WSUS role',
        description:
          'Install Windows Server Update Services with the required sub-features. Choose between WID (Windows Internal Database) for smaller environments or SQL Server for larger deployments.',
        code: `# Install WSUS with WID (Windows Internal Database)
Install-WindowsFeature -Name UpdateServices -IncludeManagementTools

# Or with SQL Server
# Install-WindowsFeature -Name UpdateServices-DB -IncludeManagementTools`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > Windows Server Update Services',
        note: 'WID supports up to 20,000 clients. For larger environments or reporting needs, use SQL Server.',
      },
      {
        title: 'Run the WSUS post-installation tasks',
        description:
          'Complete the initial configuration by specifying the content directory where update files will be stored.',
        code: `# Set the content directory
& "C:\\Program Files\\Update Services\\Tools\\wsusutil.exe" postinstall CONTENT_DIR=D:\\WSUS

# If using SQL Server:
# wsusutil.exe postinstall SQL_INSTANCE_NAME="SQLSERVER\\INSTANCE" CONTENT_DIR=D:\\WSUS`,
        codeLanguage: 'powershell',
        warning: 'Choose a volume with sufficient space. WSUS content can grow to hundreds of gigabytes depending on the number of products and classifications selected.',
      },
      {
        title: 'Configure WSUS synchronization source',
        description:
          'Configure where WSUS downloads updates from. Typically this is Microsoft Update, but downstream WSUS servers can synchronize from an upstream WSUS server.',
        code: `# Connect to the WSUS server
$wsus = Get-WsusServer -Name "DC01" -PortNumber 8530

# Set synchronization source to Microsoft Update
Set-WsusServerSynchronization -SyncFromMU

# Or set upstream WSUS server
# Set-WsusServerSynchronization -UssServerName "WSUS-HQ" -PortNumber 8530`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Select products and classifications',
        description:
          'Choose which Microsoft products and update classifications to synchronize. Be selective to conserve disk space and bandwidth.',
        code: `$wsus = Get-WsusServer

# Get all products and select specific ones
$products = Get-WsusProduct -UpdateServer $wsus
$products | Where-Object {
    $_.Product.Title -in @("Windows Server 2022", "Windows Server 2019", "Windows 11", "Microsoft Defender Antivirus")
} | Set-WsusProduct

# Get classifications and select specific ones
$classifications = Get-WsusClassification -UpdateServer $wsus
$classifications | Where-Object {
    $_.Classification.Title -in @("Critical Updates", "Security Updates", "Definition Updates", "Update Rollups")
} | Set-WsusClassification`,
        codeLanguage: 'powershell',
        note: 'Avoid selecting "Drivers" unless you specifically need driver distribution. Drivers significantly increase storage requirements and synchronization time.',
      },
      {
        title: 'Perform the initial synchronization',
        description:
          'Start the first WSUS synchronization. This downloads the update metadata from Microsoft Update and can take several hours depending on the number of selected products.',
        code: `$wsus = Get-WsusServer

# Start synchronization
$subscription = $wsus.GetSubscription()
$subscription.StartSynchronization()

# Monitor progress
$subscription.GetSynchronizationProgress()

# Or wait for completion
while ($subscription.GetSynchronizationStatus() -ne "NotProcessing") {
    $progress = $subscription.GetSynchronizationProgress()
    Write-Host "Phase: $($progress.Phase) - Items: $($progress.ProcessedItems)/$($progress.TotalItems)"
    Start-Sleep -Seconds 30
}

Write-Host "Synchronization complete."`,
        codeLanguage: 'powershell',
        warning: 'The initial sync can take several hours. Do not interrupt it. Schedule it during off-hours if possible.',
      },
      {
        title: 'Create computer target groups',
        description:
          'Create groups to organize computers by department, location, or role. This allows you to approve updates for test groups first, then roll out to production.',
        code: `$wsus = Get-WsusServer

# Create target groups
$wsus.CreateComputerTargetGroup("Pilot-Ring")
$wsus.CreateComputerTargetGroup("Production-Servers")
$wsus.CreateComputerTargetGroup("Production-Workstations")

# Verify
$wsus.GetComputerTargetGroups() | Select-Object Name, Id`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure GPO for WSUS client targeting',
        description:
          'Create a Group Policy to point domain computers to the WSUS server and assign them to the correct target group using client-side targeting.',
        code: `# Create GPO
New-GPO -Name "CFG-WSUSSettings" | New-GPLink \\
  -Target "OU=Computers,OU=Company,DC=corp,DC=contoso,DC=com" -LinkEnabled Yes

$gpoName = "CFG-WSUSSettings"
$key = "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate"
$auKey = "$key\\AU"

# Point to WSUS server
Set-GPRegistryValue -Name $gpoName -Key $key -ValueName "WUServer" \\
  -Value "http://DC01:8530" -Type String
Set-GPRegistryValue -Name $gpoName -Key $key -ValueName "WUStatusServer" \\
  -Value "http://DC01:8530" -Type String

# Enable client-side targeting
Set-GPRegistryValue -Name $gpoName -Key $key -ValueName "TargetGroupEnabled" \\
  -Value 1 -Type DWord
Set-GPRegistryValue -Name $gpoName -Key $key -ValueName "TargetGroup" \\
  -Value "Production-Workstations" -Type String

# Configure auto-update: 4 = Auto download and schedule install
Set-GPRegistryValue -Name $gpoName -Key $auKey -ValueName "NoAutoUpdate" \\
  -Value 0 -Type DWord
Set-GPRegistryValue -Name $gpoName -Key $auKey -ValueName "AUOptions" \\
  -Value 4 -Type DWord
Set-GPRegistryValue -Name $gpoName -Key $auKey -ValueName "UseWUServer" \\
  -Value 1 -Type DWord

# Schedule install: day 0=every day, time 3=3:00 AM
Set-GPRegistryValue -Name $gpoName -Key $auKey -ValueName "ScheduledInstallDay" \\
  -Value 0 -Type DWord
Set-GPRegistryValue -Name $gpoName -Key $auKey -ValueName "ScheduledInstallTime" \\
  -Value 3 -Type DWord`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure automatic approval rules',
        description:
          'Set up automatic approval rules to approve critical and security updates for specific groups, reducing manual approval overhead.',
        code: `$wsus = Get-WsusServer

# Create an auto-approval rule
$rule = $wsus.CreateInstallApprovalRule("Auto-Approve Security Updates")

# Set the target group
$pilotGroup = $wsus.GetComputerTargetGroups() | Where-Object { $_.Name -eq "Pilot-Ring" }
$groupCollection = New-Object Microsoft.UpdateServices.Administration.ComputerTargetGroupCollection
$groupCollection.Add($pilotGroup)
$rule.SetComputerTargetGroups($groupCollection)

# Set classification filter (Security Updates and Critical Updates)
$classifications = $wsus.GetUpdateClassifications() |
    Where-Object { $_.Title -in @("Security Updates", "Critical Updates") }
$classCollection = New-Object Microsoft.UpdateServices.Administration.UpdateClassificationCollection
$classifications | ForEach-Object { $classCollection.Add($_) }
$rule.SetUpdateClassifications($classCollection)

$rule.Enabled = $true
$rule.Save()`,
        codeLanguage: 'powershell',
        note: 'Always test updates on a pilot group before approving for production. This catches issues before they affect the entire organization.',
      },
      {
        title: 'Run WSUS server cleanup',
        description:
          'Periodically clean up the WSUS database and content to remove expired updates, superseded updates, and unused content.',
        code: `# Run WSUS cleanup wizard via PowerShell
Invoke-WsusServerCleanup -CleanupObsoleteUpdates \\
  -CleanupUnneededContentFiles \\
  -CompressUpdates \\
  -DeclineExpiredUpdates \\
  -DeclineSupersededUpdates`,
        codeLanguage: 'powershell',
        note: 'Schedule the cleanup monthly using a scheduled task. WSUS databases can grow very large without regular maintenance.',
      },
      {
        title: 'Verify client reporting',
        description:
          'Confirm that client computers are reporting to WSUS and appearing in the correct target groups.',
        code: `# On a client: force detection and report
wuauclt /detectnow /reportnow

# On Windows 10/11, use USOClient
USOClient StartScan
USOClient StartDownload

# On the WSUS server: check client status
$wsus = Get-WsusServer
$wsus.GetComputerTargets() | Select-Object FullDomainName, LastReportedStatusTime, RequestedTargetGroupName |
    Sort-Object LastReportedStatusTime -Descending | Format-Table`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['wuauclt', 'powershell-get-wsusserver'],
    relatedGuides: ['ws-gpo-create', 'ws-ad-domain-setup'],
    tags: ['wsus', 'updates', 'patch-management', 'windows-update', 'infrastructure'],
  },

  // ─── 8. Set Up a File Server with DFS ─────────────────────────────────────
  {
    id: 'ws-file-server',
    title: 'Set Up a File Server with DFS',
    description:
      'Configure a Windows File Server with NTFS permissions, SMB file shares, and Distributed File System (DFS) Namespaces and Replication for centralized and redundant file access across multiple locations.',
    category: 'ws-infrastructure',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: [
      'Windows Server 2019 or 2022 joined to an Active Directory domain',
      'A dedicated data volume (D: or E:) separate from the OS volume',
      'Domain Admin or File Server Administrators group membership',
      'For DFS Replication: two or more file servers',
    ],
    steps: [
      {
        title: 'Install the File Server and DFS roles',
        description:
          'Install the File Server role along with DFS Namespaces and DFS Replication for centralized namespace management and multi-site replication.',
        code: `Install-WindowsFeature -Name FS-FileServer, FS-DFS-Namespace, FS-DFS-Replication, FS-Resource-Manager -IncludeManagementTools

# Verify
Get-WindowsFeature FS-* | Where-Object { $_.Installed } | Select-Object Name, DisplayName`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > File and Storage Services',
      },
      {
        title: 'Create the folder structure',
        description:
          'Create a well-organized folder structure on the data volume. Use department-based or project-based top-level folders.',
        code: `$basePath = "D:\\FileShares"

$folders = @("Finance", "HR", "IT", "Marketing", "Shared", "Projects")

foreach ($folder in $folders) {
    New-Item -Path "$basePath\\$folder" -ItemType Directory -Force
}

# Verify
Get-ChildItem $basePath | Select-Object Name, FullName`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure NTFS permissions',
        description:
          'Set NTFS permissions on each folder to restrict access to the appropriate security groups. Remove inheritance from the base folders and apply explicit permissions.',
        code: `$folders = @{
    "Finance"   = "GRP-Finance"
    "HR"        = "GRP-HR"
    "IT"        = "GRP-IT"
    "Marketing" = "GRP-Marketing"
    "Shared"    = "Domain Users"
    "Projects"  = "Domain Users"
}

foreach ($folder in $folders.GetEnumerator()) {
    $path = "D:\\FileShares\\$($folder.Key)"

    # Disable inheritance and remove inherited permissions
    $acl = Get-Acl $path
    $acl.SetAccessRuleProtection($true, $false)

    # Add SYSTEM - Full Control
    $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule(
        "SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")))

    # Add Administrators - Full Control
    $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule(
        "BUILTIN\\Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")))

    # Add department group - Modify
    $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule(
        $folder.Value, "Modify", "ContainerInherit,ObjectInherit", "None", "Allow")))

    Set-Acl -Path $path -AclObject $acl
}

# Verify permissions
Get-Acl "D:\\FileShares\\Finance" | Format-List`,
        codeLanguage: 'powershell',
        warning: 'Always plan and document your permission model before applying. Incorrect permissions can lock out users or expose sensitive data.',
      },
      {
        title: 'Create SMB file shares',
        description:
          'Share the folders over the network using SMB. Set share-level permissions to complement the NTFS permissions.',
        code: `$folders = @("Finance", "HR", "IT", "Marketing", "Shared", "Projects")

foreach ($folder in $folders) {
    New-SmbShare -Name $folder \\
        -Path "D:\\FileShares\\$folder" \\
        -FullAccess "BUILTIN\\Administrators" \\
        -ChangeAccess "Authenticated Users" \\
        -Description "$folder department file share"
}

# Verify shares
Get-SmbShare | Where-Object { $_.Path -like "D:\\FileShares*" } |
    Select-Object Name, Path, Description`,
        codeLanguage: 'powershell',
        note: 'A common best practice is to grant Change or Full Control at the share level and control granular access through NTFS permissions. The most restrictive permission wins.',
      },
      {
        title: 'Enable access-based enumeration',
        description:
          'Enable ABE so users only see folders and files they have permission to access, providing a cleaner view of the file share.',
        code: `# Enable ABE on all department shares
$shares = Get-SmbShare | Where-Object { $_.Path -like "D:\\FileShares*" }

foreach ($share in $shares) {
    Set-SmbShare -Name $share.Name -FolderEnumerationMode AccessBased -Force
}

# Verify
Get-SmbShare | Select-Object Name, FolderEnumerationMode`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create a DFS namespace',
        description:
          'Set up a domain-based DFS namespace that provides a unified UNC path (e.g. \\\\corp.contoso.com\\Files) regardless of which server hosts the actual data.',
        code: `# Create a domain-based DFS namespace
New-DfsnRoot -Path "\\\\corp.contoso.com\\Files" \\
  -TargetPath "\\\\FS01\\Files" \\
  -Type DomainV2

# Add folder targets to the namespace
$folders = @("Finance", "HR", "IT", "Marketing", "Shared", "Projects")

foreach ($folder in $folders) {
    New-DfsnFolder -Path "\\\\corp.contoso.com\\Files\\$folder" \\
        -TargetPath "\\\\FS01\\$folder"
}

# Verify
Get-DfsnFolder -Path "\\\\corp.contoso.com\\Files\\*" | Select-Object Path, State`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure DFS Replication',
        description:
          'Set up DFS-R to replicate file shares between two or more servers for redundancy and local access at branch offices.',
        code: `# Create a replication group
New-DfsReplicationGroup -GroupName "FileShares-Replication" |
    New-DfsReplicatedFolder -FolderName "Shared" |
    Add-DfsrMember -ComputerName "FS01", "FS02"

# Add the connection between servers
Add-DfsrConnection -GroupName "FileShares-Replication" \\
    -SourceComputerName "FS01" -DestinationComputerName "FS02"

# Set the content path on each server
Set-DfsrMembership -GroupName "FileShares-Replication" \\
    -FolderName "Shared" -ComputerName "FS01" \\
    -ContentPath "D:\\FileShares\\Shared" -PrimaryMember $true -Force

Set-DfsrMembership -GroupName "FileShares-Replication" \\
    -FolderName "Shared" -ComputerName "FS02" \\
    -ContentPath "D:\\FileShares\\Shared" -Force`,
        codeLanguage: 'powershell',
        warning: 'During initial replication, the primary member content takes precedence. Ensure the primary server has the correct and complete data before starting replication.',
      },
      {
        title: 'Configure File Server Resource Manager quotas',
        description:
          'Set up quotas to prevent any single department from consuming all available disk space.',
        code: `# Create a quota template
New-FsrmQuotaTemplate -Name "Department-50GB" \\
    -Size 50GB \\
    -Description "50 GB limit for department shares" \\
    -Threshold (New-FsrmQuotaThreshold -Percentage 80 -Action (
        New-FsrmAction -Type Email -MailTo "[Admin Email]" \\
            -Subject "Quota warning: [Source Io Owner] on [Source File Path]" \\
            -Body "The folder [Source File Path] has exceeded 80% of its 50GB quota."
    ))

# Apply quotas to department folders
$folders = @("Finance", "HR", "IT", "Marketing")

foreach ($folder in $folders) {
    New-FsrmQuota -Path "D:\\FileShares\\$folder" -Template "Department-50GB"
}

Get-FsrmQuota | Select-Object Path, Size, Usage`,
        codeLanguage: 'powershell',
        note: 'Quotas can be hard (blocks writes) or soft (only reports). Start with soft quotas to understand usage patterns before enforcing hard limits.',
      },
      {
        title: 'Verify file share access and DFS resolution',
        description:
          'Test that users can access shares through the DFS namespace and that permissions are applied correctly.',
        code: `# Test DFS namespace resolution
Get-DfsnFolderTarget -Path "\\\\corp.contoso.com\\Files\\Finance"

# Test SMB access
Test-Path "\\\\corp.contoso.com\\Files\\Finance"
Get-ChildItem "\\\\corp.contoso.com\\Files\\Finance"

# Check DFS Replication health
Get-DfsrState -GroupName "FileShares-Replication"
Get-DfsReplicationGroup | Get-DfsReplicatedFolder | Get-DfsrBacklog

# View open sessions and files
Get-SmbSession | Select-Object ClientComputerName, ClientUserName, NumOpens
Get-SmbOpenFile | Select-Object ClientComputerName, Path`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['powershell-new-smbshare', 'powershell-get-acl'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-backup-recovery'],
    tags: ['file-server', 'dfs', 'smb', 'ntfs', 'permissions', 'replication'],
  },

  // ─── 9. Configure an RDP Gateway ──────────────────────────────────────────
  {
    id: 'ws-rdp-gateway',
    title: 'Configure an RDP Gateway',
    description:
      'Install and configure a Remote Desktop Gateway (RD Gateway) to provide secure, encrypted RDP access to internal servers over HTTPS, including SSL certificate configuration, connection authorization policies, and resource authorization policies.',
    category: 'ws-security',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: [
      'Windows Server 2019 or 2022 with a public or internal static IP',
      'An SSL/TLS certificate for the gateway hostname (e.g. rdgw.contoso.com)',
      'Active Directory domain membership',
      'Port 443 (HTTPS) open on the firewall from external networks',
    ],
    steps: [
      {
        title: 'Install the Remote Desktop Gateway role',
        description:
          'Install RD Gateway along with the Network Policy and Access Services role that provides the policy engine.',
        code: `Install-WindowsFeature -Name RDS-Gateway -IncludeManagementTools -IncludeAllSubFeature

# Verify
Get-WindowsFeature RDS-Gateway, NPAS`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > Remote Desktop Services > Remote Desktop Gateway',
      },
      {
        title: 'Obtain and install an SSL certificate',
        description:
          'Import or request an SSL certificate for the RD Gateway server name. The certificate common name or SAN must match the external DNS name clients will use.',
        code: `# Import a PFX certificate
$password = ConvertTo-SecureString "CertP@ssword!" -AsPlainText -Force
Import-PfxCertificate -FilePath "C:\\Certs\\rdgw.contoso.com.pfx" \\
    -CertStoreLocation Cert:\\LocalMachine\\My \\
    -Password $password

# Or request from internal CA
Get-Certificate -Template "WebServer" \\
    -SubjectName "CN=rdgw.contoso.com" \\
    -DnsName "rdgw.contoso.com" \\
    -CertStoreLocation Cert:\\LocalMachine\\My

# List installed certificates
Get-ChildItem Cert:\\LocalMachine\\My | Select-Object Subject, Thumbprint, NotAfter`,
        codeLanguage: 'powershell',
        warning: 'The certificate must be trusted by all connecting clients. Use a public CA for external access or ensure the internal CA root certificate is distributed to all clients.',
      },
      {
        title: 'Bind the SSL certificate to RD Gateway',
        description:
          'Associate the SSL certificate with the RD Gateway service using the certificate thumbprint.',
        code: `# Get the certificate thumbprint
$cert = Get-ChildItem Cert:\\LocalMachine\\My | Where-Object { $_.Subject -like "*rdgw.contoso.com*" }
$thumbprint = $cert.Thumbprint

# Bind to RD Gateway using RD Gateway PowerShell module
Import-Module RemoteDesktopServices
Set-Item -Path "RDS:\\GatewayServer\\SSLCertificate\\Thumbprint" -Value $thumbprint

# Or use netsh for IIS/HTTPS binding
netsh http add sslcert ipport=0.0.0.0:443 certhash=$thumbprint appid="{00112233-4455-6677-8899-aabbccddeeff}"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create a Connection Authorization Policy (CAP)',
        description:
          'A CAP defines WHO can connect through the RD Gateway. It specifies which user groups are allowed to establish connections and can enforce device redirection restrictions.',
        code: `Import-Module RemoteDesktopServices

New-Item -Path "RDS:\\GatewayServer\\CAP" -Name "Allow-Domain-Users" \\
    -UserGroups @("CORP\\Domain Users") \\
    -AuthMethod 1  # 1=Password

# Configure additional CAP settings
Set-Item -Path "RDS:\\GatewayServer\\CAP\\Allow-Domain-Users\\DeviceRedirection" -Value 2
# 0=Allow all, 1=Disable all, 2=Disable drives only

Get-ChildItem "RDS:\\GatewayServer\\CAP"`,
        codeLanguage: 'powershell',
        note: 'For higher security, restrict the CAP to a specific group like RDP-Gateway-Users instead of all Domain Users.',
      },
      {
        title: 'Create a Resource Authorization Policy (RAP)',
        description:
          'A RAP defines WHAT internal resources users can connect to through the RD Gateway. It maps user groups to allowed target servers.',
        code: `Import-Module RemoteDesktopServices

# Create a computer group for allowed targets
New-ADGroup -Name "RDG-AllowedServers" -GroupScope DomainLocal \\
    -Path "OU=Groups,OU=Company,DC=corp,DC=contoso,DC=com"

# Add servers to the group
Add-ADGroupMember -Identity "RDG-AllowedServers" -Members "FileServer01$", "AppServer01$"

# Create the RAP
New-Item -Path "RDS:\\GatewayServer\\RAP" -Name "Allow-Internal-Servers" \\
    -UserGroups @("CORP\\Domain Users") \\
    -ComputerGroupType 1 \\
    -ComputerGroup "CORP\\RDG-AllowedServers"

Get-ChildItem "RDS:\\GatewayServer\\RAP"`,
        codeLanguage: 'powershell',
        warning: 'Avoid allowing connections to ALL network resources. Always restrict to specific server groups for the principle of least privilege.',
      },
      {
        title: 'Configure RD Gateway connection limits',
        description:
          'Set maximum connection limits and idle timeout values to protect server resources and enforce session discipline.',
        code: `Import-Module RemoteDesktopServices

# Set maximum connections
Set-Item -Path "RDS:\\GatewayServer\\MaxConnections" -Value 250

# Set idle timeout (in minutes)
Set-Item -Path "RDS:\\GatewayServer\\IdleTimeout" -Value 120

# Set session timeout (in minutes)
Set-Item -Path "RDS:\\GatewayServer\\SessionTimeout" -Value 480

# Enable session timeout action (disconnect)
Set-Item -Path "RDS:\\GatewayServer\\SessionTimeoutAction" -Value 1`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure NPS (Network Policy Server) logging',
        description:
          'Enable logging on the NPS component to track all connection attempts, successes, and failures for security auditing.',
        code: `# Enable NPS accounting logging
$npsLogPath = "C:\\Windows\\System32\\LogFiles\\NPS"
New-Item -Path $npsLogPath -ItemType Directory -Force

# Configure NPS logging via netsh
netsh nps set logging enabled=yes directory="$npsLogPath"

# Enable Windows event logging for NPS
auditpol /set /subcategory:"Network Policy Server" /success:enable /failure:enable

# Verify NPS policies
Get-NpsRadiusClient
netsh nps show config`,
        codeLanguage: 'powershell',
        note: 'Review NPS logs regularly for unauthorized access attempts. Consider forwarding logs to a SIEM for centralized monitoring.',
      },
      {
        title: 'Configure firewall rules',
        description:
          'Ensure the Windows Firewall and any network firewalls allow HTTPS (443) inbound to the RD Gateway server.',
        code: `# Verify firewall rule exists
Get-NetFirewallRule -DisplayName "*Remote Desktop Gateway*" |
    Select-Object Name, DisplayName, Enabled, Direction, Action

# Create rule if missing
New-NetFirewallRule -DisplayName "RD Gateway (HTTPS-In)" \\
    -Direction Inbound -Protocol TCP -LocalPort 443 \\
    -Action Allow -Profile Any -Enabled True

# Also allow UDP for RDP UDP transport
New-NetFirewallRule -DisplayName "RD Gateway (UDP-In)" \\
    -Direction Inbound -Protocol UDP -LocalPort 3391 \\
    -Action Allow -Profile Any -Enabled True`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure RDP clients to use the gateway',
        description:
          'Set up the Remote Desktop Connection client or deploy gateway settings via Group Policy to route RDP connections through the gateway.',
        code: `# Deploy RD Gateway settings via GPO registry values
$gpoName = "CFG-RDGateway"
New-GPO -Name $gpoName | New-GPLink \\
    -Target "OU=Computers,OU=Company,DC=corp,DC=contoso,DC=com" -LinkEnabled Yes

$key = "HKCU\\Software\\Policies\\Microsoft\\Windows NT\\Terminal Services"

# Set default gateway
Set-GPRegistryValue -Name $gpoName -Key $key \\
    -ValueName "DefaultTSGateway" -Value "rdgw.contoso.com" -Type String

# Use gateway for all connections
Set-GPRegistryValue -Name $gpoName -Key $key \\
    -ValueName "TSGatewayProfileUsageMethod" -Value 1 -Type DWord`,
        codeLanguage: 'powershell',
        note: 'Users can also manually configure the RD Gateway in the Remote Desktop Connection app under Advanced > Settings > Use these RD Gateway server settings.',
      },
      {
        title: 'Test and verify RDP Gateway connectivity',
        description:
          'Test the end-to-end connection by connecting to an internal server through the RD Gateway from an external network.',
        code: `# Test gateway port from a client
Test-NetConnection -ComputerName rdgw.contoso.com -Port 443

# On the gateway server: view current connections
Import-Module RemoteDesktopServices
Get-ChildItem "RDS:\\GatewayServer\\CurrentConnections"

# View connection events
Get-WinEvent -LogName "Microsoft-Windows-TerminalServices-Gateway/Operational" -MaxEvents 20 |
    Select-Object TimeCreated, Id, Message | Format-Table -Wrap`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['mstsc', 'powershell-test-netconnection'],
    relatedGuides: ['ws-ca-setup', 'ws-ad-domain-setup', 'ws-gpo-create'],
    tags: ['rdp', 'remote-desktop', 'gateway', 'ssl', 'security', 'remote-access'],
  },

  // ─── 10. Set Up Windows Server Backup ─────────────────────────────────────
  {
    id: 'ws-backup-recovery',
    title: 'Set Up Windows Server Backup',
    description:
      'Install and configure Windows Server Backup for full server, system state, and file-level backups, schedule automated backup jobs, configure backup targets, and perform test restores to validate recovery procedures.',
    category: 'ws-security',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'Windows Server 2019 or 2022',
      'Local Administrator access',
      'A dedicated backup target (external disk, network share, or secondary volume)',
      'Sufficient storage for at least two full backups',
    ],
    steps: [
      {
        title: 'Install the Windows Server Backup feature',
        description:
          'Install the Windows Server Backup feature which provides the wbadmin command-line tool and the backup MMC snap-in.',
        code: `Install-WindowsFeature -Name Windows-Server-Backup -IncludeManagementTools

# Verify
Get-WindowsFeature Windows-Server-Backup`,
        codeLanguage: 'powershell',
        portalPath: 'Server Manager > Add Roles and Features > Features > Windows Server Backup',
      },
      {
        title: 'Configure a full server backup to a network share',
        description:
          'Set up a one-time full server backup to a network share. This backs up all volumes, the system state, and bare metal recovery data.',
        code: `# Create a backup policy
$policy = New-WBPolicy

# Add all critical volumes (system, boot, AD if DC)
Add-WBSystemState -Policy $policy
Add-WBBareMetalRecovery -Policy $policy

# Add all volumes
$volumes = Get-WBVolume -AllVolumes
Add-WBVolume -Policy $policy -Volume $volumes

# Set the network target
$cred = Get-Credential -Message "Enter credentials for the backup share"
$target = New-WBBackupTarget -NetworkPath "\\\\BackupServer\\Backups\\DC01" -Credential $cred
Add-WBBackupTarget -Policy $policy -Target $target

# Run the backup now
Start-WBBackup -Policy $policy`,
        codeLanguage: 'powershell',
        note: 'Network-based backups keep only the most recent backup. For version history, use a dedicated backup solution or rotate target folders.',
      },
      {
        title: 'Schedule daily automated backups',
        description:
          'Create a scheduled backup policy that runs automatically at a specified time each day.',
        code: `$policy = New-WBPolicy

# Add system state and bare metal
Add-WBSystemState -Policy $policy
Add-WBBareMetalRecovery -Policy $policy

# Add specific volumes
$cVol = Get-WBVolume -VolumePath "C:"
Add-WBVolume -Policy $policy -Volume $cVol

# Set backup target
$cred = Get-Credential
$target = New-WBBackupTarget -NetworkPath "\\\\BackupServer\\Backups\\DC01" -Credential $cred
Add-WBBackupTarget -Policy $policy -Target $target

# Schedule for 2:00 AM daily
Set-WBSchedule -Policy $policy -Schedule 02:00

# Apply the policy (enables the scheduled task)
Set-WBPolicy -Policy $policy -Force

# Verify the schedule
Get-WBPolicy | Select-Object *`,
        codeLanguage: 'powershell',
        warning: 'Ensure the backup target has sufficient space. A failed backup due to insufficient disk space will not alert you by default.',
      },
      {
        title: 'Configure System State backup for domain controllers',
        description:
          'For domain controllers, System State backups are critical as they include Active Directory, SYSVOL, the registry, and the certificate store.',
        code: `# System State only backup (smaller and faster)
wbadmin start systemstatebackup -backupTarget:\\\\BackupServer\\Backups\\DC01-SystemState -quiet

# Schedule System State backup via wbadmin
# Note: Set-WBPolicy handles this when Add-WBSystemState is used

# Verify System State backup
wbadmin get versions -backupTarget:\\\\BackupServer\\Backups\\DC01-SystemState`,
        codeLanguage: 'powershell',
        note: 'System State backups for domain controllers should be performed at least twice within the tombstone lifetime (default 180 days) to allow AD object recovery.',
      },
      {
        title: 'Configure file and folder level backup',
        description:
          'Create a targeted backup policy for specific important directories like file shares or application data.',
        code: `$policy = New-WBPolicy

# Add specific file paths
$fileSpec = New-WBFileSpec -FileSpec "D:\\FileShares"
Add-WBFileSpec -Policy $policy -FileSpec $fileSpec

# Exclude temporary files
$excludeSpec = New-WBFileSpec -FileSpec "D:\\FileShares\\*.tmp" -Exclude
Add-WBFileSpec -Policy $policy -FileSpec $excludeSpec

# Set target (local disk)
$target = New-WBBackupTarget -VolumePath "E:"
Add-WBBackupTarget -Policy $policy -Target $target

# Schedule and apply
Set-WBSchedule -Policy $policy -Schedule 01:00
Set-WBPolicy -Policy $policy -Force`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Enable backup event notifications',
        description:
          'Configure email notifications for backup success and failure events so administrators are alerted to issues.',
        code: `# Create a scheduled task that checks backup status and sends email
$scriptBlock = @'
$backup = Get-WBSummary
$lastResult = $backup.LastBackupResultHR

if ($lastResult -ne 0) {
    $body = "Backup FAILED on $env:COMPUTERNAME at $($backup.LastBackupTime). Error: $lastResult"
    Send-MailMessage -From "backup@contoso.com" -To "admins@contoso.com" \\
        -Subject "BACKUP FAILURE: $env:COMPUTERNAME" -Body $body \\
        -SmtpServer "smtp.contoso.com" -Priority High
}
'@

$scriptBlock | Out-File -FilePath "C:\\Scripts\\Check-Backup.ps1"

# Register scheduled task to run after each backup
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\\Scripts\\Check-Backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At "04:00"
Register-ScheduledTask -TaskName "Check-BackupStatus" \\
    -Action $action -Trigger $trigger -RunLevel Highest \\
    -User "SYSTEM"`,
        codeLanguage: 'powershell',
        note: 'For more robust monitoring, integrate with System Center Operations Manager (SCOM) or a third-party monitoring solution.',
      },
      {
        title: 'Perform a test file restore',
        description:
          'Regularly test your backups by performing a restore. Start with a file-level restore to verify data integrity without affecting production systems.',
        code: `# List available backup versions
wbadmin get versions

# Restore specific files to an alternate location
wbadmin start recovery -version:03/26/2026-02:00 \\
    -itemType:File \\
    -items:"D:\\FileShares\\Finance\\Budget.xlsx" \\
    -recoveryTarget:"C:\\RestoreTest" \\
    -quiet

# Verify the restored file
Get-ChildItem "C:\\RestoreTest" -Recurse
Get-FileHash "C:\\RestoreTest\\Budget.xlsx"`,
        codeLanguage: 'powershell',
        warning: 'Always test restores to an alternate location first. Restoring to the original location will overwrite existing files.',
      },
      {
        title: 'Monitor backup health and history',
        description:
          'Review backup history, check for errors, and ensure backups are completing successfully on schedule.',
        code: `# View backup summary
Get-WBSummary | Select-Object LastSuccessfulBackupTime, LastBackupResultHR, \\
    NumberOfVersions, NextBackupTime

# View detailed backup job history
Get-WBJob -Previous 5 | Format-Table StartTime, EndTime, HResult, JobState

# Check Windows Event Log for backup events
Get-WinEvent -LogName "Microsoft-Windows-Backup" -MaxEvents 20 |
    Select-Object TimeCreated, Id, LevelDisplayName, Message | Format-Table -Wrap

# View backup catalog
wbadmin get versions`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['wbadmin', 'powershell-get-wbsummary'],
    relatedGuides: ['ws-ad-domain-setup', 'ws-file-server'],
    tags: ['backup', 'recovery', 'disaster-recovery', 'wbadmin', 'system-state', 'security'],
  },
]
