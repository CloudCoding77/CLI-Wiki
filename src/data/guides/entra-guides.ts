import type { Guide } from '../../types'

export const entraGuides: Guide[] = [
  // ─── 1. Create a Conditional Access Policy ──────────────────────────────────
  {
    id: 'entra-conditional-access',
    title: 'Create a Conditional Access Policy',
    description:
      'Design and deploy a Conditional Access policy in Microsoft Entra ID to enforce adaptive access controls based on user, device, location, and risk signals. Covers policy planning, configuration, report-only testing, and production rollout.',
    category: 'entra-security',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: [
      'Microsoft Entra ID P1 or P2 license',
      'Conditional Access Administrator or Security Administrator role',
      'At least one test user account not excluded from the policy',
      'Break-glass emergency access account configured',
    ],
    steps: [
      {
        title: 'Plan the policy scope and objectives',
        description:
          'Before creating a policy, define which users and applications it targets, what conditions it evaluates, and what grant or session controls it enforces. Document the business requirement (e.g., require MFA for all cloud apps when users are off the corporate network).',
        note: 'Always maintain at least two break-glass emergency access accounts excluded from all Conditional Access policies to prevent tenant lockout.',
      },
      {
        title: 'Open the Conditional Access blade',
        description:
          'Sign in to the Microsoft Entra admin center and navigate to the Conditional Access policies list. Review existing policies to avoid conflicts with the new policy you are about to create.',
        portalPath: 'Entra admin center > Protection > Conditional Access > Policies',
      },
      {
        title: 'Create a new policy',
        description:
          'Click "+ New policy" and give it a descriptive name that reflects its purpose (e.g., "Require MFA – All Cloud Apps – External Networks"). A clear naming convention makes it easier to manage policies at scale.',
        portalPath: 'Entra admin center > Protection > Conditional Access > Policies > + New policy',
      },
      {
        title: 'Configure user and group assignments',
        description:
          'Under Assignments > Users, select the target users or groups. You can include "All users" and then add exclusions for emergency access accounts and service accounts. Use groups for easier management rather than assigning individual users.',
        warning: 'Never apply a policy to all users without excluding your break-glass accounts. This can cause a complete tenant lockout.',
      },
      {
        title: 'Select target cloud apps or actions',
        description:
          'Under Assignments > Target resources, choose which cloud applications the policy applies to. You can select "All cloud apps" for broad coverage or pick specific apps. You can also target user actions such as "Register security information" or "Register or join devices".',
        portalPath: 'Entra admin center > Protection > Conditional Access > [Policy] > Target resources',
        note: 'Selecting "All cloud apps" also covers the Azure portal, Microsoft Graph, and other Microsoft services. Test thoroughly before enforcing.',
      },
      {
        title: 'Define conditions',
        description:
          'Configure one or more conditions to narrow when the policy applies. Common conditions include: named locations (trusted vs. untrusted networks), device platforms (Windows, iOS, Android), client apps (browser, mobile apps, desktop clients), and sign-in risk level (requires Entra ID P2).',
        portalPath: 'Entra admin center > Protection > Conditional Access > [Policy] > Conditions',
      },
      {
        title: 'Configure grant controls',
        description:
          'Under Access controls > Grant, define what is required to grant access. Common options: "Require multifactor authentication", "Require device to be marked as compliant", "Require Hybrid Azure AD joined device", or "Require approved client app". You can require one or all of the selected controls.',
        code: `# Verify grant controls via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Policy.Read.All"
Get-MgIdentityConditionalAccessPolicy | Select-Object DisplayName, State,
  @{N='GrantControls';E={$_.GrantControls.BuiltInControls -join ', '}}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure session controls (optional)',
        description:
          'Under Access controls > Session, optionally configure session-level controls such as sign-in frequency (e.g., require re-authentication every 8 hours), persistent browser session settings, or Conditional Access App Control to enforce real-time monitoring via Microsoft Defender for Cloud Apps.',
        note: 'Sign-in frequency affects user experience. A value that is too low will cause frequent re-authentication prompts and may reduce productivity.',
      },
      {
        title: 'Enable the policy in Report-only mode',
        description:
          'Set the policy state to "Report-only" instead of "On". This allows you to monitor how the policy would affect sign-ins without actually blocking or challenging users. Review the report-only results in the Sign-in logs for at least one to two weeks before enabling enforcement.',
        portalPath: 'Entra admin center > Protection > Conditional Access > [Policy] > Enable policy > Report-only',
        warning: 'Do not skip report-only testing. Enabling an untested policy can block legitimate users and disrupt business operations.',
      },
      {
        title: 'Analyze report-only results and enable the policy',
        description:
          'After the testing period, review the Conditional Access insights workbook and sign-in logs. Filter for "Report-only: Failure" entries to identify users who would have been blocked. Resolve any issues, then switch the policy state from "Report-only" to "On" to enforce it in production.',
        portalPath: 'Entra admin center > Identity > Monitoring & health > Sign-in logs',
        code: `# Check report-only impact via Graph PowerShell
Connect-MgGraph -Scopes "AuditLog.Read.All"
Get-MgAuditLogSignIn -Filter "conditionalAccessStatus eq 'reportOnlyFailure'" -Top 50 |
  Select-Object UserDisplayName, AppDisplayName, ConditionalAccessStatus`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-mfa-setup',
      'entra-pim-setup',
      'entra-access-reviews',
    ],
    tags: ['conditional-access', 'zero-trust', 'mfa', 'security', 'entra-id'],
  },

  // ─── 2. Enable MFA for All Users ────────────────────────────────────────────
  {
    id: 'entra-mfa-setup',
    title: 'Enable MFA for All Users',
    description:
      'Roll out multifactor authentication across your organization using Microsoft Entra ID Security Defaults or Conditional Access policies. Covers authentication method registration, user communication, and monitoring adoption.',
    category: 'entra-security',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: [
      'Microsoft Entra ID P1 license (for Conditional Access approach) or any Entra ID tier (for Security Defaults)',
      'Global Administrator or Authentication Policy Administrator role',
      'Users with valid phone numbers or the Microsoft Authenticator app installed',
    ],
    steps: [
      {
        title: 'Choose between Security Defaults and Conditional Access',
        description:
          'Security Defaults provide a simple one-click way to enforce MFA for all users but offer no customization. Conditional Access policies provide granular control over who is challenged, when, and how. For production tenants with P1 or higher licensing, Conditional Access is recommended.',
        note: 'Security Defaults and Conditional Access policies are mutually exclusive. Enabling Security Defaults disables all custom Conditional Access policies.',
      },
      {
        title: 'Configure authentication methods',
        description:
          'Navigate to the Authentication methods blade and enable the methods you want to support: Microsoft Authenticator (push notifications, passwordless), FIDO2 security keys, phone (SMS or voice call), and/or Temporary Access Pass for onboarding. Disable legacy methods like app passwords if not needed.',
        portalPath: 'Entra admin center > Protection > Authentication methods > Policies',
        code: `# List current authentication method policies
Connect-MgGraph -Scopes "Policy.ReadWrite.AuthenticationMethod"
Get-MgPolicyAuthenticationMethodPolicy |
  Select-Object -ExpandProperty AuthenticationMethodConfigurations |
  Select-Object Id, State`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Enable the Microsoft Authenticator registration campaign',
        description:
          'Turn on the registration campaign to nudge users who have not yet registered the Authenticator app. This prompts users during sign-in to set up the app if they only have weaker methods like SMS registered.',
        portalPath: 'Entra admin center > Protection > Authentication methods > Registration campaign',
      },
      {
        title: 'Create the MFA Conditional Access policy',
        description:
          'If you chose the Conditional Access route, create a new policy named "Require MFA – All Users – All Cloud Apps". Assign it to All Users (excluding break-glass accounts), target All Cloud Apps, and under Grant controls select "Require multifactor authentication". Set the policy to Report-only initially.',
        portalPath: 'Entra admin center > Protection > Conditional Access > Policies > + New policy',
        warning: 'Always exclude emergency access accounts from MFA policies to prevent lockout scenarios.',
      },
      {
        title: 'Communicate the rollout to end users',
        description:
          'Send an organization-wide email or Teams message explaining that MFA is being enabled, when it takes effect, and how to register. Provide a direct link to https://aka.ms/mfasetup so users can proactively register their authentication methods before enforcement begins.',
        note: 'Give users at least two weeks notice before switching the policy from Report-only to On. This reduces helpdesk calls significantly.',
      },
      {
        title: 'Monitor registration progress',
        description:
          'Use the Authentication methods activity report to track how many users have registered MFA methods. Identify users who have not registered and send targeted reminders before the enforcement date.',
        portalPath: 'Entra admin center > Protection > Authentication methods > Activity',
        code: `# Get users without MFA methods registered
Connect-MgGraph -Scopes "UserAuthenticationMethod.Read.All"
Get-MgReportAuthenticationMethodUserRegistrationDetail -Filter "isMfaRegistered eq false" |
  Select-Object UserPrincipalName, UserDisplayName`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Switch the policy to enforce MFA',
        description:
          'After the testing period and once registration adoption is above 90%, change the Conditional Access policy state from "Report-only" to "On". Monitor sign-in logs closely for the first 48 hours to catch any unexpected blocks.',
        portalPath: 'Entra admin center > Protection > Conditional Access > [MFA Policy] > Enable policy > On',
      },
      {
        title: 'Set up MFA fraud alerts and reporting',
        description:
          'Enable the fraud alert setting so users can report suspicious MFA prompts by pressing a key during phone verification or denying an unexpected Authenticator push. Configure automatic blocking of the account when fraud is reported and set up notification alerts for your security team.',
        portalPath: 'Entra admin center > Protection > Multifactor authentication > Fraud alert',
        warning: 'If MFA fraud alerts are not configured, attackers who compromise a password can repeatedly send MFA prompts (MFA fatigue attacks) without detection.',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-conditional-access',
      'entra-pim-setup',
      'entra-access-reviews',
    ],
    tags: ['mfa', 'multifactor-authentication', 'security', 'entra-id', 'authentication'],
  },

  // ─── 3. Create an App Registration ──────────────────────────────────────────
  {
    id: 'entra-app-registration',
    title: 'Create an App Registration',
    description:
      'Register a new application in Microsoft Entra ID to enable authentication and authorization. Covers configuring redirect URIs, API permissions, client secrets, certificates, and token settings for web apps, SPAs, and daemon services.',
    category: 'entra-apps',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    prerequisites: [
      'Microsoft Entra ID (any tier)',
      'Application Administrator or Cloud Application Administrator role',
      'Understanding of OAuth 2.0 / OpenID Connect flows for your application type',
    ],
    steps: [
      {
        title: 'Navigate to App registrations',
        description:
          'Sign in to the Microsoft Entra admin center and open the App registrations blade. Review existing registrations to ensure you are not creating a duplicate.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations',
      },
      {
        title: 'Register the application',
        description:
          'Click "+ New registration". Provide a display name that clearly identifies the application. Under "Supported account types", choose the appropriate option: "Accounts in this organizational directory only" for single-tenant LOB apps, or "Accounts in any organizational directory" for multi-tenant SaaS apps. Leave the redirect URI empty for now.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > + New registration',
        note: 'You can change the supported account types later, but switching from single-tenant to multi-tenant requires careful review of your authorization logic.',
      },
      {
        title: 'Configure redirect URIs',
        description:
          'On the app overview page, go to Authentication and add redirect URIs. Choose the platform: Web (for server-side apps), Single-page application (for React/Angular/Vue), Mobile/desktop (for native apps). Add all URIs where your application expects to receive tokens, including localhost for development.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > Authentication',
        warning: 'Never use wildcard redirect URIs in production. This creates an open redirect vulnerability that attackers can exploit to steal tokens.',
      },
      {
        title: 'Configure API permissions',
        description:
          'Navigate to API permissions and add the required permissions. For Microsoft Graph, choose between delegated permissions (on behalf of a signed-in user) and application permissions (daemon/service). Start with the least privilege needed. Common delegated permissions include User.Read, Mail.Read, and Files.ReadWrite.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > API permissions',
        code: `# Add API permissions via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Application.ReadWrite.All"
$appId = "<your-app-object-id>"

# Add Microsoft Graph User.Read delegated permission
$graphServicePrincipal = Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'"
$userReadPermission = $graphServicePrincipal.Oauth2PermissionScopes | Where-Object { $_.Value -eq "User.Read" }

$params = @{
  RequiredResourceAccess = @(
    @{
      ResourceAppId = "00000003-0000-0000-c000-000000000000"
      ResourceAccess = @(
        @{
          Id   = $userReadPermission.Id
          Type = "Scope"
        }
      )
    }
  )
}
Update-MgApplication -ApplicationId $appId -BodyParameter $params`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Grant admin consent (if required)',
        description:
          'Application permissions and some high-privilege delegated permissions require admin consent. Click "Grant admin consent for [tenant]" to approve the permissions on behalf of all users. Verify the status column shows a green checkmark for each permission.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > API permissions > Grant admin consent',
        note: 'Only grant admin consent for permissions your application actually needs. Excessive permissions increase the blast radius if the app is compromised.',
      },
      {
        title: 'Create a client secret or upload a certificate',
        description:
          'Navigate to Certificates & secrets. For development or simpler setups, create a client secret (choose 6, 12, 18, or 24 months expiry). For production workloads, upload an X.509 certificate which is more secure than secrets. Copy the secret value immediately as it will not be shown again.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > Certificates & secrets',
        warning: 'Store client secrets securely in Azure Key Vault or your CI/CD secret management system. Never commit secrets to source control or embed them in client-side code.',
      },
      {
        title: 'Configure token settings',
        description:
          'Under Token configuration, add optional claims to the ID token and access token if needed. Common optional claims include email, upn, groups, and preferred_username. You can also configure group claims to include security group membership in the token.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > Token configuration',
      },
      {
        title: 'Expose an API (optional)',
        description:
          'If your application exposes its own API that other apps will call, navigate to "Expose an API". Set the Application ID URI (e.g., api://<client-id>) and define scopes that client applications can request. This is required for APIs protected by OAuth 2.0.',
        portalPath: 'Entra admin center > Identity > Applications > App registrations > [App] > Expose an API',
        code: `# Set the Application ID URI via PowerShell
Connect-MgGraph -Scopes "Application.ReadWrite.All"
Update-MgApplication -ApplicationId "<app-object-id>" -IdentifierUris @("api://<client-id>")`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Test authentication end to end',
        description:
          'Use a tool like Postman, the MSAL library in your application code, or the OAuth 2.0 token endpoint directly to verify that authentication works. For the authorization code flow, visit the /authorize endpoint in a browser, sign in, and confirm you receive a token. For client credentials flow, POST to the /token endpoint with your client ID and secret.',
        code: `# Quick test: acquire a token using client credentials (PowerShell)
$body = @{
  client_id     = "<your-client-id>"
  scope         = "https://graph.microsoft.com/.default"
  client_secret = "<your-client-secret>"
  grant_type    = "client_credentials"
}
$response = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token" -Body $body
$response.access_token | Set-Clipboard
Write-Host "Access token copied to clipboard"`,
        codeLanguage: 'powershell',
        note: 'For production, use certificate-based authentication or managed identities instead of client secrets in the token request.',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-enterprise-app-sso',
      'entra-rbac-roles',
    ],
    tags: ['app-registration', 'oauth', 'openid-connect', 'api-permissions', 'entra-id'],
  },

  // ─── 4. Configure SSO for Enterprise App ────────────────────────────────────
  {
    id: 'entra-enterprise-app-sso',
    title: 'Configure SSO for Enterprise App',
    description:
      'Set up Single Sign-On for a third-party enterprise application using SAML or OIDC in Microsoft Entra ID. Covers gallery app provisioning, SSO configuration, attribute mapping, certificate management, and user assignment.',
    category: 'entra-apps',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: [
      'Microsoft Entra ID P1 or P2 license',
      'Application Administrator or Cloud Application Administrator role',
      'Admin access to the third-party application for SSO configuration',
      'The third-party application supports SAML 2.0 or OIDC for SSO',
    ],
    steps: [
      {
        title: 'Add the enterprise application from the gallery',
        description:
          'Navigate to Enterprise applications and click "+ New application". Search the Entra ID application gallery for the third-party app (e.g., Salesforce, ServiceNow, Slack). If the app is not in the gallery, choose "Create your own application" and select "Integrate any other application you don\'t find in the gallery (Non-gallery)".',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > + New application',
      },
      {
        title: 'Select the SSO method',
        description:
          'Open the newly created enterprise application and navigate to Single sign-on. Select the SSO method supported by the third-party app: SAML is the most common for enterprise apps, OIDC is newer and simpler, Linked sign-on is for apps that already have their own SSO configured. For this guide, we focus on SAML.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on',
      },
      {
        title: 'Configure basic SAML settings',
        description:
          'In the SAML-based sign-on configuration, edit section 1 "Basic SAML Configuration". Enter the Identifier (Entity ID) and Reply URL (Assertion Consumer Service URL) provided by the third-party application. Optionally add a Sign-on URL if the app supports SP-initiated SSO and a Relay State if required.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on > Basic SAML Configuration',
        note: 'The Identifier and Reply URL values must exactly match what the third-party application expects. Even a trailing slash difference will cause SSO to fail.',
      },
      {
        title: 'Configure attributes and claims',
        description:
          'Edit section 2 "Attributes & Claims" to map Entra ID user attributes to the claims the application expects. The default NameID is usually user.userprincipalname. Add additional claims for attributes like email, first name, last name, department, or group membership based on the application requirements.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on > Attributes & Claims',
        code: `# View current claims mapping via Graph PowerShell
Connect-MgGraph -Scopes "Application.Read.All"
$sp = Get-MgServicePrincipal -Filter "displayName eq 'Your App Name'"
Get-MgServicePrincipalClaimMappingPolicy -ServicePrincipalId $sp.Id`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Download the SAML signing certificate',
        description:
          'In section 3 "SAML Signing Certificate", download the certificate in the format required by the third-party application (usually Base64 or PEM). Also copy the Federation Metadata XML URL which some apps can use for automatic configuration. Verify the certificate expiration date and set a calendar reminder to rotate it before it expires.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on > SAML Signing Certificate',
        warning: 'SAML signing certificates expire. If the certificate expires without renewal, SSO will break for all users of the application. Set up certificate expiration notifications.',
      },
      {
        title: 'Copy the Entra ID SSO URLs',
        description:
          'In section 4 "Set up [App Name]", copy the Login URL, Azure AD Identifier (Entity ID), and Logout URL. You will need to enter these values into the third-party application SSO configuration page.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on > Set up [App]',
      },
      {
        title: 'Configure SSO on the third-party application side',
        description:
          'Log into the admin console of the third-party application and locate its SSO or SAML configuration settings. Paste the Login URL, Entra ID Identifier, and Logout URL into the corresponding fields. Upload the SAML signing certificate downloaded in the previous step. Save the configuration.',
        note: 'Each application has a different admin interface. Consult the application vendor documentation for exact field names and locations. Microsoft provides app-specific tutorials for gallery applications.',
      },
      {
        title: 'Assign users and groups',
        description:
          'Navigate to Users and groups for the enterprise application. Add the users or groups who should have access to the application. If "User assignment required?" is set to Yes, only assigned users can access the app. If set to No, all users in the tenant can access it.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Users and groups > + Add user/group',
      },
      {
        title: 'Test SSO with a test user',
        description:
          'Click the "Test" button in the Single sign-on configuration to launch the SSO test flow. Sign in with a test user account that has been assigned to the application. Verify that the user is successfully redirected to the third-party application without being asked for additional credentials.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Single sign-on > Test',
        warning: 'If the test fails, use the "Got an error?" troubleshooting link to diagnose the issue. Common problems include mismatched Reply URLs, incorrect NameID format, or missing claims.',
      },
      {
        title: 'Enable provisioning (optional)',
        description:
          'If the application supports SCIM provisioning, navigate to the Provisioning blade and configure automatic user provisioning. This ensures that user accounts are created, updated, and deactivated in the third-party application automatically based on Entra ID assignments.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning',
      },
      {
        title: 'Monitor SSO sign-in activity',
        description:
          'After enabling SSO for production users, monitor the sign-in logs to detect failures. Filter by the application name to see all SSO attempts. Pay attention to error codes 50058 (silent sign-in failed), 50105 (user not assigned), and 75011 (authentication method mismatch). Set up alerts for repeated SSO failures.',
        portalPath: 'Entra admin center > Identity > Monitoring & health > Sign-in logs',
        code: `# Query SSO sign-in failures for a specific app
Connect-MgGraph -Scopes "AuditLog.Read.All"
Get-MgAuditLogSignIn -Filter "appDisplayName eq 'Your App Name' and status/errorCode ne 0" -Top 20 |
  Select-Object UserDisplayName, Status, CreatedDateTime`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-app-registration',
      'entra-user-provisioning',
      'entra-access-reviews',
    ],
    tags: ['sso', 'saml', 'enterprise-app', 'single-sign-on', 'entra-id'],
  },

  // ─── 5. Set Up Automatic User Provisioning ──────────────────────────────────
  {
    id: 'entra-user-provisioning',
    title: 'Set Up Automatic User Provisioning',
    description:
      'Configure SCIM-based automatic user provisioning from Microsoft Entra ID to a third-party SaaS application. Covers connecting the provisioning service, mapping attributes, scoping filters, and monitoring provisioning cycles.',
    category: 'entra-identity',
    difficulty: 'intermediate',
    estimatedMinutes: 25,
    prerequisites: [
      'Microsoft Entra ID P1 or P2 license',
      'Application Administrator role',
      'Enterprise application already added to the tenant',
      'SCIM endpoint URL and authentication token from the third-party application',
    ],
    steps: [
      {
        title: 'Navigate to the enterprise application provisioning settings',
        description:
          'Open the enterprise application you want to configure provisioning for and navigate to the Provisioning blade. If provisioning has never been configured, you will see a "Get started" button.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning',
      },
      {
        title: 'Set provisioning mode to Automatic',
        description:
          'Click "Get started" or "Edit provisioning" and set the Provisioning Mode to "Automatic". This enables Entra ID to automatically create, update, and disable user accounts in the target application using the SCIM protocol.',
        note: 'If the application does not support SCIM, the only option is "Manual" which provides no automation. Check with the vendor for SCIM support.',
      },
      {
        title: 'Configure admin credentials',
        description:
          'In the Admin Credentials section, enter the Tenant URL (SCIM endpoint) and Secret Token provided by the third-party application. Click "Test Connection" to verify that Entra ID can reach the SCIM endpoint and authenticate successfully.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning > Admin Credentials',
        warning: 'Store the SCIM secret token securely. If the token expires or is rotated on the application side, provisioning will stop until updated.',
      },
      {
        title: 'Configure attribute mappings',
        description:
          'Expand the Mappings section and edit the user attribute mappings. Map Entra ID attributes (like userPrincipalName, displayName, givenName, surname, department) to the corresponding attributes in the target application. Remove any mappings for attributes that should not be synced.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning > Mappings > Provision Azure Active Directory Users',
        note: 'The matching attribute (usually userPrincipalName or mail) is critical. It determines how Entra ID matches users between systems. Changing it after initial sync can cause duplicates.',
      },
      {
        title: 'Configure scoping filters',
        description:
          'Define which users should be provisioned by setting scoping filters. Under Settings, set "Scope" to "Sync only assigned users and groups" (recommended) or "Sync all users and groups". You can also add attribute-based scoping filters to further refine which users are in scope (e.g., only users where department equals "Engineering").',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning > Settings',
      },
      {
        title: 'Assign users and groups for provisioning',
        description:
          'If the scope is set to "Sync only assigned users and groups", navigate to Users and groups and assign the users or groups that should be provisioned to the application. Only assigned users will be created in the target application.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Users and groups',
      },
      {
        title: 'Start the initial provisioning cycle',
        description:
          'Set the Provisioning Status to "On" and click Save. The initial provisioning cycle processes all users in scope and can take from 20 minutes to several hours depending on the number of users. Subsequent incremental cycles run approximately every 40 minutes.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning',
        code: `# Check provisioning status via Graph PowerShell
Connect-MgGraph -Scopes "Application.Read.All"
$sp = Get-MgServicePrincipal -Filter "displayName eq 'Your App Name'"
Get-MgServicePrincipalSynchronizationJob -ServicePrincipalId $sp.Id |
  Select-Object Id, Status`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Monitor provisioning logs and resolve errors',
        description:
          'Navigate to the Provisioning logs to review the status of each user operation (Create, Update, Disable, Delete). Filter by status "Failure" to identify and fix provisioning errors. Common errors include attribute validation failures, duplicate user conflicts, and SCIM schema mismatches. Set up email notifications for provisioning failures.',
        portalPath: 'Entra admin center > Identity > Applications > Enterprise applications > [App] > Provisioning > Provisioning logs',
        warning: 'If the initial cycle has many failures, fix the root cause (usually attribute mapping issues) and restart the cycle rather than letting it complete with errors.',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-enterprise-app-sso',
      'entra-group-management',
      'entra-access-reviews',
    ],
    tags: ['provisioning', 'scim', 'automation', 'user-lifecycle', 'entra-id'],
  },

  // ─── 6. Create Dynamic Groups ───────────────────────────────────────────────
  {
    id: 'entra-group-management',
    title: 'Create Dynamic Groups',
    description:
      'Create and manage dynamic membership groups in Microsoft Entra ID that automatically add and remove members based on user or device attribute rules. Covers rule syntax, validation, processing, and common patterns.',
    category: 'entra-identity',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    prerequisites: [
      'Microsoft Entra ID P1 or P2 license',
      'Groups Administrator or User Administrator role',
      'Users with populated attributes (department, jobTitle, etc.) in Entra ID',
    ],
    steps: [
      {
        title: 'Navigate to Groups',
        description:
          'Sign in to the Microsoft Entra admin center and navigate to the Groups blade. Review existing groups to understand your current group structure before creating new ones.',
        portalPath: 'Entra admin center > Identity > Groups > All groups',
      },
      {
        title: 'Create a new group with dynamic membership',
        description:
          'Click "+ New group". Set the Group type to "Security" (or "Microsoft 365" for collaboration scenarios). Set the Membership type to "Dynamic User" for user-based groups or "Dynamic Device" for device-based groups. Provide a descriptive group name and description.',
        portalPath: 'Entra admin center > Identity > Groups > All groups > + New group',
        note: 'Dynamic Microsoft 365 groups are useful for automatically managing Teams membership, shared mailboxes, and SharePoint access based on user attributes.',
      },
      {
        title: 'Build the dynamic membership rule',
        description:
          'Click "Add dynamic query" to open the rule builder. Use the simple rule builder for basic rules or switch to the advanced editor for complex expressions. Common examples: (user.department -eq "Engineering") for department-based groups, (user.companyName -eq "Contoso") for company-based groups, or combine rules with -and and -or operators.',
        portalPath: 'Entra admin center > Identity > Groups > [New group] > Dynamic membership rules',
        code: `# Example dynamic membership rules:

# All users in the Engineering department
(user.department -eq "Engineering")

# All full-time employees in the US
(user.employeeType -eq "FullTime") -and (user.usageLocation -eq "US")

# All users with Manager title, excluding guests
(user.jobTitle -contains "Manager") -and (user.userType -eq "Member")

# All Windows devices
(device.deviceOSType -eq "Windows")`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Validate the rule',
        description:
          'Use the "Validate Rules" tab to test the dynamic membership rule against specific users before saving. Select a few test users and click "Validate" to see if they would be included or excluded by the rule. This helps catch syntax errors and logic issues before the group starts processing.',
        note: 'The rule validator checks a limited number of users. After the group is created, monitor the actual membership to ensure the rule works as expected across all users.',
      },
      {
        title: 'Save and wait for processing',
        description:
          'Click "Save" to create the group. The dynamic membership evaluation engine will begin processing the rule against all users in the directory. The initial processing can take from a few minutes to several hours depending on the size of the directory. The group properties page shows the processing status.',
        warning: 'Do not assign the group to policies or applications until the initial processing is complete. Assigning an empty or partially populated group can cause unintended access denials.',
      },
      {
        title: 'Verify group membership',
        description:
          'Once processing completes, navigate to the group Members tab to verify that the expected users appear. Cross-reference with the user attributes to ensure the rule is matching correctly. If members are missing, check that their attributes are populated correctly in their user profile.',
        portalPath: 'Entra admin center > Identity > Groups > [Group] > Members',
        code: `# Check dynamic group members via Graph PowerShell
Connect-MgGraph -Scopes "Group.Read.All"
$group = Get-MgGroup -Filter "displayName eq 'Engineering Team'"
Get-MgGroupMember -GroupId $group.Id | ForEach-Object {
  Get-MgUser -UserId $_.Id | Select-Object DisplayName, Department
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Monitor and troubleshoot membership changes',
        description:
          'Dynamic groups are re-evaluated whenever user attributes change. Use the Audit logs to track membership additions and removals. Filter by Activity "Add member to group" and "Remove member from group" to monitor changes over time. If a user is unexpectedly added or removed, check their attribute values against the rule.',
        portalPath: 'Entra admin center > Identity > Groups > [Group] > Audit logs',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-rbac-roles',
      'entra-user-provisioning',
      'entra-access-reviews',
    ],
    tags: ['dynamic-groups', 'group-management', 'automation', 'entra-id'],
  },

  // ─── 7. Create Custom RBAC Roles ────────────────────────────────────────────
  {
    id: 'entra-rbac-roles',
    title: 'Create Custom RBAC Roles',
    description:
      'Create and assign custom role-based access control roles in Microsoft Entra ID to delegate fine-grained administrative permissions. Covers identifying required permissions, building custom role definitions, assigning roles at different scopes, and auditing role usage.',
    category: 'entra-identity',
    difficulty: 'advanced',
    estimatedMinutes: 25,
    prerequisites: [
      'Microsoft Entra ID P1 or P2 license',
      'Privileged Role Administrator or Global Administrator role',
      'Understanding of the least privilege principle and your delegation requirements',
    ],
    steps: [
      {
        title: 'Identify the delegation scenario',
        description:
          'Before creating a custom role, clearly define what administrative tasks the role should allow. Review the built-in roles first to check if an existing role already meets your needs. Custom roles should be created only when no built-in role provides the right combination of permissions.',
        note: 'Microsoft Entra ID has over 80 built-in roles. Use the role comparison tool to find the closest match before building a custom role.',
      },
      {
        title: 'Review available permissions',
        description:
          'Browse the available Entra ID permissions to identify which ones your custom role needs. Permissions follow the pattern microsoft.directory/resource/action (e.g., microsoft.directory/users/basic/update). Use the Entra admin center or Microsoft Graph to list all available role permissions.',
        portalPath: 'Entra admin center > Identity > Roles & admins > Roles & admins > + New custom role',
        code: `# List all available role permissions in Entra ID
Connect-MgGraph -Scopes "RoleManagement.Read.Directory"
$roleDefinitions = Get-MgRoleManagementDirectoryResourceNamespace -ResourceNamespaceId "microsoft.directory"
$roleDefinitions.ResourceActions | Select-Object Name, Description | Sort-Object Name`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Create the custom role definition',
        description:
          'Navigate to Roles and administrators and click "+ New custom role". Provide a descriptive name (e.g., "Helpdesk Password Reset Operator") and description. On the Permissions tab, search for and add only the specific permissions needed for the role.',
        portalPath: 'Entra admin center > Identity > Roles & admins > Roles & admins > + New custom role',
        warning: 'Apply the principle of least privilege. Only include permissions that are absolutely necessary for the role. Overly broad custom roles defeat the purpose of fine-grained delegation.',
      },
      {
        title: 'Add permissions to the role',
        description:
          'Search for permissions by keyword or browse by resource category. For example, to create a role that can only reset passwords and read user profiles, add: microsoft.directory/users/password/update and microsoft.directory/users/basic/read. Review the full list of selected permissions before proceeding.',
        code: `# Create a custom role via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "RoleManagement.ReadWrite.Directory"

$params = @{
  DisplayName   = "Helpdesk Password Reset Operator"
  Description   = "Can reset passwords and read basic user profiles"
  IsEnabled     = $true
  RolePermissions = @(
    @{
      AllowedResourceActions = @(
        "microsoft.directory/users/password/update"
        "microsoft.directory/users/basic/read"
        "microsoft.directory/users/authenticationMethods/basic/update"
      )
    }
  )
}
New-MgRoleManagementDirectoryRoleDefinition -BodyParameter $params`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Review and create the role',
        description:
          'On the Review + create tab, verify the role name, description, and permissions. Once created, the role appears in the Roles list alongside built-in roles. Note that custom roles are identified by a different icon or badge than built-in roles.',
        portalPath: 'Entra admin center > Identity > Roles & admins > Roles & admins',
      },
      {
        title: 'Assign the custom role to users or groups',
        description:
          'Open the custom role and click "+ Add assignments". Select the users or groups who should receive the role. Choose the assignment scope: directory-wide (the role applies to all objects) or scoped to a specific administrative unit (the role only applies to objects within that unit).',
        portalPath: 'Entra admin center > Identity > Roles & admins > [Custom Role] > + Add assignments',
        note: 'Scoping role assignments to administrative units provides an additional layer of access control. For example, a helpdesk operator scoped to the "EMEA" administrative unit can only reset passwords for users in that unit.',
      },
      {
        title: 'Configure administrative units for scoped assignments (optional)',
        description:
          'If you need to scope the role to specific users or devices, create an administrative unit first. Navigate to Administrative units, create a new unit, add members, and then create a scoped role assignment targeting that unit.',
        portalPath: 'Entra admin center > Identity > Roles & admins > Administrative units > + Add',
        code: `# Create an administrative unit and add members
Connect-MgGraph -Scopes "AdministrativeUnit.ReadWrite.All"

$au = New-MgDirectoryAdministrativeUnit -DisplayName "EMEA Region" -Description "Users in EMEA offices"
$user = Get-MgUser -Filter "usageLocation eq 'DE'"
New-MgDirectoryAdministrativeUnitMemberByRef -AdministrativeUnitId $au.Id -BodyParameter @{
  "@odata.id" = "https://graph.microsoft.com/v1.0/users/$($user.Id)"
}`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Test the custom role',
        description:
          'Sign in with a test user who has been assigned the custom role. Verify that the user can perform the allowed actions (e.g., reset passwords) and cannot perform actions outside the role (e.g., delete users or modify group membership). Test both in the portal and via PowerShell or Graph API.',
        warning: 'Always test custom roles with a non-admin test account before rolling out to production users. Misconfigured roles can either grant excessive access or fail to provide enough access for the intended tasks.',
      },
      {
        title: 'Audit role assignments and usage',
        description:
          'Monitor custom role usage through the Audit logs. Filter by "Add member to role" and "Remove member from role" activities. Regularly review who has custom role assignments and remove stale assignments. Consider using Access Reviews to automate the review process.',
        portalPath: 'Entra admin center > Identity > Monitoring & health > Audit logs',
        code: `# List all active role assignments for a custom role
Connect-MgGraph -Scopes "RoleManagement.Read.Directory"
$role = Get-MgRoleManagementDirectoryRoleDefinition -Filter "displayName eq 'Helpdesk Password Reset Operator'"
Get-MgRoleManagementDirectoryRoleAssignment -Filter "roleDefinitionId eq '$($role.Id)'" |
  ForEach-Object { Get-MgUser -UserId $_.PrincipalId | Select-Object DisplayName, UserPrincipalName }`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-pim-setup',
      'entra-group-management',
      'entra-access-reviews',
    ],
    tags: ['rbac', 'custom-roles', 'delegation', 'least-privilege', 'entra-id'],
  },

  // ─── 8. Set Up Privileged Identity Management ───────────────────────────────
  {
    id: 'entra-pim-setup',
    title: 'Set Up Privileged Identity Management',
    description:
      'Configure Microsoft Entra Privileged Identity Management (PIM) to enforce just-in-time privileged access, require approval workflows, and audit elevated role usage. Covers role settings, activation policies, approval flows, and alerts.',
    category: 'entra-security',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: [
      'Microsoft Entra ID P2 license',
      'Global Administrator or Privileged Role Administrator role',
      'Break-glass emergency access accounts with permanent role assignments',
    ],
    steps: [
      {
        title: 'Navigate to Privileged Identity Management',
        description:
          'Sign in to the Microsoft Entra admin center and navigate to the PIM blade. If this is the first time using PIM, you may need to consent to the PIM service. Click "Consent" and verify your identity with MFA.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management',
        note: 'Only a Global Administrator can consent to PIM for the first time. After initial consent, Privileged Role Administrators can manage PIM settings.',
      },
      {
        title: 'Review current permanent role assignments',
        description:
          'Click "Microsoft Entra roles" and then "Roles" to see all role assignments. Identify users with permanent (Active) assignments to privileged roles like Global Administrator, User Administrator, and Exchange Administrator. The goal is to convert most permanent assignments to eligible assignments.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > Microsoft Entra roles > Roles',
        warning: 'Do not remove permanent Global Administrator assignments from break-glass accounts. These accounts must always maintain permanent access for emergency scenarios.',
      },
      {
        title: 'Configure role settings for Global Administrator',
        description:
          'Click on the Global Administrator role, then "Role settings" and "Edit". Configure the maximum activation duration (recommended: 1-4 hours), require MFA on activation, require justification, and optionally require approval. Set the approvers to your security team or a designated approval group.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > Microsoft Entra roles > Roles > Global Administrator > Role settings',
      },
      {
        title: 'Configure approval workflows',
        description:
          'For high-privilege roles, enable the "Require approval to activate" setting. Designate specific users or groups as approvers. When a user requests to activate the role, the approvers receive an email notification and can approve or deny the request through the PIM portal or email action buttons.',
        note: 'Configure at least two approvers for each role to avoid bottlenecks when one approver is unavailable. If no approvers are configured, Privileged Role Administrators act as default approvers.',
      },
      {
        title: 'Configure role settings for other privileged roles',
        description:
          'Repeat the role settings configuration for other privileged roles in your organization: User Administrator, Exchange Administrator, SharePoint Administrator, Security Administrator, etc. Adjust the activation duration, MFA requirement, and approval settings based on the sensitivity of each role.',
        code: `# Configure PIM role settings via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "RoleManagement.ReadWrite.Directory"

# Get the role definition for User Administrator
$roleDefinition = Get-MgRoleManagementDirectoryRoleDefinition -Filter "displayName eq 'User Administrator'"

# Get current PIM policy for the role
Get-MgPolicyRoleManagementPolicy -Filter "scopeId eq '/' and scopeType eq 'DirectoryRole'" |
  Where-Object { $_.DisplayName -like "*$($roleDefinition.DisplayName)*" }`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Convert permanent assignments to eligible',
        description:
          'For each privileged role, select users who currently have permanent (Active) assignments and convert them to Eligible. Navigate to the role, click "Assignments", select the user, and change the assignment type from "Active" to "Eligible". Set an appropriate expiration date for the eligible assignment.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > Microsoft Entra roles > Roles > [Role] > Assignments',
        warning: 'Before converting assignments, ensure that affected users understand the new activation process. Converting without notification can cause disruption when admins suddenly lose their permanent access.',
      },
      {
        title: 'Set up PIM alerts',
        description:
          'Configure PIM security alerts to detect risky patterns. Navigate to PIM alerts and review the built-in alert rules: "Roles are being assigned outside of PIM", "Potential stale role assignment", "Too many Global Administrators", and "Roles don\'t require MFA for activation". Enable email notifications for critical alerts.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > Microsoft Entra roles > Alerts',
      },
      {
        title: 'Configure notifications',
        description:
          'Set up email notifications for PIM events. Configure who receives notifications when roles are activated, when activation requires approval, and when assignments are about to expire. Ensure your security team receives notifications for Global Administrator and other high-privilege role activations.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > Microsoft Entra roles > Roles > [Role] > Role settings > Notifications',
      },
      {
        title: 'Test the activation workflow',
        description:
          'Sign in as a test user with an eligible role assignment. Navigate to PIM and click "Activate" for the assigned role. Provide the required justification, complete MFA, and submit the activation request. If approval is required, verify that the approver receives the notification and can approve the request.',
        portalPath: 'Entra admin center > Identity governance > Privileged Identity Management > My roles > Activate',
        note: 'Test the full workflow including activation, performing admin tasks, and deactivation. Verify that the role is automatically deactivated after the configured duration expires.',
      },
      {
        title: 'Schedule recurring access reviews for PIM roles',
        description:
          'Create access reviews for eligible role assignments to ensure that only authorized users retain their privileged access over time. Navigate to Access Reviews and create a review targeting PIM role assignments with a quarterly or semi-annual recurrence.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > + New access review',
        code: `# List current PIM eligible assignments for audit
Connect-MgGraph -Scopes "RoleManagement.Read.Directory"
Get-MgRoleManagementDirectoryRoleEligibilityScheduleInstance |
  Select-Object PrincipalId, RoleDefinitionId, StartDateTime, EndDateTime |
  ForEach-Object {
    $user = Get-MgUser -UserId $_.PrincipalId -ErrorAction SilentlyContinue
    $role = Get-MgRoleManagementDirectoryRoleDefinition -UnifiedRoleDefinitionId $_.RoleDefinitionId
    [PSCustomObject]@{
      User = $user.DisplayName
      Role = $role.DisplayName
      Expires = $_.EndDateTime
    }
  }`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-conditional-access',
      'entra-mfa-setup',
      'entra-rbac-roles',
      'entra-access-reviews',
    ],
    tags: ['pim', 'privileged-identity', 'just-in-time', 'zero-trust', 'entra-id'],
  },

  // ─── 9. Configure Access Reviews ────────────────────────────────────────────
  {
    id: 'entra-access-reviews',
    title: 'Configure Access Reviews',
    description:
      'Set up recurring access reviews in Microsoft Entra ID to regularly verify that users still need their group memberships, application assignments, and role assignments. Covers review creation, reviewer configuration, auto-apply settings, and result analysis.',
    category: 'entra-security',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    prerequisites: [
      'Microsoft Entra ID P2 license (or Entra ID Governance license)',
      'At least one of: Global Administrator, Identity Governance Administrator, or User Administrator role',
      'Groups, applications, or roles that require periodic review',
    ],
    steps: [
      {
        title: 'Navigate to Access Reviews',
        description:
          'Sign in to the Microsoft Entra admin center and navigate to the Access Reviews blade under Identity Governance. Review any existing access reviews to understand the current review cadence and scope.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews',
      },
      {
        title: 'Create a new access review',
        description:
          'Click "+ New access review". Select the review type: "Teams + Groups" to review group and Teams membership, "Applications" to review application assignments, or "Azure resources / Entra roles" to review role assignments. For this guide, we configure a group membership review.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > + New access review',
      },
      {
        title: 'Configure the review scope',
        description:
          'Select which groups or applications to review. You can select specific groups or choose "All Microsoft 365 groups with guest users" to target guest access. Set the scope to "Guest users only" if focusing on external access, or "All users" for a comprehensive review. Choose whether to review inactive users only.',
        note: 'Focusing access reviews on guest users is a quick win for security. Guest accounts often accumulate over time without regular cleanup.',
      },
      {
        title: 'Select reviewers',
        description:
          'Choose who will perform the review: "Group owners" (recommended for self-service), "Selected users or groups" (for centralized review by security teams), "Users review their own access" (self-attestation), or "Managers of users". You can also configure fallback reviewers in case the primary reviewer does not respond.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > [New review] > Reviewers',
        warning: 'Self-attestation (users reviewing their own access) provides the weakest security assurance. Use it only as a supplement to manager or group owner reviews, not as the sole review mechanism.',
      },
      {
        title: 'Configure recurrence and duration',
        description:
          'Set the review to recur on a schedule: weekly, monthly, quarterly, semi-annually, or annually. Define the review duration (how long reviewers have to complete their reviews) and the start date. Quarterly reviews are a good balance between security and reviewer fatigue.',
        code: `# Create an access review for a group via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "AccessReview.ReadWrite.All"

$params = @{
  DisplayName  = "Quarterly Guest Access Review - Marketing Team"
  DescriptionForAdmins = "Review guest user access to the Marketing Team group"
  DescriptionForReviewers = "Please verify that each guest user still needs access to the Marketing Team."
  Scope = @{
    Query     = "/groups/<group-id>/members"
    QueryType = "MicrosoftGraph"
  }
  Reviewers = @(
    @{
      Query     = "/groups/<group-id>/owners"
      QueryType = "MicrosoftGraph"
    }
  )
  Settings = @{
    MailNotificationsEnabled       = $true
    ReminderNotificationsEnabled   = $true
    JustificationRequiredOnApproval = $true
    AutoApplyDecisionsEnabled       = $true
    DefaultDecisionEnabled          = $true
    DefaultDecision                 = "Deny"
    InstanceDurationInDays          = 14
    Recurrence = @{
      Pattern = @{ Type = "absoluteMonthly"; Interval = 3 }
      Range   = @{ Type = "noEnd"; StartDate = "2026-04-01" }
    }
  }
}
New-MgIdentityGovernanceAccessReviewDefinition -BodyParameter $params`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Configure completion settings',
        description:
          'Under Settings, configure what happens when the review completes: enable "Auto apply results to resource" to automatically remove denied users. Set the "If reviewers don\'t respond" default action to "No change", "Remove access", or "Approve access". Enable "Justification required" to force reviewers to provide a reason for their decisions.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > [New review] > Settings',
        note: 'Setting the default action for non-responsive reviewers to "Remove access" provides the strongest security posture but can disrupt access if reviewers are negligent. Balance security with your organization\'s risk tolerance.',
      },
      {
        title: 'Review and create',
        description:
          'Review all settings on the summary page and click "Create". The first review instance will be created immediately (or on the start date if set in the future). Reviewers will receive email notifications with a link to complete their reviews.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews',
      },
      {
        title: 'Monitor review progress and analyze results',
        description:
          'After the review period begins, monitor completion progress in the Access Reviews blade. Click on the review to see how many reviewers have completed their reviews and how many decisions have been made. After the review completes, analyze the results to see how many users were approved, denied, or not reviewed. Export the results for compliance reporting.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > [Review] > Results',
        code: `# Get access review results
Connect-MgGraph -Scopes "AccessReview.Read.All"
$reviews = Get-MgIdentityGovernanceAccessReviewDefinition
$reviews | ForEach-Object {
  Write-Host "Review: $($_.DisplayName) - Status: $($_.Status)"
  $instances = Get-MgIdentityGovernanceAccessReviewDefinitionInstance -AccessReviewScheduleDefinitionId $_.Id
  $instances | Select-Object Id, Status, StartDateTime, EndDateTime
}`,
        codeLanguage: 'powershell',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-pim-setup',
      'entra-group-management',
      'entra-b2b-guest',
      'entra-conditional-access',
    ],
    tags: ['access-reviews', 'governance', 'compliance', 'guest-access', 'entra-id'],
  },

  // ─── 10. Invite and Manage B2B Guest Users ──────────────────────────────────
  {
    id: 'entra-b2b-guest',
    title: 'Invite and Manage B2B Guest Users',
    description:
      'Invite external partners and collaborators as B2B guest users in Microsoft Entra ID. Covers single and bulk invitations, guest access settings, cross-tenant access policies, and lifecycle management of external identities.',
    category: 'entra-identity',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    prerequisites: [
      'Microsoft Entra ID (any tier; P1/P2 for advanced features like Conditional Access for guests)',
      'Guest Inviter role or higher',
      'External collaboration settings configured to allow invitations',
    ],
    steps: [
      {
        title: 'Review external collaboration settings',
        description:
          'Before inviting guests, review and configure the external collaboration settings. Define who can invite guests (admins only, members, or guests themselves). Set allowed or denied domains to control which organizations can be invited. Configure the guest user access restrictions to determine what directory data guests can see.',
        portalPath: 'Entra admin center > Identity > External Identities > External collaboration settings',
        note: 'Restricting guest invitations to admins and users in the Guest Inviter role provides the most control. Allowing all members to invite guests is convenient but can lead to uncontrolled external access.',
      },
      {
        title: 'Invite a single guest user',
        description:
          'Navigate to Users and click "+ Invite external user". Enter the guest email address, a personal invitation message, and select which groups or applications the guest should be added to. The guest will receive an email with a redemption link to accept the invitation.',
        portalPath: 'Entra admin center > Identity > Users > All users > + Invite external user',
        code: `# Invite a guest user via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "User.Invite.All"

$invitation = New-MgInvitation -InvitedUserEmailAddress "partner@contoso.com" ` +
  '-InviteRedirectUrl "https://myapps.microsoft.com" ' +
  `-InvitedUserDisplayName "Jane Partner" ` +
  `-SendInvitationMessage:$true ` +
  `-InvitedUserMessageInfo @{ CustomizedMessageBody = "Welcome to our collaboration portal!" }
Write-Host "Invitation sent. Redemption URL: $($invitation.InviteRedeemUrl)"`,
        codeLanguage: 'powershell',
      },
      {
        title: 'Bulk invite guest users',
        description:
          'For inviting many guests at once, use the bulk invite feature or a PowerShell script. Prepare a CSV file with columns for email address, display name, and redirect URL. Upload the CSV in the portal or loop through it in PowerShell to send invitations programmatically.',
        code: `# Bulk invite guests from a CSV file
Connect-MgGraph -Scopes "User.Invite.All"

$guests = Import-Csv -Path "C:\\Guests\\invitations.csv"
foreach ($guest in $guests) {
  New-MgInvitation -InvitedUserEmailAddress $guest.Email ` +
    '-InviteRedirectUrl "https://myapps.microsoft.com" ' +
    `-InvitedUserDisplayName $guest.DisplayName ` +
    `-SendInvitationMessage:$true
  Write-Host "Invited: $($guest.Email)"
}`,
        codeLanguage: 'powershell',
        note: 'For large-scale invitations (100+ users), consider throttling the API calls to avoid hitting Microsoft Graph rate limits. Add a short delay between invitations.',
      },
      {
        title: 'Configure cross-tenant access policies',
        description:
          'For ongoing partnerships, configure cross-tenant access settings to define trust relationships. Navigate to Cross-tenant access settings and add the partner organization by tenant ID or domain. Configure inbound settings (what the partner can access in your tenant) and outbound settings (what your users can access in the partner tenant).',
        portalPath: 'Entra admin center > Identity > External Identities > Cross-tenant access settings',
        warning: 'Cross-tenant access policies can grant significant access to external organizations. Review inbound trust settings carefully, especially the option to trust the partner MFA and device compliance claims.',
      },
      {
        title: 'Assign guests to applications and groups',
        description:
          'Add guest users to the appropriate security groups and application assignments. Use a dedicated group for external users (e.g., "External Partners") to make it easy to apply Conditional Access policies and access reviews specifically to guest accounts. Avoid adding guests to groups that contain sensitive internal resources unless necessary.',
        portalPath: 'Entra admin center > Identity > Groups > [Group] > Members > + Add members',
      },
      {
        title: 'Set up guest lifecycle management',
        description:
          'Configure access reviews specifically for guest users to regularly verify that external access is still needed. Set up a Conditional Access policy that requires MFA for all guest sign-ins. Consider configuring automatic guest account expiration by using entitlement management access packages with expiration dates. Monitor guest sign-in activity and remove stale guest accounts that have not signed in for 90+ days.',
        portalPath: 'Entra admin center > Identity governance > Access Reviews > + New access review',
        code: `# Find stale guest accounts (no sign-in for 90+ days)
Connect-MgGraph -Scopes "User.Read.All", "AuditLog.Read.All"
$threshold = (Get-Date).AddDays(-90)
Get-MgUser -Filter "userType eq 'Guest'" -Property DisplayName, UserPrincipalName, SignInActivity |
  Where-Object { $_.SignInActivity.LastSignInDateTime -lt $threshold -or $_.SignInActivity.LastSignInDateTime -eq $null } |
  Select-Object DisplayName, UserPrincipalName, @{N='LastSignIn';E={$_.SignInActivity.LastSignInDateTime}}`,
        codeLanguage: 'powershell',
        warning: 'Before deleting stale guest accounts, notify the internal sponsor or project owner. Some guest accounts may be used for service-to-service integrations that do not generate interactive sign-in activity.',
      },
    ],
    relatedCommands: [],
    relatedGuides: [
      'entra-access-reviews',
      'entra-conditional-access',
      'entra-group-management',
    ],
    tags: ['b2b', 'guest-users', 'external-identities', 'collaboration', 'entra-id'],
  },
]
