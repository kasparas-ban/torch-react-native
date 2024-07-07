import useSession from "@/stores/useSession"

export default function useAuth() {
  const { session } = useSession()

  return { isSignedIn: !!session, user: session?.user }
}
