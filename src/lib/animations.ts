export const pulseRingKeyframes = {
  '0%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)'
  },
  '10%': {
    transform: 'scale(0.955)',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.65)'
  },
  '20%': {
    transform: 'scale(0.96)',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.6)'
  },
  '30%': {
    transform: 'scale(0.965)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.55)'
  },
  '40%': {
    transform: 'scale(0.97)',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)'
  },
  '50%': {
    transform: 'scale(0.975)',
    boxShadow: '0 0 0 5px rgba(59, 130, 246, 0.45)'
  },
  '60%': {
    transform: 'scale(0.98)',
    boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.4)'
  },
  '70%': {
    transform: 'scale(0.985)',
    boxShadow: '0 0 0 7px rgba(59, 130, 246, 0.35)'
  },
  '80%': {
    transform: 'scale(0.99)',
    boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.3)'
  },
  '90%': {
    transform: 'scale(0.97)',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.25)'
  },
  '100%': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.2)'
  }
};

export const accordionKeyframes = {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' }
  }
};

export const animations = {
  'accordion-down': 'accordion-down 1.2s ease-out',
  'accordion-up': 'accordion-up 1.2s ease-out',
  'pulse-ring': 'pulse-ring 60s linear infinite'
};