export const pulseRingKeyframes = {
  '0%': {
    transform: 'scale(0.98)',
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)'
  },
  '10%': {
    transform: 'scale(0.982)',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.35)'
  },
  '20%': {
    transform: 'scale(0.984)',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)'
  },
  '30%': {
    transform: 'scale(0.986)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.25)'
  },
  '40%': {
    transform: 'scale(0.988)',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
  },
  '50%': {
    transform: 'scale(0.99)',
    boxShadow: '0 0 0 5px rgba(59, 130, 246, 0.15)'
  },
  '60%': {
    transform: 'scale(0.988)',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
  },
  '70%': {
    transform: 'scale(0.986)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.25)'
  },
  '80%': {
    transform: 'scale(0.984)',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)'
  },
  '90%': {
    transform: 'scale(0.982)',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.35)'
  },
  '100%': {
    transform: 'scale(0.98)',
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)'
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
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out'
};