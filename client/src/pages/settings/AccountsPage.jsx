import React, { useState } from 'react';
import { useAccounts } from '../../context/AccountContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import {
  Link2,
  RotateCw,
  Trash2,
  Plus
} from 'lucide-react';

export default function AccountsPage() {
  const { accounts, syncAll, isSyncing, connectAccount, disconnectAccount } = useAccounts();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [provider, setProvider] = useState('gmail');
  const [emailAddress, setEmailAddress] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!emailAddress) return;
    setLoading(true);
    try {
      await connectAccount({
        provider,
        emailAddress,
        name: accountName || (provider === 'gmail' ? 'Google Workspace' : 'Microsoft 365')
      });
      setIsConnectModalOpen(false);
      setEmailAddress('');
      setAccountName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
            Connected accounts
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
            Manage the email mailboxes connected to Relay for executive triage
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="md"
            icon={RotateCw}
            loading={isSyncing}
            onClick={syncAll}
          >
            Sync all
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsConnectModalOpen(true)}
          >
            Connect account
          </Button>
        </div>
      </div>

      {/* Account List Card */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="account-row-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: 'var(--color-surface-subtle)',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 240px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface)',
                    border: 'var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Link2 size={16} color="var(--color-primary)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{acc.name}</span>
                    <Badge type="assistant" size="sm" dot>
                      Connected & synced
                    </Badge>
                    {acc.isSimulated && (
                      <span className="keycap">Simulated</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {acc.emailAddress} • Last synced <span className="tabular-nums">{new Date(acc.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    if (confirm(`Disconnect ${acc.name}?`)) {
                      disconnectAccount(acc.id);
                    }
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Connect Account Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="Connect new email account"
        subtitle="Simulated OAuth integration"
      >
        <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 500, display: 'block', marginBottom: '6px', color: 'var(--color-charcoal-muted)' }}>
              Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setProvider('gmail')}
                style={{
                  padding: '9px',
                  borderRadius: 'var(--radius-md)',
                  border: provider === 'gmail' ? '2px solid var(--color-primary)' : 'var(--border-subtle)',
                  backgroundColor: provider === 'gmail' ? 'var(--color-sage)' : 'var(--color-surface)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Google Workspace
              </button>
              <button
                type="button"
                onClick={() => setProvider('outlook')}
                style={{
                  padding: '9px',
                  borderRadius: 'var(--radius-md)',
                  border: provider === 'outlook' ? '2px solid var(--color-primary)' : 'var(--border-subtle)',
                  backgroundColor: provider === 'outlook' ? 'var(--color-sage)' : 'var(--color-surface)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Microsoft Outlook
              </button>
            </div>
          </div>

          <Input
            label="Account display name"
            placeholder="e.g. Marcus Personal Inquiries"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="e.g. inquiries@vance-advisory.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />

          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            Connection will be simulated instantly with sample message headers.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => setIsConnectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={loading}
            >
              Connect & sync
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
