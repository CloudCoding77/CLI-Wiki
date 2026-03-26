import type { Guide } from '../../types'

export const m365Guides: Guide[] = [
  // ─── 1. Create Mail Flow Rules ────────────────────────────────────────────
  {
    id: 'm365-exchange-mailflow',
    title: 'Create Mail Flow Rules',
    description:
      'Configure mail flow rules (transport rules) in Exchange Online to control the flow of email messages in your organization. Learn how to create rules for disclaimers, encryption, header modification, and conditional routing.',
    category: 'm365-exchange',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'Exchange Online license (Plan 1 or Plan 2)',
      'Exchange Administrator or Organization Management role',
      'Exchange Online PowerShell module (ExchangeOnlineManagement)',
    ],
    steps: [
      {
        title: 'Connect to Exchange Online PowerShell',
        description:
          'Open a PowerShell window and connect to Exchange Online using the ExchangeOnlineManagement module. This establishes a remote session that lets you manage mail flow rules programmatically.',
        code: `# Install the module if not present
Install-Module -Name ExchangeOnlineManagement -Force -Scope CurrentUser

# Connect to Exchange Online
Connect-ExchangeOnline -UserPrincipalName admin@contoso.com`,
        codeLanguage: 'powershell',
        note: 'You can also use the Exchange admin center (EAC) for a graphical interface, but PowerShell gives you more granular control and supports automation.',
      },
      {
        title: 'Review existing mail flow rules',
        description:
          'Before creating new rules, review the current rule set to avoid conflicts or duplicate processing. Rules are processed in priority order, so understanding the existing configuration is critical.',
        code: `# List all existing transport rules
Get-TransportRule | Format-Table Name, State, Priority -AutoSize`,
        codeLanguage: 'powershell',
        portalPath: 'Exchange admin center > Mail flow > Rules',
      },
      {
        title: 'Create a disclaimer rule',
        description:
          'Create a mail flow rule that appends a legal disclaimer to all outbound messages. This is one of the most common use cases for transport rules in enterprise environments.',
        code: `# Create an outbound disclaimer rule
New-TransportRule -Name "External Disclaimer" \`
  -SentToScope NotInOrganization \`
  -ApplyHtmlDisclaimerLocation Append \`
  -ApplyHtmlDisclaimerText "<p style='font-size:11px;color:gray;'>This email is confidential and intended solely for the addressee. If you received this in error, please delete it immediately.</p>" \`
  -ApplyHtmlDisclaimerFallbackAction Wrap`,
        codeLanguage: 'powershell',
        note: 'The FallbackAction determines what happens when the disclaimer cannot be added (e.g., encrypted messages). "Wrap" encloses the original message as an attachment with the disclaimer in the new body.',
      },
      {
        title: 'Create a conditional routing rule',
        description:
          'Set up a rule that redirects messages based on specific conditions, such as routing all messages with "Invoice" in the subject to a shared mailbox for review.',
        code: `# Redirect messages containing "Invoice" in the subject
New-TransportRule -Name "Route Invoices to Finance" \`
  -SubjectContainsWords "Invoice","Payment","Receipt" \`
  -RedirectMessageTo finance-review@contoso.com \`
  -ExceptIfSentTo finance-review@contoso.com`,
        codeLanguage: 'powershell',
        warning: 'Always add exceptions to prevent routing loops. Without the ExceptIfSentTo parameter, redirected messages could match the rule again and create infinite loops.',
      },
      {
        title: 'Create an encryption rule',
        description:
          'Configure a rule that automatically applies Office 365 Message Encryption (OME) to messages containing sensitive data or sent to external recipients with specific keywords.',
        code: `# Encrypt messages marked as confidential
New-TransportRule -Name "Encrypt Confidential" \`
  -HeaderContainsMessageHeader "msip_labels" \`
  -HeaderContainsWords "Confidential" \`
  -ApplyRightsProtectionTemplate "Encrypt" \`
  -Mode Enforce`,
        codeLanguage: 'powershell',
        portalPath: 'Exchange admin center > Mail flow > Rules > + > Apply Office 365 Message Encryption',
      },
      {
        title: 'Create a header modification rule',
        description:
          'Add, modify, or remove message headers to support interoperability with third-party systems, spam filtering, or compliance tracking. Custom headers are invisible to end users but can be read by mail servers and gateways.',
        code: `# Add a custom header to all outbound messages
New-TransportRule -Name "Add Compliance Header" \`
  -SentToScope NotInOrganization \`
  -SetHeaderName "X-Company-Compliance" \`
  -SetHeaderValue "Reviewed"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Set rule priority and activation',
        description:
          'Adjust the priority of your new rules to ensure they are evaluated in the correct order. Lower priority numbers are processed first. Enable or disable rules as needed for testing.',
        code: `# Set priority (0 = highest)
Set-TransportRule -Identity "External Disclaimer" -Priority 0
Set-TransportRule -Identity "Encrypt Confidential" -Priority 1

# Disable a rule for testing
Set-TransportRule -Identity "Route Invoices to Finance" -Mode Audit`,
        codeLanguage: 'powershell',
        note: 'Use "Audit" mode to test rules without actually applying actions. Audit results appear in the message trace logs.',
      },
      {
        title: 'Test mail flow rules',
        description:
          'Send test messages that match each rule condition and verify the expected actions are applied. Use message trace to confirm rule processing and diagnose any issues.',
        code: `# Run a message trace to verify rule hits
Get-MessageTrace -StartDate (Get-Date).AddHours(-1) -EndDate (Get-Date) \`
  -SenderAddress user@contoso.com |
  Get-MessageTraceDetail |
  Where-Object { $_.Event -eq "Transport rule" }`,
        codeLanguage: 'powershell',
        portalPath: 'Exchange admin center > Mail flow > Message trace',
        warning: 'Message trace data may take up to 10 minutes to appear. For real-time testing, check the recipient mailbox directly.',
      },
      {
        title: 'Monitor and maintain rules',
        description:
          'Establish a regular review cycle for your mail flow rules. Export the current configuration for documentation and disaster recovery. Remove or disable rules that are no longer needed to keep processing efficient.',
        code: `# Export all rules to XML for backup
$rules = Get-TransportRule
$rules | Export-Clixml -Path "C:\\Backup\\TransportRules_$(Get-Date -Format yyyyMMdd).xml"

# Remove an obsolete rule
Remove-TransportRule -Identity "Old Disclaimer" -Confirm:$false`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-shared-mailbox', 'm365-exchange-retention', 'm365-dlp-policy'],
    tags: ['exchange', 'mail-flow', 'transport-rules', 'disclaimer', 'encryption'],
  },

  // ─── 2. Set Up a Shared Mailbox ───────────────────────────────────────────
  {
    id: 'm365-shared-mailbox',
    title: 'Set Up a Shared Mailbox',
    description:
      'Create and configure a shared mailbox in Exchange Online for team collaboration. Covers mailbox creation, permission assignment, auto-replies, sent-item behavior, and Outlook profile setup.',
    category: 'm365-exchange',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    prerequisites: [
      'Exchange Online license',
      'Exchange Administrator or Global Administrator role',
    ],
    steps: [
      {
        title: 'Create the shared mailbox',
        description:
          'Create a new shared mailbox using the Microsoft 365 admin center or PowerShell. Shared mailboxes do not require a license as long as they stay under the 50 GB storage limit.',
        code: `# Connect to Exchange Online first
Connect-ExchangeOnline -UserPrincipalName admin@contoso.com

# Create the shared mailbox
New-Mailbox -Shared -Name "Sales Team" \`
  -DisplayName "Sales Team" \`
  -Alias salesteam \`
  -PrimarySmtpAddress salesteam@contoso.com`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Teams & groups > Shared mailboxes > + Add a shared mailbox',
        note: 'Shared mailboxes exceeding 50 GB require an Exchange Online Plan 2 license or an Exchange Online Archiving add-on.',
      },
      {
        title: 'Assign Full Access and Send As permissions',
        description:
          'Grant team members Full Access permission to read and manage the mailbox, and Send As permission to send emails that appear to come from the shared mailbox address.',
        code: `# Grant Full Access
Add-MailboxPermission -Identity salesteam@contoso.com \`
  -User "john@contoso.com" -AccessRights FullAccess -InheritanceType All

# Grant Send As
Add-RecipientPermission -Identity salesteam@contoso.com \`
  -Trustee "john@contoso.com" -AccessRights SendAs -Confirm:$false

# Bulk-add a group of users
$users = @("jane@contoso.com","mike@contoso.com","sarah@contoso.com")
foreach ($user in $users) {
  Add-MailboxPermission -Identity salesteam@contoso.com -User $user -AccessRights FullAccess -InheritanceType All
  Add-RecipientPermission -Identity salesteam@contoso.com -Trustee $user -AccessRights SendAs -Confirm:$false
}`,
        codeLanguage: 'powershell',
        warning: 'Full Access permission allows users to read all existing mail in the shared mailbox. Only grant this to authorized team members.',
      },
      {
        title: 'Configure sent items behavior',
        description:
          'By default, messages sent from a shared mailbox are saved only in the sender\'s Sent Items folder. Configure the mailbox to also store a copy in the shared mailbox Sent Items for team visibility.',
        code: `# Save sent items in the shared mailbox
Set-Mailbox salesteam@contoso.com \`
  -MessageCopyForSentAsEnabled $true \`
  -MessageCopyForSendOnBehalfEnabled $true`,
        codeLanguage: 'powershell',
        note: 'This setting ensures all team members can see the full conversation history in the shared mailbox.',
      },
      {
        title: 'Set up automatic replies',
        description:
          'Configure automatic replies (out-of-office messages) for the shared mailbox to acknowledge incoming messages and set response time expectations.',
        code: `# Enable automatic replies
Set-MailboxAutoReplyConfiguration -Identity salesteam@contoso.com \`
  -AutoReplyState Enabled \`
  -ExternalMessage "Thank you for contacting our sales team. We will respond within 24 business hours." \`
  -InternalMessage "Your message has been received by the Sales Team shared mailbox."`,
        codeLanguage: 'powershell',
        portalPath: 'Exchange admin center > Recipients > Mailboxes > salesteam > Manage mail flow settings > Automatic replies',
      },
      {
        title: 'Add the shared mailbox to Outlook',
        description:
          'Shared mailboxes with Full Access permissions auto-map to Outlook within 30-60 minutes. If auto-mapping is undesirable, disable it and add the mailbox manually as an additional account in Outlook.',
        code: `# Disable auto-mapping for a specific user
Add-MailboxPermission -Identity salesteam@contoso.com \`
  -User "john@contoso.com" -AccessRights FullAccess \`
  -AutoMapping $false`,
        codeLanguage: 'powershell',
        note: 'Auto-mapping only works with Outlook desktop. For Outlook on the web, users must manually open the shared mailbox via File > Open another mailbox.',
      },
      {
        title: 'Verify and audit the configuration',
        description:
          'Confirm permissions, test sending and receiving, and review the mailbox configuration. Set up an audit log to track who accesses the shared mailbox.',
        code: `# Verify permissions
Get-MailboxPermission -Identity salesteam@contoso.com |
  Where-Object { $_.User -ne "NT AUTHORITY\\SELF" } |
  Format-Table User, AccessRights -AutoSize

# Verify mailbox settings
Get-Mailbox salesteam@contoso.com | Format-List DisplayName, PrimarySmtpAddress, RecipientTypeDetails, ProhibitSendReceiveQuota`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-exchange-mailflow', 'm365-license-management'],
    tags: ['exchange', 'shared-mailbox', 'permissions', 'outlook'],
  },

  // ─── 3. Configure Retention Policies ──────────────────────────────────────
  {
    id: 'm365-exchange-retention',
    title: 'Configure Retention Policies',
    description:
      'Set up retention policies in Microsoft 365 to manage data lifecycle, including email retention, deletion schedules, and compliance hold. Covers both Microsoft Purview retention policies and Exchange Online retention tags.',
    category: 'm365-exchange',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: [
      'Microsoft 365 E3/E5 or Exchange Online Plan 2 license',
      'Compliance Administrator or Global Administrator role',
      'Exchange Online PowerShell module',
    ],
    steps: [
      {
        title: 'Plan your retention strategy',
        description:
          'Before creating policies, define your organization\'s data retention requirements. Identify which content types need retention (email, Teams messages, SharePoint documents), how long to retain them, and what should happen when the retention period expires (delete or keep).',
        note: 'Consult with your legal and compliance teams to ensure retention periods meet regulatory requirements (e.g., GDPR, HIPAA, SOX).',
      },
      {
        title: 'Create a Microsoft Purview retention policy',
        description:
          'Navigate to the Microsoft Purview compliance portal and create a new retention policy. Purview retention policies apply broadly across Microsoft 365 workloads and are the recommended approach for organization-wide retention.',
        portalPath: 'Microsoft Purview compliance portal > Data lifecycle management > Microsoft 365 > Retention policies > + New retention policy',
        warning: 'Retention policies can take up to 7 days to fully propagate across all mailboxes and sites. Do not assume immediate enforcement.',
      },
      {
        title: 'Configure Exchange Online retention scope',
        description:
          'Scope the retention policy to Exchange Online mailboxes. Choose whether to apply the policy to all mailboxes or specific users and groups. Set the retention period and the action at expiration.',
        code: `# Connect to Security & Compliance PowerShell
Connect-IPPSSession -UserPrincipalName admin@contoso.com

# Create a retention policy for Exchange
New-RetentionCompliancePolicy -Name "Email Retention - 3 Years" \`
  -ExchangeLocation All \`
  -Enabled $true

# Create a retention rule
New-RetentionComplianceRule -Policy "Email Retention - 3 Years" \`
  -RetentionDuration 1095 \`
  -RetentionComplianceAction KeepAndDelete \`
  -ExpirationDateOption ModificationAgeInDays`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create retention tags for granular control',
        description:
          'For more granular control, create Exchange Online retention tags. These allow users or administrators to apply specific retention settings to individual folders or messages using Messaging Records Management (MRM).',
        code: `# Create a default policy tag (applies to entire mailbox)
New-RetentionPolicyTag -Name "Default - 2 Year Delete" \`
  -Type All \`
  -RetentionAction DeleteAndAllowRecovery \`
  -AgeLimitForRetention 730 \`
  -RetentionEnabled $true

# Create a personal tag (users can apply manually)
New-RetentionPolicyTag -Name "Keep 5 Years" \`
  -Type Personal \`
  -RetentionAction DeleteAndAllowRecovery \`
  -AgeLimitForRetention 1825 \`
  -RetentionEnabled $true

# Create a tag for Deleted Items
New-RetentionPolicyTag -Name "Deleted Items - 30 Days" \`
  -Type DeletedItems \`
  -RetentionAction DeleteAndAllowRecovery \`
  -AgeLimitForRetention 30 \`
  -RetentionEnabled $true`,
        codeLanguage: 'powershell',
        note: 'Personal tags appear in Outlook and OWA, allowing users to override the default retention on individual items or folders.',
      },
      {
        title: 'Create and assign a retention policy with tags',
        description:
          'Bundle the retention tags into a retention policy and assign it to mailboxes. Each mailbox can have only one MRM retention policy assigned at a time.',
        code: `# Create a retention policy containing the tags
New-RetentionPolicy -Name "Standard Retention Policy" \`
  -RetentionPolicyTagLinks "Default - 2 Year Delete","Keep 5 Years","Deleted Items - 30 Days"

# Assign the policy to all mailboxes
Get-Mailbox -ResultSize Unlimited |
  Set-Mailbox -RetentionPolicy "Standard Retention Policy"`,
        codeLanguage: 'powershell',
        warning: 'Changing the retention policy on a mailbox triggers the Managed Folder Assistant to reprocess the mailbox, which can take up to 7 days.',
      },
      {
        title: 'Configure litigation hold for compliance',
        description:
          'Place mailboxes on litigation hold when you need to preserve all mailbox content for legal discovery, regardless of retention policies. Litigation hold prevents permanent deletion of items.',
        code: `# Enable litigation hold for a specific user
Set-Mailbox -Identity user@contoso.com \`
  -LitigationHoldEnabled $true \`
  -LitigationHoldDuration 365 \`
  -RetentionComment "Legal hold per case #2024-001" \`
  -RetentionUrl "https://intranet.contoso.com/legal/hold-policy"`,
        codeLanguage: 'powershell',
        portalPath: 'Exchange admin center > Recipients > Mailboxes > [User] > Others > Litigation hold',
        warning: 'Litigation hold preserves ALL data including deleted items. This can significantly increase mailbox storage. Monitor mailbox sizes regularly.',
      },
      {
        title: 'Start the Managed Folder Assistant',
        description:
          'The Managed Folder Assistant processes mailboxes and applies retention tags. By default it runs once every 7 days. You can manually trigger it for immediate processing during testing.',
        code: `# Trigger the Managed Folder Assistant for a single mailbox
Start-ManagedFolderAssistant -Identity user@contoso.com

# Trigger for all mailboxes (use with caution)
Get-Mailbox -ResultSize Unlimited |
  ForEach-Object { Start-ManagedFolderAssistant -Identity $_.Identity }`,
        codeLanguage: 'powershell',
        note: 'Running the Managed Folder Assistant on all mailboxes simultaneously can cause performance issues. For large tenants, process in batches.',
      },
      {
        title: 'Monitor and report on retention',
        description:
          'Generate reports on retention policy assignments, hold status, and mailbox sizes to ensure compliance. Use these reports for auditing and to verify that policies are applied correctly.',
        code: `# Report on retention policy assignments
Get-Mailbox -ResultSize Unlimited |
  Select-Object DisplayName, PrimarySmtpAddress, RetentionPolicy, LitigationHoldEnabled |
  Export-Csv -Path "C:\\Reports\\RetentionReport.csv" -NoTypeInformation

# Check mailbox sizes under hold
Get-MailboxStatistics -Identity user@contoso.com |
  Select-Object DisplayName, TotalItemSize, ItemCount, DeletedItemCount`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data lifecycle management > Reports',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-exchange-mailflow', 'm365-dlp-policy'],
    tags: ['exchange', 'retention', 'compliance', 'purview', 'litigation-hold'],
  },

  // ─── 4. Configure Teams Policies ──────────────────────────────────────────
  {
    id: 'm365-teams-policies',
    title: 'Configure Teams Policies',
    description:
      'Set up and manage Microsoft Teams policies to control messaging, meeting, app permissions, and calling features across your organization. Covers policy creation, assignment, and best practices for governance.',
    category: 'm365-teams',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: [
      'Microsoft Teams license',
      'Teams Administrator or Global Administrator role',
      'Microsoft Teams PowerShell module (MicrosoftTeams)',
    ],
    steps: [
      {
        title: 'Connect to Microsoft Teams PowerShell',
        description:
          'Install and connect to the Microsoft Teams PowerShell module. This is required for managing Teams policies at scale and for automating policy assignments.',
        code: `# Install the Teams PowerShell module
Install-Module -Name MicrosoftTeams -Force -Scope CurrentUser

# Connect to Teams
Connect-MicrosoftTeams`,
        codeLanguage: 'powershell',
        note: 'The MicrosoftTeams module replaces the deprecated Skype for Business Online Connector for all Teams management tasks.',
      },
      {
        title: 'Configure a messaging policy',
        description:
          'Create a messaging policy to control chat features such as message editing, deletion, read receipts, and the use of GIFs, memes, and stickers. Different policies can be applied to different user groups.',
        code: `# Create a restrictive messaging policy for regulated users
New-CsTeamsMessagingPolicy -Identity "Regulated-Users" \`
  -AllowUserEditMessage $true \`
  -AllowUserDeleteMessage $false \`
  -AllowUserChat $true \`
  -ReadReceiptsEnabledType UserPreference \`
  -AllowGiphy $false \`
  -AllowMemes $false \`
  -AllowStickers $false \`
  -AllowUrlPreviews $true \`
  -AllowUserTranslation $true`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Messaging policies > + Add',
      },
      {
        title: 'Configure a meeting policy',
        description:
          'Create meeting policies to control who can start meetings, recording permissions, lobby settings, and screen sharing capabilities. This is critical for securing meetings with external participants.',
        code: `# Create a meeting policy for all-hands meetings
New-CsTeamsMeetingPolicy -Identity "AllHands-Meetings" \`
  -AllowChannelMeetingScheduling $true \`
  -AllowMeetNow $true \`
  -AllowPrivateMeetNow $true \`
  -AutoAdmittedUsers EveryoneInCompanyExcludingGuests \`
  -AllowCloudRecording $true \`
  -AllowTranscription $true \`
  -DesignatedPresenterRoleMode EveryoneInCompanyUserOverride \`
  -ScreenSharingMode EntireScreen \`
  -AllowExternalParticipantGiveRequestControl $false`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Meetings > Meeting policies > + Add',
        warning: 'Setting AutoAdmittedUsers to "Everyone" allows anonymous users to join without waiting in the lobby. Use this only for public webinars.',
      },
      {
        title: 'Configure an app permission policy',
        description:
          'Control which third-party and custom apps users can install in Teams. Create allow lists or block lists to govern app availability organization-wide or for specific groups.',
        code: `# Create an app permission policy that blocks all third-party apps
New-CsTeamsAppPermissionPolicy -Identity "No-ThirdParty-Apps" \`
  -DefaultCatalogAppsType BlockedAppList \`
  -GlobalCatalogAppsType BlockedAppList \`
  -PrivateCatalogAppsType BlockedAppList

# Or allow only specific apps
New-CsTeamsAppPermissionPolicy -Identity "Approved-Apps-Only" \`
  -DefaultCatalogAppsType AllowedAppList \`
  -DefaultCatalogApps @(
    New-Object Microsoft.Teams.Policy.Administration.Cmdlets.Core.DefaultCatalogApp -Property @{Id="com.microsoft.teamspace.tab.planner"}
  )`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Teams apps > Permission policies > + Add',
      },
      {
        title: 'Configure a calling policy',
        description:
          'Set up calling policies to manage call forwarding, delegation, voicemail, and busy-on-busy settings for users with Teams Phone licenses.',
        code: `# Create a calling policy
New-CsTeamsCallingPolicy -Identity "Standard-Calling" \`
  -AllowPrivateCalling $true \`
  -AllowCallForwardingToPhone $true \`
  -AllowCallForwardingToUser $true \`
  -AllowVoicemail AlwaysEnabled \`
  -BusyOnBusyEnabledType Enabled \`
  -AllowCallGroups $true \`
  -AllowDelegation $true`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Calling policies > + Add',
        note: 'Calling policies only affect users with a Teams Phone license. Users without this license will not see calling features regardless of policy.',
      },
      {
        title: 'Create a live events policy',
        description:
          'Configure live events policies to control who can schedule live events, the maximum audience size, recording options, and whether attendees can ask questions during the event.',
        code: `# Create a live events policy
New-CsTeamsMeetingBroadcastPolicy -Identity "Company-LiveEvents" \`
  -AllowBroadcastScheduling $true \`
  -AllowBroadcastTranscription $true \`
  -BroadcastAttendeeVisibilityMode EveryoneInCompany \`
  -BroadcastRecordingMode AlwaysRecord`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Meetings > Live events policies > + Add',
      },
      {
        title: 'Assign policies to users and groups',
        description:
          'Assign the created policies to individual users, security groups, or set them as the organization-wide default. Group-based policy assignment is the recommended approach for large organizations.',
        code: `# Assign to an individual user
Grant-CsTeamsMessagingPolicy -Identity "john@contoso.com" -PolicyName "Regulated-Users"
Grant-CsTeamsMeetingPolicy -Identity "john@contoso.com" -PolicyName "AllHands-Meetings"

# Assign to a group (recommended)
New-CsGroupPolicyAssignment -GroupId "a]1b2c3d4-e5f6-7890-abcd-ef1234567890" \`
  -PolicyType TeamsMessagingPolicy \`
  -PolicyName "Regulated-Users" \`
  -Rank 1

# Set as global default
Set-CsTeamsMessagingPolicy -Identity Global -AllowGiphy $true -AllowMemes $true`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Users > [Select user] > Policies',
        note: 'Group policy assignments take up to 72 hours to propagate to all group members. Individual assignments take effect within a few hours.',
      },
      {
        title: 'Test and validate policy assignments',
        description:
          'Verify that policies are correctly assigned and effective. Use PowerShell to check the effective policy for a user, which accounts for direct assignments, group assignments, and the global default.',
        code: `# Check effective policies for a user
Get-CsUserPolicyAssignment -Identity "john@contoso.com"

# Check which messaging policy is effective
Get-CsOnlineUser -Identity "john@contoso.com" |
  Select-Object DisplayName, TeamsMessagingPolicy, TeamsMeetingPolicy, TeamsCallingPolicy`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Audit and document policy configuration',
        description:
          'Export all Teams policies and their assignments for documentation and compliance purposes. Regular audits help ensure policy consistency and identify policy drift.',
        code: `# Export all messaging policies
Get-CsTeamsMessagingPolicy | Export-Csv -Path "C:\\Reports\\TeamsMessagingPolicies.csv" -NoTypeInformation

# Export all policy assignments
Get-CsOnlineUser -ResultSize Unlimited |
  Select-Object DisplayName, UserPrincipalName, TeamsMessagingPolicy, TeamsMeetingPolicy, TeamsCallingPolicy |
  Export-Csv -Path "C:\\Reports\\TeamsPolicyAssignments.csv" -NoTypeInformation`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-teams-rooms', 'm365-teams-phone'],
    tags: ['teams', 'policies', 'messaging', 'meetings', 'governance'],
  },

  // ─── 5. Set Up Teams Rooms ────────────────────────────────────────────────
  {
    id: 'm365-teams-rooms',
    title: 'Set Up Teams Rooms',
    description:
      'Deploy and configure Microsoft Teams Rooms devices for conference rooms, including resource account creation, license assignment, device setup, peripheral configuration, and monitoring.',
    category: 'm365-teams',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    prerequisites: [
      'Microsoft Teams Rooms Basic or Pro license',
      'Teams Administrator and Exchange Administrator roles',
      'Teams Rooms certified hardware (Logitech, Poly, Yealink, etc.)',
      'Network connectivity with required firewall rules',
    ],
    steps: [
      {
        title: 'Create a resource account for the room',
        description:
          'Create a dedicated resource account in Microsoft 365 for the Teams Room. This account represents the physical room and manages its calendar. The account must be a Room mailbox type.',
        code: `# Connect to Exchange Online
Connect-ExchangeOnline -UserPrincipalName admin@contoso.com

# Create the room mailbox
New-Mailbox -Name "Conf Room 101" \`
  -Alias confroom101 \`
  -Room \`
  -EnableRoomMailboxAccount $true \`
  -MicrosoftOnlineServicesID confroom101@contoso.com \`
  -RoomMailboxPassword (ConvertTo-SecureString -String 'P@ssw0rd123!' -AsPlainText -Force)`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Resources > Rooms & equipment > + Add resource',
        warning: 'Use a strong, unique password for each room account. Store passwords in a secure vault as they are needed during device setup.',
      },
      {
        title: 'Configure the room mailbox settings',
        description:
          'Set calendar processing options to automatically accept meeting invitations, remove the subject for privacy, and configure the booking window. These settings ensure the room calendar stays accurate.',
        code: `# Configure calendar processing
Set-CalendarProcessing -Identity confroom101@contoso.com \`
  -AutomateProcessing AutoAccept \`
  -AddOrganizerToSubject $false \`
  -DeleteComments $false \`
  -DeleteSubject $false \`
  -ProcessExternalMeetingMessages $false \`
  -RemovePrivateProperty $false \`
  -AddAdditionalResponse $true \`
  -AdditionalResponse "This room is equipped with a Teams Room device for video conferencing."`,
        codeLanguage: 'powershell',
        note: 'Setting DeleteSubject to $false allows the room display panel to show meeting titles. Some organizations prefer $true for privacy.',
      },
      {
        title: 'Assign a Teams Rooms license',
        description:
          'Assign the appropriate Teams Rooms license to the resource account. Teams Rooms Basic is free for up to 25 rooms; Teams Rooms Pro provides advanced management and monitoring capabilities.',
        code: `# Connect to Microsoft Graph
Connect-MgGraph -Scopes "User.ReadWrite.All","Organization.Read.All"

# Get the license SKU ID
Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -like "*MEETING_ROOM*" } |
  Select-Object SkuId, SkuPartNumber

# Assign the license
Set-MgUserLicense -UserId confroom101@contoso.com \`
  -AddLicenses @(@{SkuId = "<Teams-Rooms-SKU-ID>"}) \`
  -RemoveLicenses @()`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Users > Active users > confroom101 > Licenses and apps',
      },
      {
        title: 'Configure password expiration policy',
        description:
          'Disable password expiration for the room account to prevent the device from losing connectivity when the password expires. Teams Rooms devices cannot handle password change prompts.',
        code: `# Disable password expiration via Microsoft Graph
Update-MgUser -UserId confroom101@contoso.com \`
  -PasswordPolicies DisablePasswordExpiration`,
        codeLanguage: 'powershell',
        warning: 'If your organization enforces password expiration via Conditional Access, you must create an exclusion for Teams Rooms accounts.',
      },
      {
        title: 'Configure Conditional Access exclusions',
        description:
          'Exclude Teams Rooms accounts from Conditional Access policies that require MFA or device compliance, as these devices cannot handle interactive prompts. Create a dedicated exclusion group for room accounts.',
        portalPath: 'Azure Active Directory admin center > Security > Conditional Access > [Policy] > Users > Exclude',
        note: 'Create a security group named "Teams Rooms Accounts" and add all room accounts. Use this group for exclusions across all relevant CA policies.',
      },
      {
        title: 'Set up the physical device',
        description:
          'Power on the Teams Rooms device and complete the initial setup wizard. Connect the device to the network, sign in with the resource account credentials, and pair peripherals (camera, microphone, speakers, display).',
        warning: 'Ensure the device firmware is up to date before signing in. Outdated firmware can cause connectivity or feature issues.',
      },
      {
        title: 'Configure room peripherals',
        description:
          'In the Teams Rooms device settings, configure the connected peripherals. Set the default camera, microphone, and speaker. Enable intelligent speaker features if supported by the hardware for speaker attribution in transcripts.',
        portalPath: 'Teams Rooms device > Settings (gear icon) > Peripherals',
        note: 'Use Teams Rooms certified peripherals to ensure full compatibility. Non-certified devices may work but are not supported by Microsoft.',
      },
      {
        title: 'Configure proximity join and Bluetooth beaconing',
        description:
          'Enable Bluetooth beaconing so that users in the room can discover the Teams Room device and join meetings directly from their laptop or mobile device with one click.',
        portalPath: 'Teams Rooms device > Settings > Meetings > Bluetooth beaconing',
      },
      {
        title: 'Set up Teams Rooms Pro Management',
        description:
          'If using Teams Rooms Pro licenses, configure the Teams Rooms Pro Management portal for remote monitoring, alerting, and device management across all your rooms.',
        portalPath: 'Teams Rooms Pro Management portal > Rooms > + Enroll room',
        note: 'Teams Rooms Pro Management provides automated incident detection, update management, and detailed analytics dashboards.',
      },
      {
        title: 'Test the room setup',
        description:
          'Schedule a test meeting from Outlook, join the meeting on the room device, and verify audio, video, screen sharing, and whiteboarding functionality. Test proximity join from a laptop in the room.',
        code: `# Verify the room account status
Get-CsOnlineUser -Identity confroom101@contoso.com |
  Select-Object DisplayName, SipAddress, TeamsUpgradeEffectiveMode, AccountEnabled`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Document the room configuration',
        description:
          'Record the room setup details including hardware model, firmware version, peripheral list, network configuration, and account credentials (stored securely). This documentation is essential for troubleshooting and future deployments.',
        code: `# Export room information
Get-Mailbox confroom101@contoso.com |
  Select-Object DisplayName, PrimarySmtpAddress, RoomCapacity, ResourceCustom |
  Export-Csv -Path "C:\\Reports\\RoomConfig_ConfRoom101.csv" -NoTypeInformation`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-teams-policies', 'm365-teams-phone', 'm365-license-management'],
    tags: ['teams', 'teams-rooms', 'conference-room', 'video-conferencing', 'hardware'],
  },

  // ─── 6. Configure Teams Phone System ──────────────────────────────────────
  {
    id: 'm365-teams-phone',
    title: 'Configure Teams Phone System',
    description:
      'Set up Microsoft Teams Phone System with Calling Plans or Direct Routing. Covers license assignment, number acquisition, dial plans, auto attendants, call queues, voicemail, and emergency calling configuration.',
    category: 'm365-teams',
    difficulty: 'advanced',
    estimatedMinutes: 60,
    prerequisites: [
      'Microsoft Teams Phone license (standalone or as part of E5)',
      'Calling Plan license or SBC for Direct Routing',
      'Teams Administrator and Global Administrator roles',
      'Emergency address registered with Microsoft',
    ],
    steps: [
      {
        title: 'Plan your telephony deployment',
        description:
          'Decide between Microsoft Calling Plans (cloud-based PSTN) and Direct Routing (bring your own SBC/carrier). Calling Plans are simpler to deploy but available in fewer countries. Direct Routing offers carrier flexibility but requires an on-premises or cloud SBC.',
        note: 'For organizations with existing telephony contracts or in countries without Calling Plan availability, Direct Routing is the recommended approach. Operator Connect is a hybrid option managed by certified carriers.',
      },
      {
        title: 'Assign Teams Phone licenses',
        description:
          'Assign Microsoft Teams Phone System licenses to all users who need PSTN calling. If using Calling Plans, also assign a Domestic or International Calling Plan license.',
        code: `# Connect to Microsoft Graph
Connect-MgGraph -Scopes "User.ReadWrite.All","Organization.Read.All"

# Get available license SKUs
Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -like "*MCOEV*" -or $_.SkuPartNumber -like "*MCOPSTN*" } |
  Select-Object SkuPartNumber, SkuId, ConsumedUnits,
    @{N="Available";E={$_.PrepaidUnits.Enabled - $_.ConsumedUnits}}

# Assign Phone System + Calling Plan
$phoneLicense = Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "MCOEV" }
$callingPlan = Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "MCOPSTN1" }

Set-MgUserLicense -UserId "john@contoso.com" \`
  -AddLicenses @(
    @{SkuId = $phoneLicense.SkuId},
    @{SkuId = $callingPlan.SkuId}
  ) \`
  -RemoveLicenses @()`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Users > Active users > [User] > Licenses and apps',
      },
      {
        title: 'Acquire phone numbers',
        description:
          'Obtain phone numbers from Microsoft (for Calling Plans) or port existing numbers from your current carrier. For Direct Routing, phone numbers are managed by your SBC/carrier.',
        code: `# Connect to Teams
Connect-MicrosoftTeams

# Search for available numbers
Search-CsPhoneNumberAssignment -TelephoneNumberType DirectRouting \`
  -AreaCode "206" -Quantity 10

# Or acquire from Microsoft (Calling Plans)
New-CsOnlineTelephoneNumberOrder -CivicAddressId "<address-id>" \`
  -NumberType UserSubscriber -Quantity 10`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Phone numbers > + Add',
        warning: 'Number porting can take 2-4 weeks. Plan your migration timeline accordingly and maintain your existing phone service until porting is complete.',
      },
      {
        title: 'Assign phone numbers to users',
        description:
          'Assign the acquired phone numbers to licensed users. Each user can have one phone number assigned. The number becomes the user\'s direct inward dial (DID) number.',
        code: `# Assign a phone number to a user
Set-CsPhoneNumberAssignment -Identity "john@contoso.com" \`
  -PhoneNumber "+12065551234" \`
  -PhoneNumberType DirectRouting

# Verify the assignment
Get-CsOnlineUser -Identity "john@contoso.com" |
  Select-Object DisplayName, LineUri, EnterpriseVoiceEnabled`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Users > [User] > Account > Phone number',
      },
      {
        title: 'Configure a dial plan',
        description:
          'Create a dial plan to normalize dialed numbers. Dial plans translate short extensions or local dialing patterns into full E.164 numbers for call routing.',
        code: `# Create a tenant dial plan
New-CsTenantDialPlan -Identity "US-Seattle" \`
  -Description "Dial plan for Seattle office"

# Add a normalization rule for 4-digit extensions
New-CsVoiceNormalizationRule -Identity "US-Seattle/4DigitExtension" \`
  -Pattern '^(\\d{4})$' \`
  -Translation '+1206555$1' \`
  -Description "Translate 4-digit extensions to full DID"

# Add a rule for local 10-digit dialing
New-CsVoiceNormalizationRule -Identity "US-Seattle/10Digit" \`
  -Pattern '^(\\d{10})$' \`
  -Translation '+1$1' \`
  -Description "Add +1 to 10-digit numbers"`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Dial plan > + Add',
      },
      {
        title: 'Set up an auto attendant',
        description:
          'Create an auto attendant to greet callers and route them to the correct department or person. Configure business hours, after-hours greetings, and menu options.',
        code: `# Create a resource account for the auto attendant
New-CsOnlineApplicationInstance \`
  -UserPrincipalName mainline-aa@contoso.com \`
  -DisplayName "Contoso Main Line" \`
  -ApplicationId "ce933385-9390-45d1-9512-c8d228074e07"

# Assign a phone number
Set-CsPhoneNumberAssignment -Identity mainline-aa@contoso.com \`
  -PhoneNumber "+12065550100" \`
  -PhoneNumberType DirectRouting`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Auto attendants > + Add',
        note: 'The Application ID ce933385-9390-45d1-9512-c8d228074e07 is the fixed ID for auto attendants. Use 11cd3e2e-fccb-42ad-ad00-878b93575e07 for call queues.',
      },
      {
        title: 'Set up a call queue',
        description:
          'Create a call queue to distribute incoming calls among a group of agents. Configure the routing method, wait music, timeout actions, and overflow handling.',
        code: `# Create a resource account for the call queue
New-CsOnlineApplicationInstance \`
  -UserPrincipalName support-cq@contoso.com \`
  -DisplayName "Support Queue" \`
  -ApplicationId "11cd3e2e-fccb-42ad-ad00-878b93575e07"

# Assign a Virtual User license to the resource account
# Then configure the call queue in the Teams admin center`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Call queues > + Add',
      },
      {
        title: 'Configure voicemail policies',
        description:
          'Set up voicemail policies to control transcription, greeting length, and voicemail deposit rules for your organization.',
        code: `# Create a voicemail policy
New-CsOnlineVoicemailPolicy -Identity "Standard-Voicemail" \`
  -EnableTranscription $true \`
  -EnableTranscriptionProfanityMasking $true \`
  -MaximumRecordingLength (New-TimeSpan -Minutes 5) \`
  -EnableEditingCallAnswerRulesSetting $true

# Assign the policy
Grant-CsOnlineVoicemailPolicy -Identity "john@contoso.com" \`
  -PolicyName "Standard-Voicemail"`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Voice > Voicemail policies',
      },
      {
        title: 'Configure emergency calling',
        description:
          'Set up emergency calling addresses and policies. This is a regulatory requirement in most countries. Configure dynamic emergency calling to automatically determine caller location based on network information.',
        code: `# Create an emergency calling policy
New-CsTeamsEmergencyCallingPolicy -Identity "US-Emergency" \`
  -Description "Emergency policy for US users" \`
  -NotificationGroup "security@contoso.com" \`
  -NotificationMode ConferenceMuted \`
  -ExternalLocationLookupMode Enabled

# Assign the policy
Grant-CsTeamsEmergencyCallingPolicy -Identity "john@contoso.com" \`
  -PolicyName "US-Emergency"`,
        codeLanguage: 'powershell',
        portalPath: 'Teams admin center > Locations > Emergency policies',
        warning: 'Emergency calling configuration is a legal requirement. Incorrect setup can result in failed emergency calls and regulatory penalties. Test thoroughly and verify with your local emergency services provider.',
      },
      {
        title: 'Configure Direct Routing (if applicable)',
        description:
          'If using Direct Routing, configure the SBC connection and voice routing policies. The SBC must have a public certificate and be accessible from Microsoft 365.',
        code: `# Add the SBC to Teams
New-CsOnlinePSTNGateway -Fqdn sbc.contoso.com \`
  -SipSignalingPort 5061 \`
  -MaxConcurrentSessions 100 \`
  -Enabled $true \`
  -MediaBypass $true

# Create a voice route
New-CsOnlineVoiceRoute -Identity "US-Route" \`
  -NumberPattern '^\\+1(\\d{10})$' \`
  -OnlinePstnGatewayList sbc.contoso.com \`
  -Priority 1 \`
  -OnlinePstnUsages "US-Usage"

# Create a voice routing policy
New-CsOnlineVoiceRoutingPolicy -Identity "US-Routing" \`
  -OnlinePstnUsages "US-Usage"

# Assign to a user
Grant-CsOnlineVoiceRoutingPolicy -Identity "john@contoso.com" \`
  -PolicyName "US-Routing"`,
        codeLanguage: 'powershell',
        note: 'Ensure your SBC supports TLS 1.2 and has a certificate from a trusted CA. Self-signed certificates are not supported for Direct Routing.',
      },
      {
        title: 'Test and validate the phone system',
        description:
          'Perform end-to-end testing of inbound and outbound calls, auto attendant navigation, call queue distribution, voicemail, and emergency calling. Document test results for compliance.',
        code: `# Check user voice configuration
Get-CsOnlineUser -Identity "john@contoso.com" |
  Select-Object DisplayName, LineUri, EnterpriseVoiceEnabled,
    OnlineVoiceRoutingPolicy, TenantDialPlan,
    TeamsCallingPolicy, TeamsEmergencyCallingPolicy

# Test SBC connectivity (Direct Routing)
Get-CsOnlinePSTNGateway | Select-Object Fqdn, Enabled, MediaBypass,
  SipSignalingPort, FailedMediaNegotiationIpAddress`,
        codeLanguage: 'powershell',
        warning: 'Always test emergency calling in coordination with your SBC provider and local emergency services. Do not place test 911/112 calls without prior arrangement.',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-teams-policies', 'm365-teams-rooms'],
    tags: ['teams', 'phone-system', 'calling-plans', 'direct-routing', 'auto-attendant', 'call-queue'],
  },

  // ─── 7. Create and Manage a SharePoint Site ───────────────────────────────
  {
    id: 'm365-sharepoint-site',
    title: 'Create and Manage a SharePoint Site',
    description:
      'Create a SharePoint Online site collection, configure navigation, set permissions, enable versioning, and customize the site for team collaboration or publishing.',
    category: 'm365-sharepoint',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    prerequisites: [
      'SharePoint Online license',
      'SharePoint Administrator or Global Administrator role',
      'PnP PowerShell module (optional, for advanced management)',
    ],
    steps: [
      {
        title: 'Create a new SharePoint site',
        description:
          'Create a new team site or communication site from the SharePoint admin center or using PowerShell. Team sites are connected to Microsoft 365 Groups; communication sites are standalone and designed for broadcasting information.',
        code: `# Install PnP PowerShell module
Install-Module -Name PnP.PowerShell -Force -Scope CurrentUser

# Connect to SharePoint Online
Connect-PnPOnline -Url "https://contoso-admin.sharepoint.com" -Interactive

# Create a communication site
New-PnPSite -Type CommunicationSite \`
  -Title "Marketing Portal" \`
  -Url "https://contoso.sharepoint.com/sites/marketing" \`
  -Description "Marketing team public portal" \`
  -SiteDesign Showcase`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint admin center > Sites > Active sites > + Create',
        note: 'Team sites automatically create an associated Microsoft 365 Group, Teams team, and shared mailbox. Communication sites do not.',
      },
      {
        title: 'Configure site permissions',
        description:
          'Set up the permission structure for the site. SharePoint uses a hierarchy of site owners, members, and visitors. Break permission inheritance on libraries or folders when different access levels are needed.',
        code: `# Connect to the new site
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/marketing" -Interactive

# Add a site collection administrator
Set-PnPSite -Identity "https://contoso.sharepoint.com/sites/marketing" \`
  -Owners "admin@contoso.com"

# Add members to the default Members group
Add-PnPGroupMember -Group "Marketing Portal Members" \`
  -EmailAddress "marketingteam@contoso.com"

# Add visitors for read-only access
Add-PnPGroupMember -Group "Marketing Portal Visitors" \`
  -EmailAddress "allstaff@contoso.com"`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint site > Settings (gear icon) > Site permissions',
        warning: 'Avoid breaking permission inheritance unless absolutely necessary. It makes permission management complex and can lead to security gaps.',
      },
      {
        title: 'Enable versioning and content approval',
        description:
          'Enable version history on document libraries to track changes and allow rollback. Configure content approval if documents must be reviewed before being visible to all site members.',
        code: `# Enable versioning on the default document library
Set-PnPList -Identity "Documents" \`
  -EnableVersioning $true \`
  -MajorVersions 50 \`
  -EnableMinorVersions $true \`
  -MinorVersions 10

# Enable content approval
Set-PnPList -Identity "Documents" -EnableModeration $true`,
        codeLanguage: 'powershell',
        note: 'Major versions (1.0, 2.0) are visible to all users. Minor versions (1.1, 1.2) are only visible to editors until published as a major version.',
      },
      {
        title: 'Configure site navigation',
        description:
          'Customize the site navigation to help users find content. Configure the top navigation bar for main sections and the quick launch (left navigation) for frequently used libraries and pages.',
        code: `# Add a navigation node to the top navigation
Add-PnPNavigationNode -Location TopNavigationBar \`
  -Title "Resources" \`
  -Url "https://contoso.sharepoint.com/sites/marketing/SitePages/Resources.aspx"

# Add a node to the quick launch
Add-PnPNavigationNode -Location QuickLaunch \`
  -Title "Brand Assets" \`
  -Url "https://contoso.sharepoint.com/sites/marketing/BrandAssets"`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint site > Settings > Navigation',
      },
      {
        title: 'Create document libraries and lists',
        description:
          'Create additional document libraries for organizing content by topic or department. Add custom columns to libraries and lists for metadata tagging and filtering.',
        code: `# Create a new document library
New-PnPList -Title "Brand Assets" -Template DocumentLibrary \`
  -Url "BrandAssets" -EnableVersioning

# Add a custom column
Add-PnPField -List "Brand Assets" \`
  -DisplayName "Asset Type" \`
  -InternalName "AssetType" \`
  -Type Choice \`
  -Choices "Logo","Template","Photo","Video"

# Create a list for tracking
New-PnPList -Title "Campaign Tracker" -Template GenericList
Add-PnPField -List "Campaign Tracker" -DisplayName "Status" \`
  -InternalName "Status" -Type Choice \`
  -Choices "Planning","Active","Completed","Archived"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Apply a site design and branding',
        description:
          'Apply a site design to standardize the look and feel across your organization. Configure the site logo, theme colors, and header layout for brand consistency.',
        code: `# Set the site logo
Set-PnPSite -LogoFilePath "C:\\Branding\\logo.png"

# Apply a custom theme
$theme = @{
  "themePrimary" = "#0078d4"
  "themeLighterAlt" = "#eff6fc"
  "themeLighter" = "#deecf9"
  "themeLight" = "#c7e0f4"
}
Add-PnPTenantTheme -Identity "Contoso Brand" -Palette $theme -IsInverted $false

# Apply the theme to the site
Set-PnPWebTheme -Theme "Contoso Brand"`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint site > Settings > Change the look',
      },
      {
        title: 'Verify and test the site',
        description:
          'Test the site by uploading documents, checking permissions with different user accounts, verifying navigation links, and confirming that versioning and content approval work as expected.',
        code: `# Get site configuration summary
Get-PnPSite | Select-Object Url, Owner, Template, StorageQuota
Get-PnPList | Select-Object Title, ItemCount, EnableVersioning, EnableModeration |
  Format-Table -AutoSize

# Test upload
Add-PnPFile -Path "C:\\Test\\testfile.docx" -Folder "Documents"`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-onedrive-policies', 'm365-dlp-policy'],
    tags: ['sharepoint', 'site-collection', 'permissions', 'versioning', 'branding'],
  },

  // ─── 8. Configure OneDrive Sync Policies ──────────────────────────────────
  {
    id: 'm365-onedrive-policies',
    title: 'Configure OneDrive Sync Policies',
    description:
      'Set up OneDrive for Business sync policies using Group Policy, Intune, and the SharePoint admin center. Covers sync client configuration, Known Folder Move, storage limits, sharing restrictions, and file-on-demand settings.',
    category: 'm365-sharepoint',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'OneDrive for Business license (included with Microsoft 365)',
      'SharePoint Administrator or Global Administrator role',
      'Group Policy management tools or Microsoft Intune for client settings',
    ],
    steps: [
      {
        title: 'Configure tenant-level OneDrive settings',
        description:
          'Set global OneDrive policies in the SharePoint admin center. Configure default storage limits, sharing defaults, and sync restrictions that apply to all users.',
        code: `# Connect to SharePoint Online
Connect-PnPOnline -Url "https://contoso-admin.sharepoint.com" -Interactive

# Set default storage limit for all users (in MB)
Set-PnPTenant -OneDriveStorageQuota 1048576  # 1 TB

# Restrict external sharing to existing guests only
Set-PnPTenant -OneDriveSharingCapability ExistingExternalUserSharingOnly`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint admin center > Settings > OneDrive > Storage limit',
      },
      {
        title: 'Configure sharing policies',
        description:
          'Set sharing restrictions to control how users share OneDrive files externally. Configure link types, expiration dates, and whether users can share with anyone or only with authenticated guests.',
        code: `# Configure sharing settings
Set-PnPTenant \`
  -DefaultSharingLinkType Internal \`
  -DefaultLinkPermission View \`
  -RequireAnonymousLinksExpireInDays 30 \`
  -FileAnonymousLinkType View \`
  -FolderAnonymousLinkType View \`
  -PreventExternalUsersFromResharing $true`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint admin center > Policies > Sharing',
        warning: 'Changing sharing policies affects all existing shared links. Review current sharing activity before making restrictive changes to avoid breaking active collaborations.',
      },
      {
        title: 'Enable Known Folder Move (KFM)',
        description:
          'Configure Known Folder Move to automatically redirect Desktop, Documents, and Pictures folders to OneDrive. This provides automatic backup and enables roaming between devices.',
        code: `# Using Intune configuration profile (Settings Catalog)
# Policy: OneDrive > Silently move Windows known folders to OneDrive
# Tenant ID: <your-tenant-id>

# Or via Group Policy (ADMX):
# Computer Configuration > Administrative Templates > OneDrive
# "Silently move Windows known folders to OneDrive" = Enabled
# Tenant ID = <your-tenant-id>

# PowerShell to verify KFM status
Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\OneDrive\\Accounts\\Business1" |
  Select-Object KfmFoldersProtectedNow, KfmSilentOptIn`,
        codeLanguage: 'powershell',
        note: 'KFM silently redirects folders without user interaction. Users who have files in these folders will see them sync to OneDrive automatically. Test with a pilot group first.',
      },
      {
        title: 'Configure Files On-Demand',
        description:
          'Enable Files On-Demand to save local disk space. Files appear in File Explorer but are downloaded only when opened. This is especially important for devices with limited storage.',
        code: `# Enable Files On-Demand via Group Policy or Intune
# Computer Configuration > Administrative Templates > OneDrive
# "Use OneDrive Files On-Demand" = Enabled

# Or set via registry
# HKLM\\SOFTWARE\\Policies\\Microsoft\\OneDrive
# FilesOnDemandEnabled = 1

# Verify status via PowerShell
Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\OneDrive" -Name FilesOnDemandEnabled -ErrorAction SilentlyContinue`,
        codeLanguage: 'powershell',
        note: 'Files On-Demand requires Windows 10 1709 or later. On macOS, it requires macOS 12.1 or later with the standalone OneDrive app.',
      },
      {
        title: 'Restrict sync to managed devices',
        description:
          'Prevent users from syncing OneDrive to unmanaged personal devices. This ensures corporate data is only available on compliant, IT-managed devices.',
        code: `# Allow sync only from domain-joined devices
Set-PnPTenant -IsUnmanagedSyncClientForTenantRestricted $true

# Specify allowed domains (Azure AD tenant IDs)
Set-PnPTenant -AllowedDomainListForSyncClient @("<tenant-id-1>","<tenant-id-2>")

# Block sync for specific file types
Set-PnPTenant -ExcludedFileExtensionsForSyncClient @("pst","exe","msi","iso")`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint admin center > Settings > OneDrive > Sync',
        warning: 'Restricting sync to managed devices will immediately stop sync on any unmanaged device. Warn users before enabling this setting.',
      },
      {
        title: 'Configure bandwidth throttling',
        description:
          'Set upload and download bandwidth limits for the OneDrive sync client to prevent network saturation, especially during initial KFM rollout or in bandwidth-constrained locations.',
        code: `# Via Group Policy or Intune:
# Computer Configuration > Administrative Templates > OneDrive
# "Limit the sync client upload rate to a percentage of throughput" = 50
# "Limit the sync client download speed to a fixed rate" = 10000 (KB/s)

# Enable automatic bandwidth management (recommended)
# "Enable automatic upload bandwidth management for OneDrive" = Enabled`,
        codeLanguage: 'powershell',
        note: 'Automatic bandwidth management uses LEDBAT protocol to detect available bandwidth and adjusts dynamically. This is preferred over fixed limits in most scenarios.',
      },
      {
        title: 'Set up OneDrive retention and compliance',
        description:
          'Configure retention policies for OneDrive files after user account deletion. By default, deleted user OneDrive content is retained for 30 days but can be extended up to 10 years.',
        code: `# Set retention period for deleted user OneDrive (in days)
Set-PnPTenant -OrphanedPersonalSitesRetentionPeriod 365

# Assign a secondary administrator for user OneDrive
Set-PnPTenantSite -Url "https://contoso-my.sharepoint.com/personal/john_contoso_com" \`
  -Owners "manager@contoso.com"`,
        codeLanguage: 'powershell',
        portalPath: 'SharePoint admin center > Settings > OneDrive > Retention',
      },
      {
        title: 'Monitor and report on OneDrive usage',
        description:
          'Use the Microsoft 365 admin center reports and PowerShell to monitor OneDrive adoption, storage usage, sync status, and sharing activity across your organization.',
        code: `# Get OneDrive usage report via Microsoft Graph
Connect-MgGraph -Scopes "Reports.Read.All"
Get-MgReportOneDriveUsageAccountDetail -Period D30 -OutFile "C:\\Reports\\OneDriveUsage.csv"

# Check individual user storage
Get-PnPTenantSite -IncludeOneDriveSites -Filter "Url -like '-my.sharepoint.com/personal/'" |
  Select-Object Url, Owner, StorageUsageCurrent, StorageQuota |
  Sort-Object StorageUsageCurrent -Descending |
  Select-Object -First 20`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Reports > Usage > OneDrive',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-sharepoint-site', 'm365-dlp-policy'],
    tags: ['onedrive', 'sync', 'known-folder-move', 'files-on-demand', 'sharing'],
  },

  // ─── 9. Automate License Assignment ───────────────────────────────────────
  {
    id: 'm365-license-management',
    title: 'Automate License Assignment',
    description:
      'Automate Microsoft 365 license assignment using Azure AD group-based licensing, Microsoft Graph PowerShell, and monitoring scripts. Covers license inventory, group-based assignment, service plan customization, and error handling.',
    category: 'm365-exchange',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'Azure AD Premium P1 or P2 license (for group-based licensing)',
      'Global Administrator or License Administrator role',
      'Microsoft Graph PowerShell module',
    ],
    steps: [
      {
        title: 'Review current license inventory',
        description:
          'Start by auditing your current license assignments and availability. Understand which SKUs are in use, how many are consumed, and how many are available for assignment.',
        code: `# Connect to Microsoft Graph
Connect-MgGraph -Scopes "Organization.Read.All","User.Read.All","Directory.Read.All"

# Get license summary
Get-MgSubscribedSku | Select-Object SkuPartNumber,
  @{N="Total";E={$_.PrepaidUnits.Enabled}},
  ConsumedUnits,
  @{N="Available";E={$_.PrepaidUnits.Enabled - $_.ConsumedUnits}} |
  Format-Table -AutoSize`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft 365 admin center > Billing > Licenses',
        note: 'Run this audit monthly to identify unused licenses that can be reclaimed or reallocated.',
      },
      {
        title: 'Set up group-based licensing',
        description:
          'Create Azure AD security groups for each license type. When users are added to these groups, licenses are automatically assigned. When removed, licenses are automatically reclaimed.',
        portalPath: 'Azure Active Directory admin center > Groups > + New group > Licenses',
        code: `# Create a security group for E3 licenses
New-MgGroup -DisplayName "License - Microsoft 365 E3" \`
  -Description "Members receive an M365 E3 license automatically" \`
  -MailEnabled:$false \`
  -MailNickname "lic-m365-e3" \`
  -SecurityEnabled:$true

# Get the group and SKU IDs
$group = Get-MgGroup -Filter "displayName eq 'License - Microsoft 365 E3'"
$sku = Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "SPE_E3" }`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Assign licenses to groups with service plan customization',
        description:
          'Assign license SKUs to groups and optionally disable specific service plans. For example, assign an E3 license but disable Yammer or Sway if those services are not needed.',
        code: `# Assign E3 license to the group with some services disabled
$disabledPlans = @(
  (Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "SPE_E3" }).ServicePlans |
    Where-Object { $_.ServicePlanName -in @("YAMMER_ENTERPRISE","SWAY") } |
    Select-Object -ExpandProperty ServicePlanId
)

Set-MgGroupLicense -GroupId $group.Id \`
  -AddLicenses @(@{
    SkuId = $sku.SkuId
    DisabledPlans = $disabledPlans
  }) \`
  -RemoveLicenses @()`,
        codeLanguage: 'powershell',
        note: 'Disabled service plans can be re-enabled later without removing and reassigning the license. This is useful for phased service rollouts.',
      },
      {
        title: 'Create dynamic group rules for automatic membership',
        description:
          'Use dynamic membership rules to automatically add users to license groups based on attributes like department, job title, or location. This fully automates the license lifecycle.',
        code: `# Create a dynamic group for all full-time employees
New-MgGroup -DisplayName "License - Auto E3 (Full Time)" \`
  -Description "Auto-assigns E3 to full-time employees" \`
  -MailEnabled:$false \`
  -MailNickname "lic-auto-e3-ft" \`
  -SecurityEnabled:$true \`
  -GroupTypes @("DynamicMembership") \`
  -MembershipRule '(user.employeeType -eq "FullTime") and (user.accountEnabled -eq true)' \`
  -MembershipRuleProcessingState "On"`,
        codeLanguage: 'powershell',
        warning: 'Test dynamic group rules with a small scope first. An incorrect rule could assign licenses to all users in your tenant, consuming your entire license pool.',
      },
      {
        title: 'Handle license assignment errors',
        description:
          'Monitor group-based licensing for errors. Common issues include insufficient licenses, conflicting service plans, and usage location not set. Create a script to detect and report these errors.',
        code: `# Check for license assignment errors
$groups = Get-MgGroup -Filter "assignedLicenses/any()" -Property Id,DisplayName,AssignedLicenses

foreach ($g in $groups) {
  $errors = Get-MgGroupMemberWithLicenseError -GroupId $g.Id
  if ($errors) {
    Write-Warning "Group '$($g.DisplayName)' has $($errors.Count) license errors"
    foreach ($err in $errors) {
      $user = Get-MgUser -UserId $err.Id
      Write-Host "  User: $($user.DisplayName) - $($user.UserPrincipalName)"
    }
  }
}`,
        codeLanguage: 'powershell',
        note: 'The most common error is missing UsageLocation. Set this attribute on all users before assigning licenses.',
      },
      {
        title: 'Bulk-set usage location for users',
        description:
          'Usage location is required for license assignment. Create a script to set usage location for all users who are missing it, based on their office location or a default country code.',
        code: `# Find users without a usage location
$usersNoLocation = Get-MgUser -All -Filter "usageLocation eq null" -Property Id,DisplayName,UsageLocation

# Set usage location for all users to US (or your default)
foreach ($user in $usersNoLocation) {
  Update-MgUser -UserId $user.Id -UsageLocation "US"
  Write-Host "Set UsageLocation for $($user.DisplayName) to US"
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Monitor and report on license usage',
        description:
          'Create automated reports to track license consumption, identify unused licenses, and forecast future needs. Schedule these reports to run weekly or monthly.',
        code: `# Generate a comprehensive license report
$report = Get-MgUser -All -Property DisplayName, UserPrincipalName, AssignedLicenses, AccountEnabled |
  ForEach-Object {
    $licenses = $_.AssignedLicenses | ForEach-Object {
      $skuId = $_.SkuId
      (Get-MgSubscribedSku | Where-Object { $_.SkuId -eq $skuId }).SkuPartNumber
    }
    [PSCustomObject]@{
      DisplayName = $_.DisplayName
      UPN = $_.UserPrincipalName
      Enabled = $_.AccountEnabled
      Licenses = ($licenses -join "; ")
    }
  }

$report | Export-Csv -Path "C:\\Reports\\LicenseReport_$(Get-Date -Format yyyyMMdd).csv" -NoTypeInformation

# Count users per license type
$report | Where-Object { $_.Licenses -ne "" } |
  ForEach-Object { $_.Licenses -split "; " } |
  Group-Object | Select-Object Count, Name | Sort-Object Count -Descending`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-shared-mailbox', 'm365-teams-rooms'],
    tags: ['licensing', 'automation', 'group-based-licensing', 'microsoft-graph', 'azure-ad'],
  },

  // ─── 10. Create a DLP Policy ──────────────────────────────────────────────
  {
    id: 'm365-dlp-policy',
    title: 'Create a DLP Policy',
    description:
      'Configure Data Loss Prevention (DLP) policies in Microsoft Purview to detect and protect sensitive information across Exchange, SharePoint, OneDrive, and Teams. Covers policy creation, sensitive information types, custom rules, and incident management.',
    category: 'm365-exchange',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: [
      'Microsoft 365 E3/E5 or Microsoft Purview Information Protection license',
      'Compliance Administrator or Global Administrator role',
      'Security & Compliance PowerShell module',
    ],
    steps: [
      {
        title: 'Plan your DLP strategy',
        description:
          'Identify the types of sensitive information your organization handles (credit card numbers, social security numbers, health records, financial data) and determine which locations need protection. Map regulatory requirements (GDPR, HIPAA, PCI-DSS) to specific sensitive information types.',
        note: 'Start with a test policy in simulation mode before enforcing. This lets you measure false positive rates and adjust rules without impacting users.',
      },
      {
        title: 'Connect to Security & Compliance PowerShell',
        description:
          'Connect to the Security & Compliance Center PowerShell to manage DLP policies programmatically. This provides full access to DLP cmdlets not available in the GUI.',
        code: `# Connect to Security & Compliance PowerShell
Connect-IPPSSession -UserPrincipalName admin@contoso.com`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Review built-in sensitive information types',
        description:
          'Microsoft 365 includes over 300 built-in sensitive information types (SITs). Review the available types to find ones that match your data classification requirements before creating custom types.',
        code: `# List all available sensitive information types
Get-DlpSensitiveInformationType | Select-Object Name, Publisher |
  Sort-Object Name | Format-Table -AutoSize

# Get details about a specific SIT
Get-DlpSensitiveInformationType -Identity "Credit Card Number" |
  Select-Object Name, Description, Publisher, ClassificationMethod`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data classification > Sensitive info types',
      },
      {
        title: 'Create a custom sensitive information type (optional)',
        description:
          'If built-in types do not cover your needs, create a custom sensitive information type using regular expressions, keyword lists, or exact data match. This is common for employee IDs, project codes, or proprietary data formats.',
        code: `# Create a custom SIT for employee IDs (format: EMP-123456)
New-DlpSensitiveInformationType \`
  -Name "Contoso Employee ID" \`
  -Description "Matches Contoso employee ID format EMP-XXXXXX" \`
  -Entity '<Entity id="12345678-1234-1234-1234-123456789012"
    patternsProximity="300" recommendedConfidence="85">
    <Pattern confidenceLevel="85">
      <IdMatch idRef="EmployeeId_Regex"/>
    </Pattern>
  </Entity>' \`
  -Regex '<Regex id="EmployeeId_Regex">EMP-\\d{6}</Regex>'`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data classification > Sensitive info types > + Create',
        note: 'Custom SITs support regex, keyword dictionaries, and exact data match (EDM). EDM is recommended for large datasets like customer databases.',
      },
      {
        title: 'Create the DLP policy',
        description:
          'Create a new DLP policy that targets the desired locations (Exchange, SharePoint, OneDrive, Teams). Start in simulation mode to evaluate the impact before enforcement.',
        code: `# Create a DLP policy targeting Exchange and SharePoint
New-DlpCompliancePolicy -Name "Protect Financial Data" \`
  -Comment "Detects and protects credit card numbers and bank account information" \`
  -ExchangeLocation All \`
  -SharePointLocation All \`
  -OneDriveLocation All \`
  -TeamsLocation All \`
  -Mode TestWithNotifications`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data loss prevention > Policies > + Create policy',
        warning: 'Always start in TestWithNotifications mode (simulation). Jumping directly to enforcement can block legitimate business communications.',
      },
      {
        title: 'Create DLP rules with conditions and actions',
        description:
          'Add rules to the policy that define what sensitive data to detect and what actions to take. Configure low-count and high-count rules with different severity levels.',
        code: `# Create a rule for low-count detection (1-9 instances)
New-DlpComplianceRule -Name "Financial Data - Low Count" \`
  -Policy "Protect Financial Data" \`
  -ContentContainsSensitiveInformation @(
    @{Name="Credit Card Number"; minCount="1"; maxCount="9"; confidencelevel="85"},
    @{Name="U.S. Bank Account Number"; minCount="1"; maxCount="9"; confidencelevel="85"}
  ) \`
  -NotifyUser Owner,LastModifier,SiteAdmin \`
  -GenerateIncidentReport SiteAdmin \`
  -IncidentReportContent All \`
  -ReportSeverityLevel Low

# Create a rule for high-count detection (10+ instances)
New-DlpComplianceRule -Name "Financial Data - High Count" \`
  -Policy "Protect Financial Data" \`
  -ContentContainsSensitiveInformation @(
    @{Name="Credit Card Number"; minCount="10"; confidencelevel="85"},
    @{Name="U.S. Bank Account Number"; minCount="10"; confidencelevel="85"}
  ) \`
  -BlockAccess $true \`
  -BlockAccessScope All \`
  -NotifyUser Owner,LastModifier,SiteAdmin \`
  -GenerateIncidentReport SiteAdmin,GlobalAdmin \`
  -IncidentReportContent All \`
  -ReportSeverityLevel High`,
        codeLanguage: 'powershell',
        note: 'The confidence level parameter controls how strict the detection is. Higher values reduce false positives but may miss some matches. 85 is a good default for most SITs.',
      },
      {
        title: 'Configure user notifications and policy tips',
        description:
          'Set up policy tips that warn users in real-time when they are about to share sensitive data. Configure email notifications for compliance officers when incidents are detected.',
        code: `# Update rule with custom notification text
Set-DlpComplianceRule -Identity "Financial Data - Low Count" \`
  -NotifyUser Owner \`
  -NotifyPolicyTipCustomText "This document appears to contain financial data (credit card or bank account numbers). Please ensure you are authorized to share this information." \`
  -NotifyEmailCustomText "A DLP policy match was detected. Please review the content and ensure compliance with our data protection policies."`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data loss prevention > Policies > [Policy] > Edit rule > User notifications',
      },
      {
        title: 'Configure override and business justification',
        description:
          'Allow users to override DLP blocks with a business justification. This provides flexibility while maintaining an audit trail of all override decisions.',
        code: `# Allow overrides with justification for the low-count rule
Set-DlpComplianceRule -Identity "Financial Data - Low Count" \`
  -BlockAccess $true \`
  -BlockAccessScope PerUser \`
  -NotifyAllowOverride WithJustification

# High-count rule: override requires manager approval
Set-DlpComplianceRule -Identity "Financial Data - High Count" \`
  -NotifyAllowOverride WithJustification`,
        codeLanguage: 'powershell',
        warning: 'Override activity is logged and auditable. Regularly review override reports to identify users who frequently bypass DLP policies.',
      },
      {
        title: 'Review simulation results and tune the policy',
        description:
          'After running in simulation mode for 1-2 weeks, review the DLP reports to evaluate policy effectiveness. Adjust confidence levels, add exceptions, or modify rules based on the simulation data.',
        code: `# Get DLP policy detection report
Get-DlpDetailReport -StartDate (Get-Date).AddDays(-14) -EndDate (Get-Date) |
  Where-Object { $_.PolicyName -eq "Protect Financial Data" } |
  Group-Object RuleName | Select-Object Count, Name

# Export detailed incidents
Get-DlpDetailReport -StartDate (Get-Date).AddDays(-14) -EndDate (Get-Date) |
  Export-Csv -Path "C:\\Reports\\DLP_SimulationResults.csv" -NoTypeInformation`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data loss prevention > Activity explorer',
        note: 'Focus on false positive rates. If a rule generates more than 5% false positives, consider increasing the confidence level or adding exclusions.',
      },
      {
        title: 'Enable enforcement and ongoing monitoring',
        description:
          'Once satisfied with the simulation results, switch the policy to enforcement mode. Set up ongoing monitoring dashboards and alert rules for DLP incidents.',
        code: `# Switch policy to enforcement mode
Set-DlpCompliancePolicy -Identity "Protect Financial Data" -Mode Enable

# Verify policy status
Get-DlpCompliancePolicy -Identity "Protect Financial Data" |
  Select-Object Name, Mode, Enabled, Workload, CreatedBy

# Set up an alert policy for high-severity DLP incidents
New-ActivityAlert -Name "DLP High Severity Alert" \`
  -Description "Alert when high-severity DLP policy matches are detected" \`
  -Operation DLPRuleMatch \`
  -NotifyUser "compliance@contoso.com" \`
  -Severity High`,
        codeLanguage: 'powershell',
        portalPath: 'Microsoft Purview compliance portal > Data loss prevention > Alerts',
        warning: 'After enabling enforcement, monitor the alert queue closely for the first 48 hours. Be prepared to switch back to simulation mode if excessive false positives disrupt business operations.',
      },
    ],
    relatedCommands: [],
    relatedGuides: ['m365-exchange-retention', 'm365-exchange-mailflow', 'm365-onedrive-policies'],
    tags: ['dlp', 'data-loss-prevention', 'compliance', 'purview', 'sensitive-data', 'security'],
  },
]
