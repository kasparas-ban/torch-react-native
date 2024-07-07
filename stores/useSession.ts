import { Session } from "@supabase/supabase-js"
import { create } from "zustand"

type State = {
  session: Session | null
}

type Actions = {
  setSession: (session: Session | null) => void
}

const sessionStore = create<State & Actions>(set => ({
  session: null,
  setSession: (session: Session | null) => set(() => ({ session })),
}))

const useSession = () => ({
  session: sessionStore(state => state.session),
  setSession: sessionStore(state => state.setSession),
})

export default useSession
