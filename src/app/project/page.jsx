import { redirect } from "next/navigation"


const page = () => {
    redirect('/',"push")
  return (
    null
  )
}

export default page