import { create } from "zustand"
import { SignUpUserData } from "@/types/userTypes"

type SignUpState = {
  userData?: SignUpUserData
  setUserData: (userData?: SignUpUserData) => void
}

const useSignUpStore = create<SignUpState>(set => ({
  userData: undefined,
  setUserData: (userData?: SignUpUserData) => set(() => ({ userData })),
}))

const useSignUpData = () => ({
  userData: useSignUpStore(state => state.userData),
  setUserData: useSignUpStore(state => state.setUserData),
})

export default useSignUpData
