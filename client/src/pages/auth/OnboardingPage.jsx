import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../context/AccountContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { accounts, connectAccount } = useAccounts();

  const [activeModalProvider, setActiveModalProvider] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [syncStage, setSyncStage] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [connectedAccountName, setConnectedAccountName] = useState('');

  const providers = [
    {
      id: 'gmail',
      name: 'Google Workspace',
      defaultEmail: 'marcus.vance@vancetech.io',
      iconColor: '#EA4335',
      description: 'Primary inbox, sent correspondence, and calendar metadata',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
      )
    },
    {
      id: 'outlook',
      name: 'Microsoft 365',
      defaultEmail: 'm.vance@board-advisory.com',
      iconColor: '#0078D4',
      description: 'Corporate Exchange mailbox and executive meeting requests',
      logo: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#0078D4" d="M14.5 3H22v18h-7.5z" />
          <path fill="#28A8EA" d="M14.5 3L2 6.5v11L14.5 21z" />
          <circle cx="8" cy="12" r="3" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  const handleOpenAuth = (provider) => {
    setActiveModalProvider(provider);
    setIsAuthorizing(false);
    setSyncStage(null);
    setSyncProgress(0);
  };

  const handleSimulateOAuth = async () => {
    if (!activeModalProvider) return;
    setIsAuthorizing(true);
    setSyncStage('connecting');
    setSyncProgress(25);

    await new Promise((r) => setTimeout(r, 500));
    setSyncStage('fetching');
    setSyncProgress(65);

    await new Promise((r) => setTimeout(r, 600));
    setSyncStage('analyzing');
    setSyncProgress(92);

    const created = await connectAccount({
      provider: activeModalProvider.id,
      emailAddress: activeModalProvider.defaultEmail,
      name: activeModalProvider.name
    });

    setSyncProgress(100);
    setSyncStage('done');
    setConnectedAccountName(created.name);
    setIsAuthorizing(false);
  };

  const handleFinishOnboarding = () => {
    navigate('/app/overview');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
            Connect email accounts
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
            Link executive inboxes to activate AI reply triage
          </p>
        </div>

        {/* Quiet Sandbox Notice */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-subtle)',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldCheck size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
            Simulated OAuth authorization • External credentials not required
          </div>
        </div>

        {/* Provider Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {providers.map((provider) => {
            const isConnected = accounts.some((a) => a.provider === provider.id);
            return (
              <div
                key={provider.id}
                style={{
                  padding: '14px',
                  backgroundColor: isConnected ? 'var(--color-surface-subtle)' : 'var(--color-surface)',
                  border: isConnected ? '1px solid var(--color-resp-assistant-border)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 200px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface)',
                      border: 'var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {provider.logo}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{provider.name}</span>
                      {isConnected && (
                        <Badge type="assistant" size="sm" dot>
                          Connected
                        </Badge>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
                      {provider.description}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)', marginTop: '2px', wordBreak: 'break-all' }}>
                      Simulated inbox: <code style={{ color: 'var(--color-primary)' }}>{provider.defaultEmail}</code>
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {isConnected ? (
                    <Button variant="ghost" size="sm" disabled>
                      <CheckCircle2 size={16} color="var(--color-resp-assistant)" />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenAuth(provider)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleFinishOnboarding}
            style={{ width: '100%' }}
          >
            Launch assistant workspace
          </Button>

          <button
            onClick={handleFinishOnboarding}
            style={{
              fontSize: '12px',
              color: 'var(--color-charcoal-muted)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            Skip for now (uses pre-seeded demo accounts)
          </button>
        </div>
      </Card>

      {/* Simulated OAuth Modal */}
      <Modal
        isOpen={!!activeModalProvider}
        onClose={() => {
          if (!isAuthorizing) setActiveModalProvider(null);
        }}
        title={`Authorize ${activeModalProvider?.name || ''}`}
        subtitle="Simulated OAuth 2.0 handshake"
      >
        {syncStage === 'done' ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-resp-assistant-bg)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto'
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
              Connection successful
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)', marginBottom: '18px' }}>
              {connectedAccountName} is now connected. Initial messages and metadata have been synchronized.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveModalProvider(null)}
              style={{ width: '100%' }}
            >
              Done
            </Button>
          </div>
        ) : isAuthorizing ? (
          <div style={{ padding: '12px 0' }}>
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                {syncStage === 'connecting' && 'Connecting to API Gateway...'}
                {syncStage === 'fetching' && 'Fetching email threads and calendar events...'}
                {syncStage === 'analyzing' && 'Preparing AI reply classification schema...'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                Simulating OAuth 2.0 token handshake
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '6px',
                width: '100%',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${syncProgress}%`,
                  backgroundColor: 'var(--color-primary)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--color-charcoal-muted)'
              }}
            >
              <span className="tabular-nums">{syncProgress}% complete</span>
              <span>Encrypted sandbox</span>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                padding: '12px',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: 'var(--border-subtle)',
                marginBottom: '16px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                Permissions requested by Relay:
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  fontSize: '12px',
                  color: 'var(--color-charcoal-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}
              >
                <li>Read message headers, content, and metadata</li>
                <li>Create and update draft email responses</li>
                <li>Read calendar invitations and meeting proposals</li>
              </ul>
            </div>

            <div
              style={{
                fontSize: '11px',
                color: 'var(--color-charcoal-light)',
                marginBottom: '18px',
                lineHeight: 1.4
              }}
            >
              Simulated OAuth prompt for prototype testing. No external credentials needed.
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setActiveModalProvider(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSimulateOAuth}
              >
                Authorize access
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
