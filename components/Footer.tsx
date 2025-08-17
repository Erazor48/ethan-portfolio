// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="text-center p-4 bg-primary text-sm text-muted-primary-fg">
      © {new Date().getFullYear()} Ethan Orain. All rights reserved.
      <br />
      <a href="/privacy-policy" className="underline hover:text-primary-fg">
        Privacy Policy
      </a>
    </footer>
  );
}
