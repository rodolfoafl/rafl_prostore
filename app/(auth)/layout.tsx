export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}
