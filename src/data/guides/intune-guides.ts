import type { Guide } from '../../types'

export const intuneGuides: Guide[] = [
  // ─── 1. Set up Windows Autopilot ───────────────────────────────────────────
  {
    id: 'intune-autopilot-setup',
    title: 'Set up Windows Autopilot',
    description:
      'Configure Windows Autopilot for zero-touch device provisioning, including hardware hash registration, deployment profiles, Enrollment Status Page, and end-to-end testing.',
    category: 'intune-enrollment',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    prerequisites: [
      'Azure AD Premium P1 or P2 license',
      'Microsoft Intune license (standalone or as part of EMS E3/E5)',
      'Global Administrator or Intune Administrator role',
      'Network access to Microsoft enrollment endpoints',
    ],
    steps: [
      {
        title: 'Verify licensing and prerequisites',
        description:
          'Confirm that Azure AD Premium P1 and Intune licenses are assigned to the tenant. Open the Microsoft 365 admin center and navigate to Billing > Licenses to verify the subscription status. Every user who will enroll a device needs an Intune license assigned.',
        portalPath: 'Microsoft 365 admin center > Billing > Licenses',
        note: 'If you use Windows Autopilot for pre-provisioning (white glove), Azure AD Premium P2 is recommended.',
      },
      {
        title: 'Enable automatic MDM enrollment',
        description:
          'In Azure Active Directory, configure automatic MDM enrollment so devices that join Azure AD are automatically enrolled in Intune. Set the MDM user scope to All or to a specific group of users who will use Autopilot.',
        portalPath: 'Azure Active Directory admin center > Mobility (MDM and MAM) > Microsoft Intune',
      },
      {
        title: 'Collect hardware hashes from existing devices',
        description:
          'Run a PowerShell script on each target device to export the hardware hash to a CSV file. This script uses the Get-WindowsAutopilotInfo cmdlet. If the module is not installed, the script will install it from the PowerShell Gallery.',
        code: `# Install the module if not present
Install-Script -Name Get-WindowsAutopilotInfo -Force

# Export hardware hash to CSV
Get-WindowsAutopilotInfo -OutputFile C:\\AutopilotHashes\\device_hash.csv`,
        codeLanguage: 'powershell',
        note: 'You can also request hardware hashes from your OEM or hardware vendor. Dell, HP, and Lenovo all support uploading hashes to your tenant directly.',
      },
      {
        title: 'Bulk-collect hashes from multiple devices',
        description:
          'For large-scale deployments, run the collection script across many machines and merge the results into a single CSV. Ensure the CSV retains the required columns: Serial Number, Windows Product ID, and Hardware Hash.',
        code: `# Collect hash and append to a network share CSV
Get-WindowsAutopilotInfo -OutputFile "\\\\FileServer\\Autopilot\\hashes.csv" -Append`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Import hardware hashes into Intune',
        description:
          'In the Intune admin center, navigate to Windows enrollment and import the CSV file. The import process can take up to 15 minutes. Verify that all devices appear with the correct serial numbers after import completes.',
        portalPath: 'Intune admin center > Devices > Windows > Windows enrollment > Devices',
        warning: 'Do not close the browser tab during import. If the import fails, check that the CSV format matches the expected three-column schema.',
      },
      {
        title: 'Create a dynamic Azure AD device group',
        description:
          'Create an Azure AD group using a dynamic device membership rule that targets Autopilot devices. This group will be used for profile and app assignments. Use the ZTDID (Zero Touch Device ID) attribute to match Autopilot-registered devices.',
        code: `# Dynamic membership rule for all Autopilot devices
(device.devicePhysicalIDs -any (_ -startsWith "[ZTDId]"))`,
        codeLanguage: 'powershell',
        portalPath: 'Azure Active Directory admin center > Groups > New group',
        note: 'Dynamic group membership evaluation can take 5-15 minutes after a device is imported.',
      },
      {
        title: 'Create an Autopilot deployment profile',
        description:
          'Create a new Windows Autopilot deployment profile. Choose between user-driven or self-deploying mode depending on your scenario. Configure the Azure AD join type (Azure AD joined or Hybrid Azure AD joined). Set a descriptive profile name to distinguish between different use cases.',
        portalPath: 'Intune admin center > Devices > Windows > Windows enrollment > Deployment profiles > + Create profile',
      },
      {
        title: 'Configure the Out-of-Box Experience (OOBE)',
        description:
          'In the deployment profile, customize the OOBE settings. Hide the privacy settings, EULA, and change account options as needed. Set the user account type to Standard User for security best practices. Enable or disable the option to allow users to skip the Windows Hello setup.',
        note: 'For kiosk or shared devices, use the self-deploying profile mode and skip user account assignment.',
      },
      {
        title: 'Configure the Enrollment Status Page (ESP)',
        description:
          'Enable the Enrollment Status Page to show provisioning progress during Autopilot setup. Configure which apps and policies must be installed before the user can access the desktop. Set a reasonable timeout (30-60 minutes) and enable the option to block device use until all required apps are installed.',
        portalPath: 'Intune admin center > Devices > Windows > Windows enrollment > Enrollment Status Page',
        warning: 'Setting too many required apps on the ESP can cause long wait times or timeouts. Start with 5-10 critical apps and add more gradually.',
      },
      {
        title: 'Assign the deployment profile to the device group',
        description:
          'Assign the Autopilot deployment profile to the dynamic Azure AD group created earlier. This ensures that all imported Autopilot devices receive the correct profile when they connect to the internet and begin OOBE.',
        portalPath: 'Intune admin center > Devices > Windows > Windows enrollment > Deployment profiles > [Your Profile] > Assignments',
      },
      {
        title: 'Assign apps and configuration policies',
        description:
          'Assign the required applications (Office 365, VPN client, LOB apps) and configuration profiles (Wi-Fi, certificates, restrictions) to the same device group. These will be installed during the Enrollment Status Page phase or immediately after enrollment completes.',
        note: 'Mark critical apps as Required and set them as blocking on the ESP. Non-critical apps can be set to Available for user self-service.',
      },
      {
        title: 'Test the Autopilot deployment',
        description:
          'Reset a test device to factory defaults and connect it to the internet. The device should automatically receive the Autopilot profile and present the customized OOBE. Walk through the entire enrollment process and verify that all apps install, policies apply, and the device reaches a compliant state in the Intune portal.',
        code: `# Reset a test device to trigger Autopilot (run as admin)
systemreset --factoryreset`,
        codeLanguage: 'powershell',
        warning: 'Factory reset will erase all data on the device. Only perform this on test devices or devices with backed-up data.',
      },
    ],
    relatedGuides: [
      'intune-compliance-policy',
      'intune-config-profile',
      'intune-win32-app-deploy',
    ],
    tags: [
      'autopilot',
      'enrollment',
      'zero-touch',
      'oobe',
      'provisioning',
      'hardware-hash',
      'esp',
      'deployment-profile',
    ],
  },

  // ─── 2. Deploy a Win32 App ─────────────────────────────────────────────────
  {
    id: 'intune-win32-app-deploy',
    title: 'Deploy a Win32 App',
    description:
      'Package and deploy a Win32 application through Intune using the IntuneWinAppUtil tool, including detection rules, requirement rules, and group assignment.',
    category: 'intune-deployment',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    prerequisites: [
      'Microsoft Win32 Content Prep Tool (IntuneWinAppUtil.exe) downloaded',
      'Application source files (installer, config files) prepared in a folder',
      'Intune Administrator role',
    ],
    steps: [
      {
        title: 'Prepare the application source folder',
        description:
          'Create a dedicated folder containing all files needed for the application installation. Place the primary installer (EXE or MSI) and any supporting files (config files, transforms, scripts) in this folder. Do not include unrelated files as they increase the package size.',
        note: 'Keep the folder structure flat when possible. Nested folders are supported but increase packaging complexity.',
      },
      {
        title: 'Package the app with IntuneWinAppUtil',
        description:
          'Run the IntuneWinAppUtil.exe command-line tool to convert the source folder into an .intunewin package. Specify the source folder, the setup file, and the output folder. The tool compresses and encrypts the content for upload to Intune.',
        code: `# Package the application
IntuneWinAppUtil.exe -c "C:\\AppSource\\MyApp" -s "setup.exe" -o "C:\\AppOutput" -q`,
        codeLanguage: 'powershell',
        note: 'The -q flag runs the tool in quiet mode. The -c parameter is the source folder, -s is the setup file name, and -o is the output folder.',
      },
      {
        title: 'Create a new Win32 app in Intune',
        description:
          'In the Intune admin center, start the Win32 app creation wizard. Select the .intunewin file generated in the previous step. The portal will read the package metadata and pre-fill some fields.',
        portalPath: 'Intune admin center > Apps > All apps > + Add > App type: Windows app (Win32)',
      },
      {
        title: 'Configure app information',
        description:
          'Fill in the app name, description, publisher, and version. Add a logo image if available. Set the category to help users find the app in Company Portal. Provide an informational URL and privacy URL if applicable.',
        note: 'The app name and publisher are visible to end users in the Company Portal app.',
      },
      {
        title: 'Define install and uninstall commands',
        description:
          'Specify the silent install command line and the uninstall command line. Use the appropriate silent switches for your installer type. Set the install behavior to System or User depending on whether the app requires admin privileges.',
        code: `# Example install command (EXE with silent switch)
setup.exe /S /v/qn

# Example uninstall command
setup.exe /uninstall /S

# Example MSI-based install command
msiexec /i "MyApp.msi" /qn /norestart`,
        codeLanguage: 'powershell',
        warning: 'Incorrect install commands are the most common cause of deployment failures. Always test the silent install command manually on a test device before deploying through Intune.',
      },
      {
        title: 'Set requirement rules',
        description:
          'Define the minimum OS version, architecture (32-bit or 64-bit), and disk space requirements. You can also add custom requirement rules using scripts or registry checks to ensure the device meets specific conditions before installation.',
        portalPath: 'Intune admin center > Apps > [Your App] > Requirements',
        note: 'Setting the OS architecture is mandatory. Choose 64-bit unless the app specifically requires 32-bit.',
      },
      {
        title: 'Configure detection rules',
        description:
          'Add detection rules so Intune can determine whether the app is already installed. Choose between MSI product code detection, file/folder existence, or registry key detection. For EXE installers, file-based or registry-based detection is the most reliable.',
        code: `# Common detection rule examples:
# File detection:  C:\\Program Files\\MyApp\\myapp.exe  (version >= 2.0.0)
# Registry detection: HKLM\\SOFTWARE\\MyApp  value "Version"  string equals "2.0.0"`,
        codeLanguage: 'powershell',
        warning: 'If detection rules are misconfigured, the app will reinstall on every sync cycle or never show as installed. Test detection rules thoroughly.',
      },
      {
        title: 'Configure return codes',
        description:
          'Review the default return codes and add any custom ones specific to your installer. Common codes include 0 (success), 1707 (success), 3010 (soft reboot), and 1641 (hard reboot). Custom installers may use non-standard return codes that you need to map.',
      },
      {
        title: 'Assign the app to groups',
        description:
          'Assign the app as Required for groups that should receive it automatically, or as Available for groups that can install it on demand from Company Portal. You can also create an Uninstall assignment to remove the app from specific groups.',
        portalPath: 'Intune admin center > Apps > [Your App] > Assignments',
        note: 'Use Available assignments for optional software to reduce bandwidth and give users choice. Use Required for critical business apps.',
      },
      {
        title: 'Monitor deployment status',
        description:
          'After assignment, monitor the deployment from the app overview page. Check the device install status and user install status views. Successful deployments show as Installed; failures show error codes that help with troubleshooting. Allow 30-60 minutes for the first devices to report back.',
        portalPath: 'Intune admin center > Apps > [Your App] > Device install status',
      },
    ],
    relatedCommands: ['winget', 'msiexec'],
    relatedGuides: [
      'intune-lob-msi-deploy',
      'intune-store-app',
    ],
    tags: [
      'win32',
      'app-deployment',
      'intunewin',
      'packaging',
      'detection-rules',
      'silent-install',
    ],
  },

  // ─── 3. Deploy a LOB App (MSI) ────────────────────────────────────────────
  {
    id: 'intune-lob-msi-deploy',
    title: 'Deploy a LOB App (MSI)',
    description:
      'Upload and deploy a line-of-business MSI application through Intune with minimal configuration, including assignment and installation monitoring.',
    category: 'intune-deployment',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    prerequisites: [
      'MSI installer file ready for upload',
      'Intune Administrator role',
    ],
    steps: [
      {
        title: 'Start the LOB app upload',
        description:
          'In the Intune admin center, add a new Line-of-business app. Select the MSI file from your local machine. The maximum file size for LOB apps is 8 GB. The upload time depends on your network speed and the file size.',
        portalPath: 'Intune admin center > Apps > All apps > + Add > App type: Line-of-business app',
      },
      {
        title: 'Wait for file processing',
        description:
          'After selecting the MSI file, Intune processes and uploads it. A progress indicator shows the upload status. Do not close the browser tab or navigate away until the upload completes. Large files may take several minutes.',
        warning: 'If the upload fails, verify your network connection and ensure the MSI file is not corrupted. Try again with a stable connection.',
      },
      {
        title: 'Configure app information',
        description:
          'Review the auto-detected app information including name, version, publisher, and product code. Intune reads these values from the MSI metadata. Correct any inaccurate fields and add a description, category, and logo to help users identify the app.',
        note: 'The MSI product code is automatically used for detection, so you do not need to configure detection rules manually.',
      },
      {
        title: 'Set command-line arguments (optional)',
        description:
          'Add any additional msiexec command-line arguments if needed. Common options include /qn for silent mode (already applied by default) and custom properties like INSTALLDIR or feature selections. Leave blank if the default silent install is sufficient.',
        code: `# Example: install to a custom directory with no restart
/qn INSTALLDIR="C:\\Program Files\\MyLOBApp" /norestart`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Assign the app to groups',
        description:
          'Assign the app as Required for automatic deployment or Available for Company Portal self-service. Select the target Azure AD groups. You can combine Required and Available assignments for different groups in the same app.',
        portalPath: 'Intune admin center > Apps > [Your App] > Assignments',
      },
      {
        title: 'Monitor installation status',
        description:
          'Check the device install status to track which devices have successfully installed the app. The status updates after each device sync cycle (approximately every 8 hours or on manual sync). Look for error codes on failed installations to guide troubleshooting.',
        portalPath: 'Intune admin center > Apps > [Your App] > Device install status',
      },
      {
        title: 'Verify on a target device',
        description:
          'On a test device, trigger a manual Intune sync from Settings > Accounts > Access work or school > Info > Sync. After sync completes, verify the application appears in Programs and Features or Apps & features. Confirm the correct version is installed.',
        code: `# Force Intune sync from PowerShell (run as admin)
Get-ScheduledTask | Where-Object {$_.TaskName -eq "PushLaunch"} | Start-ScheduledTask`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: ['msiexec'],
    relatedGuides: [
      'intune-win32-app-deploy',
      'intune-store-app',
    ],
    tags: [
      'lob',
      'msi',
      'line-of-business',
      'app-deployment',
      'installer',
    ],
  },

  // ─── 4. Assign a Microsoft Store App ───────────────────────────────────────
  {
    id: 'intune-store-app',
    title: 'Assign a Microsoft Store App',
    description:
      'Add and assign a Microsoft Store app using the new Intune-integrated Store experience, with automatic updates and license management.',
    category: 'intune-deployment',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    prerequisites: [
      'Intune Administrator role',
      'Target devices running Windows 10 1809 or later',
    ],
    steps: [
      {
        title: 'Open the Microsoft Store apps section',
        description:
          'Navigate to the Apps section in the Intune admin center and add a new app. Select "Microsoft Store app (new)" as the app type. This uses the new integrated Store experience that does not require a Microsoft Store for Business account.',
        portalPath: 'Intune admin center > Apps > All apps > + Add > App type: Microsoft Store app (new)',
      },
      {
        title: 'Search for the app',
        description:
          'Use the built-in search to find the desired app from the Microsoft Store catalog. You can search by app name or publisher. Select the correct app from the search results. The app details including description, publisher, and icon are loaded automatically.',
        note: 'Only apps that support offline licensing or the new Store integration will appear. Some consumer-only apps may not be available.',
      },
      {
        title: 'Configure app settings',
        description:
          'Review the app information and select the installer type. For most apps, choose the recommended installer type (StoreInstall for UWP or winget for Win32 Store apps). Set the install behavior to System context unless the app is specifically a per-user app.',
        note: 'The winget installer type allows Intune to install Win32 desktop apps from the Store with better reliability and update management.',
      },
      {
        title: 'Assign the app to groups',
        description:
          'Assign the app to your target Azure AD groups. Choose Required for automatic deployment or Available for self-service installation via Company Portal. You can also assign the app to All Users or All Devices for broad deployment.',
        portalPath: 'Intune admin center > Apps > [Your App] > Assignments',
      },
      {
        title: 'Configure update behavior',
        description:
          'Microsoft Store apps configured through Intune receive automatic updates by default. If you need to control the update cadence, you can create a configuration policy to manage Store update settings. For most organizations, leaving automatic updates enabled is recommended.',
        note: 'Automatic updates reduce security risk and administrative overhead. Only disable them if you have a specific compliance reason.',
      },
      {
        title: 'Verify deployment',
        description:
          'Check the app install status in the Intune portal. On a target device, open the Company Portal app and verify the app is listed (for Available assignments) or confirm it appears in the Start menu (for Required assignments). Allow up to one sync cycle for the assignment to reach devices.',
        portalPath: 'Intune admin center > Apps > [Your App] > Device install status',
      },
    ],
    relatedCommands: ['winget'],
    relatedGuides: [
      'intune-win32-app-deploy',
      'intune-lob-msi-deploy',
    ],
    tags: [
      'store',
      'microsoft-store',
      'uwp',
      'app-deployment',
      'winget',
      'company-portal',
    ],
  },

  // ─── 5. Create a Compliance Policy ─────────────────────────────────────────
  {
    id: 'intune-compliance-policy',
    title: 'Create a Compliance Policy',
    description:
      'Define and deploy a device compliance policy covering device health, system security, password requirements, and actions for noncompliance with Conditional Access integration.',
    category: 'intune-compliance',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    prerequisites: [
      'Intune Administrator role',
      'Azure AD groups for policy targeting',
      'Understanding of organizational security requirements',
    ],
    steps: [
      {
        title: 'Navigate to compliance policies',
        description:
          'Open the Intune admin center and navigate to the compliance policies section. Review any existing policies to avoid conflicts. Plan your new policy scope and settings before creating it.',
        portalPath: 'Intune admin center > Devices > Compliance > Policies > + Create Policy',
      },
      {
        title: 'Select platform and create policy',
        description:
          'Choose the target platform (Windows 10 and later, iOS/iPadOS, Android, or macOS). Enter a descriptive policy name and description that clearly identifies the purpose, such as "Corporate Windows Compliance - Standard Security". Use a consistent naming convention across all your policies.',
      },
      {
        title: 'Configure Device Health settings',
        description:
          'Enable the device health checks relevant to your organization. For Windows devices, configure BitLocker requirement, Secure Boot requirement, and Code Integrity. Enable the TPM requirement if your hardware supports it. These settings verify that the device boot chain is secure.',
        note: 'Device health attestation requires devices to communicate with the Microsoft Health Attestation Service. Ensure the endpoint is not blocked by your firewall.',
      },
      {
        title: 'Configure Device Properties',
        description:
          'Set the minimum and maximum allowed OS versions to ensure devices are running supported builds. This prevents outdated or preview builds from accessing corporate resources. Reference your organization patch management timeline when setting these values.',
      },
      {
        title: 'Configure System Security settings',
        description:
          'Set password requirements including minimum length (recommend 8+ characters), complexity, and expiration. Enable the firewall, antivirus, and antispyware requirements. Require encryption on the device. These settings form the core security baseline for compliance.',
        warning: 'Setting overly strict password policies (e.g., 16+ characters, 30-day expiration) can lead to user frustration and workarounds. Balance security with usability.',
      },
      {
        title: 'Configure Microsoft Defender settings',
        description:
          'If using Microsoft Defender for Endpoint, set the maximum allowed machine risk score. Choose from Clear, Low, Medium, or High. Devices exceeding the risk threshold are marked noncompliant. This integrates Defender threat intelligence with Conditional Access.',
        note: 'This setting requires Microsoft Defender for Endpoint to be onboarded and connected to Intune.',
      },
      {
        title: 'Configure actions for noncompliance',
        description:
          'Define what happens when a device falls out of compliance. The default action marks the device as noncompliant immediately. Add additional actions such as sending an email notification to the user, remotely locking the device, or retiring it after a grace period. Set appropriate time delays for each action.',
        portalPath: 'Intune admin center > Devices > Compliance > [Your Policy] > Actions for noncompliance',
        note: 'A common pattern is: Day 0 - mark noncompliant and notify user, Day 3 - send reminder, Day 7 - block access via Conditional Access, Day 14 - retire device.',
      },
      {
        title: 'Assign the policy to groups',
        description:
          'Assign the compliance policy to the target Azure AD user or device groups. Consider using a phased rollout: start with a pilot group, validate the results, then expand to the broader organization. You can also add exclusion groups for devices that need exceptions.',
        portalPath: 'Intune admin center > Devices > Compliance > [Your Policy] > Assignments',
      },
      {
        title: 'Monitor compliance status',
        description:
          'After assignment, monitor the compliance dashboard for policy evaluation results. Check the per-device and per-setting status to identify which requirements cause the most failures. Use this data to adjust settings or create user remediation guides. The compliance dashboard refreshes every 8 hours by default.',
        portalPath: 'Intune admin center > Devices > Compliance > Monitor',
      },
    ],
    relatedGuides: [
      'intune-config-profile',
      'intune-bitlocker',
      'intune-autopilot-setup',
    ],
    tags: [
      'compliance',
      'security',
      'conditional-access',
      'password-policy',
      'device-health',
      'defender',
    ],
  },

  // ─── 6. Create a Configuration Profile ─────────────────────────────────────
  {
    id: 'intune-config-profile',
    title: 'Create a Configuration Profile',
    description:
      'Build and deploy device configuration profiles using the Settings Catalog or templates to manage device settings, restrictions, and features across your fleet.',
    category: 'intune-config',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    prerequisites: [
      'Intune Administrator role',
      'Understanding of the settings you need to configure',
      'Azure AD groups for profile targeting',
    ],
    steps: [
      {
        title: 'Choose between Settings Catalog and Templates',
        description:
          'Intune offers two approaches for configuration profiles: the Settings Catalog (granular, searchable, recommended for new profiles) and Templates (pre-built groupings like Device Restrictions, Wi-Fi, VPN). The Settings Catalog supports the broadest set of settings and is the preferred method for most scenarios.',
        note: 'The Settings Catalog replaces many legacy template-based profiles. Microsoft recommends using it for new deployments. Templates are still useful for Wi-Fi, VPN, certificates, and SCEP profiles.',
      },
      {
        title: 'Create a new configuration profile',
        description:
          'Navigate to the configuration profiles section and create a new profile. Select the target platform (Windows 10 and later) and the profile type (Settings catalog or a specific template). Give the profile a clear, descriptive name following your naming convention.',
        portalPath: 'Intune admin center > Devices > Configuration > + Create > New Policy',
      },
      {
        title: 'Add settings (Settings Catalog)',
        description:
          'If using the Settings Catalog, click Add settings and use the search bar or browse categories to find the settings you need. Select each setting and configure its value. Settings are organized by CSP (Configuration Service Provider) categories such as Device Lock, Defender, and Edge browser.',
        portalPath: 'Intune admin center > Devices > Configuration > [Your Profile] > Configuration settings > + Add settings',
        note: 'Use the search function to find settings quickly. For example, search "password" to find all password-related settings across all categories.',
      },
      {
        title: 'Configure template settings (if using Templates)',
        description:
          'If using a template profile, configure each setting page in the wizard. Templates group related settings together and present them in a guided flow. Review each category and enable or disable settings as needed. Not Configured leaves the device default in place.',
      },
      {
        title: 'Configure scope tags',
        description:
          'Assign scope tags to limit profile visibility to specific administrators. Scope tags enable delegated administration where different IT teams manage different groups of devices. If you do not use scope tags, leave the Default tag selected.',
        portalPath: 'Intune admin center > Devices > Configuration > [Your Profile] > Scope tags',
        note: 'Scope tags are optional but recommended for organizations with multiple IT teams or regional admins.',
      },
      {
        title: 'Assign the profile to groups',
        description:
          'Assign the configuration profile to the target Azure AD user or device groups. Consider creating separate profiles for different user populations rather than one large profile. Add exclusion groups for any devices or users that should not receive the settings.',
        portalPath: 'Intune admin center > Devices > Configuration > [Your Profile] > Assignments',
      },
      {
        title: 'Set applicability rules (optional)',
        description:
          'Configure applicability rules to further filter which devices receive the profile based on OS version or OS edition. For example, you can restrict a profile to only Windows 11 Enterprise devices. This is useful when a group contains mixed device types.',
      },
      {
        title: 'Review and create',
        description:
          'Review all configured settings on the summary page before creating the profile. Verify the profile name, settings, scope tags, and assignments are correct. Once created, the profile is deployed on the next device sync cycle.',
        warning: 'Incorrect configuration profiles can lock users out of their devices or break functionality. Always test with a small pilot group before broad deployment.',
      },
      {
        title: 'Monitor profile deployment',
        description:
          'Check the profile deployment status in the Intune portal. The overview shows success, failure, conflict, and pending counts. Drill into individual devices to see per-setting application status. Conflicts occur when two profiles configure the same setting with different values.',
        portalPath: 'Intune admin center > Devices > Configuration > [Your Profile] > Device status',
      },
      {
        title: 'Troubleshoot conflicts and errors',
        description:
          'If devices show errors or conflicts, use the per-device detail view to identify which settings failed. Common issues include conflicting profiles, unsupported settings for the OS version, or insufficient device capabilities. Resolve conflicts by consolidating overlapping profiles or adjusting priority.',
        note: 'Use the Intune diagnostic report on the device (Settings > Accounts > Access work or school > Info > Create report) to get detailed policy application logs.',
      },
    ],
    relatedGuides: [
      'intune-compliance-policy',
      'intune-update-ring',
      'intune-bitlocker',
    ],
    tags: [
      'configuration',
      'settings-catalog',
      'csp',
      'device-restrictions',
      'profile',
      'scope-tags',
    ],
  },

  // ─── 7. Configure Windows Update Ring ──────────────────────────────────────
  {
    id: 'intune-update-ring',
    title: 'Configure Windows Update Ring',
    description:
      'Create and deploy a Windows Update ring policy to control update deferral periods, user experience settings, and automatic update behavior across managed devices.',
    category: 'intune-config',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    prerequisites: [
      'Intune Administrator role',
      'Devices running Windows 10 1709 or later',
      'Azure AD groups for update ring targeting',
    ],
    steps: [
      {
        title: 'Plan your update ring strategy',
        description:
          'Before creating update rings, plan your rollout strategy. A common approach is three rings: Preview (IT team, 0-day deferral), Broad (early adopters, 7-day deferral), and General (all users, 14-day deferral). This staged approach lets you catch issues before they affect the entire organization.',
        note: 'Microsoft recommends at least two update rings to allow staged rollout and validation of updates.',
      },
      {
        title: 'Create a new update ring',
        description:
          'Navigate to the Windows Update section and create a new update ring policy. Give it a descriptive name that reflects its purpose and target audience, such as "Update Ring - General (14-day deferral)".',
        portalPath: 'Intune admin center > Devices > Windows > Update rings for Windows 10 and later > + Create profile',
      },
      {
        title: 'Configure update deferral periods',
        description:
          'Set the deferral periods for quality updates (security patches) and feature updates (major Windows releases). Quality update deferrals can be 0-30 days. Feature update deferrals can be 0-365 days. Set the feature update uninstall window to allow rollback if issues are discovered.',
        note: 'For most organizations, deferring quality updates by 7-14 days and feature updates by 60-90 days provides a good balance between security and stability.',
      },
      {
        title: 'Configure servicing channel',
        description:
          'Select the Windows servicing channel for the update ring. The General Availability Channel is recommended for most devices. You can also target a specific feature update version to prevent devices from upgrading beyond a particular release until you are ready.',
      },
      {
        title: 'Configure user experience settings',
        description:
          'Control how updates are presented to users. Configure auto-restart behavior, active hours, restart notifications, and deadline settings. Set engaged restart deadlines to force updates after a reasonable period (3-7 days) while giving users flexibility to choose when to restart.',
        warning: 'Setting forced restarts during business hours can cause data loss if users have unsaved work. Configure active hours or use deadline-based restarts to minimize disruption.',
      },
      {
        title: 'Configure automatic update behavior',
        description:
          'Set the automatic update behavior to control when updates are downloaded and installed. Options range from fully automatic (recommended) to notify-only. For most managed environments, "Auto install and restart at scheduled time" provides the best balance of control and automation.',
      },
      {
        title: 'Assign the update ring to groups',
        description:
          'Assign the update ring to the appropriate Azure AD groups. Each device should receive only one update ring to avoid conflicts. If a device is a member of multiple groups with different update rings, the most restrictive settings may apply unpredictably.',
        portalPath: 'Intune admin center > Devices > Windows > Update rings > [Your Ring] > Assignments',
        warning: 'Avoid assigning multiple update rings to the same device. Use exclusive group membership to prevent conflicts.',
      },
      {
        title: 'Monitor update compliance',
        description:
          'Use the Windows Update compliance reports to track which devices have installed the latest updates. The compliance view shows update status by ring, and you can drill down into individual devices. Use this data to identify devices that are failing to update and investigate the root cause.',
        portalPath: 'Intune admin center > Reports > Windows updates',
      },
    ],
    relatedGuides: [
      'intune-config-profile',
      'intune-compliance-policy',
    ],
    tags: [
      'windows-update',
      'update-ring',
      'patching',
      'deferral',
      'servicing',
      'quality-updates',
      'feature-updates',
    ],
  },

  // ─── 8. Deploy a PowerShell Script ─────────────────────────────────────────
  {
    id: 'intune-powershell-script',
    title: 'Deploy a PowerShell Script',
    description:
      'Upload and deploy a PowerShell script to managed devices through Intune, including execution context configuration, retry settings, and deployment monitoring.',
    category: 'intune-management',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    prerequisites: [
      'Intune Administrator role',
      'PowerShell script file (.ps1) prepared and tested locally',
      'Target devices running Windows 10 1709 or later',
    ],
    steps: [
      {
        title: 'Prepare the PowerShell script',
        description:
          'Write and test your PowerShell script locally before deploying through Intune. Ensure the script handles errors gracefully, includes logging, and exits with appropriate exit codes (0 for success, non-zero for failure). The script file must be UTF-8 encoded and less than 200 KB.',
        code: `# Example: Configure a custom registry setting with logging
$LogPath = "C:\\ProgramData\\IntuneScripts\\ConfigureRegistry.log"
$RegPath = "HKLM:\\SOFTWARE\\Contoso"
$RegName = "EnableFeatureX"
$RegValue = 1

try {
    New-Item -Path (Split-Path $LogPath) -ItemType Directory -Force | Out-Null
    if (-not (Test-Path $RegPath)) {
        New-Item -Path $RegPath -Force | Out-Null
    }
    Set-ItemProperty -Path $RegPath -Name $RegName -Value $RegValue -Type DWord
    "$(Get-Date) - SUCCESS: Set $RegName to $RegValue" | Out-File $LogPath -Append
    exit 0
} catch {
    "$(Get-Date) - ERROR: $($_.Exception.Message)" | Out-File $LogPath -Append
    exit 1
}`,
        codeLanguage: 'powershell',
        note: 'Always include error handling and logging. Scripts that fail silently are extremely difficult to troubleshoot through Intune.',
      },
      {
        title: 'Navigate to script deployment',
        description:
          'Open the Intune admin center and navigate to the platform scripts section. This is where you upload and manage all PowerShell scripts deployed to Windows devices.',
        portalPath: 'Intune admin center > Devices > Scripts and remediations > Platform scripts > + Add > Windows 10 and later',
      },
      {
        title: 'Upload the script file',
        description:
          'Enter a descriptive name and optional description for the script. Upload the .ps1 file. The name should clearly indicate what the script does, such as "Configure Contoso Registry Settings" or "Set Default Browser to Edge".',
      },
      {
        title: 'Configure script execution settings',
        description:
          'Set the execution context to System (runs as SYSTEM account) or User (runs as the logged-in user). Choose System for scripts that modify HKLM registry keys, install software, or change system-wide settings. Choose User for scripts that configure per-user settings like HKCU registry keys.',
        note: 'Scripts running in System context have full administrative privileges. Scripts running in User context run with the permissions of the logged-in user.',
      },
      {
        title: 'Configure signature and 64-bit settings',
        description:
          'Choose whether to enforce script signature checking. If your scripts are signed with a trusted certificate, enable this for additional security. Select "Run script in 64-bit PowerShell Host" if your script uses 64-bit specific modules or registry paths.',
        warning: 'The 32-bit PowerShell host redirects HKLM\\SOFTWARE to HKLM\\SOFTWARE\\WOW6432Node. Always use the 64-bit host unless you specifically need 32-bit compatibility.',
      },
      {
        title: 'Assign the script to groups',
        description:
          'Assign the script to target Azure AD user or device groups. Scripts run once per device by default and are re-evaluated on a schedule. If you need the script to run again, you must re-upload it or create a new script entry.',
        portalPath: 'Intune admin center > Devices > Scripts and remediations > [Your Script] > Assignments',
      },
      {
        title: 'Understand retry and re-run behavior',
        description:
          'Intune attempts to run the script once and retries up to three times if it fails. The Intune Management Extension checks for new or changed scripts every hour. If you need to re-run a script, change the script content or create a new script deployment. Scripts are not re-run automatically on devices where they succeeded.',
        note: 'To force a re-run on a specific device, you can delete the script execution records from the Intune Management Extension registry on that device.',
      },
      {
        title: 'Monitor script execution status',
        description:
          'Check the script deployment status in the Intune portal. The overview page shows how many devices have successfully run the script, how many failed, and how many are pending. Click on individual devices to see the script output and any error messages returned by the script.',
        portalPath: 'Intune admin center > Devices > Scripts and remediations > [Your Script] > Device status',
      },
    ],
    relatedGuides: [
      'intune-config-profile',
      'intune-win32-app-deploy',
    ],
    tags: [
      'powershell',
      'script',
      'automation',
      'remediation',
      'registry',
      'intune-management-extension',
    ],
  },

  // ─── 9. Enable BitLocker via Intune ────────────────────────────────────────
  {
    id: 'intune-bitlocker',
    title: 'Enable BitLocker via Intune',
    description:
      'Configure and deploy BitLocker drive encryption through Intune endpoint protection profiles, including OS drive encryption settings, recovery options, and Azure AD key backup.',
    category: 'intune-compliance',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    prerequisites: [
      'Intune Administrator role',
      'Devices with TPM 1.2 or later (TPM 2.0 recommended)',
      'Devices running Windows 10 Pro, Enterprise, or Education',
      'Azure AD Premium for recovery key backup',
    ],
    steps: [
      {
        title: 'Verify device hardware readiness',
        description:
          'Ensure target devices have a compatible TPM chip and meet the firmware requirements for BitLocker. Devices without TPM can use BitLocker with a startup key stored on a USB drive, but this is not recommended for enterprise deployments. Check the device inventory in Intune for TPM attestation status.',
        code: `# Check TPM status on a device
Get-Tpm | Select-Object TpmPresent, TpmReady, TpmEnabled, TpmActivated`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create an endpoint protection profile',
        description:
          'In the Intune admin center, create a new endpoint protection configuration profile. The BitLocker settings are located within the endpoint protection template. Choose Windows 10 and later as the platform and Endpoint protection as the profile type.',
        portalPath: 'Intune admin center > Devices > Configuration > + Create > New Policy > Windows 10 and later > Endpoint protection',
      },
      {
        title: 'Configure Windows Encryption base settings',
        description:
          'In the Windows Encryption section, set "Encrypt devices" to Require. Choose the encryption method: XTS-AES 256-bit is recommended for OS drives and fixed drives. Enable "Warning for other disk encryption" to prompt users to disable third-party encryption before enabling BitLocker.',
        warning: 'If devices already have a third-party encryption solution (e.g., Symantec Endpoint Encryption), it must be removed before enabling BitLocker. Conflicting encryption products can cause boot failures.',
      },
      {
        title: 'Configure OS drive encryption settings',
        description:
          'Configure the operating system drive settings. Set the startup authentication method to TPM only (most seamless) or TPM + PIN (more secure). Enable BitLocker on devices without a compatible TPM only if you plan to use USB startup keys. Set the minimum PIN length if using TPM + PIN.',
        note: 'TPM-only authentication provides transparent encryption. TPM + PIN adds pre-boot authentication for higher security environments but requires user interaction at every boot.',
      },
      {
        title: 'Configure recovery options',
        description:
          'Enable recovery key backup to Azure AD so administrators can retrieve keys if users are locked out. Set "Save BitLocker recovery information to Azure Active Directory" to Enable. Configure whether to allow or require the 48-digit recovery password and 256-bit recovery key.',
        warning: 'If Azure AD recovery key backup fails and no other recovery method is configured, data loss can occur if the user forgets their PIN or TPM changes. Always verify that recovery keys are being escrowed successfully.',
      },
      {
        title: 'Configure fixed drive and removable drive settings',
        description:
          'Optionally configure encryption for fixed data drives (secondary internal drives). You can also set policies for removable drives (USB drives) such as requiring encryption before write access is granted. These settings are independent of the OS drive configuration.',
        note: 'Requiring encryption on removable drives can impact productivity. Consider using a warning-only policy initially and transitioning to enforcement after user training.',
      },
      {
        title: 'Assign the profile to device groups',
        description:
          'Assign the endpoint protection profile to the target Azure AD device groups. Start with a pilot group of test devices to validate the encryption process before deploying to the broader fleet. Devices will begin encryption silently on the next sync cycle if all prerequisites are met.',
        portalPath: 'Intune admin center > Devices > Configuration > [Your Profile] > Assignments',
      },
      {
        title: 'Verify recovery key backup to Azure AD',
        description:
          'After devices encrypt, verify that recovery keys are being stored in Azure AD. Navigate to the device record in Azure AD and check the BitLocker keys section. Each encrypted drive should have a recovery key ID and creation timestamp. This is critical for support scenarios.',
        portalPath: 'Azure Active Directory admin center > Devices > [Device] > BitLocker keys',
        code: `# View BitLocker recovery key on a local device (run as admin)
(Get-BitLockerVolume -MountPoint C:).KeyProtector | Where-Object {$_.KeyProtectorType -eq "RecoveryPassword"} | Select-Object KeyProtectorId, RecoveryPassword`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Monitor encryption status',
        description:
          'Monitor the BitLocker encryption status from the Intune encryption report. The report shows which devices are encrypted, which are pending, and which have failed. For failed devices, check the error details to identify common issues such as missing TPM, insufficient disk space, or Group Policy conflicts.',
        portalPath: 'Intune admin center > Devices > Monitor > Encryption report',
      },
    ],
    relatedGuides: [
      'intune-compliance-policy',
      'intune-config-profile',
    ],
    tags: [
      'bitlocker',
      'encryption',
      'tpm',
      'recovery-key',
      'endpoint-protection',
      'security',
      'azure-ad',
    ],
  },

  // ─── 10. Remote Wipe/Retire Devices ────────────────────────────────────────
  {
    id: 'intune-remote-actions',
    title: 'Remote Wipe/Retire Devices',
    description:
      'Execute remote actions on managed devices including full wipe, selective retire, and fresh start, with clear guidance on when to use each option and verification steps.',
    category: 'intune-management',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    prerequisites: [
      'Intune Administrator role or appropriate RBAC permissions for remote actions',
      'Device enrolled and reachable by Intune',
    ],
    steps: [
      {
        title: 'Understand the difference between Wipe, Retire, and Fresh Start',
        description:
          'Wipe performs a full factory reset, removing all data, apps, and settings — the device returns to the out-of-box experience. Retire removes only corporate data (managed apps, policies, profiles, email) while leaving personal data intact — ideal for BYOD scenarios. Fresh Start removes all pre-installed OEM apps and resets Windows while optionally retaining user data.',
        note: 'Choose Retire for BYOD and personal devices leaving the organization. Choose Wipe for corporate-owned devices being repurposed or decommissioned. Choose Fresh Start to clean up bloatware while keeping the device enrolled.',
      },
      {
        title: 'Locate the device in Intune',
        description:
          'Navigate to the device list in the Intune admin center. Search for the target device by name, serial number, or user principal name. Click on the device to open its detail page where all remote actions are available. Verify you have selected the correct device before proceeding.',
        portalPath: 'Intune admin center > Devices > All devices > [Search for device]',
        warning: 'Always double-check the device name, serial number, and enrolled user before executing any remote action. Wiping the wrong device is irreversible.',
      },
      {
        title: 'Execute a Wipe (full factory reset)',
        description:
          'Click the Wipe action from the device toolbar. You will be prompted to confirm. For Windows devices, you can optionally choose to keep the enrollment state and user account or to wipe the device even if it loses network connectivity. The wipe command is queued and executes when the device checks in.',
        portalPath: 'Intune admin center > Devices > All devices > [Device] > Wipe',
        warning: 'A full wipe permanently erases ALL data on the device, including personal files, apps, and settings. This action cannot be undone. Ensure the user has backed up any needed data before proceeding.',
      },
      {
        title: 'Execute a Retire (selective wipe)',
        description:
          'Click the Retire action from the device toolbar to remove only corporate data and management profiles. This leaves personal data, apps, and settings intact. Retire removes managed email accounts, Wi-Fi profiles, VPN configurations, certificates, and Company Portal data. The device is unenrolled from Intune after the retire completes.',
        portalPath: 'Intune admin center > Devices > All devices > [Device] > Retire',
        note: 'After a Retire action, the device is removed from Intune management. The user can re-enroll if needed. Corporate apps deployed as Required through Intune will be removed.',
      },
      {
        title: 'Execute a Fresh Start (Windows only)',
        description:
          'Click the Fresh Start action to reinstall Windows while removing pre-installed manufacturer apps. You can choose whether to retain user data on the device. The device remains enrolled in Intune and Azure AD after the Fresh Start completes. This is useful for cleaning up OEM bloatware without a full factory reset.',
        portalPath: 'Intune admin center > Devices > All devices > [Device] > Fresh start',
        note: 'Fresh Start requires Windows 10 version 1709 or later. The device downloads the latest Windows version during the process, which requires an active internet connection.',
      },
      {
        title: 'Verify the action status',
        description:
          'After initiating a remote action, monitor its status from the Device actions section on the device detail page. The status shows Pending until the device checks in and processes the command, then changes to Completed or Failed. For wipe actions, the device will disappear from the device list after the reset completes and before re-enrollment.',
        portalPath: 'Intune admin center > Devices > All devices > [Device] > Device action status',
      },
    ],
    relatedGuides: [
      'intune-compliance-policy',
      'intune-autopilot-setup',
    ],
    tags: [
      'wipe',
      'retire',
      'fresh-start',
      'remote-actions',
      'factory-reset',
      'byod',
      'decommission',
      'device-lifecycle',
    ],
  },
]
