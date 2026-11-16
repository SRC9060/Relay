import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Sparkles, ArrowLeft, Inbox, Layers } from 'lucide-react';

export default function PlaceholderPage({ title, milestone = 'Milestone 2', description, badgeType }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive human-readable title if not provided
  const pathPart = location.pathname.split('/').pop() || 'Section';
  const pageTitle =
    title ||
    pathPart
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/app/overview')}
        >
          Back to Overview
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700 }}>{pageTitle}</h1>
              {badgeType && <Badge type={badgeType} dot />}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
              {description || `This view is mapped into the Relay Assistant Shell navigation.`}
            </p>
          </div>

          <Badge type="neutral" size="sm">
            <Layers size={12} /> {milestone}
          </Badge>
        </div>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-subtle)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            margin: '12px 0'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-sage)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Inbox size={20} />
          </div>
          <div style={{ maxWidth: '480px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
              Shell Route Active
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
              Per the Milestone 1 contract, the full application shell and design tokens are in place.
              The seeded three-pane email triage workspace and AI classification pipeline will populate
              this view in subsequent milestones.
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/overview')}
          >
            Return to Overview Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
