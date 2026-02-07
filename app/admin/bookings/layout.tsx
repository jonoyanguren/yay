import AuthCheck from "../components/AuthCheck";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}
