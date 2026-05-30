export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Budgetly
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
