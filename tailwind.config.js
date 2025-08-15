/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
    	extend: {
			borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
			backgroundImage: {
				'gradient-top': 'linear-gradient(to top, hsl(var(--gradient-a)), transparent)',
  				'gradient-bottom': 'linear-gradient(to bottom, hsl(var(--gradient-a)), hsl(var(--gradient-b)))'
			  },
    		colors: {
    			background: 'hsl(var(--background))',
				foreground: {
					DEFAULT: "hsl(var(--foreground))",
					secondary: "hsl(var(--foreground-secondary))"
				},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				fg: 'hsl(var(--card-fg))'
    			},
				blur: 'hsl(var(--blur))',
				bio: 'hsl(var(--bio))',
				'hero-button': {
					DEFAULT: 'hsl(var(--hero-button))',
    				hover: 'hsl(var(--hero-button-hover))'
				},
				'navbar-emphasis': 'hsl(var(--navbar-emphasis))',
				primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				fg: 'hsl(var(--primary-fg))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				fg: 'hsl(var(--secondary-fg))',
					'emphasis-fg': 'hsl(var(--secondary-emphasis-fg))'
    			},
				muted: {
					primary: {
						DEFAULT: 'hsl(var(--muted-primary))',
    					fg: 'hsl(var(--muted-primary-fg))'
					},
					secondary: {
						DEFAULT: 'hsl(var(--muted-secondary))',
    					fg: 'hsl(var(--muted-secondary-fg))'
					}
				},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				fg: 'hsl(var(--accent-fg))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				fg: 'hsl(var(--destructive-fg))'
    			},
				border: {
    				DEFAULT: 'hsl(var(--border))',
    				pickture: 'hsl(var(--border-pickture))'
    			},
				chat: {
					explanation: {
						DEFAULT: 'hsl(var(--chat-explanation))',
						fg: 'hsl(var(--chat-explanation-fg))',
						border: 'hsl(var(--chat-explanation-border))'
					},
					input: 'hsl(var(--chat-input))',
					ring: 'hsl(var(--chat-ring))',
					shadow: 'hsl(var(--chat-shadow))',
					'button-primary': {
						DEFAULT: 'hsl(var(--chat-button-primary))',
						fg: 'hsl(var(--chat-button-primary-fg))'
					},
				},
				skills: {
    				DEFAULT: 'hsl(var(--skills))',
					projects: {
						DEFAULT: 'hsl(var(--skills-projects))',
						fg: 'hsl(var(--skills-projects-fg))'
					},
					primary: {
						DEFAULT: 'hsl(var(--skills-primary))',
						fg: 'hsl(var(--skills-primary-fg))',
						border: 'hsl(var(--skills-primary-border))'
					},
					secondary: {
						DEFAULT: 'hsl(var(--skills-secondary))',
						fg: 'hsl(var(--skills-secondary-fg))',
						border: 'hsl(var(--skills-secondary-border))'
					},
					tertiary: {
						DEFAULT: 'hsl(var(--skills-tertiary))',
						fg: 'hsl(var(--skills-tertiary-fg))',
						border: 'hsl(var(--skills-tertiary-border))'
					},
					quaternary: {
						DEFAULT: 'hsl(var(--skills-quaternary))',
						fg: 'hsl(var(--skills-quaternary-fg))',
						border: 'hsl(var(--skills-quaternary-border))'
					},
					quinary: {
						DEFAULT: 'hsl(var(--skills-quinary))',
						fg: 'hsl(var(--skills-quinary-fg))',
						border: 'hsl(var(--skills-quinary-border))'
					},
					senary: {
						DEFAULT: 'hsl(var(--skills-senary))',
						fg: 'hsl(var(--skills-senary-fg))',
						border: 'hsl(var(--skills-senary-border))'
					},
					legende: {
						DEFAULT: 'hsl(var(--skills-legende))',
						fg: 'hsl(var(--skills-legende-fg))'
					}
    			}
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  };
  