'use client'

import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const fetchUser = async () => {
  const res = await axios.get("/users/get-user-details", { withCredentials: true })
  return res.data.data
}

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: false,
  })
}
