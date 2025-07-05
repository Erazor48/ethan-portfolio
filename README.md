# Ethan's Portfolio with AI Chatbot

A modern portfolio website with an intelligent chatbot that knows about Ethan's skills, projects, and experience.

## Features

- **AI Chatbot** - Intelligent assistant that knows about Ethan's profile
- **Modern UI** - Built with Next.js, TypeScript, and Tailwind CSS
- **Responsive Design** - Works on all devices
- **Secure** - No API keys exposed, uses Hugging Face free tier
- **Real-time** - Instant responses with loading states

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables** (optional)
   Create a `.env.local` file:
   ```env
   # Hugging Face API Key (optional - for enhanced AI responses)
   # Get a free API key from https://huggingface.co/settings/tokens
   HUGGINGFACE_API_KEY=your_api_key_here
   
   # Rate limiting (optional)
   RATE_LIMIT_MAX_REQUESTS=10
   RATE_LIMIT_WINDOW_MS=60000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Chatbot Features

The chatbot can answer questions about:
- Ethan's skills and technologies
- Projects and work experience
- Contact information and social links
- Background and education
- Location and availability

## Security

- No API keys exposed in client-side code
- Rate limiting to prevent abuse
- Input validation and sanitization
- Error handling for graceful failures

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI**: Hugging Face Inference API
- **Icons**: Lucide React
- **State Management**: React hooks

## Customization

To update Ethan's information, edit `lib/ai/knowledge-base.ts` with the latest:
- Skills and technologies
- Projects and experience
- Contact information
- Education and background

## Deployment

The chatbot works without any API keys (uses fallback responses), but for enhanced AI responses, you can:

1. Get a free Hugging Face API key
2. Add it to your environment variables
3. Deploy to Vercel, Netlify, or any Next.js hosting

## License

MIT License - feel free to use this code for your own portfolio! 