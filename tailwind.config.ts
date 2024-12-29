import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				'wedding-pink': '#e69fa3',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-ring': {
					'0%': {
						transform: 'scale(0.95)',
						boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)'
					},
					'10%': {
						transform: 'scale(0.96)',
						boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.6)'
					},
					'20%': {
						transform: 'scale(0.97)',
						boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)'
					},
					'30%': {
						transform: 'scale(0.98)',
						boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.4)'
					},
					'40%': {
						transform: 'scale(0.99)',
						boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.3)'
					},
					'50%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 10px rgba(59, 130, 246, 0.2)'
					},
					'60%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 10px rgba(59, 130, 246, 0.15)'
					},
					'70%': {
						transform: 'scale(0.99)',
						boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.1)'
					},
					'80%': {
						transform: 'scale(0.98)',
						boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.05)'
					},
					'90%': {
						transform: 'scale(0.96)',
						boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.02)'
					},
					'100%': {
						transform: 'scale(0.95)',
						boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 1.2s ease-out',
				'accordion-up': 'accordion-up 1.2s ease-out',
				'pulse-ring': 'pulse-ring 60s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;